import React from 'react';
import { SavedQuote, Quote } from '../types';
import { BookMarked, Trash2, Download, Copy, ExternalLink, X, Heart } from 'lucide-react';

interface KeepsakesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedQuotes: SavedQuote[];
  onRemoveQuote: (quoteId: string) => void;
  onSelectQuote: (quote: Quote) => void;
  onOpenStudio: (quote: Quote) => void;
}

export const KeepsakesModal: React.FC<KeepsakesModalProps> = ({
  isOpen,
  onClose,
  savedQuotes,
  onRemoveQuote,
  onSelectQuote,
  onOpenStudio,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#0E1014] border border-[#1F232B] rounded-2xl max-w-4xl w-full p-6 sm:p-8 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F232B]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#13161C] border border-[#1F232B] flex items-center justify-center text-[#C6F432]">
              <Heart className="w-4 h-4 fill-[#C6F432]" />
            </div>
            <div>
              <h2 className="font-heritage text-lg sm:text-xl font-bold text-white tracking-wide">
                YOUR KEEPSAKES & VAULT
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                {savedQuotes.length} {savedQuotes.length === 1 ? 'quote' : 'quotes'} enshrined in your sanctuary
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

        {/* Quotes List */}
        <div className="py-6 space-y-4 overflow-y-auto flex-1">
          {savedQuotes.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <BookMarked className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#C6F432]" />
              <p className="font-paragone text-lg text-zinc-400 italic mb-1">
                Your sanctuary is currently empty.
              </p>
              <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                Explore the Mood Matrix and press the heart icon on any quote to enshrine it here with your reflections.
              </p>
            </div>
          ) : (
            savedQuotes.map(({ quote, savedAt, personalNote }) => (
              <div
                key={quote.id}
                className="p-5 rounded-xl bg-[#08090A] border border-[#1F232B] hover:border-zinc-700 transition-all group flex flex-col sm:flex-row justify-between items-start gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
                    <span className="text-[#C6F432]">#{quote.moodId}</span>
                    <span aria-hidden="true">·</span>
                    <span>Saved {new Date(savedAt).toLocaleDateString()}</span>
                  </div>

                  <p className="font-paragone text-lg sm:text-xl text-zinc-100 italic leading-relaxed mb-3">
                    “{quote.text}”
                  </p>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-tattoo text-xl text-[#C6F432]">
                      “{quote.tattooTagline}”
                    </span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      — {quote.author}
                    </span>
                  </div>

                  {personalNote && (
                    <div className="p-3 rounded-lg bg-[#13161C] border border-[#1F232B] text-xs text-zinc-300">
                      <span className="text-[10px] font-mono text-[#C6F432] uppercase block mb-1">
                        YOUR REFLECTION:
                      </span>
                      <p className="italic">{personalNote}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center gap-2 self-end sm:self-start shrink-0">
                  <button
                    onClick={() => {
                      onSelectQuote(quote);
                      onClose();
                    }}
                    className="p-2 rounded-lg bg-[#13161C] border border-[#1F232B] text-zinc-400 hover:text-white hover:border-[#C6F432] transition-colors"
                    title="View in main sanctuary"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenStudio(quote)}
                    className="p-2 rounded-lg bg-[#13161C] border border-[#1F232B] text-[#C6F432] hover:bg-[#1A1E26] transition-colors"
                    title="Export as wallpaper"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRemoveQuote(quote.id)}
                    className="p-2 rounded-lg bg-[#13161C] border border-[#1F232B] text-zinc-500 hover:text-red-400 hover:border-red-500/40 transition-colors"
                    title="Remove from keepsakes"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#1F232B] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#13161C] border border-[#1F232B] hover:border-zinc-600 text-white rounded-lg text-xs font-medium uppercase tracking-wider transition-all"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
