import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface PnLDataPoint {
  timestamp: number;
  date: string;
  time: string;
  [key: string]: number | string; // Dynamic bot values
}

interface BotPerformance {
  id: string;
  name: string;
  color: string;
  currentValue: number;
  change24h: number;
  isActive: boolean;
}

interface PnLChartProps {
  data: PnLDataPoint[];
  bots: BotPerformance[];
  onZoomChange?: (domain: [number, number]) => void;
  className?: string;
}

export const PnLChart: React.FC<PnLChartProps> = ({
  data,
  bots,
  onZoomChange,
  className = ""
}) => {
  const [zoomDomain, setZoomDomain] = useState<[number, number] | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);
  const chartRef = useRef<any>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
              <span className="text-sm font-medium">{entry.dataKey}:</span>
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

  // Format X-axis
  const formatXAxis = (tickItem: any) => {
    if (typeof tickItem === 'string') {
      const date = new Date(tickItem);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return tickItem;
  };

  // Handle zoom
  const handleZoomIn = () => {
    if (data.length > 0) {
      const midPoint = Math.floor(data.length / 2);
      const start = Math.max(0, midPoint - Math.floor(data.length / 4));
      const end = Math.min(data.length - 1, midPoint + Math.floor(data.length / 4));
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

  // Get active bots for chart
  const activeBots = bots.filter(bot => bot.isActive);
  const btcBot = bots.find(bot => bot.id === 'btc-buy-hold');

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

      {/* Bot legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {activeBots.map((bot) => (
          <div key={bot.id} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: bot.color }}
            />
            <span className="text-sm font-medium">{bot.name}</span>
            <Badge 
              variant={bot.change24h >= 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {bot.change24h >= 0 ? '+' : ''}{bot.change24h.toFixed(2)}%
            </Badge>
          </div>
        ))}
        {btcBot && (
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full border-2 border-dashed" 
              style={{ backgroundColor: btcBot.color }}
            />
            <span className="text-sm font-medium">{btcBot.name}</span>
            <Badge variant="secondary" className="text-xs">
              {btcBot.change24h >= 0 ? '+' : ''}{btcBot.change24h.toFixed(2)}%
            </Badge>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-[400px] md:h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            ref={chartRef}
            data={data}
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
              tickFormatter={formatXAxis}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            
            <YAxis 
              tickFormatter={formatYAxis}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
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
            {activeBots.map((bot) => (
              <Line
                key={bot.id}
                type="monotone"
                dataKey={bot.id}
                stroke={bot.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: bot.color, strokeWidth: 2 }}
                isAnimationActive={true}
              />
            ))}
            
            {/* BTC Buy & Hold line (dashed) */}
            {btcBot && (
              <Line
                type="monotone"
                dataKey={btcBot.id}
                stroke={btcBot.color}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 4, stroke: btcBot.color, strokeWidth: 2 }}
                isAnimationActive={true}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Current values */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {activeBots.map((bot) => {
          const latestValue = data.length > 0 ? data[data.length - 1][bot.id] as number : 0;
          const change = latestValue - 10000; // Assuming starting value of $10,000
          const changePercent = (change / 10000) * 100;
          
          return (
            <div key={bot.id} className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: bot.color }}
                />
                <span className="text-sm font-medium">{bot.name}</span>
              </div>
              <div className="text-lg font-bold">
                ${typeof latestValue === 'number' ? latestValue.toFixed(2) : '0.00'}
              </div>
              <div className={`text-sm ${changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
