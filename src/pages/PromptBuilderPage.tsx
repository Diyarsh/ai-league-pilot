import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, Trash2, Plus, Rocket, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PromptBlock {
  id: string;
  text: string;
  category: "entry" | "exit" | "risk" | "asset";
}

const prebuiltBlocks: PromptBlock[] = [
  { id: "1", text: "Trade memes only", category: "asset" },
  { id: "2", text: "Exit at +30%", category: "exit" },
  { id: "3", text: "Hold <6h", category: "exit" },
  { id: "4", text: "LLM auto-strategy", category: "entry" },
  { id: "5", text: "RSI oversold entry", category: "entry" },
  { id: "6", text: "Max risk 2%", category: "risk" },
  { id: "7", text: "Stop loss -10%", category: "risk" },
  { id: "8", text: "High volume confirmation", category: "entry" },
];

// Mock preview data
const mockPreviewData = [
  { time: "00:00", value: 100 },
  { time: "04:00", value: 103 },
  { time: "08:00", value: 101 },
  { time: "12:00", value: 108 },
  { time: "16:00", value: 112 },
  { time: "20:00", value: 118 },
  { time: "24:00", value: 124 },
];

export default function PromptBuilderPage() {
  const [botName, setBotName] = useState("");
  const [selectedBlocks, setSelectedBlocks] = useState<PromptBlock[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  
  const getCategoryColor = (category: PromptBlock["category"]) => {
    switch (category) {
      case "entry": return "bg-primary/10 text-primary border-primary/20";
      case "exit": return "bg-success/10 text-success border-success/20";
      case "risk": return "bg-destructive/10 text-destructive border-destructive/20";
      case "asset": return "bg-accent/10 text-accent border-accent/20";
    }
  };
  
  const addBlock = (block: PromptBlock) => {
    if (!selectedBlocks.find(b => b.id === block.id)) {
      setSelectedBlocks([...selectedBlocks, block]);
    }
  };
  
  const removeBlock = (blockId: string) => {
    setSelectedBlocks(selectedBlocks.filter(b => b.id !== blockId));
  };
  
  const handleLaunchBot = async () => {
    if (!botName.trim()) {
      toast({
        title: "Bot Name Required",
        description: "Please give your bot a name",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedBlocks.length === 0) {
      toast({
        title: "Strategy Required",
        description: "Please add at least one strategy block",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      const prompt = selectedBlocks.map(b => b.text).join(", ");
      const strategy = selectedBlocks.find(b => b.category === "entry")?.text || "Custom";
      
      // Random metrics for demo
      const profitability = (Math.random() * 20 + 5).toFixed(2);
      const sharpe = (Math.random() * 2 + 1.5).toFixed(2);
      const trades = Math.floor(Math.random() * 100 + 20);
      
      const { error } = await supabase
        .from('bots')
        .insert({
          name: botName,
          prompt: prompt,
          profitability: parseFloat(profitability),
          sharpe: parseFloat(sharpe),
          trades: trades,
          strategy: strategy,
        });
      
      if (error) throw error;
      
      toast({
        title: "🎉 Bot Launched Successfully!",
        description: `${botName} is now running in demo mode`,
      });
      
      // Reset form
      setBotName("");
      setSelectedBlocks([]);
      
    } catch (error) {
      console.error("Error creating bot:", error);
      toast({
        title: "Error",
        description: "Failed to launch bot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary" />
              AI Bot <span className="text-gradient-primary">Builder</span>
            </h1>
            <p className="text-muted-foreground">
              Drag and drop blocks to create your custom trading strategy
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Builder Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bot Name Input */}
            <Card className="glass-card p-6">
              <label className="text-sm font-medium mb-2 block">Bot Name</label>
              <Input
                placeholder="Enter your bot name..."
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="bg-input border-border"
              />
            </Card>
            
            {/* Canvas - Selected Blocks */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">Your Strategy Canvas</h2>
              <div className="min-h-[200px] p-4 rounded-lg border-2 border-dashed border-border bg-secondary/20">
                {selectedBlocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center">
                    <Plus className="w-12 h-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Select blocks below to build your strategy
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedBlocks.map((block) => (
                      <Badge
                        key={block.id}
                        variant="outline"
                        className={`${getCategoryColor(block.category)} px-4 py-2 text-sm cursor-pointer hover:scale-105 transition-transform`}
                      >
                        {block.text}
                        <Trash2
                          className="w-3 h-3 ml-2 inline"
                          onClick={() => removeBlock(block.id)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
            
            {/* Available Blocks */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">Strategy Blocks</h2>
              <div className="space-y-4">
                {["entry", "exit", "risk", "asset"].map((category) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold mb-2 capitalize">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {prebuiltBlocks
                        .filter((b) => b.category === category)
                        .map((block) => (
                          <Badge
                            key={block.id}
                            variant="outline"
                            className={`${getCategoryColor(block.category)} px-4 py-2 cursor-pointer hover:scale-105 transition-transform`}
                            onClick={() => addBlock(block)}
                          >
                            <Plus className="w-3 h-3 mr-1 inline" />
                            {block.text}
                          </Badge>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Preview Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-card p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                24h Preview
              </h2>
              
              {/* Preview Chart */}
              <div className="h-[200px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockPreviewData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '10px' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '10px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Preview Metrics */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Profitability</span>
                  <span className="font-bold text-success">+24%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Est. Sharpe Ratio</span>
                  <span className="font-bold">2.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <Badge variant="outline">Medium</Badge>
                </div>
              </div>
              
              {/* Launch Button */}
              <Button
                onClick={handleLaunchBot}
                disabled={isCreating || !botName.trim() || selectedBlocks.length === 0}
                className="w-full bg-primary hover:bg-primary/90 glow-primary"
                size="lg"
              >
                {isCreating ? (
                  "Launching..."
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    Launch in Demo
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-2">
                Demo mode: $100 virtual capital
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}