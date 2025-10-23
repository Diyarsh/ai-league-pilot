import { getHyperliquidSymbol, getTokenRiskLevel, getMinOrderSize } from './hyperliquid-mapping';

// Mock Hyperliquid client for now (will be replaced with real SDK)
class MockHyperliquidClient {
  exchange = {
    placeOrder: async (order: any) => {
      console.log('Mock order placed:', order);
      return { oid: Date.now() };
    },
    getOrderStatus: async (orderId: string) => {
      console.log('Mock order status:', orderId);
      return {
        status: 'open',
        coin: 'BTC-USD',
        is_buy: true,
        sz: 1,
        limit_px: 50000,
        filled_sz: 0,
        timestamp: Date.now()
      };
    },
    getPositions: async () => {
      console.log('Mock positions');
      return [];
    },
    getAccountInfo: async () => {
      console.log('Mock account info');
      return { balance: 10000, equity: 10000 };
    }
  };
}

export interface OrderRequest {
  token: string;
  side: 'buy' | 'sell';
  size: number;
  price?: number; // Optional for market orders
  orderType: 'market' | 'limit';
}

export interface OrderStatus {
  id: string;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  token: string;
  side: 'buy' | 'sell';
  size: number;
  price: number;
  filledSize?: number;
  pnl?: number;
  timestamp: Date;
}

export interface TradingConfig {
  isLiveMode: boolean;
  privateKey?: string;
  testnet?: boolean;
}

export class HyperliquidTradingService {
  private client: MockHyperliquidClient | null = null;
  private config: TradingConfig;
  private orders: Map<string, OrderStatus> = new Map();

  constructor(config: TradingConfig) {
    this.config = config;
    this.initializeClient();
  }

  private initializeClient() {
    if (this.config.isLiveMode && this.config.privateKey) {
      try {
        // For now, use mock client. In production, replace with real Hyperliquid SDK
        this.client = new MockHyperliquidClient();
        console.log('Hyperliquid client initialized (mock mode)');
      } catch (error) {
        console.error('Failed to initialize Hyperliquid client:', error);
      }
    }
  }

  async placeOrder(orderRequest: OrderRequest): Promise<OrderStatus> {
    if (!this.config.isLiveMode) {
      // Return mock order for simulation mode
      return this.createMockOrder(orderRequest);
    }

    if (!this.client) {
      throw new Error('Hyperliquid client not initialized');
    }

    try {
      const symbol = getHyperliquidSymbol(orderRequest.token);
      const minSize = getMinOrderSize(orderRequest.token);
      
      if (orderRequest.size < minSize) {
        throw new Error(`Order size too small. Minimum: ${minSize}`);
      }

      const order = {
        coin: symbol,
        is_buy: orderRequest.side === 'buy',
        sz: orderRequest.size,
        limit_px: orderRequest.price || 0,
        order_type: orderRequest.orderType === 'market' 
          ? { market: {} }
          : { limit: { tif: 'Gtc' } },
        reduce_only: false
      };

      const response = await this.client.exchange.placeOrder(order);
      
      const orderStatus: OrderStatus = {
        id: response.oid.toString(),
        status: 'pending',
        token: orderRequest.token,
        side: orderRequest.side,
        size: orderRequest.size,
        price: orderRequest.price || 0,
        timestamp: new Date()
      };

      this.orders.set(orderStatus.id, orderStatus);
      return orderStatus;

    } catch (error) {
      console.error('Error placing order:', error);
      throw new Error(`Failed to place order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus | null> {
    if (!this.config.isLiveMode) {
      return this.orders.get(orderId) || null;
    }

    if (!this.client) {
      throw new Error('Hyperliquid client not initialized');
    }

    try {
      const response = await this.client.exchange.getOrderStatus(orderId);
      
      if (response) {
        const orderStatus: OrderStatus = {
          id: orderId,
          status: response.status === 'open' ? 'pending' : 'filled',
          token: response.coin,
          side: response.is_buy ? 'buy' : 'sell',
          size: response.sz,
          price: response.limit_px,
          filledSize: response.filled_sz,
          timestamp: new Date(response.timestamp)
        };

        this.orders.set(orderId, orderStatus);
        return orderStatus;
      }

      return null;
    } catch (error) {
      console.error('Error fetching order status:', error);
      return null;
    }
  }

  async getPositions(): Promise<any[]> {
    if (!this.config.isLiveMode) {
      return []; // No positions in simulation mode
    }

    if (!this.client) {
      throw new Error('Hyperliquid client not initialized');
    }

    try {
      const response = await this.client.exchange.getPositions();
      return response || [];
    } catch (error) {
      console.error('Error fetching positions:', error);
      return [];
    }
  }

  async getAccountInfo(): Promise<any> {
    if (!this.config.isLiveMode) {
      return { balance: 10000, equity: 10000 }; // Mock account info
    }

    if (!this.client) {
      throw new Error('Hyperliquid client not initialized');
    }

    try {
      const response = await this.client.exchange.getAccountInfo();
      return response;
    } catch (error) {
      console.error('Error fetching account info:', error);
      return null;
    }
  }

  private createMockOrder(orderRequest: OrderRequest): OrderStatus {
    const orderId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const orderStatus: OrderStatus = {
      id: orderId,
      status: 'pending',
      token: orderRequest.token,
      side: orderRequest.side,
      size: orderRequest.size,
      price: orderRequest.price || 0,
      timestamp: new Date()
    };

    // Simulate order filling after a delay
    setTimeout(() => {
      const updatedOrder = { ...orderStatus, status: 'filled' as const };
      this.orders.set(orderId, updatedOrder);
    }, 2000);

    this.orders.set(orderId, orderStatus);
    return orderStatus;
  }

  updateConfig(newConfig: Partial<TradingConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.initializeClient();
  }

  getConfig(): TradingConfig {
    return { ...this.config };
  }

  getAllOrders(): OrderStatus[] {
    return Array.from(this.orders.values());
  }

  getOrdersByToken(token: string): OrderStatus[] {
    return Array.from(this.orders.values()).filter(order => order.token === token);
  }
}
