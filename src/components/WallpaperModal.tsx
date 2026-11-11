import React, { useState, useEffect } from 'react';
import { Quote, Mood } from '../types';
import { generateQuoteCardImage, downloadDataUrl } from '../services/canvasExporter';
import { Download, Smartphone, Square, Check, Copy, X, Sparkles } from 'lucide-react';

interface WallpaperModalProps {
  quote: Quote | null;
  mood: Mood | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  quote,
  mood,
  isOpen,
  onClose,
}) => {
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1'>('9:16');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !quote) return;
    let isCancelled = false;

    const render = async () => {
      setIsRendering(true);
      try {
        const url = await generateQuoteCardImage(quote, mood, {
          aspectRatio,
          style: 'midnight-lime',
        });
        if (!isCancelled) {
          setPreviewUrl(url);
        }
      } catch (err) {
        console.error('Failed to generate preview image:', err);
      } finally {
        if (!isCancelled) setIsRendering(false);
      }
    };

    render();
    return () => {
      isCancelled = true;
    };
  }, [isOpen, quote, mood, aspectRatio]);

  if (!isOpen || !quote) return null;

  const handleDownload = () => {
    if (!previewUrl) return;
    const filename = `heritage_${quote.author.toLowerCase().replace(/\s+/g, '_')}_${aspectRatio.replace(':', 'x')}.png`;
    downloadDataUrl(previewUrl, filename);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleCopyImage = async () => {
    if (!previewUrl) return;
    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      if ((navigator.clipboard as any)?.write) {
        await (navigator.clipboard as any).write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
      }
    } catch (e) {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#0E1014] border border-[#1F232B] rounded-2xl max-w-4xl w-full p-6 sm:p-8 relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F232B]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#C6F432]" />
            <div>
              <h2 className="font-heritage text-lg sm:text-xl font-bold text-white tracking-wide">
                WALLPAPER STUDIO & KEEPSAKE MAKER
              </h2>
              <p className="text-xs text-zinc-400 font-paragone italic">
                Midnight Black (60%) · Crisp White (30%) · Lime Green (10%)
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

        {/* Content body: Preview & Controls */}
        <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center flex-1 overflow-y-auto">
          {/* Canvas Render Preview (Left 7 cols) */}
          <div className="md:col-span-7 flex justify-center items-center bg-[#08090A] p-4 rounded-xl border border-[#1F232B] min-h-[360px]">
            {isRendering ? (
              <div className="text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C6F432] animate-spin" />
                <span>Engraving high-resolution typography...</span>
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Wallpaper preview"
                className={`rounded shadow-2xl object-contain max-h-[440px] border border-[#1F232B] transition-transform duration-300 ${
                  aspectRatio === '9:16' ? 'w-auto h-[440px]' : 'w-[400px] h-[400px]'
                }`}
              />
            ) : null}
          </div>

          {/* Configuration & Actions (Right 5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Format & Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    aspectRatio === '9:16'
                      ? 'bg-[#1A1E26] border-[#C6F432] text-[#C6F432]'
                      : 'bg-[#13161C] border-[#1F232B] text-zinc-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Phone 9:16</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('1:1')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    aspectRatio === '1:1'
                      ? 'bg-[#1A1E26] border-[#C6F432] text-[#C6F432]'
                      : 'bg-[#13161C] border-[#1F232B] text-zinc-400 hover:text-white'
                  }`}
                >
                  <Square className="w-4 h-4" />
                  <span>Square 1:1</span>
                </button>
              </div>
            </div>

            {/* Typography Anatomy Callout */}
            <div className="p-4 rounded-xl bg-[#08090A] border border-[#1F232B] text-xs space-y-2">
              <span className="text-[10px] font-mono text-[#C6F432] uppercase tracking-wider block">
                TYPOGRAPHIC ARRANGEMENT
              </span>
              <div className="text-zinc-300">
                <span className="text-zinc-500">Header:</span>{' '}
                <span className="font-heritage text-white">The Heritage Legacy</span>
              </div>
              <div className="text-zinc-300">
                <span className="text-zinc-500">Body:</span>{' '}
                <span className="font-paragone text-white italic">Paragone Fancy Aesthetic Serif</span>
              </div>
              <div className="text-zinc-300">
                <span className="text-zinc-500">Signature:</span>{' '}
                <span className="font-tattoo text-[#C6F432] text-sm">Yosarosa Cursive Tattoo</span>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleDownload}
                disabled={isRendering || !previewUrl}
                className="w-full py-3 bg-[#C6F432] hover:bg-[#b5e326] active:scale-95 text-[#08090A] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[#C6F432]/25"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Downloaded High-Res PNG</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Wallpaper (PNG)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyImage}
                disabled={isRendering || !previewUrl}
                className="w-full py-2.5 bg-[#13161C] border border-[#1F232B] hover:border-zinc-600 text-zinc-300 hover:text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all"
              >
                {copySuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#C6F432]" />
                    <span className="text-[#C6F432]">Copied Image to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
