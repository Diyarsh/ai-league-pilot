import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';

export function WalletConnect() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  // Force-open modal when disconnected to avoid provider redirect pages
  if (!connected) {
    return (
      <Button size="sm" className="glow-primary" onClick={() => setVisible(true)}>
        Connect Wallet
      </Button>
    );
  }
  // When connected, keep the rich dropdown/address experience
  return <WalletMultiButton />;
}
