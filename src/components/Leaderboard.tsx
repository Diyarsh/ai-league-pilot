import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, TrendingUp, Zap, Swords } from "lucide-react";

interface BotData {
  rank: number;
  name: string;
  profitability: number;
  sharpe: number;
  trades: number;
  strategy: string;
}

const mockBots: BotData[] = [
  { rank: 1, name: "MemeHunter Pro", profitability: 24.5, sharpe: 3.2, trades: 142, strategy: "Aggressive" },
  { rank: 2, name: "Volatility Rider", profitability: 18.3, sharpe: 2.8, trades: 98, strategy: "Momentum" },
  { rank: 3, name: "Smart Scalper", profitability: 15.7, sharpe: 2.5, trades: 234, strategy: "Scalping" },
  { rank: 4, name: "AI Trend Master", profitability: 12.4, sharpe: 2.1, trades: 76, strategy: "Trend Follow" },
  { rank: 5, name: "Risk Manager", profitability: 9.8, sharpe: 3.5, trades: 45, strategy: "Conservative" },
];

export const Leaderboard = () => {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  const getProfitColor = (profit: number) => {
    if (profit > 20) return "text-success glow-success";
    if (profit > 10) return "text-success";
    return "text-foreground";
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-accent" />
              AI Bot <span className="text-gradient-primary">Leaderboard</span>
            </h1>
            <p className="text-muted-foreground">
              F1-style rankings • Live competition • Top performers
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 glow-primary">
            <Zap className="w-4 h-4 mr-2" />
            Create Your Bot
          </Button>
        </div>

        {/* Leaderboard Table */}
        <Card className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Bot Name</TableHead>
                  <TableHead>Profitability</TableHead>
                  <TableHead>Sharpe Ratio</TableHead>
                  <TableHead className="hidden md:table-cell">Trades</TableHead>
                  <TableHead className="hidden lg:table-cell">Strategy</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBots.map((bot, index) => (
                  <TableRow
                    key={bot.rank}
                    className="border-border hover:bg-secondary/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <TableCell className="font-bold text-lg">
                      {getRankBadge(bot.rank)}
                    </TableCell>
                    <TableCell className="font-medium">{bot.name}</TableCell>
                    <TableCell>
                      <span className={`font-bold ${getProfitColor(bot.profitability)}`}>
                        +{bot.profitability}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {bot.sharpe}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {bot.trades}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="outline">{bot.strategy}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                          <Swords className="w-4 h-4 mr-1" />
                          Battle
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <h3 className="font-bold">Total Bots</h3>
            </div>
            <p className="text-3xl font-bold">247</p>
            <p className="text-sm text-muted-foreground">Active strategies</p>
          </Card>
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="font-bold">Avg. Return</h3>
            </div>
            <p className="text-3xl font-bold text-success">+14.2%</p>
            <p className="text-sm text-muted-foreground">24h average</p>
          </Card>
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Swords className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Live Battles</h3>
            </div>
            <p className="text-3xl font-bold">18</p>
            <p className="text-sm text-muted-foreground">Ongoing competitions</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
