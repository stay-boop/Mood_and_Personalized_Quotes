import React from 'react';
import { Volume2, VolumeX, Sparkles, BookMarked, SlidersHorizontal } from 'lucide-react';
import { SoundType } from '../services/ambientAudio';

interface TopBarProps {
  activeTab: 'moods' | 'quotes' | 'studio' | 'keepsakes';
  onSelectTab: (tab: 'moods' | 'quotes' | 'studio' | 'keepsakes') => void;
  savedCount: number;
  soundType: SoundType;
  onToggleSound: () => void;
  onOpenTypography: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  soundType,
  onToggleSound,
  onOpenTypography,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#08090A]/95 backdrop-blur-md border-b border-[#1F232B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title (One-line wordmark in display face) */}
        <button
          onClick={() => onSelectTab('moods')}
          className="text-left group flex items-center gap-3 whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-full bg-[#13161C] border border-[#1F232B] flex items-center justify-center text-[#C6F432] group-hover:border-[#C6F432] transition-colors">
            <span className="font-heritage text-sm font-black">H</span>
          </div>
          <div>
            <span className="font-heritage text-xl sm:text-2xl font-bold tracking-wider text-white group-hover:text-[#C6F432] transition-colors">
              THE HERITAGE
            </span>
          </div>
        </button>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectTab('moods')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'moods'
                ? 'text-[#C6F432] font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Mood Matrix
            {activeTab === 'moods' && (
              <span className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-[#C6F432]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('quotes')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'quotes'
                ? 'text-[#C6F432] font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Personalized Quotes
            {activeTab === 'quotes' && (
              <span className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-[#C6F432]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('studio')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'studio'
                ? 'text-[#C6F432] font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Wallpaper Studio
            {activeTab === 'studio' && (
              <span className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-[#C6F432]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('keepsakes')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'keepsakes'
                ? 'text-[#C6F432] font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Keepsakes
            {savedCount > 0 && (
              <span className="text-[11px] font-mono px-1.5 py-0.2 bg-[#1A1E26] text-[#C6F432] rounded">
                {savedCount}
              </span>
            )}
            {activeTab === 'keepsakes' && (
              <span className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-[#C6F432]" />
            )}
          </button>

          <button
            onClick={onOpenTypography}
            className="whitespace-nowrap shrink-0 text-zinc-500 hover:text-[#C6F432] transition-colors flex items-center gap-1 text-xs uppercase tracking-wider"
            title="Explore The Heritage Legacy, Yosarosa Cursive, & Paragone Serif"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Fonts</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Ambient Soundscape Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2.5 rounded-lg border transition-all flex items-center gap-2 text-xs font-medium whitespace-nowrap shrink-0 ${
              soundType !== 'off'
                ? 'bg-[#13161C] border-[#C6F432] text-[#C6F432] shadow-sm shadow-[#C6F432]/20'
                : 'bg-[#0E1014] border-[#1F232B] text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
            title={`Ambient Soundscape: ${soundType === 'off' ? 'Disabled' : soundType.toUpperCase()}`}
          >
            {soundType !== 'off' ? (
              <>
                <Volume2 className="w-4 h-4 text-[#C6F432] animate-pulse" />
                <span className="hidden lg:inline capitalize">{soundType}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden lg:inline">Atmosphere</span>
              </>
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => onSelectTab(activeTab === 'quotes' ? 'studio' : 'quotes')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#08090A] bg-[#C6F432] rounded-lg hover:bg-[#b5e326] active:scale-95 transition-all shadow-sm shadow-[#C6F432]/30 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeTab === 'quotes' ? 'Export Card' : 'Divine Quote'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
