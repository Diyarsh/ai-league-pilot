# AI-League: Drag, Drop, Dominate 🤖⚡

Solana Cypherpunk Hackathon submission

- Tracks: Consumer Apps • DeFi • Undefined
- Demo: https://ai-league-pilot.vercel.app/
- GitHub: https://github.com/Diyarsh/ai-league-pilot
- Video (1 min, Loom): TBD

> Alpha Arena for everyone — build AI bots, battle LLMs, and (mock) execute perps on Solana.

## Why it wins
- Consumer-grade UI (drag & drop, mobile-ready), live charts, leaderboards
- DeFi-ready: zk-private strategies (stub), Pyth prices, Drift (mock exec)
- Clear extensibility to real on-chain execution post-hackathon

## What’s implemented (MVP)
- Solana wallet connect (Phantom, Backpack, Solflare) on devnet
- Pyth SOL/USD price in header (HTTP Hermes, cached fallback)
- Drift perps mock action (toast + payload) with wallet check
- LLM/Bot PnL chart and AI thinking panel
- Submission page with links (Demo, README, Loom)

## Quick start

Prerequisites: Node 18+, npm

```bash
npm install
npm run dev
```

Build:
```bash
npm run build
```

## Notes
- Devnet only. No mainnet keys required.
- If you see a blank page, hard refresh and ensure a Solana wallet extension is enabled.

---

Previous docs preserved below for reference.
