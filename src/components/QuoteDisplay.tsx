import React, { useState } from 'react';
import { Quote, Mood } from '../types';
import {
  Heart,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Download,
  Share2,
  BookmarkCheck,
  Feather,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface QuoteDisplayProps {
  quote: Quote;
  mood: Mood;
  isSaved: boolean;
  onToggleSave: (quote: Quote, note?: string) => void;
  onNextQuote: () => void;
  onSynthesizeBespoke: () => void;
  onOpenStudio: (quote: Quote) => void;
  isGenerating?: boolean;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({
  quote,
  mood,
  isSaved,
  onToggleSave,
  onNextQuote,
  onSynthesizeBespoke,
  onOpenStudio,
  isGenerating = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionNote, setReflectionNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [fontFocus, setFontFocus] = useState<'balanced' | 'tattoo-prominent'>('balanced');

  const handleCopy = async () => {
    try {
      const textToCopy = `“${quote.text}”\n— ${quote.author}${quote.source ? ` (${quote.source})` : ''}\n[Motto: “${quote.tattooTagline}”]`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      // Fallback
    }
  };

  const handleSaveReflection = () => {
    onToggleSave(quote, reflectionNote);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2200);
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Mood Header Kicker */}
      <div className="flex items-center justify-between gap-4 mb-6 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-[#C6F432] text-sm">{mood.symbol}</span>
          <span className="font-mono uppercase tracking-widest text-zinc-300">{mood.name}</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span className="hidden sm:inline font-paragone italic text-zinc-400">{mood.subtitle}</span>
        </div>

        {/* Typographic View Switcher */}
        <div className="flex items-center gap-1 p-0.5 bg-[#0E1014] rounded-lg border border-[#1F232B]">
          <button
            onClick={() => setFontFocus('balanced')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
              fontFocus === 'balanced'
                ? 'bg-[#1A1E26] text-[#C6F432]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Editorial Serif
          </button>
          <button
            onClick={() => setFontFocus('tattoo-prominent')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
              fontFocus === 'tattoo-prominent'
                ? 'bg-[#1A1E26] text-[#C6F432]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Tattoo Script Focus
          </button>
        </div>
      </div>

      {/* Main Monumental Quote Card */}
      <div className="relative rounded-2xl bg-[#0E1014] border border-[#1F232B] shadow-2xl overflow-hidden transition-all duration-300">
        {/* Subtle Ambient Vignette & Hairline Frame */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#13161C]/50 via-transparent to-[#08090A]/80 pointer-events-none" />

        {/* Top Heritage Crest Strip */}
        <div className="relative z-10 px-8 pt-8 pb-4 flex items-center justify-between border-b border-[#1F232B]/60">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6F432]" />
            <span className="font-heritage text-xs sm:text-sm font-bold tracking-widest text-[#C6F432]">
              THE HERITAGE LEGACY
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
            {quote.isAiGenerated && (
              <span className="text-[#C6F432] bg-[#1A1E26] px-2 py-0.5 rounded text-[10px] tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Bespoke
              </span>
            )}
            <span>{quote.era || 'Timeless'}</span>
          </div>
        </div>

        {/* Central Quote Body */}
        <div className="relative z-10 p-8 sm:p-12 lg:p-16 text-center">
          {/* Decorative quotation icon */}
          <div className="flex justify-center mb-6">
            <span className="font-paragone text-6xl text-[#C6F432]/60 select-none leading-none">
              “
            </span>
          </div>

          {/* Primary Quote Content */}
          {fontFocus === 'balanced' ? (
            <div>
              <blockquote className="font-paragone text-2xl sm:text-3xl lg:text-4xl text-white font-normal italic leading-relaxed sm:leading-loose tracking-wide max-w-3xl mx-auto mb-8 text-wrap:balance">
                {quote.text}
              </blockquote>

              {/* Yosarosa Cursive Tattoo Script Motto */}
              <div className="py-4 my-6 inline-block px-8 relative">
                <span className="font-tattoo text-3xl sm:text-4xl lg:text-5xl text-[#C6F432] block tracking-wide select-none">
                  “{quote.tattooTagline}”
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 mt-1 block">
                  TATTOO INSCRIPTION · YOSAROSA CURSIVE
                </span>
              </div>
            </div>
          ) : (
            <div>
              {/* Prominent Tattoo Script Inscription Focus */}
              <div className="py-4 my-2 inline-block px-8 relative">
                <span className="font-tattoo text-4xl sm:text-5xl lg:text-6xl text-[#C6F432] block tracking-wider select-none leading-relaxed">
                  “{quote.tattooTagline}”
                </span>
                <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 mt-2 block">
                  TATTOO MOTTO IN YOSAROSA CURSIVE
                </span>
              </div>

              <blockquote className="font-paragone text-xl sm:text-2xl text-zinc-200 font-normal italic leading-relaxed max-w-2xl mx-auto mt-6 text-wrap:balance">
                {quote.text}
              </blockquote>
            </div>
          )}

          {/* Author Attribution */}
          <div className="mt-8 pt-6 border-t border-[#1F232B]/80 max-w-md mx-auto">
            <cite className="not-italic">
              <span className="block text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                {quote.author}
              </span>
              {quote.source && (
                <span className="block text-xs font-paragone italic text-zinc-400 mt-1">
                  {quote.source}
                </span>
              )}
            </cite>
          </div>
        </div>

        {/* Card Interactive Action Toolbar */}
        <div className="relative z-10 px-6 sm:px-8 py-4 bg-[#0A0B0E] border-t border-[#1F232B] flex flex-wrap items-center justify-between gap-4">
          {/* Left actions: Next quote & Bespoke AI */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNextQuote}
              className="px-3.5 py-2 rounded-lg bg-[#13161C] border border-[#1F232B] hover:border-zinc-700 text-xs font-medium text-white hover:text-[#C6F432] transition-all flex items-center gap-2 active:scale-95"
              title="Next quote in this mood"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Next Quote</span>
            </button>

            <button
              onClick={onSynthesizeBespoke}
              disabled={isGenerating}
              className="px-3.5 py-2 rounded-lg bg-[#13161C] border border-[#1F232B] hover:border-[#C6F432] text-xs font-medium text-[#C6F432] hover:bg-[#1A1E26] transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              title="Channel a brand new AI quote"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Synthesizing...' : 'AI Oracle'}</span>
            </button>
          </div>

          {/* Right actions: Favorite, Copy, Studio Export, Reflect */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(quote)}
              className={`p-2 rounded-lg border transition-all ${
                isSaved
                  ? 'bg-[#1A1E26] border-[#C6F432] text-[#C6F432]'
                  : 'bg-[#13161C] border-[#1F232B] text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
              title={isSaved ? 'Saved in Keepsakes' : 'Save to Keepsakes'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#C6F432]' : ''}`} />
            </button>

            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-[#13161C] border border-[#1F232B] text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
              title="Copy quote"
            >
              {copied ? <Check className="w-4 h-4 text-[#C6F432]" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onOpenStudio(quote)}
              className="px-3.5 py-2 rounded-lg bg-[#C6F432] text-[#08090A] hover:bg-[#b5e326] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm shadow-[#C6F432]/20 active:scale-95"
              title="Generate downloadable HD Phone Wallpaper / Card"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Studio Card</span>
            </button>

            <button
              onClick={() => setShowReflection(!showReflection)}
              className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                showReflection
                  ? 'bg-[#1A1E26] border-[#C6F432] text-[#C6F432]'
                  : 'bg-[#13161C] border-[#1F232B] text-zinc-400 hover:text-white'
              }`}
            >
              <Feather className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reflect</span>
              {showReflection ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Expandable Contemplation & Journal Prompt */}
        {showReflection && (
          <div className="relative z-10 p-6 sm:p-8 bg-[#0B0C10] border-t border-[#1F232B] animate-fadeIn">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 text-xs font-mono text-[#C6F432] tracking-wider uppercase mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Curatorial Inquiry</span>
              </div>

              <p className="font-paragone text-lg sm:text-xl text-white italic mb-4">
                "{quote.reflectionPrompt}"
              </p>

              <div className="space-y-3">
                <textarea
                  rows={2}
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  placeholder="Record your thoughts or journal your reaction to this quote..."
                  className="w-full p-3 bg-[#13161C] border border-[#1F232B] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C6F432] transition-colors"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">
                    Saved notes will be kept in your local Keepsakes vault.
                  </span>
                  <button
                    onClick={handleSaveReflection}
                    className="px-4 py-1.5 bg-[#13161C] border border-[#1F232B] hover:border-[#C6F432] text-xs font-medium text-white hover:text-[#C6F432] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    {noteSaved ? <Check className="w-3.5 h-3.5 text-[#C6F432]" /> : null}
                    <span>{noteSaved ? 'Saved to Keepsakes' : 'Save Reflection'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quote Tags Metadata (Zero-pill text styling with dots per §1.A) */}
      <div className="flex items-center justify-center gap-3 text-xs text-zinc-500 mt-6 font-mono">
        {quote.tags.map((tag, idx) => (
          <React.Fragment key={tag}>
            <span>#{tag}</span>
            {idx < quote.tags.length - 1 && <span aria-hidden="true">·</span>}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};
