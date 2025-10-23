import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Brain, TrendingUp, Activity, Target, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BotDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bot: {
    id: string;
    name: string;
    prompt: string;
    profitability: number;
    sharpe: number;
    trades: number;
    strategy: string;
  } | null;
}

interface Trade {
  id: string;
  asset: string;
  side: string;
  price: number;
  amount: number;
  timestamp: string;
}

export const BotDetailsModalEnhanced = ({ open, onOpenChange, bot }: BotDetailsModalProps) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoadingTrades, setIsLoadingTrades] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  
  useEffect(() => {
    if (open && bot) {
      fetchTrades();
      fetchAnalysis();
    }
  }, [open, bot]);
  
  const fetchTrades = async () => {
    if (!bot) return;
    setIsLoadingTrades(true);
    
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('bot_id', bot.id)
        .order('timestamp', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setTrades(data || []);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setIsLoadingTrades(false);
    }
  };
  
  const fetchAnalysis = async () => {
    if (!bot) return;
    setIsLoadingAnalysis(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-strategy', {
        body: {
          type: 'performance',
          prompt: bot.strategy,
          marketData: `Profitability: ${bot.profitability}%, Sharpe: ${bot.sharpe}, Trades: ${bot.trades}`
        }
      });
      
      if (error) throw error;
      setAnalysis(data.result || 'Analysis not available');
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setAnalysis('Performance analysis unavailable');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };
  
  if (!bot) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{bot.name}</DialogTitle>
              <DialogDescription>
                Strategy: {bot.strategy}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Metrics */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Performance Metrics
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground mb-1">Profitability</p>
                  <p className="text-lg font-bold text-success">+{bot.profitability}%</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground mb-1">Sharpe Ratio</p>
                  <p className="text-lg font-bold">{bot.sharpe}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground mb-1">Total Trades</p>
                  <p className="text-lg font-bold">{bot.trades}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* AI Performance Analysis */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                AI Performance Analysis
              </h3>
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                {isLoadingAnalysis ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p className="text-sm">AI is analyzing performance...</p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{analysis}</p>
                )}
              </div>
            </div>
            
            <Separator />
            
            {/* Bot Prompt */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Strategy Prompt
              </h3>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-sm leading-relaxed">{bot.prompt}</p>
              </div>
            </div>
            
            <Separator />
            
            {/* Trade History */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Recent Trade History
              </h3>
              {isLoadingTrades ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : trades.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No trades recorded yet
                </div>
              ) : (
                <div className="space-y-2">
                  {trades.map((trade) => (
                    <div
                      key={trade.id}
                      className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant={trade.side === "buy" ? "default" : "outline"}>
                          {trade.side.toUpperCase()}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">{trade.asset}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(trade.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">${trade.price}</p>
                        <p className="text-xs text-muted-foreground">{trade.amount} units</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};