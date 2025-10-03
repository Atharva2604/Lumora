import { useState, useCallback, useEffect } from "react";

export const useSpeechSynthesis = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop speech on unmount
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.rate = 0.9; // Slightly slower for clarity
    newUtterance.pitch = 1;
    newUtterance.volume = 1;

    newUtterance.onstart = () => setIsPlaying(true);
    newUtterance.onend = () => setIsPlaying(false);
    newUtterance.onerror = () => setIsPlaying(false);

    setUtterance(newUtterance);
    window.speechSynthesis.speak(newUtterance);
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else if (utterance) {
      window.speechSynthesis.speak(utterance);
    }
  }, [isPlaying, utterance, stop]);

  return { speak, stop, toggle, isPlaying };
};
