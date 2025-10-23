import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ThinkingLog {
  id: number;
  timestamp: string;
  type: "analysis" | "trade" | "alert";
  message: string;
}

export const AIThinkingDynamic = () => {
  const [thinkingLogs, setThinkingLogs] = useState<ThinkingLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateThinking = async () => {
    try {
      const scenarios = [
        {
          type: 'thinking',
          prompt: 'Aggressive meme trading',
          marketData: 'SOL price: $142.3, RSI: 28 (oversold), Volume: +340%'
        },
        {
          type: 'thinking',
          prompt: 'Conservative DCA',
          marketData: 'BTC price: $67,800, RSI: 52 (neutral), Volume: normal'
        },
        {
          type: 'thinking',
          prompt: 'Momentum scalping',
          marketData: 'ETH price: $3,420, RSI: 72 (overbought), Volume: +180%'
        }
      ];

      const responses = await Promise.all(
        scenarios.slice(0, 3).map(scenario =>
          supabase.functions.invoke('generate-strategy', {
            body: scenario
          })
        )
      );

      const newLogs: ThinkingLog[] = responses.map((resp, idx) => ({
        id: Date.now() + idx,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: idx % 3 === 0 ? 'trade' : idx % 3 === 1 ? 'analysis' : 'alert',
        message: resp.data?.result || '🤖 Analyzing market conditions...'
      }));

      setThinkingLogs(prev => [...newLogs, ...prev].slice(0, 5));
    } catch (error) {
      console.error('Error generating thinking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateThinking();
    const interval = setInterval(generateThinking, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

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
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              <Brain className="w-8 h-8 mx-auto mb-2 animate-pulse" />
              <p>AI is analyzing markets...</p>
            </div>
          ) : thinkingLogs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No thinking logs yet
            </div>
          ) : (
            thinkingLogs.map((log, index) => (
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
            ))
          )}
        </div>
      </ScrollArea>

      {/* Strategy Info */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Current Strategy</span>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            LLM Multi-Strategy
          </Badge>
        </div>
      </div>
    </Card>
  );
};