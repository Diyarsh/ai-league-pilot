-- Create trades table
CREATE TABLE IF NOT EXISTS public.trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id UUID NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
  asset TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  price NUMERIC NOT NULL,
  amount NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Trades are viewable by everyone"
ON public.trades
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create trades"
ON public.trades
FOR INSERT
WITH CHECK (true);

-- Add index for better performance
CREATE INDEX idx_trades_bot_id ON public.trades(bot_id);
CREATE INDEX idx_trades_timestamp ON public.trades(timestamp DESC);

-- Enable realtime for bots table
ALTER PUBLICATION supabase_realtime ADD TABLE public.bots;