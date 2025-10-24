import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface PnLDataPoint {
  timestamp: number;
  date: string;
  time: string;
  [key: string]: number | string;
}

export interface BotPerformance {
  id: string;
  name: string;
  color: string;
  currentValue: number;
  change24h: number;
  isActive: boolean;
  unrealizedPnL: number;
  totalTrades: number;
  winRate: number;
}

export const usePnLData = () => {
  const [data, setData] = useState<PnLDataPoint[]>([]);
  const [bots, setBots] = useState<BotPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize bots
  const initializeBots = useCallback(() => {
    const initialBots: BotPerformance[] = [
      {
        id: 'ai-bot-1',
        name: 'GPT-4 Turbo',
        color: '#3b82f6',
        currentValue: 10000,
        change24h: 0,
        isActive: true,
        unrealizedPnL: 0,
        totalTrades: 0,
        winRate: 0
      },
      {
        id: 'ai-bot-2',
        name: 'Claude Sonnet',
        color: '#8b5cf6',
        currentValue: 10000,
        change24h: 0,
        isActive: true,
        unrealizedPnL: 0,
        totalTrades: 0,
        winRate: 0
      },
      {
        id: 'ai-bot-3',
        name: 'Gemini Pro',
        color: '#10b981',
        currentValue: 10000,
        change24h: 0,
        isActive: true,
        unrealizedPnL: 0,
        totalTrades: 0,
        winRate: 0
      },
      {
        id: 'btc-buy-hold',
        name: 'BTC Buy & Hold',
        color: '#6b7280',
        currentValue: 10000,
        change24h: 0,
        isActive: true,
        unrealizedPnL: 0,
        totalTrades: 0,
        winRate: 0
      }
    ];
    setBots(initialBots);
  }, []);

  // Generate mock data for demonstration
  const generateMockData = useCallback(() => {
    const now = Date.now();
    const dataPoints: PnLDataPoint[] = [];
    const hours = 24 * 7; // 7 days of data
    
    for (let i = hours; i >= 0; i--) {
      const timestamp = now - (i * 60 * 60 * 1000); // Each point is 1 hour apart
      const date = new Date(timestamp);
      
      // Generate realistic trading data with some volatility
      const baseValue = 10000;
      const timeFactor = i / hours;
      
      const dataPoint: PnLDataPoint = {
        timestamp,
        date: date.toISOString().split('T')[0],
        time: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        'ai-bot-1': baseValue * (1 + Math.sin(timeFactor * Math.PI * 2) * 0.1 + Math.random() * 0.05),
        'ai-bot-2': baseValue * (1 + Math.sin(timeFactor * Math.PI * 2 + 1) * 0.08 + Math.random() * 0.03),
        'ai-bot-3': baseValue * (1 + Math.sin(timeFactor * Math.PI * 2 + 2) * 0.12 + Math.random() * 0.04),
        'btc-buy-hold': baseValue * (1 + timeFactor * 0.02 + Math.random() * 0.01) // More stable
      };
      
      dataPoints.push(dataPoint);
    }
    
    return dataPoints;
  }, []);

  // Update bot performance based on latest data
  const updateBotPerformance = useCallback((latestData: PnLDataPoint) => {
    setBots(prevBots => 
      prevBots.map(bot => {
        const currentValue = latestData[bot.id] as number || 10000;
        const previousValue = data.length > 1 ? data[data.length - 2][bot.id] as number : 10000;
        const change24h = ((currentValue - previousValue) / previousValue) * 100;
        
        return {
          ...bot,
          currentValue,
          change24h,
          unrealizedPnL: currentValue - 10000,
          totalTrades: Math.floor(Math.random() * 50) + 10, // Mock data
          winRate: Math.random() * 0.4 + 0.5 // 50-90% win rate
        };
      })
    );
  }, [data]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        initializeBots();
        
        // For now, use mock data. In production, this would fetch from Supabase
        const mockData = generateMockData();
        setData(mockData);
        
        if (mockData.length > 0) {
          updateBotPerformance(mockData[mockData.length - 1]);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load PnL data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [initializeBots, generateMockData, updateBotPerformance]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const now = Date.now();
        const lastPoint = prevData[prevData.length - 1];
        
        // Create new data point with some variation
        const newPoint: PnLDataPoint = {
          timestamp: now,
          date: new Date(now).toISOString().split('T')[0],
          time: new Date(now).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          'ai-bot-1': (lastPoint['ai-bot-1'] as number) * (1 + (Math.random() - 0.5) * 0.02),
          'ai-bot-2': (lastPoint['ai-bot-2'] as number) * (1 + (Math.random() - 0.5) * 0.015),
          'ai-bot-3': (lastPoint['ai-bot-3'] as number) * (1 + (Math.random() - 0.5) * 0.025),
          'btc-buy-hold': (lastPoint['btc-buy-hold'] as number) * (1 + (Math.random() - 0.5) * 0.005)
        };
        
        // Keep only last 168 hours (7 days) of data
        const newData = [...prevData, newPoint].slice(-168);
        
        // Update bot performance
        updateBotPerformance(newPoint);
        
        return newData;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [updateBotPerformance]);

  // Add new trade entry/exit
  const addTradeEntry = useCallback((botId: string, entryPrice: number, side: 'long' | 'short') => {
    // This would typically update the database
    console.log(`Trade entry: ${botId} ${side} at $${entryPrice}`);
  }, []);

  const addTradeExit = useCallback((botId: string, exitPrice: number, pnl: number) => {
    // This would typically update the database
    console.log(`Trade exit: ${botId} at $${exitPrice}, PnL: $${pnl}`);
  }, []);

  return {
    data,
    bots,
    isLoading,
    error,
    addTradeEntry,
    addTradeExit,
    refreshData: () => {
      const mockData = generateMockData();
      setData(mockData);
      if (mockData.length > 0) {
        updateBotPerformance(mockData[mockData.length - 1]);
      }
    }
  };
};
