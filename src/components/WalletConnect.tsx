import React, { useEffect, useState } from 'react';
import { TonConnectButton, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, onDisconnect }) => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  // Auto-reconnect on page load if address in localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem('ton_wallet_address');
    if (savedAddress && !wallet) {
      // Try to restore connection
      console.log('Attempting to restore wallet connection...');
    }
  }, [wallet]);

  // Handle wallet connection
  useEffect(() => {
    if (wallet) {
      const address = wallet.account.address;
      localStorage.setItem('ton_wallet_address', address);
      
      // Save to Supabase
      const saveToSupabase = async () => {
        try {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              wallet_address: address,
              created_at: new Date().toISOString()
            }, {
              onConflict: 'wallet_address'
            });

          if (error) {
            console.error('Error saving wallet address:', error);
          } else {
            toast({
              title: "Wallet Connected",
              description: "Your TON wallet has been connected successfully!",
            });
            onConnect?.(address);
          }
        } catch (error) {
          console.error('Error saving to Supabase:', error);
        }
      };
      
      saveToSupabase();
    } else {
      // Wallet disconnected
      localStorage.removeItem('ton_wallet_address');
      onDisconnect?.();
    }
  }, [wallet, onConnect, onDisconnect, toast]);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      
      // Use TonConnect UI to connect
      await tonConnectUI.openModal();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setConnectionError('Connection failed');
      setRetryCount(prev => prev + 1);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await tonConnectUI.disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your TON wallet has been disconnected",
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  if (wallet) {
    const address = wallet.account.address;
    return (
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {address.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{truncateAddress(address)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="text-xs"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  if (connectionError && retryCount >= 3) {
    return (
      <Button
        onClick={() => {
          setRetryCount(0);
          setConnectionError(null);
          handleConnect();
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Retry
      </Button>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};
