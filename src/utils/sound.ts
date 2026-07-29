// Native Web Speech API & Web Audio Synthesizer for Kids English App

export const speakText = (text: string, rate = 0.85, pitch = 1.1) => {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel(); // cancel previous speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate; // slightly slower for 2nd graders
  utterance.pitch = pitch; // slightly higher friendly pitch for kids

  // Try to pick an American English voice if available
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(
    (v) => v.lang.startsWith('en') && (v.name.includes('US') || v.name.includes('Samantha') || v.name.includes('Natural'))
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (enVoice) {
    utterance.voice = enVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const speakVietnamese = (text: string) => {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find((v) => v.lang.startsWith('vi'));
  if (viVoice) {
    utterance.voice = viVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// Web Audio API Synthesizer for Sound Effects (No external audio file downloads needed!)
export const playSoundEffect = (type: 'correct' | 'wrong' | 'star' | 'fanfare' | 'pop') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    if (type === 'correct') {
      // Happy Arpeggio (C5 -> E5 -> G5 -> C6)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } else if (type === 'wrong') {
      // Gentle Low Buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'star') {
      // Star sparkling chime
      [880, 1174.66, 1396.91, 1760].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.3);
      });
    } else if (type === 'pop') {
      // Bubble pop sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch (e) {
    console.warn('AudioContext not supported or blocked:', e);
  }
};
