import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Brain, Zap, Sparkles, RefreshCw } from "lucide-react";
import { PerformanceChart } from "./PerformanceChart";
import { MetricsCard } from "./MetricsCard";
import { AIThinkingDynamic } from "./AIThinkingDynamic";
import { SimulationSection } from "./SimulationSection";
import { ConfettiModal } from "./ConfettiModal";
import { PnLChart } from "./PnLChart";
import { useCryptoPrices } from "@/hooks/use-crypto-prices";
import { usePnLData } from "@/hooks/use-pnl-data";
import { PriceSkeleton } from "./PriceSkeleton";
import { LiveBadge } from "./LiveBadge";
import { useState } from "react";

export const Dashboard = () => {
  const [confettiOpen, setConfettiOpen] = useState(false);
  const { prices, isLoading, getPrice, formatPrice, isUsingCached, rateLimited } = useCryptoPrices();
  const { data: pnlData, bots, isLoading: pnlLoading, error: pnlError } = usePnLData();
  
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              <span className="text-sm text-success-foreground font-medium">Live</span>
            </div>
            {isLoading ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/10 border border-muted/20">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span className="text-sm text-muted-foreground">Updating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm text-primary font-medium">
                  BTC: {formatPrice(btcPrice, 'bitcoin')}
                </span>
                {isUsingCached && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded text-[10px]">
                    cached
                  </span>
                )}
                <LiveBadge />
              </div>
            )}
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricsCard
            title="Total Profitability"
            value={isLoading ? (
              <PriceSkeleton variant="compact" />
            ) : (
              `+${((btcPrice * 0.001) / 100).toFixed(1)}%`
            )}
            subtitle="vs BTC baseline"
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
          />
          <MetricsCard
            title="Sharpe Ratio"
            value={isLoading ? (
              <PriceSkeleton variant="compact" />
            ) : (
              "2.8"
            )}
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
        </div>

        {/* PnL Chart - Full width */}
        <div className="mb-6">
          {pnlLoading ? (
            <Card className="p-6">
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center space-y-2">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Loading PnL data...</p>
                </div>
              </div>
            </Card>
          ) : pnlError ? (
            <Card className="p-6">
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center space-y-2">
                  <p className="text-sm text-destructive">Error loading PnL data</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <PnLChart data={pnlData} bots={bots} />
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>

          {/* AI Thinking Sidebar */}
          <div className="lg:col-span-1">
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
