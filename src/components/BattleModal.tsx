import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Swords, Trophy } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface BattleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bot1: { name: string; profitability: number; strategy: string } | null;
  bot2: { name: string; profitability: number; strategy: string } | null;
}

// Mock battle data
const mockBattleData = [
  { time: "00:00", bot1: 100, bot2: 100 },
  { time: "04:00", bot1: 104, bot2: 102 },
  { time: "08:00", bot1: 107, bot2: 103 },
  { time: "12:00", bot1: 112, bot2: 106 },
  { time: "16:00", bot1: 118, bot2: 108 },
  { time: "20:00", bot1: 122, bot2: 112 },
  { time: "24:00", bot1: 124.5, bot2: 118.3 },
];

export const BattleModal = ({ open, onOpenChange, bot1, bot2 }: BattleModalProps) => {
  if (!bot1 || !bot2) return null;
  
  const winner = bot1.profitability > bot2.profitability ? bot1 : bot2;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Swords className="w-6 h-6 text-accent" />
            <DialogTitle className="text-2xl">AI Bot Battle Arena</DialogTitle>
          </div>
          <DialogDescription className="text-center">
            24h Performance Comparison • Winner Takes Glory
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Battle Header */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className={`p-4 rounded-lg border-2 ${winner === bot1 ? 'border-success bg-success/10' : 'border-border bg-secondary/50'}`}>
              <div className="flex items-center gap-2 mb-2">
                {winner === bot1 && <Trophy className="w-5 h-5 text-success" />}
                <h3 className="font-bold">{bot1.name}</h3>
              </div>
              <Badge variant="outline" className="mb-2">{bot1.strategy}</Badge>
              <p className="text-2xl font-bold text-success">+{bot1.profitability}%</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-2">⚔️</div>
              <p className="text-sm text-muted-foreground">VS</p>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${winner === bot2 ? 'border-success bg-success/10' : 'border-border bg-secondary/50'}`}>
              <div className="flex items-center gap-2 mb-2">
                {winner === bot2 && <Trophy className="w-5 h-5 text-success" />}
                <h3 className="font-bold">{bot2.name}</h3>
              </div>
              <Badge variant="outline" className="mb-2">{bot2.strategy}</Badge>
              <p className="text-2xl font-bold text-success">+{bot2.profitability}%</p>
            </div>
          </div>
          
          {/* Battle Chart */}
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockBattleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
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
                  dataKey="bot1"
                  stroke={winner === bot1 ? "hsl(var(--success))" : "hsl(var(--primary))"}
                  strokeWidth={winner === bot1 ? 4 : 3}
                  dot={{ fill: winner === bot1 ? "hsl(var(--success))" : "hsl(var(--primary))", r: 4 }}
                  name={bot1.name}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="bot2"
                  stroke={winner === bot2 ? "hsl(var(--success))" : "hsl(var(--accent))"}
                  strokeWidth={winner === bot2 ? 4 : 3}
                  dot={{ fill: winner === bot2 ? "hsl(var(--success))" : "hsl(var(--accent))", r: 4 }}
                  name={bot2.name}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Winner Announcement */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-success/20 to-success/5 border border-success/30 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-6 h-6 text-success animate-pulse-glow" />
              <p className="text-lg font-bold">Winner: {winner.name}</p>
              <Trophy className="w-6 h-6 text-success animate-pulse-glow" />
            </div>
            <p className="text-sm text-muted-foreground">
              Outperformed by {Math.abs(bot1.profitability - bot2.profitability).toFixed(1)}% over 24h
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};