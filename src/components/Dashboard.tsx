import { TrendingUp, Brain, Zap } from "lucide-react";
import { AIThinkingDynamic } from "./AIThinkingDynamic";
import { PnLChart } from "./PnLChart";
import { useCryptoPrices } from "@/hooks/use-crypto-prices";

export const Dashboard = () => {
  // Prices no longer rendered here; keeping hook ready for future use if needed
  useCryptoPrices();

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

        {/* Metrics removed */}

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
