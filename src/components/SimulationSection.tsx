import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const assets = ["BTC", "ETH", "SOL", "PEPE", "DOGE"];

// Mock simulation data generator
const generateSimulationData = (days: number, asset: string) => {
  const volatility = asset === "PEPE" ? 0.15 : asset === "DOGE" ? 0.12 : 0.08;
  const trend = Math.random() > 0.5 ? 1 : -1;
  const data = [];
  
  for (let i = 0; i <= days; i++) {
    const randomChange = (Math.random() - 0.5) * volatility * trend;
    const value = 1000 * (1 + randomChange * i);
    data.push({
      day: i,
      value: parseFloat(value.toFixed(2)),
    });
  }
  
  return data;
};

export const SimulationSection = () => {
  const [days, setDays] = useState([7]);
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [simulationData, setSimulationData] = useState(generateSimulationData(7, "BTC"));
  
  const handleSimulate = () => {
    const data = generateSimulationData(days[0], selectedAsset);
    setSimulationData(data);
  };
  
  const finalValue = simulationData[simulationData.length - 1].value;
  const profit = finalValue - 1000;
  const profitPercentage = ((profit / 1000) * 100).toFixed(2);
  const isProfit = profit >= 0;
  
  return (
    <Card className="glass-card p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1">Simulation: What If?</h2>
          <p className="text-sm text-muted-foreground">Test strategies risk-free with historical data</p>
        </div>
      </div>
      
      {/* Controls */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Investment Amount: $1000</label>
            <label className="text-sm text-muted-foreground">{days[0]} days ago</label>
          </div>
          <Slider
            value={days}
            onValueChange={setDays}
            min={1}
            max={30}
            step={1}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {assets.map((asset) => (
            <Button
              key={asset}
              variant={selectedAsset === asset ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedAsset(asset)}
              className="min-w-[60px]"
            >
              {asset}
            </Button>
          ))}
          <Button
            onClick={handleSimulate}
            className="ml-auto bg-primary hover:bg-primary/90 glow-primary"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Simulate
          </Button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-[200px] md:h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={simulationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis 
              dataKey="day" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              label={{ value: 'Days Ago', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={isProfit ? "hsl(var(--success))" : "hsl(var(--destructive))"}
              strokeWidth={3}
              dot={{ fill: isProfit ? "hsl(var(--success))" : "hsl(var(--destructive))", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Results */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
        <div className="flex-1 p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground mb-1">Final Value</p>
          <p className="text-2xl font-bold">${finalValue.toFixed(2)}</p>
        </div>
        <div className="flex-1 p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground mb-1">Profit/Loss</p>
          <div className="flex items-center gap-2">
            {isProfit ? (
              <TrendingUp className="w-5 h-5 text-success" />
            ) : (
              <TrendingDown className="w-5 h-5 text-destructive" />
            )}
            <p className={`text-2xl font-bold ${isProfit ? 'text-success glow-success' : 'text-destructive'}`}>
              {isProfit ? '+' : ''}{profitPercentage}%
            </p>
          </div>
        </div>
        <div className="flex-1 p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground mb-1">Amount</p>
          <p className={`text-2xl font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
            {isProfit ? '+' : ''}{profit >= 0 ? '$' : '-$'}{Math.abs(profit).toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
};