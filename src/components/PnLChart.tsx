import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TrendingUp, TrendingDown, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ChartDataPoint {
  date: string;
  timestamp: number;
  [key: string]: number | string;
}

interface BotData {
  id: string;
  name: string;
  color: string;
  data: number[];
  currentValue: number;
  changePercent: number;
}

interface PnLChartProps {
  data?: any[];
  bots?: any[];
  onZoomChange?: (domain: [number, number]) => void;
  className?: string;
}

export const PnLChart: React.FC<PnLChartProps> = ({
  data,
  bots,
  onZoomChange,
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState<'llm' | 'bot'>('llm');
  const [zoomDomain, setZoomDomain] = useState<[number, number] | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);
  const chartRef = useRef<any>(null);

  // X-axis labels
  const xAxisLabels = [
    "Oct 17 18:00", "Oct 18 22:04", "Oct 20 02:08", "Oct 21 06:12", 
    "Oct 22 10:17", "Oct 23 14:21", "Oct 24 18:25", "Oct 25 22:29"
  ];

  // LLM Mode Data
  const llmBots: BotData[] = [
    {
      id: 'grok4',
      name: 'Grok 4',
      color: '#1E90FF', // blue
      data: [9052, 9200, 9300, 9400, 9500, 9600, 9700, 9800],
      currentValue: 9800,
      changePercent: -2.0
    },
    {
      id: 'qwen3max',
      name: 'Qwen3 Max',
      color: '#800080', // purple
      data: [17579, 17600, 17700, 17800, 17900, 18000, 18100, 18200],
      currentValue: 18200,
      changePercent: 82.0
    },
    {
      id: 'deepseek',
      name: 'DeepSeek Chat V3.1',
      color: '#32CD32', // green
      data: [13399, 13400, 13450, 13500, 13550, 13600, 13650, 13700],
      currentValue: 13700,
      changePercent: 37.0
    },
    {
      id: 'gpt5',
      name: 'GPT-5',
      color: '#FF4500', // red
      data: [10000, 10100, 10200, 10300, 10400, 10500, 10600, 10700],
      currentValue: 10700,
      changePercent: 7.0
    },
    {
      id: 'gemini25',
      name: 'Gemini 2.5 Pro',
      color: '#6b7280', // gray
      data: [10000, 9900, 9800, 9700, 9600, 9500, 9400, 9300],
      currentValue: 9300,
      changePercent: -7.0
    }
  ];

  // Bot Mode Data
  const botBots: BotData[] = [
    {
      id: 'userbot1',
      name: 'User Bot 1',
      color: '#1E90FF', // blue
      data: [5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400],
      currentValue: 6400,
      changePercent: 28.0
    },
    {
      id: 'userbot2',
      name: 'User Bot 2',
      color: '#FFA500', // orange
      data: [3000, 3200, 3400, 3600, 3800, 4000, 4200, 4400],
      currentValue: 4400,
      changePercent: 46.7
    },
    {
      id: 'userbot3',
      name: 'User Bot 3',
      color: '#FFD700', // yellow
      data: [7000, 7200, 7400, 7500, 7600, 7700, 7800, 7900],
      currentValue: 7900,
      changePercent: 12.9
    }
  ];

  // BTC baseline data (same for both modes)
  const btcData = [10000, 10100, 10200, 10300, 10400, 10500, 10600, 10700];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate chart data
  const generateChartData = (bots: BotData[]) => {
    return xAxisLabels.map((label, index) => {
      const dataPoint: ChartDataPoint = {
        date: label,
        timestamp: index,
        btc: btcData[index]
      };
      
      bots.forEach(bot => {
        dataPoint[bot.id] = bot.data[index];
      });
      
      return dataPoint;
    });
  };

  const currentBots = activeTab === 'llm' ? llmBots : botBots;
  const chartData = generateChartData(currentBots);

  // Format tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium">{entry.dataKey === 'btc' ? 'BTC' : entry.dataKey}:</span>
              <span className="text-sm">
                ${typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Format Y-axis
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Handle zoom
  const handleZoomIn = () => {
    if (chartData.length > 0) {
      const midPoint = Math.floor(chartData.length / 2);
      const start = Math.max(0, midPoint - Math.floor(chartData.length / 4));
      const end = Math.min(chartData.length - 1, midPoint + Math.floor(chartData.length / 4));
      setZoomDomain([start, end]);
    }
  };

  const handleZoomOut = () => {
    setZoomDomain(undefined);
  };

  const handleReset = () => {
    setZoomDomain(undefined);
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">TOTAL ACCOUNT VALUE</h3>
          <p className="text-muted-foreground">
            Real-time performance tracking across all trading bots
          </p>
        </div>
        
        {/* Mobile zoom controls */}
        {isMobile && (
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Tab switcher */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'llm' | 'bot')} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="llm">LLM Battle</TabsTrigger>
          <TabsTrigger value="bot">Bot League</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Bot legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {currentBots.map((bot) => (
          <div key={bot.id} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: bot.color }}
            />
            <span className="text-sm font-medium">{bot.name}</span>
            <Badge 
              variant={bot.changePercent >= 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {bot.changePercent >= 0 ? '+' : ''}{bot.changePercent.toFixed(1)}%
            </Badge>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border-2 border-dashed" 
            style={{ backgroundColor: '#6b7280' }}
          />
          <span className="text-sm font-medium">BTC</span>
          <Badge variant="secondary" className="text-xs">
            +7.0%
          </Badge>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px] md:h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            ref={chartRef}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--muted))" 
              opacity={0.3}
            />
            
            <XAxis 
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={zoomDomain}
              tickFormatter={(value) => xAxisLabels[value] || ''}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            
            <YAxis 
              tickFormatter={formatYAxis}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              domain={[0, 20000]}
              label={{ value: 'Account Value ($)', angle: -90, position: 'insideLeft' }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference line at $10,000 (starting value) */}
            <ReferenceLine 
              y={10000} 
              stroke="hsl(var(--muted))" 
              strokeDasharray="2 2" 
              opacity={0.5}
            />
            
            {/* Bot performance lines */}
            {currentBots.map((bot) => (
              <Line
                key={bot.id}
                type="monotone"
                dataKey={bot.id}
                stroke={bot.color}
                strokeWidth={2}
                dot={{ r: 5, fill: bot.color }}
                activeDot={{ r: 6, stroke: bot.color, strokeWidth: 2 }}
                isAnimationActive={true}
              />
            ))}
            
            {/* BTC Buy & Hold line (dashed) */}
            <Line
              type="monotone"
              dataKey="btc"
              stroke="#6b7280"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 5, fill: '#6b7280' }}
              activeDot={{ r: 6, stroke: '#6b7280', strokeWidth: 2 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Current values */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentBots.map((bot) => (
          <div key={bot.id} className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: bot.color }}
              />
              <span className="text-sm font-medium">{bot.name}</span>
            </div>
            <div className="text-lg font-bold">
              ${bot.currentValue.toFixed(2)}
            </div>
            <div className={`text-sm ${bot.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {bot.changePercent >= 0 ? '+' : ''}{bot.changePercent.toFixed(1)}%
            </div>
          </div>
        ))}
        <div className="p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full border-2 border-dashed" 
              style={{ backgroundColor: '#6b7280' }}
            />
            <span className="text-sm font-medium">BTC</span>
          </div>
          <div className="text-lg font-bold">
            ${btcData[btcData.length - 1].toFixed(2)}
          </div>
          <div className="text-sm text-green-500">
            +7.0%
          </div>
        </div>
      </div>
    </Card>
  );
};