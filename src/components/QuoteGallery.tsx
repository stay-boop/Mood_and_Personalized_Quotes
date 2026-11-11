import React, { useState } from 'react';
import { Quote, Mood } from '../types';
import { MOODS, QUOTES } from '../data/quotesData';
import { Heart, Copy, Check, Download, Search, Filter } from 'lucide-react';

interface QuoteGalleryProps {
  onSelectQuote: (quote: Quote) => void;
  onOpenStudio: (quote: Quote) => void;
  savedQuoteIds: Set<string>;
  onToggleSave: (quote: Quote) => void;
}

export const QuoteGallery: React.FC<QuoteGalleryProps> = ({
  onSelectQuote,
  onOpenStudio,
  savedQuoteIds,
  onToggleSave,
}) => {
  const [selectedMoodId, setSelectedMoodId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredQuotes = QUOTES.filter((q) => {
    const matchesMood = selectedMoodId === 'all' || q.moodId === selectedMoodId;
    const matchesSearch =
      q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.author.toLowerCase().includes(search.toLowerCase()) ||
      q.tattooTagline.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesMood && matchesSearch;
  });

  const handleCopy = async (quote: Quote) => {
    try {
      await navigator.clipboard.writeText(`“${quote.text}” — ${quote.author}`);
      setCopiedId(quote.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {}
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-mono tracking-widest uppercase text-[#C6F432] block mb-2">
          THE COMPLETE CURATION
        </span>
        <h2 className="font-heritage text-3xl sm:text-4xl font-bold text-white mb-3">
          The Anthology of Human Yearning
        </h2>
        <p className="font-paragone text-lg sm:text-xl text-zinc-400 italic">
          Every human epoch distilled into monumental prose, cursive tattoo signatures, and philosophical anchors.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#1F232B]">
        <div className="flex items-center gap-1.5 p-1 bg-[#0E1014] rounded-lg border border-[#1F232B] overflow-x-auto">
          <button
            onClick={() => setSelectedMoodId('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
              selectedMoodId === 'all'
                ? 'bg-[#1A1E26] text-[#C6F432]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Moods ({QUOTES.length})
          </button>
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMoodId(m.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                selectedMoodId === m.id
                  ? 'bg-[#1A1E26] text-[#C6F432]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {m.symbol} {m.name}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search author, keyword, or quote..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#0E1014] border border-[#1F232B] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C6F432] transition-colors"
          />
        </div>
      </div>

      {/* Grid of Quote Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotes.map((q) => {
          const isSaved = savedQuoteIds.has(q.id);
          const mood = MOODS.find((m) => m.id === q.moodId);

          return (
            <div
              key={q.id}
              className="p-6 rounded-2xl bg-[#0E1014] border border-[#1F232B] hover:border-zinc-700 transition-all flex flex-col justify-between group hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-4 font-mono">
                  <span className="text-[#C6F432] flex items-center gap-1">
                    {mood?.symbol} {mood?.name || q.moodId}
                  </span>
                  <span>{q.era || 'Timeless'}</span>
                </div>

                <blockquote
                  onClick={() => onSelectQuote(q)}
                  className="font-paragone text-xl sm:text-2xl text-white italic leading-relaxed mb-4 cursor-pointer hover:text-zinc-200 transition-colors"
                >
                  “{q.text}”
                </blockquote>

                {/* Yosarosa Cursive Tattoo signature */}
                <div className="py-2 mb-4">
                  <span className="font-tattoo text-2xl text-[#C6F432] block select-none">
                    ~ {q.tattooTagline} ~
                  </span>
                </div>
              </div>

              <div>
                <div className="pt-4 border-t border-[#1F232B] flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      {q.author}
                    </span>
                    {q.source && (
                      <span className="text-[11px] font-paragone italic text-zinc-400">
                        {q.source}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleSave(q)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isSaved
                          ? 'bg-[#1A1E26] border-[#C6F432] text-[#C6F432]'
                          : 'bg-[#13161C] border-[#1F232B] text-zinc-400 hover:text-white'
                      }`}
                      title="Save quote"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#C6F432]' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleCopy(q)}
                      className="p-1.5 rounded-lg bg-[#13161C] border border-[#1F232B] text-zinc-400 hover:text-white transition-all"
                      title="Copy"
                    >
                      {copiedId === q.id ? (
                        <Check className="w-3.5 h-3.5 text-[#C6F432]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenStudio(q)}
                    className="px-3 py-1.5 bg-[#13161C] hover:bg-[#1A1E26] border border-[#1F232B] hover:border-[#C6F432] text-xs font-medium text-[#C6F432] rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-3 h-3" />
                    <span>Card</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
