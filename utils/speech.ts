import * as Speech from 'expo-speech';

export const SPEECH_LANGUAGE = 'en-US';

export function stopSpeaking() {
  Speech.stop();
}

export function speakEnglish(text: string) {
  const trimmed = text.trim();

  if (!trimmed) {
    return;
  }

  stopSpeaking();
  Speech.speak(trimmed, {
    language: SPEECH_LANGUAGE,
    rate: 0.95,
    pitch: 1,
  });
}
