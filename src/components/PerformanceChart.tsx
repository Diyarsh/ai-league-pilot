import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Bitcoin, DollarSign } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const mockData = [
  { time: "00:00", aiBot: 100, btc: 100 },
  { time: "04:00", aiBot: 102, btc: 101 },
  { time: "08:00", aiBot: 98, btc: 99 },
  { time: "12:00", aiBot: 105, btc: 100.5 },
  { time: "16:00", aiBot: 108, btc: 102 },
  { time: "20:00", aiBot: 112, btc: 103 },
  { time: "24:00", aiBot: 112.4, btc: 102.8 },
];

const assets = ["BTC", "ETH", "SOL", "PEPE", "DOGE"];

export const PerformanceChart = () => {
  const [selectedAsset, setSelectedAsset] = useState("BTC");

  return (
    <Card className="glass-card p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1">AI Bot Performance</h2>
          <p className="text-sm text-muted-foreground">24h comparison vs {selectedAsset}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] md:h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
              domain={[95, 115]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="aiBot"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              name="AI Bot"
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="btc"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name={selectedAsset}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">24h Return</p>
          <p className="text-lg font-bold text-success">+12.4%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Max Drawdown</p>
          <p className="text-lg font-bold text-destructive">-2.8%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
          <p className="text-lg font-bold text-foreground">68%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total Trades</p>
          <p className="text-lg font-bold text-foreground">24</p>
        </div>
      </div>
    </Card>
  );
};
