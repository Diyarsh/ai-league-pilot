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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, TrendingUp, Zap, Swords, ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BotDetailsModal } from "./BotDetailsModal";
import { BattleModal } from "./BattleModal";

interface BotData {
  id: string;
  rank?: number;
  name: string;
  profitability: number;
  sharpe: number;
  trades: number;
  strategy: string;
  prompt: string;
}

export const Leaderboard = () => {
  const [bots, setBots] = useState<BotData[]>([]);
  const [sortBy, setSortBy] = useState<"profitability" | "sharpe">("profitability");
  const [filterStrategy, setFilterStrategy] = useState<string>("all");
  const [minProfitability, setMinProfitability] = useState<string>("0");
  const [selectedBot, setSelectedBot] = useState<BotData | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [battleOpen, setBattleOpen] = useState(false);
  const [battleBot1, setBattleBot1] = useState<BotData | null>(null);
  const [battleBot2, setBattleBot2] = useState<BotData | null>(null);
  
  useEffect(() => {
    fetchBots();
  }, [sortBy, filterStrategy, minProfitability]);
  
  const fetchBots = async () => {
    let query = supabase
      .from('bots')
      .select('*')
      .gte('profitability', parseFloat(minProfitability));
    
    if (filterStrategy !== "all") {
      query = query.eq('strategy', filterStrategy);
    }
    
    query = query.order(sortBy, { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching bots:", error);
      return;
    }
    
    const botsWithRank = data?.map((bot, index) => ({
      ...bot,
      rank: index + 1,
    })) || [];
    
    setBots(botsWithRank);
  };
  
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
  
  const handleDetailsClick = (bot: BotData) => {
    setSelectedBot(bot);
    setDetailsOpen(true);
  };
  
  const handleBattleClick = (bot: BotData) => {
    if (!battleBot1) {
      setBattleBot1(bot);
    } else {
      setBattleBot2(bot);
      setBattleOpen(true);
    }
  };
  
  const strategies = ["all", ...Array.from(new Set(bots.map(b => b.strategy)))];
  
  const resetBattle = () => {
    setBattleBot1(null);
    setBattleBot2(null);
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

        {/* Filters */}
        <Card className="glass-card p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profitability">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4" />
                      Profitability
                    </div>
                  </SelectItem>
                  <SelectItem value="sharpe">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4" />
                      Sharpe Ratio
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Strategy</label>
              <Select value={filterStrategy} onValueChange={setFilterStrategy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {strategies.map(strategy => (
                    <SelectItem key={strategy} value={strategy}>
                      {strategy === "all" ? "All Strategies" : strategy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Min Profitability</label>
              <Select value={minProfitability} onValueChange={setMinProfitability}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All</SelectItem>
                  <SelectItem value="10">+10%</SelectItem>
                  <SelectItem value="15">+15%</SelectItem>
                  <SelectItem value="20">+20%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {battleBot1 && !battleBot2 && (
            <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm">
                <Badge variant="outline" className="mr-2">{battleBot1.name}</Badge>
                selected for battle. Choose another bot to compete!
                <Button variant="ghost" size="sm" onClick={resetBattle} className="ml-2">Cancel</Button>
              </p>
            </div>
          )}
        </Card>
        
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
                {bots.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No bots found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  bots.map((bot, index) => (
                    <TableRow
                      key={bot.id}
                      className="border-border hover:bg-secondary/50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <TableCell className="font-bold text-lg">
                        {getRankBadge(bot.rank || 0)}
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDetailsClick(bot)}
                          >
                            Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hidden sm:flex"
                            onClick={() => handleBattleClick(bot)}
                          >
                            <Swords className="w-4 h-4 mr-1" />
                            Battle
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
        
        {/* Modals */}
        <BotDetailsModal
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          bot={selectedBot}
        />
        <BattleModal
          open={battleOpen}
          onOpenChange={(open) => {
            setBattleOpen(open);
            if (!open) resetBattle();
          }}
          bot1={battleBot1}
          bot2={battleBot2}
        />

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
