import React, { useState } from 'react';
import { ambientSound, SoundType } from '../services/ambientAudio';
import { CloudRain, Disc, Radio, Wind, VolumeX, Volume2, X } from 'lucide-react';

interface AmbientSoundControlProps {
  isOpen: boolean;
  onClose: () => void;
  currentSound: SoundType;
  onSoundChange: (type: SoundType) => void;
}

export const AmbientSoundControl: React.FC<AmbientSoundControlProps> = ({
  isOpen,
  onClose,
  currentSound,
  onSoundChange,
}) => {
  const [volume, setVolume] = useState(0.2);

  if (!isOpen) return null;

  const handleSelect = (type: SoundType) => {
    onSoundChange(type);
    ambientSound.play(type, volume);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    ambientSound.setVolume(newVol);
  };

  const soundOptions: { type: SoundType; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      type: 'rain',
      label: 'Midnight Rain',
      desc: 'Gentle continuous downpour on dark glass',
      icon: <CloudRain className="w-4 h-4 text-[#C6F432]" />,
    },
    {
      type: 'vinyl',
      label: 'Vinyl & Hearth',
      desc: 'Subtle mechanical crackle & warm turntable hum',
      icon: <Disc className="w-4 h-4 text-[#C6F432]" />,
    },
    {
      type: 'drone',
      label: 'Deep Harmonic Drone',
      desc: 'Meditative analog chord for deep focus',
      icon: <Radio className="w-4 h-4 text-[#C6F432]" />,
    },
    {
      type: 'wind',
      label: 'Highland Wind',
      desc: 'Quiet breath of mountain air',
      icon: <Wind className="w-4 h-4 text-[#C6F432]" />,
    },
    {
      type: 'off',
      label: 'Silence',
      desc: 'Mute all synthesized soundscapes',
      icon: <VolumeX className="w-4 h-4 text-zinc-500" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0E1014] border border-[#1F232B] rounded-2xl max-w-md w-full p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1F232B] mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#C6F432]" />
            <h3 className="font-heritage text-base font-bold text-white tracking-wide">
              ATMOSPHERIC SOUNDSCAPES
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 font-paragone italic mb-4">
          Generative Web Audio soundscapes designed to tune your nervous system while reading quotes.
        </p>

        {/* Options */}
        <div className="space-y-2 mb-6">
          {soundOptions.map((opt) => {
            const isActive = currentSound === opt.type;
            return (
              <button
                key={opt.type}
                onClick={() => handleSelect(opt.type)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-[#1A1E26] border-[#C6F432] text-white shadow-sm shadow-[#C6F432]/10'
                    : 'bg-[#13161C] border-[#1F232B] text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#08090A] border border-[#1F232B]">
                    {opt.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{opt.label}</span>
                    <span className="text-[11px] text-zinc-500">{opt.desc}</span>
                  </div>
                </div>

                {isActive && (
                  <span className="text-[10px] font-mono font-semibold text-[#C6F432] uppercase px-2 py-0.5 bg-[#08090A] border border-[#C6F432]/40 rounded">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Volume slider */}
        {currentSound !== 'off' && (
          <div className="pt-2 border-t border-[#1F232B]">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span>Volume</span>
              <span className="font-mono text-[#C6F432]">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.8"
              step="0.02"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-[#C6F432] bg-[#1F232B] h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        )}

        {/* Dismiss */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#C6F432] text-[#08090A] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#b5e326]"
          >
            Apply Atmosphere
          </button>
        </div>
      </div>
    </div>
  );
};
