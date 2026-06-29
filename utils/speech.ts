import * as Speech from 'expo-speech';

const ENGLISH_LANGUAGE = 'en-US';

export function speakEnglish(text: string) {
  const trimmed = text.trim();

  if (!trimmed) {
    return;
  }

  Speech.stop();
  Speech.speak(trimmed, {
    language: ENGLISH_LANGUAGE,
    rate: 0.95,
    pitch: 1,
  });
}
