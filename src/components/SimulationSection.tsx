import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useCryptoPrices } from "@/hooks/use-crypto-prices";
import { PriceSkeleton } from "./PriceSkeleton";
import { Sparkline } from "./Sparkline";
import { LiveBadge } from "./LiveBadge";
import { TradingConfirmationModal } from "./TradingConfirmationModal";
import { OrderStatusTracker } from "./OrderStatusTracker";
import { useTrading } from "../hooks/use-trading";
import "./PriceAnimations.css";

const assets = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "pepe", symbol: "PEPE", name: "Pepe" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" }
];

// Real-time simulation data generator using current prices
const generateSimulationData = (days: number, asset: string, currentPrice: number) => {
  const volatility = asset === "PEPE" ? 0.15 : asset === "DOGE" ? 0.12 : 0.08;
  const trend = Math.random() > 0.5 ? 1 : -1;
  const data = [];
  
  for (let i = 0; i <= days; i++) {
    const randomChange = (Math.random() - 0.5) * volatility * trend;
    const value = 1000 * (1 + randomChange * i);
    data.push({
      day: i,
      value: parseFloat(value.toFixed(2)),
      price: currentPrice * (1 + randomChange * i / 10), // Simulate price movement
    });
  }
  
  return data;
};

export const SimulationSection = () => {
  const [days, setDays] = useState([7]);
  const [selectedAsset, setSelectedAsset] = useState("bitcoin");
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [showTradingModal, setShowTradingModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  
  const { prices, isLoading, getPrice, formatPrice, refetch, isUsingCached, rateLimited, priceHistory, lastUpdate } = useCryptoPrices();
  
  // Trading functionality
  const { orders, placeOrder, refreshOrders, isLoading: tradingLoading } = useTrading({
    isLiveMode,
    privateKey: undefined, // Will be set from wallet
    testnet: true // Start with testnet for safety
  });
  
  const handleSimulate = () => {
    if (prices) {
      const currentPrice = getPrice(selectedAsset as keyof typeof prices);
      const data = generateSimulationData(days[0], selectedAsset, currentPrice);
      setSimulationData(data);
    }
  };

  const handleLaunchBot = () => {
    if (!prices) return;
    
    const currentPrice = getPrice(selectedAsset as keyof typeof prices);
    const orderDetails = {
      token: selectedAsset,
      side: 'buy' as const,
      size: 1,
      price: currentPrice,
      orderType: 'market' as const
    };
    
    setPendingOrder(orderDetails);
    setShowTradingModal(true);
  };

  const handleConfirmTrade = async () => {
    if (!pendingOrder) return;
    
    try {
      await placeOrder(pendingOrder);
      setShowTradingModal(false);
      setPendingOrder(null);
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  const handleCancelTrade = () => {
    setShowTradingModal(false);
    setPendingOrder(null);
  };
  
  // Auto-simulate when prices change
  useEffect(() => {
    if (prices && !isLoading) {
      handleSimulate();
    }
  }, [prices, selectedAsset, days]);
  
  const finalValue = simulationData.length > 0 ? simulationData[simulationData.length - 1].value : 1000;
  const profit = finalValue - 1000;
  const profitPercentage = ((profit / 1000) * 100).toFixed(2);
  const isProfit = profit >= 0;
  
  return (
    <Card className="glass-card p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold">Simulation: What If?</h2>
            {!isLoading && lastUpdate && (
              <LiveBadge />
            )}
          </div>
          <p className="text-sm text-muted-foreground">Test strategies risk-free with real-time data</p>
        </div>
      </div>
      
      {/* Controls */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Investment Amount: $1000</label>
            <label className="text-sm text-muted-foreground">{days[0]} days ago</label>
          </div>
          <Slider
            value={days}
            onValueChange={setDays}
            min={1}
            max={30}
            step={1}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 md:flex-nowrap">
          {assets.map((asset) => {
            const isSelected = selectedAsset === asset.id;
            const currentPrice = getPrice(asset.id as keyof typeof prices);
            const priceChange = prices?.[asset.id as keyof typeof prices]?.change24h || 0;
            const history = priceHistory[asset.id] || [];
            const isPositive = priceChange >= 0;
            
            return (
              <Button
                key={asset.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedAsset(asset.id)}
                className="asset-button min-w-[120px] flex flex-col items-center gap-1 h-auto py-2 md:min-w-[140px]"
              >
                <div className="flex items-center gap-1 w-full justify-between">
                  <span className="text-xs font-medium">{asset.symbol}</span>
                  {isLoading ? (
                    <PriceSkeleton variant="compact" />
                  ) : (
                    <div className="price-info flex items-center gap-1">
                      <span className={`text-xs text-muted-foreground transition-colors duration-300 ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      } ${isPositive ? 'price-up' : 'price-down'}`}>
                        {formatPrice(currentPrice, asset.id)}
                      </span>
                      {isUsingCached && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded text-[10px]">
                          cached
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {!isLoading && priceChange !== 0 && (
                  <div className="flex items-center gap-1 w-full justify-between">
                    <div className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{priceChange.toFixed(1)}%
                    </div>
                    {history.length > 1 && (
                      <div className="sparkline-container">
                        <Sparkline 
                          data={history} 
                          isPositive={isPositive}
                          className="opacity-70"
                        />
                      </div>
                    )}
                  </div>
                )}
                {isUsingCached && (
                  <div className="text-xs text-gray-500 text-[10px]">
                    Using cached data
                  </div>
                )}
              </Button>
            );
          })}
          <Button
            onClick={handleSimulate}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 glow-primary"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Loading...' : 'Simulate'}
          </Button>
          <Button
            onClick={handleLaunchBot}
            disabled={tradingLoading || isLoading}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {tradingLoading ? 'Processing...' : 'Launch Bot'}
          </Button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-[200px] md:h-[250px] w-full">
        {isLoading || simulationData.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center space-y-2">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading price data...</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                label={{ value: 'Days Ago', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={isProfit ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                strokeWidth={3}
                dot={{ fill: isProfit ? "hsl(var(--success))" : "hsl(var(--destructive))", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Results */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
        <div className="flex-1 p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground mb-1">Final Value</p>
          {isLoading ? (
            <PriceSkeleton variant="large" />
          ) : (
            <p className="text-2xl font-bold">${finalValue.toFixed(2)}</p>
          )}
        </div>
        <div className="flex-1 p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground mb-1">Profit/Loss</p>
          {isLoading ? (
            <PriceSkeleton variant="large" />
          ) : (
            <div className="flex items-center gap-2">
              {isProfit ? (
                <TrendingUp className="w-5 h-5 text-success" />
              ) : (
                <TrendingDown className="w-5 h-5 text-destructive" />
              )}
              <p className={`text-2xl font-bold ${isProfit ? 'text-success glow-success' : 'text-destructive'}`}>
                {isProfit ? '+' : ''}{profitPercentage}%
              </p>
            </div>
          )}
        </div>
        <div className="flex-1 p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground mb-1">Amount</p>
          {isLoading ? (
            <PriceSkeleton variant="large" />
          ) : (
            <p className={`text-2xl font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
              {isProfit ? '+' : ''}{profit >= 0 ? '$' : '-$'}{Math.abs(profit).toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Order Status Tracker */}
      {orders.length > 0 && (
        <div className="mt-6">
          <OrderStatusTracker 
            orders={orders}
            onRefresh={refreshOrders}
            isLiveMode={isLiveMode}
          />
        </div>
      )}

      {/* Trading Confirmation Modal */}
      {pendingOrder && (
        <TradingConfirmationModal
          isOpen={showTradingModal}
          onClose={handleCancelTrade}
          onConfirm={handleConfirmTrade}
          orderDetails={pendingOrder}
          isLiveMode={isLiveMode}
        />
      )}
    </Card>
  );
};