-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create bots table for AI League
CREATE TABLE public.bots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  profitability DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sharpe DECIMAL(10, 2) NOT NULL DEFAULT 0,
  trades INTEGER NOT NULL DEFAULT 0,
  strategy TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view bots)
CREATE POLICY "Bots are viewable by everyone" 
ON public.bots 
FOR SELECT 
USING (true);

-- Create policy for public insert (anyone can create bots for demo)
CREATE POLICY "Anyone can create bots" 
ON public.bots 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bots_updated_at
BEFORE UPDATE ON public.bots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert mock data for testing
INSERT INTO public.bots (name, prompt, profitability, sharpe, trades, strategy) VALUES
('MemeHunter Pro', 'Trade memes only, Exit at +30%, Hold <6h, LLM auto-strategy', 24.5, 3.2, 142, 'Aggressive'),
('Volatility Rider', 'Follow momentum, RSI oversold entry, volume confirmation', 18.3, 2.8, 98, 'Momentum'),
('Smart Scalper', 'Quick scalps, tight stops, high frequency', 15.7, 2.5, 234, 'Scalping'),
('AI Trend Master', 'Trend following, MACD divergence, position sizing', 12.4, 2.1, 76, 'Trend Follow'),
('Risk Manager', 'Conservative entries, protect capital, low volatility', 9.8, 3.5, 45, 'Conservative');