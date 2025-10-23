import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Settings, Bell, Palette, BarChart3, Shield, Wallet, Zap } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState([10]);
  const [liveMode, setLiveMode] = useState(false);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            <span className="text-gradient-primary">Settings</span>
          </h1>
          <p className="text-muted-foreground">
            Customize your AI League trading experience
          </p>
        </div>

        <div className="grid gap-6">
          {/* Notifications */}
          <Card className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Bell className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Notifications</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Get notified about important trading events and bot performance
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enable notifications</span>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Display Preferences */}
          <Card className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/10 text-accent">
                <Palette className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Display</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize your interface appearance and behavior
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dark mode</span>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Trading Preferences */}
          <Card className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-success/10 text-success">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Trading</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure your trading simulation preferences
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-refresh prices</span>
                    <Switch
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                    />
                  </div>
                  {autoRefresh && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Refresh interval</span>
                        <Badge variant="outline">{refreshInterval[0]}s</Badge>
                      </div>
                      <Slider
                        value={refreshInterval}
                        onValueChange={setRefreshInterval}
                        min={5}
                        max={60}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Live Trading */}
          <Card className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Live Trading</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Enable real trading execution on Hyperliquid (Use with caution!)
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Live Mode</span>
                      <p className="text-xs text-muted-foreground">
                        Execute real trades on Hyperliquid
                      </p>
                    </div>
                    <Switch
                      checked={liveMode}
                      onCheckedChange={setLiveMode}
                    />
                  </div>
                  {liveMode && (
                    <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <p className="text-xs text-orange-600 font-medium">
                        ⚠️ Live trading is enabled. Real money will be used!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Security</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your wallet connection and data privacy
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      <span className="text-sm">TON Wallet</span>
                    </div>
                    <Badge variant="outline">Connected</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Disconnect Wallet
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
