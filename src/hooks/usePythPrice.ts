import { useEffect, useRef, useState } from "react";

interface PythPricePoint {
  price: number | null;
  lastUpdated: number | null;
  source: "pyth" | "fallback" | "cache" | null;
}

// Lightweight browser-friendly Pyth price fetch using Hermes HTTP API.
// We avoid heavy SDKs to keep bundle lean and devnet-friendly.
export function usePythPrice(pollMs: number = 5000) {
  const [state, setState] = useState<PythPricePoint>({ price: null, lastUpdated: null, source: null });
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const CACHE_KEY = "pyth_sol_usd_price_cache";

    const computePriceFromPyth = (entry: any): number | null => {
      if (!entry || !entry.price) return null;
      const p = entry.price.price; // integer price with exponent
      const expo = entry.price.expo; // e.g., -8
      if (typeof p !== "number" || typeof expo !== "number") return null;
      // Convert to floating point: p * 10^expo
      return p * Math.pow(10, expo);
    };

    const fetchOnce = async () => {
      try {
        // Try Hermes v2 query by symbol. Include network=devnet to prefer devnet feeds.
        const url = "https://hermes.pyth.network/v2/price_feeds?query=SOL/USD&network=devnet";
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const first = Array.isArray(data) ? data[0] : null;
        const price = computePriceFromPyth(first);
        if (price && isFinite(price)) {
          setState({ price, lastUpdated: Date.now(), source: "pyth" });
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ price, lastUpdated: Date.now() })
          );
          return;
        }
        throw new Error("Invalid Pyth payload");
      } catch (e) {
        // Fallback: use cached value if under 5 minutes old
        const cachedRaw = localStorage.getItem("pyth_sol_usd_price_cache");
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw);
            if (cached?.price && Date.now() - cached.lastUpdated < 5 * 60 * 1000) {
              setState({ price: cached.price, lastUpdated: cached.lastUpdated, source: "cache" });
              return;
            }
          } catch {}
        }
        // Last-resort fallback: fetch CoinGecko SOL price so UI stays informative
        try {
          const cg = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
            { cache: "no-store" }
          ).then((r) => r.json());
          const price = cg?.solana?.usd ?? null;
          setState({ price, lastUpdated: Date.now(), source: "fallback" });
        } catch {
          setState((s) => ({ ...s, source: s.source ?? null }));
        }
      }
    };

    // Initial fetch
    fetchOnce();
    // Polling loop
    timerRef.current = window.setInterval(fetchOnce, pollMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [pollMs]);

  return state;
}


