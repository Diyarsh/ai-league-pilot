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
import { Brain, TrendingUp, Activity, Target } from "lucide-react";

interface BotDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bot: {
    name: string;
    prompt: string;
    profitability: number;
    sharpe: number;
    trades: number;
    strategy: string;
  } | null;
}

const mockTradeHistory = [
  { time: "14:23", action: "BUY", asset: "SOL", price: "$142.3", result: "+18.5%" },
  { time: "12:15", action: "SELL", asset: "PEPE", price: "$0.00001234", result: "+24.2%" },
  { time: "10:42", action: "BUY", asset: "DOGE", price: "$0.087", result: "-3.1%" },
  { time: "09:18", action: "SELL", asset: "ETH", price: "$2,345", result: "+12.7%" },
];

export const BotDetailsModal = ({ open, onOpenChange, bot }: BotDetailsModalProps) => {
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
              <div className="space-y-2">
                {mockTradeHistory.map((trade, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={trade.action === "BUY" ? "default" : "outline"}>
                        {trade.action}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{trade.asset}</p>
                        <p className="text-xs text-muted-foreground">{trade.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{trade.price}</p>
                      <p className={`text-sm font-bold ${trade.result.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                        {trade.result}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};