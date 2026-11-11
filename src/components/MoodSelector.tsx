import React, { useState } from 'react';
import { Mood, MoodEnergy } from '../types';
import { MOODS } from '../data/quotesData';
import { Sparkles, Compass, Search, Wand2, ArrowRight } from 'lucide-react';

interface MoodSelectorProps {
  selectedMood: Mood;
  onSelectMood: (mood: Mood) => void;
  onCustomMoodGenerate: (customMoodText: string, vibe: 'philosophical' | 'poetic' | 'stoic' | 'rebellious') => void;
  isGenerating?: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
  onCustomMoodGenerate,
  isGenerating = false,
}) => {
  const [filterEnergy, setFilterEnergy] = useState<'all' | MoodEnergy>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customText, setCustomText] = useState('');
  const [customVibe, setCustomVibe] = useState<'philosophical' | 'poetic' | 'stoic' | 'rebellious'>('poetic');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const filteredMoods = MOODS.filter(m => {
    const matchesEnergy = filterEnergy === 'all' || m.energy === filterEnergy;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesEnergy && matchesSearch;
  });

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    onCustomMoodGenerate(customText.trim(), customVibe);
    setShowCustomModal(false);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-3 text-xs tracking-widest uppercase text-zinc-400 mb-3 font-mono">
          <span>THE HERITAGE ARCHIVE</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#C6F432]">MOOD SANCTUARY</span>
          <span aria-hidden="true">·</span>
          <span>CURATED RESONANCE</span>
        </div>

        <h1 className="font-heritage text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
          Where Does Your Spirit Dwell?
        </h1>

        <p className="font-paragone text-xl sm:text-2xl text-zinc-300 italic max-w-2xl mx-auto leading-relaxed">
          Select the frequency of your heart to unlock timeless literary wisdom and cursive tattoo inscriptions.
        </p>
      </div>

      {/* Filter and Utility Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#1F232B]">
        {/* Interactive Segmented Filter (Functional Buttons) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0E1014] rounded-lg border border-[#1F232B] overflow-x-auto">
          <button
            onClick={() => setFilterEnergy('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
              filterEnergy === 'all'
                ? 'bg-[#1A1E26] text-[#C6F432] shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Frequencies ({MOODS.length})
          </button>
          <button
            onClick={() => setFilterEnergy('reflective')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
              filterEnergy === 'reflective'
                ? 'bg-[#1A1E26] text-[#C6F432] shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Reflective
          </button>
          <button
            onClick={() => setFilterEnergy('calm')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
              filterEnergy === 'calm'
                ? 'bg-[#1A1E26] text-[#C6F432] shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Calm & Serene
          </button>
          <button
            onClick={() => setFilterEnergy('intense')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
              filterEnergy === 'intense'
                ? 'bg-[#1A1E26] text-[#C6F432] shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Intense & Defiant
          </button>
          <button
            onClick={() => setFilterEnergy('elevated')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
              filterEnergy === 'elevated'
                ? 'bg-[#1A1E26] text-[#C6F432] shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Elevated
          </button>
        </div>

        {/* Right side controls: Search & Custom Prompt Button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mood or theme..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#0E1014] border border-[#1F232B] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C6F432] transition-colors"
            />
          </div>

          <button
            onClick={() => setShowCustomModal(true)}
            className="px-3.5 py-1.5 bg-[#13161C] border border-[#1F232B] hover:border-[#C6F432] rounded-lg text-xs font-medium text-white hover:text-[#C6F432] whitespace-nowrap shrink-0 flex items-center gap-2 transition-all"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#C6F432]" />
            <span>Custom Mood</span>
          </button>
        </div>
      </div>

      {/* Mood Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {filteredMoods.map((mood) => {
          const isSelected = selectedMood.id === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => onSelectMood(mood)}
              className={`text-left p-5 rounded-xl transition-all relative overflow-hidden flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#13161C] border-2 border-[#C6F432] glow-lime-sm scale-[1.02]'
                  : 'bg-[#0E1014] border border-[#1F232B] hover:border-zinc-700 hover:bg-[#12141A]'
              }`}
            >
              {/* Active Indicator Pin */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#C6F432] glow-lime-sm" />
              )}

              {/* Mood Symbol & Name */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl text-zinc-300 group-hover:text-[#C6F432] transition-colors">
                    {mood.symbol}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                    {mood.energy}
                  </span>
                </div>

                <h3 className="font-heritage text-lg font-bold text-white group-hover:text-[#C6F432] transition-colors mb-1">
                  {mood.name}
                </h3>

                <p className="text-xs text-zinc-400 font-medium mb-3 line-clamp-1">
                  {mood.subtitle}
                </p>

                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-4">
                  {mood.description}
                </p>
              </div>

              {/* Tattoo Inscription Script Signature (Yosarosa Cursive Tattoo) */}
              <div className="pt-3 border-t border-[#1F232B]/60 mt-auto">
                <span className="font-tattoo text-lg text-zinc-300 group-hover:text-[#C6F432] transition-colors block truncate">
                  ~ {mood.tattooSignature} ~
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-2">
                  <span>Archetype:</span>
                  <span className="text-zinc-400 font-medium">{mood.archetype}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Mood Expression Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1014] border border-[#1F232B] rounded-2xl max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setShowCustomModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white text-lg p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-[#C6F432] tracking-widest uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Oracle</span>
            </div>

            <h3 className="font-heritage text-2xl font-bold text-white mb-2">
              Name Your Exact Emotion
            </h3>

            <p className="text-sm text-zinc-400 mb-6 font-paragone italic">
              Speak whatever is weighing or lifting your heart. The Heritage engine will forge an original quote and tattoo motto tailored uniquely to you.
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-2">
                  What are you experiencing right now?
                </label>
                <textarea
                  rows={3}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. It’s 2 AM, I took a big leap today and feel terrifying freedom..."
                  className="w-full p-3 bg-[#13161C] border border-[#1F232B] rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#C6F432] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-2">
                  Curatorial Style Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['poetic', 'philosophical', 'stoic', 'rebellious'] as const).map((tone) => (
                    <button
                      type="button"
                      key={tone}
                      onClick={() => setCustomVibe(tone)}
                      className={`p-2.5 rounded-lg border text-xs font-medium capitalize text-left transition-all ${
                        customVibe === tone
                          ? 'border-[#C6F432] bg-[#1A1E26] text-[#C6F432]'
                          : 'border-[#1F232B] bg-[#13161C] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !customText.trim()}
                  className="px-5 py-2.5 bg-[#C6F432] text-[#08090A] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#b5e326] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isGenerating ? (
                    <span>Channeling...</span>
                  ) : (
                    <>
                      <span>Synthesize Quote</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
