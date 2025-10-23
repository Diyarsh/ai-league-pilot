# AI-League MVP 🤖⚡

> AI-powered crypto trading bot platform with drag-and-drop strategy builder, real-time leaderboards, and LLM-generated insights.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-league-mvp)

## 🌟 Features

- **🎨 Drag-and-Drop Bot Builder**: Create custom trading strategies by combining pre-built blocks
- **🧠 AI-Powered Insights**: Real-time LLM-generated market analysis and strategy explanations
- **📊 Live Dashboard**: Track bot performance with interactive charts and metrics
- **🏆 Leaderboard**: Sort, filter, and compare bots with battle mode
- **⚡ Real-time Updates**: Instant leaderboard updates via Supabase Realtime
- **🎉 Gamification**: Confetti celebrations for profit milestones
- **📱 Fully Responsive**: Mobile-friendly with touch gestures and swipe support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works!)
- (Optional) Grok or OpenAI API key for enhanced AI features

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/ai-league-mvp.git
cd ai-league-mvp
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema:

```bash
# Download the schema from the app's /settings/export page
# Or use the schema in migrations folder
```

3. Deploy edge functions:

```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy generate-strategy
```

### 3. Configure Environment

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Optional: For custom AI integration
# GROK_API_KEY=your-grok-key
# OPENAI_API_KEY=your-openai-key
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

## 🌐 Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables from `.env`
4. Deploy! ✨

### Deploy Configuration

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Add all from `.env` file

## 🔧 Migrate from Lovable Cloud

This project was originally built on Lovable Cloud. To migrate:

### Database Migration

1. **Export Schema**: Visit `/settings/export` in the app and download the SQL schema
2. **Create Supabase Project**: Sign up at [supabase.com](https://supabase.com)
3. **Run Schema**: Paste the downloaded SQL into Supabase SQL Editor
4. **Enable Realtime**: The schema includes realtime configuration, but verify in Supabase dashboard

### Edge Functions Migration

The edge functions are in `supabase/functions/` and use standard Supabase format:

```bash
# Deploy all functions
supabase functions deploy generate-strategy
```

### AI Integration Options

The app currently uses Lovable AI Gateway. To use your own AI:

**Option 1: Grok (Recommended)**
```typescript
// In supabase/functions/generate-strategy/index.ts
const GROK_API_KEY = Deno.env.get('GROK_API_KEY');
const response = await fetch('https://api.x.ai/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${GROK_API_KEY}` },
  // ... rest of config
});
```

**Option 2: OpenAI**
```typescript
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
  // ... rest of config
});
```

Then add your API key to:
- `.env` for local development
- Supabase Edge Function secrets: `supabase secrets set GROK_API_KEY=xxx`
- Vercel environment variables for production

## 📁 Project Structure

```
ai-league-mvp/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Leaderboard.tsx  # Bot leaderboard
│   │   ├── SimulationSection.tsx
│   │   ├── AIThinkingDynamic.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── Index.tsx        # Home page
│   │   ├── PromptBuilderPageDnD.tsx  # Bot builder
│   │   ├── LeaderboardPage.tsx
│   │   └── ExportPage.tsx   # Export & migration
│   ├── integrations/supabase/
│   │   ├── client.ts        # Supabase client
│   │   └── types.ts         # Database types
│   └── ...
├── supabase/
│   ├── functions/
│   │   └── generate-strategy/  # AI strategy generator
│   ├── migrations/          # Database migrations
│   └── config.toml          # Edge function config
├── .env                     # Environment variables
└── README.md
```

## 🎮 Usage Guide

### Creating a Bot

1. Navigate to **Create Bot** (via navbar or dashboard button)
2. Drag strategy blocks from the palette to the canvas
3. Reorder blocks by dragging within the canvas
4. Enter a bot name
5. Review the AI-generated strategy preview
6. Click **Launch in Demo**

### Viewing the Leaderboard

1. Navigate to **Leaderboard**
2. Sort by Profitability or Sharpe Ratio
3. Filter by strategy type or min profitability
4. Click **Details** to see bot stats and trades
5. Select two bots and click **Battle** to compare

### Simulation

1. On the dashboard, use the simulation slider
2. Select an asset (SOL/PEPE/DOGE)
3. View animated timeline and predicted results

## 🔐 Security Notes

- All database tables have Row Level Security (RLS) enabled
- Current policies allow public read/write (demo mode)
- For production, implement user authentication and restrict policies:

```sql
-- Example: User-specific bot access
CREATE POLICY "Users can only see their own bots"
ON public.bots FOR SELECT
USING (auth.uid() = user_id);
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Edge Functions, Realtime)
- **AI**: Lovable AI Gateway / Grok / OpenAI
- **Charts**: Recharts
- **Drag & Drop**: dnd-kit
- **Deployment**: Vercel

## 📊 Database Schema

```sql
-- Bots table
CREATE TABLE bots (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  strategy TEXT NOT NULL,
  profitability NUMERIC DEFAULT 0,
  sharpe NUMERIC DEFAULT 0,
  trades INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trades table
CREATE TABLE trades (
  id UUID PRIMARY KEY,
  bot_id UUID REFERENCES bots(id),
  asset TEXT NOT NULL,
  side TEXT CHECK (side IN ('buy', 'sell')),
  price NUMERIC NOT NULL,
  amount NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now()
);
```

Full schema available in `/settings/export` or `supabase/migrations/`.

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Powered by [Supabase](https://supabase.com)

## 🐛 Known Issues & Roadmap

- [ ] Add user authentication
- [ ] Implement real trading via exchange APIs
- [ ] Add backtesting with historical data
- [ ] Mobile app (React Native)
- [ ] More AI models (Claude, Llama)

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions

---

**Built with ❤️ using Lovable & Supabase**
