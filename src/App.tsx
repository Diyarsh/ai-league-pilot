import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import LeaderboardPage from "./pages/LeaderboardPage";
import PromptBuilderPageDnD from "./pages/PromptBuilderPageDnD";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import Submit from "./pages/Submit";

const queryClient = new QueryClient();

const App = () => (
  <TonConnectUIProvider
    manifestUrl="https://ton-connect.github.io/demo-dapp-with-react/tonconnect-manifest.json"
    walletsListConfiguration={{
      includeWallets: [
        {
          appName: "tonwallet",
          name: "TON Wallet",
          imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
          aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
          universalLink: "https://wallet.ton.org/ton-connect",
          jsBridgeKey: "tonwallet",
          bridgeUrl: "https://bridge.tonapi.io/bridge",
          platforms: ["chrome", "android"]
        }
      ]
    }}
    actionsConfiguration={{
      twaReturnUrl: 'https://t.me/your_bot'
    }}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/builder" element={<PromptBuilderPageDnD />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/submit" element={<Submit />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </TonConnectUIProvider>
);

export default App;
