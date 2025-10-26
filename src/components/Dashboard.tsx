import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Brain, Zap, Sparkles, RefreshCw } from "lucide-react";
import { MetricsCard } from "./MetricsCard";
import { AIThinkingDynamic } from "./AIThinkingDynamic";
import { SimulationSection } from "./SimulationSection";
import { ConfettiModal } from "./ConfettiModal";
import { PnLChart } from "./PnLChart";
import { useCryptoPrices } from "@/hooks/use-crypto-prices";
import { PriceSkeleton } from "./PriceSkeleton";
import { LiveBadge } from "./LiveBadge";
import { useState } from "react";

export const Dashboard = () => {
  const [confettiOpen, setConfettiOpen] = useState(false);
  const { prices, isLoading, getPrice, formatPrice, isUsingCached, rateLimited } = useCryptoPrices();
  
  // Calculate real-time profitability based on current BTC price
  const btcPrice = getPrice('bitcoin');
  const mockProfit = btcPrice > 0 ? (btcPrice * 0.001) : 184.50; // Simulate profit based on BTC price
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              AI-League <span className="text-gradient-primary">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Track your AI bots performance in real-time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setConfettiOpen(true)}
              className="bg-success hover:bg-success/90 glow-success text-success-foreground"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Fix Profit
            </Button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              {isLoading ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Updating...</span>
                </>
              ) : (
                <>
                  <span className="text-sm text-primary font-medium">
                    BTC: {formatPrice(btcPrice, 'bitcoin')}
                  </span>
                  {isUsingCached && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded text-[10px]">
                      cached
                    </span>
                  )}
                </>
              )}
              <LiveBadge />
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <Card className="glass-card p-6">
                <div className="flex items-center justify-center h-[120px]">
                  <PriceSkeleton variant="compact" />
                </div>
              </Card>
              <Card className="glass-card p-6">
                <div className="flex items-center justify-center h-[120px]">
                  <PriceSkeleton variant="compact" />
                </div>
              </Card>
              <Card className="glass-card p-6">
                <div className="flex items-center justify-center h-[120px]">
                  <PriceSkeleton variant="compact" />
                </div>
              </Card>
            </>
          ) : (
            <>
              <MetricsCard
                title="Total Profitability"
                value={`+${((btcPrice * 0.001) / 100).toFixed(1)}%`}
                subtitle="vs BTC baseline"
                icon={<TrendingUp className="w-5 h-5" />}
                trend="up"
              />
              <MetricsCard
                title="Sharpe Ratio"
                value="2.8"
                subtitle="Risk-adjusted returns"
                icon={<Zap className="w-5 h-5" />}
                trend="neutral"
              />
              <MetricsCard
                title="AI Strategies"
                value="12"
                subtitle="Active bots running"
                icon={<Brain className="w-5 h-5" />}
                trend="neutral"
              />
            </>
          )}
        </div>

        {/* PnL Chart - Full width */}
        <div className="mb-6">
          <PnLChart />
        </div>

        {/* AI Thinking Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <AIThinkingDynamic />
          </div>
        </div>
        
        {/* Simulation Section */}
        <SimulationSection />
        
        {/* Confetti Modal */}
        <ConfettiModal
          open={confettiOpen}
          onOpenChange={setConfettiOpen}
          profit={mockProfit}
        />
      </div>
    </div>
  );
};
