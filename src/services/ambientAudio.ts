// Pure Web Audio API procedural sound synthesis for ambient mood atmospheres
// Zero external assets or audio files needed!

type SoundType = 'rain' | 'vinyl' | 'drone' | 'wind' | 'off';

class AmbientSoundManager {
  private ctx: AudioContext | null = null;
  private currentType: SoundType = 'off';
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public stop() {
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      } catch (e) {
        // ignore
      }
    }
    this.currentType = 'off';
    this.activeNodes.forEach(node => {
      if (typeof node === 'number') {
        window.clearInterval(node);
      } else if (typeof (node as any).stop === 'function') {
        try {
          (node as any).stop();
        } catch (e) {}
      }
    });
    this.activeNodes = [];
  }

  public play(type: SoundType, volume: number = 0.2) {
    if (type === 'off') {
      this.stop();
      return;
    }
    this.stop();
    this.initCtx();
    if (!this.ctx) return;

    this.currentType = type;
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.5);
    this.masterGain.connect(this.ctx.destination);

    if (type === 'rain') {
      this.startRain();
    } else if (type === 'vinyl') {
      this.startVinyl();
    } else if (type === 'drone') {
      this.startDrone();
    } else if (type === 'wind') {
      this.startWind();
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0.0001, volume), this.ctx.currentTime);
    }
  }

  public getCurrentType(): SoundType {
    return this.currentType;
  }

  private startRain() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    // Brown noise filter for deep soothing rain
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();
    this.activeNodes.push(noise);
  }

  private startVinyl() {
    if (!this.ctx || !this.masterGain) return;
    // Warm low hum + intermittent subtle crackle pops
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(60, this.ctx.currentTime);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start();
    this.activeNodes.push(osc);

    // Crackle ticks
    const crackleInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      if (Math.random() > 0.4) {
        const tick = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        tick.type = 'square';
        tick.frequency.setValueAtTime(1000 + Math.random() * 3000, this.ctx.currentTime);
        tickGain.gain.setValueAtTime(0.015 + Math.random() * 0.02, this.ctx.currentTime);
        tickGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.015);
        tick.connect(tickGain);
        tickGain.connect(this.masterGain);
        tick.start();
        tick.stop(this.ctx.currentTime + 0.02);
      }
    }, 90);

    this.activeNodes.push(crackleInterval);
  }

  private startDrone() {
    if (!this.ctx || !this.masterGain) return;
    // Deep harmonic warm ambient chord (C2, G2, C3)
    const freqs = [65.41, 98.0, 130.81, 196.0];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04 / (idx + 1), this.ctx.currentTime);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      this.activeNodes.push(osc);
    });
  }

  private startWind() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();
    this.activeNodes.push(noise);
  }
}

export const ambientSound = new AmbientSoundManager();
export type { SoundType };
