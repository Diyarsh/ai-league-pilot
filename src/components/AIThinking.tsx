import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ThinkingLog {
  id: number;
  timestamp: string;
  type: "analysis" | "trade" | "alert";
  message: string;
}

const mockThinking: ThinkingLog[] = [
  {
    id: 1,
    timestamp: "14:23",
    type: "trade",
    message: "🤖 RSI=28 (oversold) + volume +340% → Buying SOL at $142.3",
  },
  {
    id: 2,
    timestamp: "14:20",
    type: "analysis",
    message: "📊 Detected bullish divergence on MACD. Monitoring for entry.",
  },
  {
    id: 3,
    timestamp: "14:15",
    type: "alert",
    message: "⚠️ High volatility detected. Adjusting position sizes by -30%.",
  },
  {
    id: 4,
    timestamp: "14:10",
    type: "trade",
    message: "💰 Exit PEPE at $0.00001234 → +18.5% gain in 4.2h",
  },
  {
    id: 5,
    timestamp: "14:05",
    type: "analysis",
    message: "🔍 Scanning 247 tokens. Focus: High volume memes <$100M mcap.",
  },
];

export const AIThinking = () => {
  const getTypeColor = (type: ThinkingLog["type"]) => {
    switch (type) {
      case "trade":
        return "bg-success/10 text-success border-success/20";
      case "alert":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <Card className="glass-card p-6 h-[568px] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold">AI Thinking</h2>
          <p className="text-sm text-muted-foreground">Live strategy reasoning</p>
        </div>
      </div>

      {/* Thinking Log */}
      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {mockThinking.map((log, index) => (
            <div
              key={log.id}
              className="animate-fade-in-up p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getTypeColor(log.type)}>
                      {log.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{log.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Strategy Info */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Current Strategy</span>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            LLM Aggressive Hold
          </Badge>
        </div>
      </div>
    </Card>
  );
};
