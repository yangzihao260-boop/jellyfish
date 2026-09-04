/**
 * Web Audio API synthesizer for Undersea BGM and sound effects,
 * plus Web Speech API for English pronunciation of "jellyfish".
 * Completely standalone without relying on external MP3 hosting.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmTimer: number | null = null;
  private bgmStep = 0;
  private isMuted = false;
  private bgmVolume = 0.35;
  private sfxVolume = 0.7;

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master BGM gain
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      // SFX gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- BACKGROUND MUSIC: Cheerful, dreamy undersea marimba melody ---
  public startBGM() {
    this.initContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.playNextBgmNote();
  }

  public pauseBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public toggleBGM(): boolean {
    if (this.isBgmPlaying) {
      this.pauseBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(muted ? 0 : this.bgmVolume, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(muted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
  }

  public setVolume(vol: number) {
    this.bgmVolume = vol;
    if (this.bgmGain && this.ctx && !this.isMuted) {
      this.bgmGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  private playNextBgmNote = () => {
    if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

    // Cheerful, magical ocean pentatonic sequence (C major / G major uplifting loop)
    // Notes: C4, E4, G4, A4, C5, D5, E5, G5
    const melody = [
      { freq: 523.25, dur: 0.28, bass: 130.81 }, // C5, C3
      { freq: 659.25, dur: 0.22, bass: 130.81 }, // E5
      { freq: 783.99, dur: 0.28, bass: 130.81 }, // G5
      { freq: 659.25, dur: 0.22, bass: 130.81 }, // E5
      { freq: 880.00, dur: 0.32, bass: 164.81 }, // A5, E3
      { freq: 783.99, dur: 0.22, bass: 164.81 }, // G5
      { freq: 659.25, dur: 0.30, bass: 164.81 }, // E5
      { freq: 587.33, dur: 0.25, bass: 146.83 }, // D5, D3
      { freq: 523.25, dur: 0.28, bass: 146.83 }, // C5
      { freq: 587.33, dur: 0.22, bass: 146.83 }, // D5
      { freq: 659.25, dur: 0.32, bass: 174.61 }, // E5, F3
      { freq: 783.99, dur: 0.25, bass: 174.61 }, // G5
      { freq: 1046.50, dur: 0.35, bass: 196.00 }, // C6, G3
      { freq: 880.00, dur: 0.25, bass: 196.00 }, // A5
      { freq: 783.99, dur: 0.30, bass: 196.00 }, // G5
      { freq: 659.25, dur: 0.35, bass: 196.00 }, // E5
    ];

    const currentNote = melody[this.bgmStep % melody.length];
    this.bgmStep++;

    // Undersea Kalimba / Marimba tone
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = 'triangle'; // Sweet rounded bell marimba sound
    osc.frequency.setValueAtTime(currentNote.freq, this.ctx.currentTime);

    // Filter to make it sound warm and underwater
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + currentNote.dur);

    // Envelope
    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.3, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + currentNote.dur);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + currentNote.dur);

    // Soft ocean sub bass every 4 steps
    if (this.bgmStep % 4 === 1 && currentNote.bass) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(currentNote.bass, now);
      bassGain.gain.setValueAtTime(0.2, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      bassOsc.connect(bassGain);
      bassGain.connect(this.bgmGain);
      bassOsc.start(now);
      bassOsc.stop(now + 0.8);
    }

    const interval = 280; // tempo around 107 bpm, bouncy and comfortable
    this.bgmTimer = window.setTimeout(this.playNextBgmNote, interval);
  };

  // --- SPECIFIC SOUND EFFECTS ---

  /**
   * Sound effect when clicking a jellyfish:
   * A sparkling underwater magic bubble chime + bright pop!
   */
  public playJellyfishClickSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // 1. Water Bubble "Bloop" sound (pitch bends upward rapidly)
    const bubbleOsc = this.ctx.createOscillator();
    const bubbleGain = this.ctx.createGain();
    bubbleOsc.type = 'sine';
    bubbleOsc.frequency.setValueAtTime(320, now);
    bubbleOsc.frequency.exponentialRampToValueAtTime(950, now + 0.12);

    bubbleGain.gain.setValueAtTime(0.45, now);
    bubbleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    bubbleOsc.connect(bubbleGain);
    bubbleGain.connect(this.sfxGain);
    bubbleOsc.start(now);
    bubbleOsc.stop(now + 0.14);

    // 2. Sparkling magical chime arpeggio (3 quick ascending notes)
    const chord = [880, 1174.66, 1396.91, 1760]; // A5, D6, F6, A6
    chord.forEach((freq, index) => {
      const chimeOsc = this.ctx!.createOscillator();
      const chimeGain = this.ctx!.createGain();
      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(freq, now + index * 0.04);

      chimeGain.gain.setValueAtTime(0, now + index * 0.04);
      chimeGain.gain.linearRampToValueAtTime(0.25, now + index * 0.04 + 0.015);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.04 + 0.35);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.sfxGain!);
      chimeOsc.start(now + index * 0.04);
      chimeOsc.stop(now + index * 0.04 + 0.35);
    });
  }

  /**
   * Sound effect when clicking "Continue / 继续游戏":
   * Friendly positive swoosh & chime
   */
  public playContinueSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const notes = [587.33, 880, 1174.66]; // D5, A5, D6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.3, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.25);
    });
  }

  /**
   * Sound effect for clicking syllables (jel - ly - fish)
   */
  public playSyllableClickSound(index: number) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const now = this.ctx.currentTime;
    const freq = notes[index % notes.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  /**
   * Sound for popping ambient bubbles
   */
  public playBubblePopSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = 400 + Math.random() * 300;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 2.2, now + 0.07);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // --- WEB SPEECH API: Clear English pronunciation of "jellyfish" ---
  public speakJellyfish(slowMode = false, onStart?: () => void, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      console.warn('Web Speech API is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // cancel any active utterance

    const text = slowMode ? "Jel... ly... fish!" : "Jellyfish!";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = slowMode ? 0.65 : 0.88; // clear speed for elementary school children
    utterance.pitch = 1.15; // friendly, enthusiastic teacher voice pitch

    // Try to pick a natural high-quality English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Victoria') || v.name.includes('Karen') || v.name.includes('Zira')))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;

    window.speechSynthesis.speak(utterance);
  }

  public speakSyllable(syllable: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(syllable);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  }
}

export const soundEngine = new SoundEngine();
