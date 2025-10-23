import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { OrderStatus } from '../services/hyperliquid-trading';

interface OrderStatusTrackerProps {
  orders: OrderStatus[];
  onRefresh: () => void;
  isLiveMode: boolean;
}

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  orders,
  onRefresh,
  isLiveMode
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const getStatusIcon = (status: OrderStatus['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'filled':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'filled':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatPnL = (pnl?: number) => {
    if (pnl === undefined) return 'N/A';
    const formatted = pnl >= 0 ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`;
    return formatted;
  };

  const getPnLColor = (pnl?: number) => {
    if (pnl === undefined) return 'text-gray-500';
    return pnl >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (orders.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-muted-foreground">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No orders yet</p>
          <p className="text-sm">Start trading to see your order history</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Order Status</h3>
        <div className="flex items-center gap-2">
          {isLiveMode && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Live Mode
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border"
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(order.status)}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{order.token}</span>
                  <div className="flex items-center gap-1">
                    {order.side === 'buy' ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {order.side.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.size} @ ${order.price.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">
                  {formatPnL(order.pnl)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {order.filledSize ? `${order.filledSize}/${order.size}` : '0/' + order.size}
                </div>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
