export type MoodEnergy = 'calm' | 'intense' | 'reflective' | 'elevated';

export interface Mood {
  id: string;
  name: string;
  subtitle: string;
  archetype: string;
  energy: MoodEnergy;
  symbol: string;
  tattooSignature: string;
  description: string;
  tags: string[];
}

export interface Quote {
  id: string;
  moodId: string;
  text: string;
  author: string;
  source?: string;
  era?: string;
  tattooTagline: string; // Yosarosa cursive tattoo motto
  reflectionPrompt: string;
  tags: string[];
  isAiGenerated?: boolean;
}

export interface SavedQuote {
  quote: Quote;
  savedAt: string;
  personalNote?: string;
}

export interface MoodJournalEntry {
  id: string;
  date: string;
  moodId: string;
  moodName: string;
  quoteId: string;
  quoteText: string;
  author: string;
  personalReflection: string;
}
