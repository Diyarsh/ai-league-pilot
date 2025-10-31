import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Zap,
  Wallet,
  Brain,
  TrendingUp,
  X,
  ArrowRight,
  ArrowLeft,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TOTAL_STEPS = 6;

export const OnboardingModal = () => {
  const {
    currentStep,
    completed,
    skipOnboarding,
    demoAccountExpiry,
    isOpen,
    nextStep,
    prevStep,
    skip,
    complete,
    setDemoExpiry,
    open,
    close,
  } = useOnboardingStore();
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [confettiPieces, setConfettiPieces] = useState<number[]>([]);
  const [botName, setBotName] = useState('');
  const [encryptWithArcium, setEncryptWithArcium] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [walletModalOpening, setWalletModalOpening] = useState(false);

  // Calculate demo account time remaining
  useEffect(() => {
    if (demoAccountExpiry && currentStep >= 2) {
      const updateTimer = () => {
        const now = Date.now();
        const remaining = demoAccountExpiry - now;
        if (remaining > 0) {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining('Expired');
        }
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [demoAccountExpiry, currentStep]);

  // Initialize demo account expiry on step 2
  useEffect(() => {
    if (currentStep === 2 && !demoAccountExpiry) {
      const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      setDemoExpiry(expiry);
    }
  }, [currentStep, demoAccountExpiry, setDemoExpiry]);

  // Reopen onboarding modal when wallet connects on step 3
  useEffect(() => {
    if (currentStep === 3 && connected && publicKey && !isOpen) {
      // Reopen the onboarding modal if wallet just connected
      open();
    }
  }, [currentStep, connected, publicKey, isOpen, open]);

  // Auto-advance wallet connection step
  useEffect(() => {
    if (currentStep === 3 && connected && publicKey && isOpen) {
      const timer = setTimeout(() => {
        nextStep();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, connected, publicKey, isOpen, nextStep]);

  // Auto-advance timer (5 seconds per step)
  useEffect(() => {
    if (currentStep < TOTAL_STEPS && !showConfetti) {
      const timer = setTimeout(() => {
        // Skip auto-advance on steps that require user action
        if (currentStep === 3 && !connected) return;
        if (currentStep === 4 && !botName.trim()) return;
        if (currentStep === 6) return; // Don't auto-advance from last step
        nextStep();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, connected, botName, showConfetti, nextStep]);

  // Show confetti on step 5
  useEffect(() => {
    if (currentStep === 5) {
      setShowConfetti(true);
      setConfettiPieces(Array.from({ length: 50 }, (_, i) => i));
      setTimeout(() => setConfettiPieces([]), 3000);
    }
  }, [currentStep]);

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  // Mock battle data for step 5 - DeepSeek +126% (starts at 10000, ends at 22600)
  const battleData = [
    { name: 'Start', grok4: 10000, deepseek: 10000 },
    { name: '1h', grok4: 10100, deepseek: 11600 },
    { name: '2h', grok4: 10200, deepseek: 13400 },
    { name: '3h', grok4: 10300, deepseek: 15400 },
    { name: '4h', grok4: 10400, deepseek: 17600 },
    { name: '5h', grok4: 10500, deepseek: 19600 },
    { name: '6h', grok4: 10600, deepseek: 21200 },
    { name: '7h', grok4: 10700, deepseek: 22000 },
    { name: '8h', grok4: 10800, deepseek: 22600 },
  ];

  const handleCreateBot = () => {
    if (!botName.trim()) {
      toast.error('Please enter a bot name');
      return;
    }
    toast.success(`Bot "${botName}" created${encryptWithArcium ? ' with Arcium encryption' : ''}!`);
    // Save to localStorage for demo
    localStorage.setItem('onboardingBot', JSON.stringify({ name: botName, encrypted: encryptWithArcium }));
    nextStep();
  };

  const handleExecuteTrade = () => {
    if (!connected || !publicKey) {
      toast.error('Connect wallet first');
      return;
    }
    toast.success('Trade executed on Drift devnet (mock)', {
      description: 'Long SOL-PERP 2x with $1000',
    });
    console.log('Drift Mock Trade:', {
      market: 'SOL-PERP',
      leverage: '2x',
      notionalUsd: 1000,
      wallet: publicKey.toBase58(),
      timestamp: new Date().toISOString(),
    });
    setTimeout(() => {
      complete();
    }, 1500);
  };

  // Show modal if:
  // 1. Not completed and not skipped (first time)
  // 2. Or manually opened via Settings
  // 3. But NOT when wallet modal is opening (to prevent z-index conflicts)
  const shouldShow = ((!completed && !skipOnboarding) || isOpen) && !walletModalOpening;

  // Auto-open on first visit and ensure we start from step 1
  useEffect(() => {
    if (!completed && !skipOnboarding && !isOpen && !walletModalOpening) {
      // Always reset to step 1 for fresh start if not completed
      if (currentStep > 1) {
        const { reset } = useOnboardingStore.getState();
        reset();
      } else {
        open();
      }
    }
  }, [completed, skipOnboarding, isOpen, walletModalOpening, currentStep]);

  // Auto-advance if wallet is already connected on step 3
  useEffect(() => {
    if (currentStep === 3 && connected && publicKey && !walletModalOpening) {
      // Wallet already connected, skip wallet modal and advance
      const timer = setTimeout(() => {
        nextStep();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, connected, publicKey, walletModalOpening, nextStep]);

  if (!shouldShow) return null;

  return (
    <Dialog open={shouldShow} onOpenChange={(open) => {
      if (!open) {
        // If dialog is closed, mark as skipped
        close();
        if (currentStep < TOTAL_STEPS) {
          skip();
        }
      }
    }}>
      <DialogContent className="glass-card border-primary/50 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
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
                  ][i % 3],
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random()}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-bold">
            Welcome to AI-League
          </DialogTitle>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {TOTAL_STEPS}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </DialogHeader>

        {/* Step Content */}
        <div className="py-6 min-h-[400px]">
          {currentStep === 1 && (
            <div className="space-y-6 text-center">
              <div className="mx-auto p-6 rounded-full bg-primary/10 w-fit">
                <Zap className="w-16 h-16 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Welcome to AI-League</h3>
                <p className="text-muted-foreground text-lg">
                  No KYC required — wallet-only trading
                </p>
              </div>
              <Card className="p-6 bg-secondary/50">
                <p className="text-sm text-muted-foreground">
                  Trade with AI bots powered by LLMs. Compete against other traders in real-time battles.
                  All powered by Solana and zero-knowledge privacy.
                </p>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Demo Account</h3>
                <p className="text-muted-foreground">Start with virtual capital</p>
              </div>
              <Card className="p-8 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
                <div className="text-center space-y-4">
                  <div className="text-5xl font-bold text-primary">$10,000</div>
                  <p className="text-sm text-muted-foreground">Virtual Capital</p>
                  {timeRemaining && (
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {timeRemaining} remaining
                    </Badge>
                  )}
                </div>
              </Card>
              <p className="text-sm text-center text-muted-foreground">
                Your demo account expires in 24 hours. Use it to test strategies risk-free!
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Connect Wallet</h3>
                <p className="text-muted-foreground">Connect your Phantom wallet to continue</p>
              </div>
              <div className="flex justify-center">
                <div className={`p-8 rounded-lg border-2 ${
                  connected ? 'border-success bg-success/10' : 'border-border bg-secondary/50'
                }`}>
                  <Wallet className={`w-16 h-16 mx-auto mb-4 ${
                    connected ? 'text-success' : 'text-muted-foreground'
                  }`} />
                  {connected && publicKey ? (
                    <div className="text-center space-y-4">
                      <div>
                        <p className="font-bold text-success mb-2">Wallet Connected!</p>
                        <p className="text-sm text-muted-foreground">
                          {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
                        </p>
                      </div>
                      <Button
                        onClick={nextStep}
                        className="glow-primary"
                        size="lg"
                      >
                        Continue
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Auto-advancing in a moment...
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        // Set flag to prevent onboarding modal from rendering
                        setWalletModalOpening(true);
                        // Close onboarding modal
                        close();
                        // Wait for onboarding modal to fully close, then open wallet modal
                        setTimeout(() => {
                          setVisible(true);
                          // After opening wallet modal, advance and close it
                          setTimeout(() => {
                            // Close wallet modal first
                            setVisible(false);
                            // Then advance to next step
                            nextStep();
                            setWalletModalOpening(false);
                            // Reopen onboarding modal
                            setTimeout(() => {
                              open();
                            }, 200);
                          }, 300);
                        }, 300);
                      }}
                      className="glow-primary"
                      size="lg"
                    >
                      <Wallet className="w-5 h-5 mr-2" />
                      Connect Phantom Wallet
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Create Your Bot</h3>
                <p className="text-muted-foreground">Build your trading strategy</p>
              </div>
              <Card className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Bot Name</label>
                  <Input
                    placeholder="Enter bot name..."
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-secondary/50">
                  <Checkbox
                    id="arcium"
                    checked={encryptWithArcium}
                    onCheckedChange={(checked) => setEncryptWithArcium(checked as boolean)}
                  />
                  <label
                    htmlFor="arcium"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Encrypt with Arcium (zk-stub)
                  </label>
                </div>
                <Button
                  onClick={handleCreateBot}
                  disabled={!botName.trim()}
                  className="w-full glow-primary"
                  size="lg"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Create Bot
                </Button>
              </Card>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Battle vs LLM</h3>
                <p className="text-muted-foreground">Watch your bot compete against AI models</p>
              </div>
              <Card className="p-6">
                <div className="space-y-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <span className="font-medium">Grok 4</span>
                    </div>
                    <Badge variant="outline">+8%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <span className="font-medium">DeepSeek Chat V3.1</span>
                    </div>
                    <Badge variant="default" className="bg-success">+126%</Badge>
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={battleData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '10px' }} />
                      <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '10px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="grok4"
                        stroke="#1E90FF"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="deepseek"
                        stroke="#32CD32"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Execute Trade</h3>
                <p className="text-muted-foreground">Execute your first mock trade on Drift</p>
              </div>
              <Card className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Market: SOL-PERP</p>
                  <p className="text-sm text-muted-foreground">Leverage: 2x</p>
                  <p className="text-sm text-muted-foreground">Notional: $1,000</p>
                </div>
                <Button
                  onClick={handleExecuteTrade}
                  disabled={!connected}
                  className="w-full glow-primary"
                  size="lg"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Execute on Drift (mock)
                </Button>
                {!connected && (
                  <p className="text-xs text-center text-muted-foreground">
                    Please connect your wallet first
                  </p>
                )}
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <div className="flex gap-2">
            <Badge variant="outline">Powered by Pyth</Badge>
            <Badge variant="outline">Solana devnet</Badge>
          </div>
          
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            {currentStep < TOTAL_STEPS ? (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 3 && !connected) ||
                  (currentStep === 4 && !botName.trim())
                }
                className="glow-primary"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={complete} className="glow-primary">
                Complete
              </Button>
            )}
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};

