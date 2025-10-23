import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

export interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h?: number;
  priceHistory?: number[];
}

export interface CryptoPrices {
  bitcoin: CryptoPrice;
  ethereum: CryptoPrice;
  solana: CryptoPrice;
  pepe: CryptoPrice;
  dogecoin: CryptoPrice;
}

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const COINS = ['bitcoin', 'ethereum', 'solana', 'pepe', 'dogecoin'];
const COIN_NAMES = {
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum', 
  solana: 'Solana',
  pepe: 'Pepe',
  dogecoin: 'Dogecoin'
};

const COIN_SYMBOLS = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  solana: 'SOL', 
  pepe: 'PEPE',
  dogecoin: 'DOGE'
};

export const useCryptoPrices = (intervalMs: number = 10000) => {
  const [prices, setPrices] = useState<CryptoPrices | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingCached, setIsUsingCached] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [priceHistory, setPriceHistory] = useState<Record<string, number[]>>({});
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchPrices = useCallback(async () => {
    try {
      setError(null);
      setIsUsingCached(false);
      
      const response = await fetch(
        `${COINGECKO_API_URL}?ids=${COINS.join(',')}&vs_currencies=usd&include_24hr_change=true`
      );
      
      if (!response.ok) {
        if (response.status === 429) {
          setRateLimited(true);
          console.log('Rate limited, retrying in 60s...');
          setTimeout(() => setRateLimited(false), 60000);
          throw new Error('Rate limited');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const formattedPrices: CryptoPrices = {
        bitcoin: {
          id: 'bitcoin',
          name: COIN_NAMES.bitcoin,
          symbol: COIN_SYMBOLS.bitcoin,
          price: data.bitcoin.usd,
          change24h: data.bitcoin.usd_24h_change
        },
        ethereum: {
          id: 'ethereum',
          name: COIN_NAMES.ethereum,
          symbol: COIN_SYMBOLS.ethereum,
          price: data.ethereum.usd,
          change24h: data.ethereum.usd_24h_change
        },
        solana: {
          id: 'solana',
          name: COIN_NAMES.solana,
          symbol: COIN_SYMBOLS.solana,
          price: data.solana.usd,
          change24h: data.solana.usd_24h_change
        },
        pepe: {
          id: 'pepe',
          name: COIN_NAMES.pepe,
          symbol: COIN_SYMBOLS.pepe,
          price: data.pepe.usd,
          change24h: data.pepe.usd_24h_change
        },
        dogecoin: {
          id: 'dogecoin',
          name: COIN_NAMES.dogecoin,
          symbol: COIN_SYMBOLS.dogecoin,
          price: data.dogecoin.usd,
          change24h: data.dogecoin.usd_24h_change
        }
      };
      
      setPrices(formattedPrices);
      setIsLoading(false);
      setRateLimited(false);
      setLastUpdate(new Date());
      
      // Update price history for sparklines
      setPriceHistory(prev => {
        const newHistory = { ...prev };
        Object.keys(formattedPrices).forEach(coinId => {
          const price = formattedPrices[coinId as keyof CryptoPrices].price;
          if (!newHistory[coinId]) {
            newHistory[coinId] = [];
          }
          newHistory[coinId].push(price);
          // Keep only last 20 data points for sparkline
          if (newHistory[coinId].length > 20) {
            newHistory[coinId] = newHistory[coinId].slice(-20);
          }
        });
        return newHistory;
      });
      
      // Cache the prices
      localStorage.setItem('cached_crypto_prices', JSON.stringify(formattedPrices));
      localStorage.setItem('cached_crypto_timestamp', Date.now().toString());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prices';
      setError(errorMessage);
      setIsLoading(false);
      
      // Try to use cached data
      const cachedPrices = localStorage.getItem('cached_crypto_prices');
      const cachedTimestamp = localStorage.getItem('cached_crypto_timestamp');
      
      if (cachedPrices && cachedTimestamp) {
        const timeDiff = Date.now() - parseInt(cachedTimestamp);
        if (timeDiff < 300000) { // Use cache if less than 5 minutes old
          const parsedPrices = JSON.parse(cachedPrices);
          setPrices(parsedPrices);
          setIsUsingCached(true);
          console.log('Using cached price data');
        }
      }
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchPrices();
    
    // Set up interval with rate limit handling
    const interval = setInterval(() => {
      if (!rateLimited) {
        fetchPrices();
      } else {
        console.log('Rate limited, skipping fetch...');
      }
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [fetchPrices, intervalMs, rateLimited]);

  const getPrice = useCallback((coinId: keyof CryptoPrices) => {
    return prices?.[coinId]?.price || 0;
  }, [prices]);

  const getPriceChange = useCallback((coinId: keyof CryptoPrices) => {
    return prices?.[coinId]?.change24h || 0;
  }, [prices]);

  const formatPrice = useCallback((price: number, coinId: string) => {
    let decimals = 2;
    
    // Set appropriate decimal places for different coins
    if (coinId === 'pepe') {
      decimals = 8; // Very small values
    } else if (coinId === 'dogecoin') {
      decimals = 4; // Small values
    } else if (coinId === 'bitcoin' || coinId === 'ethereum') {
      decimals = 2; // Large values
    } else if (coinId === 'solana') {
      decimals = 2; // Medium values
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(price);
  }, []);

  return {
    prices,
    isLoading,
    error,
    isUsingCached,
    rateLimited,
    priceHistory,
    lastUpdate,
    getPrice,
    getPriceChange,
    formatPrice,
    refetch: fetchPrices
  };
};
