/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mood, Quote, SavedQuote } from './types';
import { MOODS, QUOTES } from './data/quotesData';
import { generatePersonalizedQuote } from './services/aiQuotes';
import { ambientSound, SoundType } from './services/ambientAudio';

import { TopBar } from './components/TopBar';
import { MoodSelector } from './components/MoodSelector';
import { QuoteDisplay } from './components/QuoteDisplay';
import { WallpaperModal } from './components/WallpaperModal';
import { TypographyDrawer } from './components/TypographyDrawer';
import { KeepsakesModal } from './components/KeepsakesModal';
import { AmbientSoundControl } from './components/AmbientSoundControl';
import { QuoteGallery } from './components/QuoteGallery';

import { Sparkles, ArrowRight, Heart, Feather, Compass, Volume2 } from 'lucide-react';

const STORAGE_KEY = 'the_heritage_saved_quotes_v1';

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'moods' | 'quotes' | 'studio' | 'keepsakes'>('moods');

  // Active mood & quote
  const [selectedMood, setSelectedMood] = useState<Mood>(MOODS[0]);
  const [currentQuote, setCurrentQuote] = useState<Quote>(QUOTES[0]);

  // Saved keepsakes
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Soundscape
  const [soundType, setSoundType] = useState<SoundType>('off');
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);

  // Modals
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [isTypographyOpen, setIsTypographyOpen] = useState(false);
  const [isKeepsakesOpen, setIsKeepsakesOpen] = useState(false);
  const [studioQuote, setStudioQuote] = useState<Quote | null>(null);

  // AI Generation status
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync saved quotes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedQuotes));
    } catch (e) {
      console.warn('Could not persist to localStorage:', e);
    }
  }, [savedQuotes]);

  // When user selects a mood, filter to matching quotes and pick one
  const handleSelectMood = (mood: Mood) => {
    setSelectedMood(mood);
    const matchingQuotes = QUOTES.filter((q) => q.moodId === mood.id);
    if (matchingQuotes.length > 0) {
      setCurrentQuote(matchingQuotes[0]);
    }
    setActiveTab('quotes');
  };

  // Cycle next quote for current mood
  const handleNextQuote = () => {
    const matchingQuotes = QUOTES.filter((q) => q.moodId === selectedMood.id);
    if (matchingQuotes.length <= 1) {
      // If only one or none, pick from general list
      const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      setCurrentQuote(randomQuote);
      return;
    }
    const currentIndex = matchingQuotes.findIndex((q) => q.id === currentQuote.id);
    const nextIndex = (currentIndex + 1) % matchingQuotes.length;
    setCurrentQuote(matchingQuotes[nextIndex]);
  };

  // AI Bespoke generation for current mood
  const handleSynthesizeBespoke = async () => {
    setIsGenerating(true);
    try {
      const bespoke = await generatePersonalizedQuote({
        moodName: selectedMood.name,
        energy: selectedMood.energy,
        vibePreference: 'poetic',
      });
      setCurrentQuote(bespoke);
    } finally {
      setIsGenerating(false);
    }
  };

  // Custom user expression generation
  const handleCustomMoodGenerate = async (
    customMoodText: string,
    vibe: 'philosophical' | 'poetic' | 'stoic' | 'rebellious'
  ) => {
    setIsGenerating(true);
    try {
      const bespoke = await generatePersonalizedQuote({
        moodName: 'Custom Revelation',
        userContext: customMoodText,
        vibePreference: vibe,
      });

      // Create a temporary mood wrapper for it
      const customMood: Mood = {
        id: `custom-${Date.now()}`,
        name: 'The Revelation',
        subtitle: 'Bespoke Emotional Horizon',
        archetype: 'The Soul in Motion',
        energy: 'reflective',
        symbol: '✧',
        tattooSignature: bespoke.tattooTagline,
        description: customMoodText,
        tags: ['bespoke', vibe, 'unspoken'],
      };

      setSelectedMood(customMood);
      setCurrentQuote(bespoke);
      setActiveTab('quotes');
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle saving to keepsakes
  const handleToggleSave = (quote: Quote, note?: string) => {
    setSavedQuotes((prev) => {
      const exists = prev.some((sq) => sq.quote.id === quote.id);
      if (exists) {
        return prev.filter((sq) => sq.quote.id !== quote.id);
      } else {
        return [
          {
            quote,
            savedAt: new Date().toISOString(),
            personalNote: note,
          },
          ...prev,
        ];
      }
    });
  };

  const handleRemoveSavedQuote = (quoteId: string) => {
    setSavedQuotes((prev) => prev.filter((sq) => sq.quote.id !== quoteId));
  };

  // Open Wallpaper Studio for a given quote
  const handleOpenStudio = (quote: Quote) => {
    setStudioQuote(quote);
    setIsWallpaperModalOpen(true);
  };

  // Toggle ambient sound
  const handleToggleSound = () => {
    setIsSoundModalOpen(true);
  };

  const isCurrentQuoteSaved = savedQuotes.some((sq) => sq.quote.id === currentQuote.id);
  const savedQuoteIds = new Set(savedQuotes.map((sq) => sq.quote.id));

  return (
    <div className="min-h-screen bg-[#08090A] text-white flex flex-col font-sans selection:bg-[#C6F432] selection:text-[#08090A]">
      {/* Top Bar strictly conforming to Top Bar Contract */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'studio') {
            handleOpenStudio(currentQuote);
          } else if (tab === 'keepsakes') {
            setIsKeepsakesOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        savedCount={savedQuotes.length}
        soundType={soundType}
        onToggleSound={handleToggleSound}
        onOpenTypography={() => setIsTypographyOpen(true)}
      />

      {/* Hero Strip for Visual Presence & Typography Introduction */}
      <div className="border-b border-[#1F232B] bg-gradient-to-b from-[#0E1014] to-[#08090A] py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-heritage text-white tracking-widest text-[11px] font-bold">
              THE HERITAGE
            </span>
            <span aria-hidden="true" className="text-zinc-700">|</span>
            <span className="font-paragone text-zinc-300 italic text-sm">
              Paragone Aesthetic Serif
            </span>
            <span aria-hidden="true" className="text-zinc-700">|</span>
            <span className="font-tattoo text-[#C6F432] text-lg">
              Yosarosa Cursive Tattoo
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 text-[11px] font-mono">
            <span>Palette: 60% Midnight · 30% White · 10% Lime</span>
            <button
              onClick={() => setIsTypographyOpen(true)}
              className="text-[#C6F432] hover:underline"
            >
              Examine Specimen →
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'moods' && (
          <>
            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={handleSelectMood}
              onCustomMoodGenerate={handleCustomMoodGenerate}
              isGenerating={isGenerating}
            />

            {/* Quick Teaser of Current Active Quote */}
            <div className="max-w-4xl mx-auto px-4 pb-16">
              <div className="p-6 rounded-2xl bg-[#0E1014] border border-[#1F232B] text-center relative overflow-hidden">
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#C6F432] uppercase mb-2">
                  <span>Current Frequency: {selectedMood.name}</span>
                </div>
                <p className="font-paragone text-xl sm:text-2xl text-white italic max-w-2xl mx-auto mb-4">
                  “{currentQuote.text}”
                </p>
                <div className="flex items-center justify-center gap-4">
                  <span className="font-tattoo text-2xl text-[#C6F432]">
                    “{currentQuote.tattooTagline}”
                  </span>
                  <button
                    onClick={() => setActiveTab('quotes')}
                    className="px-4 py-1.5 bg-[#C6F432] text-[#08090A] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#b5e326] flex items-center gap-1.5 transition-all"
                  >
                    <span>Full Sanctuary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'quotes' && (
          <div className="space-y-12 pb-16">
            <QuoteDisplay
              quote={currentQuote}
              mood={selectedMood}
              isSaved={isCurrentQuoteSaved}
              onToggleSave={handleToggleSave}
              onNextQuote={handleNextQuote}
              onSynthesizeBespoke={handleSynthesizeBespoke}
              onOpenStudio={handleOpenStudio}
              isGenerating={isGenerating}
            />

            {/* Anthology Browse Strip Below Quote */}
            <div className="border-t border-[#1F232B] pt-8">
              <QuoteGallery
                onSelectQuote={(q) => {
                  setCurrentQuote(q);
                  const foundMood = MOODS.find((m) => m.id === q.moodId);
                  if (foundMood) setSelectedMood(foundMood);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenStudio={handleOpenStudio}
                savedQuoteIds={savedQuoteIds}
                onToggleSave={handleToggleSave}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modals & Dialogs */}
      <WallpaperModal
        quote={studioQuote || currentQuote}
        mood={selectedMood}
        isOpen={isWallpaperModalOpen}
        onClose={() => setIsWallpaperModalOpen(false)}
      />

      <TypographyDrawer
        isOpen={isTypographyOpen}
        onClose={() => setIsTypographyOpen(false)}
      />

      <KeepsakesModal
        isOpen={isKeepsakesOpen}
        onClose={() => setIsKeepsakesOpen(false)}
        savedQuotes={savedQuotes}
        onRemoveQuote={handleRemoveSavedQuote}
        onSelectQuote={(q) => {
          setCurrentQuote(q);
          const foundMood = MOODS.find((m) => m.id === q.moodId);
          if (foundMood) setSelectedMood(foundMood);
          setActiveTab('quotes');
        }}
        onOpenStudio={handleOpenStudio}
      />

      <AmbientSoundControl
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        currentSound={soundType}
        onSoundChange={(newType) => setSoundType(newType)}
      />

      {/* Footer strictly adhering to Anti-Slop §1.B (quiet copyright, site links, no fake engines) */}
      <footer className="border-t border-[#1F232B] bg-[#050608] py-8 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heritage text-white tracking-wider font-bold">THE HERITAGE</span>
            <span aria-hidden="true">·</span>
            <span>Mood Sanctuary & Personalized Quotes</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('moods')}
              className="hover:text-white transition-colors"
            >
              Moods
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className="hover:text-white transition-colors"
            >
              Quotes
            </button>
            <button
              onClick={() => handleOpenStudio(currentQuote)}
              className="hover:text-white transition-colors"
            >
              Studio
            </button>
            <button
              onClick={() => setIsTypographyOpen(true)}
              className="hover:text-white transition-colors"
            >
              Typography
            </button>
            <button
              onClick={() => setIsKeepsakesOpen(true)}
              className="hover:text-white transition-colors"
            >
              Vault ({savedQuotes.length})
            </button>
          </div>

          <div className="text-[11px] font-mono text-zinc-600">
            60% Midnight · 30% White · 10% Lime (#C6F432)
          </div>
        </div>
      </footer>
    </div>
  );
}
