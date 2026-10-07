// FlashVision Humanoid Voice Audio Engine
// Generates natural Google DeepMind humanoid audio (Urdu & English) and plays via Web Audio API
import { keyManager, TTS_MODELS } from './aiConfig';

class HumanoidAudioService {
  constructor() {
    this.audioContext = null;
    this.currentSource = null;
    this.isPlaying = false;
  }

  initAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  stop() {
    if (this.currentSource) {
      try { this.currentSource.stop(); } catch (e) {}
      this.currentSource = null;
    }
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    this.isPlaying = false;
  }

  async speak(text, options = {}) {
    this.stop();
    this.initAudioContext();

    const voiceName = options.voice || 'Aoede';
    const cleanText = (text || '')
      .replace(/[*#_`\[\]()~>]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanText) return false;

    const textChunk = cleanText.length > 320 ? cleanText.substring(0, 317) + '...' : cleanText;

    let audioPlayed = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      const { key } = keyManager.getKey();
      for (const model of TTS_MODELS) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 9000);

          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: ctrl.signal,
            body: JSON.stringify({
              contents: [{ parts: [{ text: textChunk }] }],
              generationConfig: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName }
                  }
                }
              }
            })
          });
          clearTimeout(timer);

          if (!res.ok) {
            keyManager.recordFailure(key, res.status);
            continue;
          }

          const data = await res.json();
          const part = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData && p.inlineData.data);
          if (part && part.inlineData.data) {
            keyManager.recordSuccess(key);
            await this.playBase64Audio(part.inlineData.data, part.inlineData.mimeType);
            audioPlayed = true;
            return true;
          }
        } catch (err) {
          keyManager.recordFailure(key, 500);
        }
      }
      if (audioPlayed) break;
    }

    if (!audioPlayed && window.speechSynthesis) {
      return this.speakBrowserFallback(cleanText);
    }

    return false;
  }

  async playBase64Audio(base64Data, mimeType = 'audio/wav') {
    return new Promise((resolve) => {
      try {
        const binary = atob(base64Data);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes.buffer], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        const audio = new Audio(blobUrl);

        this.isPlaying = true;
        audio.onended = () => {
          this.isPlaying = false;
          URL.revokeObjectURL(blobUrl);
          resolve(true);
        };
        audio.onerror = () => {
          this.isPlaying = false;
          URL.revokeObjectURL(blobUrl);
          resolve(false);
        };
        audio.play().catch(() => resolve(false));
      } catch (e) {
        this.isPlaying = false;
        resolve(false);
      }
    });
  }

  speakBrowserFallback(text) {
    return new Promise((resolve) => {
      try {
        if (!window.speechSynthesis) return resolve(false);
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const naturalVoice = voices.find(v => 
          (v.lang.includes('ur') || v.lang.includes('hi') || v.lang.includes('en-IN') || v.lang.includes('en-GB')) &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural'))
        ) || voices.find(v => v.lang.includes('en'));

        if (naturalVoice) utterance.voice = naturalVoice;

        this.isPlaying = true;
        utterance.onend = () => {
          this.isPlaying = false;
          resolve(true);
        };
        utterance.onerror = () => {
          this.isPlaying = false;
          resolve(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        this.isPlaying = false;
        resolve(false);
      }
    });
  }
}

export const humanoidAudio = new HumanoidAudioService();
