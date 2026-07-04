import { useState, useEffect, useRef } from "react";
import { generateFeedback } from "../../services/openai";
import { useSpeech, useMic } from "../../hooks/useVoice";

export default function InterviewSession({ config, questions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [phase, setPhase] = useState("asking");
  const [timeLeft, setTimeLeft] = useState(120);
  const [speechBubble, setSpeechBubble] = useState("");
  const timerRef = useRef(null);
  const { speak, stopSpeaking, isMuted, setIsMuted } = useSpeech();
  const { isListening, toggleMic, supported: micSupported } = useMic(t => setAnswer(t));

  const question = questions[currentIndex];

  useEffect(() => {
    if (!question) return;
    setSpeechBubble("");
    setAnswer("");
    setCurrentFeedback(null);
    setPhase("asking");
    setTimeLeft(120);

    let i = 0;
    const greeting = currentIndex === 0 ? `Hi ${config.name}! I'm Alex your AI interviewer. ` : "";
    const fullText = greeting + question;

    const typeInterval = setInterval(() => {
      setSpeechBubble(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(typeInterval);
        setPhase("answering");
        speak(fullText);
        startTimer();
      }
    }, 25);

    return () => clearInterval(typeInterval);
  }, [currentIndex]);

  function startTimer() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  async function handleSubmit() {
    clearInterval(timerRef.current);
    stopSpeaking();
    const finalAnswer = answer.trim() || "(No answer provided)";
    setPhase("thinking");
    setSpeechBubble("Let me think about that...");

    const fb = await generateFeedback(question, finalAnswer);
    const newAnswers = [...answers, finalAnswer];
    const newScores = [...scores, fb.score];
    const newFeedback = [...feedbackList, fb];

    setAnswers(newAnswers);
    setScores(newScores);
    setFeedbackList(newFeedback);
    setCurrentFeedback(fb);
    setPhase("feedback");
    setSpeechBubble(fb.score >= 7 ? `Great answer! You scored ${fb.score}/10.` : `Good effort! You scored ${fb.score}/10.`);

    if (currentIndex === questions.length - 1) {
      setTimeout(() => onComplete(newAnswers, newScores, newFeedback), 100);
    }
  }

  const timerColor = timeLeft > 30 ? "#0e7490" : timeLeft > 10 ? "#d97706" : "#dc2626";
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400 font-semibold">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span style={{ color: timerColor }}>{mins}:{secs}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full">
          <div className="h-full bg-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Alex speech bubble */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-cyan-600 text-base">psychology</span>
          </div>
          <span className="text-sm font-bold text-slate-700">Alex</span>
          <span className="text-xs text-slate-400">AI Interviewer</span>
          <button onClick={() => setIsMuted(!isMuted)}
            className="ml-auto text-slate-400 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined text-base">
              {isMuted ? "volume_off" : "volume_up"}
            </span>
          </button>
        </div>
        <p className="text-slate-700 text-sm leading-relaxed">{speechBubble}</p>
      </div>

      {/* Answer area */}
      {phase === "answering" && (
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={6}
              placeholder="Type your answer here, or click the mic to speak..."
              className="w-full bg-white rounded-2xl p-5 border border-slate-200 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 resize-none text-sm text-slate-700 placeholder:text-slate-300 outline-none transition-all shadow-sm"
            />
            {micSupported && (
              <button onClick={toggleMic}
                className="absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: isListening ? "#dc2626" : "#f1f5f9",
                  boxShadow: isListening ? "0 0 12px #dc262688" : "none"
                }}>
                <span className="material-symbols-outlined text-base"
                  style={{ color: isListening ? "white" : "#64748b" }}>
                  {isListening ? "mic" : "mic_off"}
                </span>
              </button>
            )}
          </div>
          <button onClick={handleSubmit}
            disabled={answer.trim().length < 5}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
              answer.trim().length >= 5
                ? "bg-black text-white hover:bg-slate-800 cursor-pointer"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}>
            Submit Answer
          </button>
        </div>
      )}

      {/* Thinking */}
      {phase === "thinking" && (
        <div className="flex items-center space-x-3 py-4">
          {[0, 150, 300].map(delay => (
            <div key={delay} className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
              style={{ animationDelay: `${delay}ms` }} />
          ))}
          <span className="text-sm text-slate-400">Alex is reviewing your answer...</span>
        </div>
      )}

      {/* Feedback */}
      {phase === "feedback" && currentFeedback && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-extrabold"
              style={{ color: currentFeedback.score >= 7 ? "#0e7490" : currentFeedback.score >= 5 ? "#d97706" : "#dc2626" }}>
              {currentFeedback.score}/10
            </span>
            <span className="text-sm text-slate-400">
              {currentFeedback.score >= 7 ? "Strong answer" : currentFeedback.score >= 5 ? "Good attempt" : "Needs work"}
            </span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <span className="material-symbols-outlined text-green-500 text-base mt-0.5 shrink-0">check_circle</span>
              <p className="text-slate-600"><span className="text-green-600 font-semibold">Good: </span>{currentFeedback.good}</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="material-symbols-outlined text-amber-500 text-base mt-0.5 shrink-0">tips_and_updates</span>
              <p className="text-slate-600"><span className="text-amber-600 font-semibold">Improve: </span>{currentFeedback.improve}</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="material-symbols-outlined text-cyan-500 text-base mt-0.5 shrink-0">auto_awesome</span>
              <p className="text-slate-600"><span className="text-cyan-600 font-semibold">Better answer: </span>{currentFeedback.suggested}</p>
            </div>
          </div>
          {currentIndex < questions.length - 1 && (
            <button onClick={() => setCurrentIndex(i => i + 1)}
              className="w-full py-3 rounded-xl font-bold text-sm bg-black text-white hover:bg-slate-800 transition-all active:scale-95">
              Next Question →
            </button>
          )}
        </div>
      )}
    </div>
  );
}