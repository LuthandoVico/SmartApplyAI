import { useState, useRef, useEffect } from "react";

export function useSpeech() {
  const [isMuted, setIsMuted] = useState(false);

  function speak(text, onEnd) {
    if (isMuted) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang === "en-US") || voices[0];
    if (preferred) utterance.voice = preferred;
    utterance.onend = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() { window.speechSynthesis.cancel(); }

  return { speak, stopSpeaking, isMuted, setIsMuted };
}

export function useMic(onTranscript) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join("");
      onTranscript(transcript);
    };
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
  }, []);

  function toggleMic() {
    if (!supported) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  }

  return { isListening, toggleMic, supported };
}