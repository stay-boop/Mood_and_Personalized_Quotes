import { GoogleGenAI } from '@google/genai';
import { Quote } from '../types';

export interface GenerateQuoteParams {
  moodName: string;
  userContext?: string;
  vibePreference?: 'philosophical' | 'poetic' | 'stoic' | 'rebellious';
  energy?: string;
}

export async function generatePersonalizedQuote(params: GenerateQuoteParams): Promise<Quote> {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
                 (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a legendary literary curator, philosopher, and poetic aphorist.
Create a deeply moving, original, personalized quote tailored for someone feeling "${params.moodName}".
${params.userContext ? `User's specific situation/thoughts: "${params.userContext}"` : ''}
${params.vibePreference ? `Style preference: ${params.vibePreference}` : ''}

Respond ONLY with valid JSON in this exact structure without markdown backticks:
{
  "text": "The profound quote text itself (1 to 3 sentences maximum, highly literary, striking, memorable)",
  "author": "An evocative philosophical persona or real literary attribution style (e.g., 'Aphorisms of the Midnight Soul', 'Marcus Aurelius (Meditations)', 'Letters to the Unbroken', 'Anonymous Stoic')",
  "source": "A poetic source title (e.g. 'Fragments of Dawn', 'The Sovereign Mind', 'Notes from the Labyrinth')",
  "era": "e.g., '19th Century', 'Ancient Roman', 'Modern Epigram'",
  "tattooTagline": "A short, 2 to 5 word tattoo cursive inscription motto (e.g. 'ashes to embers', 'still i rise', 'amor fati', 'unconquered fire')",
  "reflectionPrompt": "A single thought-provoking question for the reader to reflect on their mood",
  "tags": ["3-4 relevant tags"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      // Clean JSON in case markdown fences are present
      const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        id: `ai-${Date.now()}`,
        moodId: params.moodName.toLowerCase().replace(/\s+/g, '-'),
        text: parsed.text || "You are the author of the stillness that follows the thunder.",
        author: parsed.author || "The Solitary Oracle",
        source: parsed.source || "Epistles of Midnight",
        era: parsed.era || "Contemporary",
        tattooTagline: parsed.tattooTagline || "still i endure",
        reflectionPrompt: parsed.reflectionPrompt || "What truth does this moment require you to accept?",
        tags: parsed.tags || ["destiny", "inner strength", "resonance"],
        isAiGenerated: true,
      };
    } catch (err) {
      console.warn('AI generation encountered error, utilizing bespoke local oracle:', err);
    }
  }

  // Graceful bespoke fallback generator crafted with profound literary resonance
  const fallbackThemes: Record<string, { quote: string; author: string; tattoo: string; prompt: string }> = {
    melancholy: {
      quote: "Do not fear the quiet ache; it is merely the heart expanding to hold more of the infinite cosmos.",
      author: "The Midnight Archivist",
      tattoo: "infinite in the quiet",
      prompt: "What beauty is waiting for your attention once the noise fades?",
    },
    defiance: {
      quote: "They tried to bury our flame in stone, forgetting that magma breaks continents from beneath.",
      author: "Fragments of the Unconquered",
      tattoo: "unbroken from within",
      prompt: "Where does your defiance transform from defense into true sovereign power?",
    },
    serenity: {
      quote: "There is an unshakeable stillness at the eye of every tempest. You are not the storm; you are the sky that holds it.",
      author: "Ancient Contemplations",
      tattoo: "the sky remains",
      prompt: "Can you feel the weight leaving your shoulders as you release what isn't yours to carry?",
    },
    ambition: {
      quote: "Destiny does not wait for the timid to ask permission. Carve your monument with disciplined hands.",
      author: "Chronicles of Will",
      tattoo: "forge your monument",
      prompt: "What will future you thank you for daring to do today?",
    },
    heartbreak: {
      quote: "The vessel that shattered was only a container; the gold you carry inside was never broken.",
      author: "The Art of Kintsugi",
      tattoo: "gold never breaks",
      prompt: "What strength has this heartbreak revealed that you didn't know you possessed?",
    },
    euphoria: {
      quote: "To drink deeply from the cup of the present is the highest form of worship the universe knows.",
      author: "Hymns of the Golden Hour",
      tattoo: "drink the light",
      prompt: "How can you share a spark of this radiance with someone walking in the dark?",
    },
  };

  const key = Object.keys(fallbackThemes).find(k => params.moodName.toLowerCase().includes(k)) || 'serenity';
  const item = fallbackThemes[key];

  return {
    id: `bespoke-${Date.now()}`,
    moodId: params.moodName.toLowerCase().replace(/\s+/g, '-'),
    text: params.userContext
      ? `Even amidst "${params.userContext}", ${item.quote.toLowerCase()}`
      : item.quote,
    author: item.author,
    source: "The Heritage Curations",
    era: "Timeless",
    tattooTagline: item.tattoo,
    reflectionPrompt: item.prompt,
    tags: ["bespoke", "heritage", "resonance"],
    isAiGenerated: true,
  };
}
