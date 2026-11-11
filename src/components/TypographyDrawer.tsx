import React, { useState } from 'react';
import { X, Sparkles, Type } from 'lucide-react';

interface TypographyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TypographyDrawer: React.FC<TypographyDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [sampleText, setSampleText] = useState('Through shadows and storms, we carve the light.');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#0E1014] border border-[#1F232B] rounded-2xl max-w-3xl w-full p-6 sm:p-8 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F232B]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#13161C] border border-[#1F232B] flex items-center justify-center text-[#C6F432]">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heritage text-lg sm:text-xl font-bold text-white tracking-wide">
                TYPOGRAPHIC SPECIMEN & COLOR SYSTEM
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                The Heritage Legacy · Yosarosa Cursive Tattoo · Paragone Fancy Aesthetic Serif
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#13161C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Custom text preview tester */}
        <div className="py-4 border-b border-[#1F232B]">
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
            Live Interactive Text Specimen
          </label>
          <input
            type="text"
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            placeholder="Type your phrase to see all three fonts..."
            className="w-full px-3 py-2 bg-[#13161C] border border-[#1F232B] rounded-lg text-sm text-white focus:outline-none focus:border-[#C6F432] transition-colors"
          />
        </div>

        {/* Specimen Showcase */}
        <div className="py-6 space-y-6 overflow-y-auto flex-1">
          {/* 1. The Heritage Legacy Fancy Logo */}
          <div className="p-6 rounded-xl bg-[#08090A] border border-[#1F232B] relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#C6F432] uppercase tracking-wider">
                01 · LOGO & BRANDING DISPLAY
              </span>
              <span className="text-xs text-zinc-500 font-mono">The Heritage Legacy Fancy Logo</span>
            </div>
            <p className="font-heritage text-2xl sm:text-3xl text-white tracking-wider my-3">
              {sampleText || 'THE HERITAGE LEGACY'}
            </p>
            <p className="text-xs text-zinc-400">
              Reserved for top marks, monumental headers, seals, and curatorial crests.
            </p>
          </div>

          {/* 2. Paragone Fancy Aesthetic Serif */}
          <div className="p-6 rounded-xl bg-[#08090A] border border-[#1F232B] relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#C6F432] uppercase tracking-wider">
                02 · EDITORIAL QUOTE BODY
              </span>
              <span className="text-xs text-zinc-500 font-mono">Paragone Fancy Aesthetic Serif</span>
            </div>
            <p className="font-paragone text-xl sm:text-2xl text-zinc-200 italic leading-relaxed my-3">
              “{sampleText || 'Through shadows and storms, we carve the light.'}”
            </p>
            <p className="text-xs text-zinc-400">
              High-contrast editorial serif calibrated for emotional resonance and profound literary prose.
            </p>
          </div>

          {/* 3. Yosarosa Cursive Tattoo */}
          <div className="p-6 rounded-xl bg-[#08090A] border border-[#1F232B] relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#C6F432] uppercase tracking-wider">
                03 · TATTOO SCRIPT SIGNATURE
              </span>
              <span className="text-xs text-zinc-500 font-mono">Yosarosa Cursive Tattoo</span>
            </div>
            <p className="font-tattoo text-3xl sm:text-4xl text-[#C6F432] tracking-wide my-3">
              ~ {sampleText || 'wild, sovereign & untamed'} ~
            </p>
            <p className="text-xs text-zinc-400">
              Intimate, calligraphic script for tattoo inscriptions, author signatures, and secret mottos.
            </p>
          </div>

          {/* Color System Breakdown */}
          <div className="p-6 rounded-xl bg-[#08090A] border border-[#1F232B]">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-3">
              COLOR DISCIPLINE: 60 - 30 - 10
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#08090A] border border-[#1F232B] rounded-lg">
                <div className="w-full h-8 bg-[#08090A] border border-zinc-800 rounded mb-2" />
                <span className="text-xs font-bold text-white block">60% Midnight Black</span>
                <span className="text-[10px] text-zinc-500 font-mono">#08090A (Canvas & Void)</span>
              </div>
              <div className="p-3 bg-[#13161C] border border-[#1F232B] rounded-lg">
                <div className="w-full h-8 bg-white rounded mb-2" />
                <span className="text-xs font-bold text-white block">30% Crisp White</span>
                <span className="text-[10px] text-zinc-400 font-mono">#FFFFFF (High-Contrast Text)</span>
              </div>
              <div className="p-3 bg-[#13161C] border border-[#1F232B] rounded-lg">
                <div className="w-full h-8 bg-[#C6F432] rounded mb-2" />
                <span className="text-xs font-bold text-white block">10% Lime Green</span>
                <span className="text-[10px] text-[#C6F432] font-mono">#C6F432 (Intent Accent)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#1F232B] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#C6F432] text-[#08090A] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#b5e326] transition-all"
          >
            Close Specimen
          </button>
        </div>
      </div>
    </div>
  );
};
