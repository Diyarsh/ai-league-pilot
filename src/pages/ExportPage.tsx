import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Database, FileCode, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ExportPage() {
  const { toast } = useToast();

  const downloadSchema = () => {
    const schema = `-- AI-League Database Schema
-- Export Date: ${new Date().toISOString()}

-- Create bots table
CREATE TABLE IF NOT EXISTS public.bots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  strategy TEXT NOT NULL,
  profitability NUMERIC NOT NULL DEFAULT 0,
  sharpe NUMERIC NOT NULL DEFAULT 0,
  trades INTEGER NOT NULL DEFAULT 0
);

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
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Bots policies
CREATE POLICY "Bots are viewable by everyone"
ON public.bots FOR SELECT USING (true);

CREATE POLICY "Anyone can create bots"
ON public.bots FOR INSERT WITH CHECK (true);

-- Trades policies
CREATE POLICY "Trades are viewable by everyone"
ON public.trades FOR SELECT USING (true);

CREATE POLICY "Anyone can create trades"
ON public.trades FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX idx_trades_bot_id ON public.trades(bot_id);
CREATE INDEX idx_trades_timestamp ON public.trades(timestamp DESC);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.bots;

-- Update trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = 'public';

CREATE TRIGGER update_bots_updated_at
BEFORE UPDATE ON public.bots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Mock data
INSERT INTO public.bots (name, prompt, strategy, profitability, sharpe, trades) VALUES
('Meme Scalper', 'Trade memes only, Exit at +30%', 'Aggressive Scalping', 18.5, 2.3, 47),
('Conservative DCA', 'High volume confirmation, Max risk 2%', 'Conservative DCA', 12.2, 3.1, 23),
('Momentum Hunter', 'RSI oversold entry, Stop loss -10%', 'Momentum Trading', 24.7, 1.9, 68),
('AI Strategy Bot', 'LLM auto-strategy, Hold <6h', 'LLM Multi-Strategy', 15.8, 2.6, 35),
('Risk Manager', 'Max risk 2%, Stop loss -10%, Exit at +30%', 'Risk-Managed Trading', 10.4, 3.5, 19);
`;

    const blob = new Blob([schema], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-league-schema.sql';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Schema Downloaded",
      description: "Full database schema with mock data exported",
    });
  };

  const downloadEnvTemplate = () => {
    const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here

# Optional: Add your own AI API key
# GROK_API_KEY=your_grok_key_here
# OPENAI_API_KEY=your_openai_key_here
`;

    const blob = new Blob([envContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env.template';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: ".env template file downloaded",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Export & <span className="text-gradient-primary">Migration</span>
          </h1>
          <p className="text-muted-foreground">
            Export your AI-League database and prepare for GitHub migration
          </p>
        </div>

        <div className="grid gap-6">
          {/* Database Schema */}
          <Card className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Database className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Database Schema</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Download complete SQL schema including tables, RLS policies, triggers, and mock data
                </p>
                <Button onClick={downloadSchema} className="glow-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Download Schema (.sql)
                </Button>
              </div>
            </div>
          </Card>

          {/* Environment Template */}
          <Card className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-success/10 text-success">
                <FileCode className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Environment Template</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Get a template .env file with all required variables
                </p>
                <Button onClick={downloadEnvTemplate} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download .env Template
                </Button>
              </div>
            </div>
          </Card>

          {/* Migration Guide */}
          <Card className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/10 text-accent">
                <Github className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Migration Guide</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Follow these steps to migrate to your own infrastructure:
                </p>
                <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                  <li>Create a new Supabase project at supabase.com</li>
                  <li>Run the downloaded schema SQL in your Supabase SQL editor</li>
                  <li>Copy your project URL and anon key to .env file</li>
                  <li>(Optional) Add Grok or OpenAI API key for AI features</li>
                  <li>Deploy edge functions from supabase/functions/ folder</li>
                  <li>Push to GitHub and deploy to Vercel</li>
                </ol>
                <div className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-xs font-mono text-muted-foreground">
                    📖 See README.md for complete migration instructions
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
