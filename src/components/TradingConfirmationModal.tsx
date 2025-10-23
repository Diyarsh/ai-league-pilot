import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { getTokenRiskLevel } from '../services/hyperliquid-mapping';

interface TradingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderDetails: {
    token: string;
    side: 'buy' | 'sell';
    size: number;
    price?: number;
    orderType: 'market' | 'limit';
  };
  isLiveMode: boolean;
}

export const TradingConfirmationModal: React.FC<TradingConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderDetails,
  isLiveMode
}) => {
  const riskLevel = getTokenRiskLevel(orderDetails.token);
  const isHighRisk = riskLevel === 'HIGH';
  const isBuy = orderDetails.side === 'buy';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLiveMode ? (
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            ) : (
              <TrendingUp className="w-5 h-5 text-primary" />
            )}
            {isLiveMode ? 'Live Trading Confirmation' : 'Simulation Trade'}
          </DialogTitle>
          <DialogDescription>
            {isLiveMode 
              ? 'This will execute a real trade on Hyperliquid. Please review carefully.'
              : 'This is a simulation trade for testing purposes.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Details */}
          <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Asset</span>
              <Badge variant="outline">{orderDetails.token}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Side</span>
              <div className="flex items-center gap-1">
                {isBuy ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${isBuy ? 'text-green-500' : 'text-red-500'}`}>
                  {orderDetails.side.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Size</span>
              <span className="text-sm">{orderDetails.size}</span>
            </div>
            {orderDetails.price && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Price</span>
                <span className="text-sm">${orderDetails.price.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Type</span>
              <Badge variant="secondary">{orderDetails.orderType}</Badge>
            </div>
          </div>

          {/* Risk Warning */}
          <div className={`p-3 rounded-lg border ${
            isHighRisk 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : riskLevel === 'MEDIUM'
              ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
              : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Risk Level: {riskLevel}
              </span>
            </div>
            {isHighRisk && (
              <p className="text-xs mt-1">
                This asset has high volatility. Consider position sizing carefully.
              </p>
            )}
          </div>

          {/* Live Mode Warning */}
          {isLiveMode && (
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-800">
                  Live Trading Enabled
                </span>
              </div>
              <p className="text-xs text-orange-700 mt-1">
                This will execute a real trade using your connected wallet. 
                You may lose money. Trade responsibly.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              className={`flex-1 ${
                isLiveMode 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isLiveMode ? 'Execute Live Trade' : 'Execute Simulation'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
