import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

interface ConfettiModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profit: number;
}

export const ConfettiModal = ({ open, onOpenChange, profit }: ConfettiModalProps) => {
  const [confettiPieces, setConfettiPieces] = useState<number[]>([]);
  
  useEffect(() => {
    if (open) {
      setConfettiPieces(Array.from({ length: 50 }, (_, i) => i));
      setTimeout(() => setConfettiPieces([]), 3000);
    }
  }, [open]);
  
  const handleClaim = () => {
    // Mock claim action
    console.log("Claiming profit to wallet...");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-primary/50 sm:max-w-md overflow-hidden">
        {/* Confetti Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiPieces.map((i) => (
            <div
              key={i}
              className="absolute w-3 h-3 animate-confetti rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: [
                  'hsl(var(--primary))', 
                  'hsl(var(--success))', 
                  'hsl(var(--accent))',
                  'hsl(var(--primary-glow))',
                  'hsl(var(--success-glow))'
                ][i % 5],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
        
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-success/10 w-fit animate-pulse-glow">
            <Sparkles className="w-12 h-12 text-success" />
          </div>
          <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">
            🎉 AI Profit Alert!
          </DialogTitle>
          <DialogDescription className="text-base">
            Your AI bot has generated profit!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-6 rounded-lg bg-gradient-to-br from-success/20 to-success/5 border border-success/30 text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Profit</p>
            <p className="text-4xl md:text-5xl font-bold text-success glow-success">
              +${profit.toFixed(2)}
            </p>
          </div>
          
          <Button
            onClick={handleClaim}
            className="w-full bg-success hover:bg-success/90 glow-success text-success-foreground"
            size="lg"
          >
            <Wallet className="w-5 h-5 mr-2" />
            Claim to TON Wallet (Gasless)
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            * Demo mode - Real wallet integration coming soon
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};