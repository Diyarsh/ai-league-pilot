import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type, marketData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'thinking') {
      // Generate AI thinking/reasoning for live market data
      systemPrompt = `You are an expert crypto trading AI assistant. Generate concise, actionable chain-of-thought reasoning for trading decisions. Focus on technical indicators, market sentiment, and risk management. Keep responses under 100 words.`;
      userPrompt = `Given this market scenario:
${marketData || 'SOL price: $142.3, RSI: 28 (oversold), Volume: +340% spike, 24h trend: bearish'}

Current strategy: ${prompt || 'Aggressive meme coin trading'}

Generate a brief trading thought/decision in this format:
"🤖 [Indicator analysis] → [Action] at [Price]"

Example: "🤖 RSI=28 (oversold) + volume +340% → Buying SOL at $142.3"`;
    } else if (type === 'strategy') {
      // Generate strategy summary from prompt blocks
      systemPrompt = `You are a crypto trading strategy analyzer. Analyze trading strategies and provide a concise 2-3 word classification like "Aggressive Scalping", "Conservative DCA", "Momentum Trading", etc.`;
      userPrompt = `Analyze this trading strategy and provide ONLY a 2-3 word classification:
"${prompt}"

Respond with ONLY the classification, nothing else.`;
    } else if (type === 'performance') {
      // Generate performance analysis for bot details
      systemPrompt = `You are a trading performance analyst. Provide concise analysis of bot performance with specific insights about wins, losses, and suggestions. Keep under 150 words.`;
      userPrompt = `Analyze this bot's performance:
Strategy: ${prompt}
${marketData || ''}

Provide a brief analysis covering:
1. What's working well
2. Areas of concern
3. One specific suggestion`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    console.log('Generated result:', result);

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-strategy:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});