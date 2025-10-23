import { useState, useEffect, useCallback } from 'react';
import { HyperliquidTradingService, OrderRequest, OrderStatus } from '../services/hyperliquid-trading';

interface UseTradingOptions {
  isLiveMode: boolean;
  privateKey?: string;
  testnet?: boolean;
}

export const useTrading = (options: UseTradingOptions) => {
  const [tradingService, setTradingService] = useState<HyperliquidTradingService | null>(null);
  const [orders, setOrders] = useState<OrderStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize trading service
  useEffect(() => {
    const service = new HyperliquidTradingService({
      isLiveMode: options.isLiveMode,
      privateKey: options.privateKey,
      testnet: options.testnet
    });
    setTradingService(service);
  }, [options.isLiveMode, options.privateKey, options.testnet]);

  // Place order
  const placeOrder = useCallback(async (orderRequest: OrderRequest): Promise<OrderStatus | null> => {
    if (!tradingService) {
      setError('Trading service not initialized');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const order = await tradingService.placeOrder(orderRequest);
      setOrders(prev => [order, ...prev]);
      return order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to place order';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [tradingService]);

  // Refresh orders
  const refreshOrders = useCallback(async () => {
    if (!tradingService) return;

    try {
      const allOrders = tradingService.getAllOrders();
      setOrders(allOrders);
    } catch (err) {
      console.error('Failed to refresh orders:', err);
    }
  }, [tradingService]);

  // Get order status
  const getOrderStatus = useCallback(async (orderId: string): Promise<OrderStatus | null> => {
    if (!tradingService) return null;

    try {
      const status = await tradingService.getOrderStatus(orderId);
      if (status) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? status : order
        ));
      }
      return status;
    } catch (err) {
      console.error('Failed to get order status:', err);
      return null;
    }
  }, [tradingService]);

  // Get positions
  const getPositions = useCallback(async () => {
    if (!tradingService) return [];

    try {
      return await tradingService.getPositions();
    } catch (err) {
      console.error('Failed to get positions:', err);
      return [];
    }
  }, [tradingService]);

  // Get account info
  const getAccountInfo = useCallback(async () => {
    if (!tradingService) return null;

    try {
      return await tradingService.getAccountInfo();
    } catch (err) {
      console.error('Failed to get account info:', err);
      return null;
    }
  }, [tradingService]);

  // Auto-refresh orders in live mode
  useEffect(() => {
    if (!options.isLiveMode || !tradingService) return;

    const interval = setInterval(() => {
      refreshOrders();
    }, 5000); // Refresh every 5 seconds in live mode

    return () => clearInterval(interval);
  }, [options.isLiveMode, tradingService, refreshOrders]);

  return {
    tradingService,
    orders,
    isLoading,
    error,
    placeOrder,
    refreshOrders,
    getOrderStatus,
    getPositions,
    getAccountInfo,
    clearError: () => setError(null)
  };
};
