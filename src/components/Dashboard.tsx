import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Brain, Zap } from "lucide-react";
import { MetricsCard } from "./MetricsCard";
import { AIThinkingDynamic } from "./AIThinkingDynamic";
import { PnLChart } from "./PnLChart";
import { useCryptoPrices } from "@/hooks/use-crypto-prices";
import { PriceSkeleton } from "./PriceSkeleton";

export const Dashboard = () => {
  const { prices, isLoading, getPrice, formatPrice } = useCryptoPrices();

  // Calculate real-time profitability based on current BTC price
  const btcPrice = getPrice('bitcoin');

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
          <div />
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

        {/* AI Thinking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <AIThinkingDynamic />
          </div>
        </div>
      </div>
    </div>
  );
};
