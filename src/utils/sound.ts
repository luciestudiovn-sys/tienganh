// Native Web Speech API & Web Audio Synthesizer with Online TTS Fallback for Kids English App

let currentAudio: HTMLAudioElement | null = null;

// Preload voices if available
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  } catch (e) {
    console.warn('Speech synthesis voice init warning:', e);
  }
}

export const speakText = (text: string, rate = 0.85, pitch = 1.1) => {
  if (!text) return;

  // Stop any running fallback audio element
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  // Fallback to clear online TTS Audio MP3 if SpeechSynthesis fails or is blocked
  const fallbackToOnlineTts = (txt: string) => {
    try {
      const encoded = encodeURIComponent(txt);
      // Youdao English Voice endpoint (type=2 for US accent)
      const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encoded}&type=2`;
      const audio = new Audio(audioUrl);
      audio.playbackRate = Math.max(0.7, Math.min(1.2, rate));
      currentAudio = audio;
      audio.play().catch(() => {
        // Secondary backup: Google Translate TTS
        const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encoded}`;
        const audioBackup = new Audio(googleUrl);
        currentAudio = audioBackup;
        audioBackup.play().catch((err) => console.warn('Online TTS fallback failed:', err));
      });
    } catch (e) {
      console.warn('TTS fallback error:', e);
    }
  };

  if (typeof window === 'undefined') return;

  if ('speechSynthesis' in window && window.speechSynthesis) {
    try {
      // Unfreeze Chrome speech engine if paused
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.cancel(); // cancel pending speech queue

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      utterance.pitch = pitch;

      const voices = window.speechSynthesis.getVoices();
      const enVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('US') ||
              v.name.includes('Samantha') ||
              v.name.includes('Google') ||
              v.name.includes('Natural'))
        ) || voices.find((v) => v.lang.startsWith('en'));

      if (enVoice) {
        utterance.voice = enVoice;
      }

      utterance.onerror = () => {
        fallbackToOnlineTts(text);
      };

      // Slight timeout prevents browser speech cancel deadlock bug
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          fallbackToOnlineTts(text);
        }
      }, 50);
    } catch (e) {
      fallbackToOnlineTts(text);
    }
  } else {
    fallbackToOnlineTts(text);
  }
};

export const speakVietnamese = (text: string) => {
  if (!text) return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  const fallbackToOnlineTts = (txt: string) => {
    try {
      const encoded = encodeURIComponent(txt);
      const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encoded}`;
      const audio = new Audio(googleUrl);
      currentAudio = audio;
      audio.play().catch((err) => console.warn('Vietnamese TTS fallback failed:', err));
    } catch (e) {
      console.warn('Vietnamese TTS error:', e);
    }
  };

  if (typeof window === 'undefined') return;

  if ('speechSynthesis' in window && window.speechSynthesis) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find((v) => v.lang.startsWith('vi'));
      if (viVoice) {
        utterance.voice = viVoice;
      }

      utterance.onerror = () => {
        fallbackToOnlineTts(text);
      };

      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          fallbackToOnlineTts(text);
        }
      }, 50);
    } catch (e) {
      fallbackToOnlineTts(text);
    }
  } else {
    fallbackToOnlineTts(text);
  }
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
