import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp } from "lucide-react";

export const TradeButton = () => {
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();

  const executeTrade = () => {
    if (!connected || !publicKey) {
      toast({ title: "Connect wallet first", description: "Please connect Phantom / Backpack / Solflare on devnet." , variant: "destructive" });
      return;
    }

    // Mock execution – future: wire real Drift devnet tx behind a feature flag
    toast({
      title: "Trade sent (mock)",
      description: "Long SOL-PERP 2x $1000 → Drift devnet",
    });
    // console.log payload for future wiring
    console.log("Mock Drift trade", {
      market: "SOL-PERP",
      leverage: 2,
      notionalUsd: 1000,
      side: "long",
      publicKey: publicKey.toBase58(),
      network: "devnet",
    });
  };

  return (
    <Button onClick={executeTrade} className="bg-primary hover:bg-primary/90 glow-primary">
      <TrendingUp className="w-4 h-4 mr-2" />
      Execute on Drift (mock)
    </Button>
  );
};


