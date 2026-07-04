import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Form from "./components/Form";
import Result from "./components/Result";
import LandingPage from "./components/interview/LandingPage";
import InterviewSession from "./components/interview/InterviewSession";
import ResultsPage from "./components/interview/ResultsPage";
import { generateQuestions, generateOverallFeedback } from "./services/openai";

function Navbar() {
  const location = useLocation();
  const onInterview = location.pathname.startsWith("/interview");

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-10 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="material-symbols-outlined text-cyan-700 text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          <div>
            <h1 style={{ fontFamily: "Manrope, sans-serif" }}
              className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
              SmartApply
            </h1>
            <p className="text-xs text-slate-400 font-medium">AI-Powered Career Tools</p>
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="flex items-center space-x-1">
          <Link to="/"
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              !onInterview
                ? "bg-cyan-50 text-cyan-700"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}>
            <span className="material-symbols-outlined text-base">description</span>
            <span>CV Optimizer</span>
          </Link>
          <Link to="/interview"
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              onInterview
                ? "bg-cyan-50 text-cyan-700"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}>
            <span className="material-symbols-outlined text-base">psychology</span>
            <span>Interview Prep</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function CVOptimizer() {
  const [result, setResult] = useState(null);

  return (
    <main className="max-w-7xl mx-auto px-10 py-10 space-y-12">
      <Form setResult={setResult} />
      <Result result={result} />
    </main>
  );
}

function InterviewApp() {
  const [screen, setScreen] = useState("landing");
  const [config, setConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [sessionData, setSessionData] = useState(null);

  async function handleStart(cfg) {
    setConfig(cfg);
    setScreen("loading");
    const qs = await generateQuestions(cfg.role, cfg.type, cfg.difficulty);
    setQuestions(qs);
    setScreen("interview");
  }

  async function handleComplete(answers, scores, feedbackList) {
    setScreen("loading");
    const overall = await generateOverallFeedback(questions, answers, scores);
    setSessionData({ answers, scores, feedbackList, overall });
    setScreen("results");
  }

  function handleTryAgain() {
    setScreen("interview");
    setSessionData(null);
  }

  function handleNewInterview() {
    setScreen("landing");
    setConfig(null);
    setQuestions([]);
    setSessionData(null);
  }

  if (screen === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <div className="w-12 h-12 rounded-full border-4 border-t-cyan-500 border-slate-200 animate-spin" />
        <p className="text-slate-400 text-sm animate-pulse">
          {questions.length === 0 ? "Generating your questions..." : "Building your results..."}
        </p>
      </div>
    );
  }

  return (
    <>
      {screen === "landing" && <LandingPage onStart={handleStart} />}
      {screen === "interview" && (
        <InterviewSession config={config} questions={questions} onComplete={handleComplete} />
      )}
      {screen === "results" && sessionData && (
        <ResultsPage
          config={config}
          questions={questions}
          answers={sessionData.answers}
          scores={sessionData.scores}
          feedbackList={sessionData.feedbackList}
          overallFeedback={sessionData.overall}
          onTryAgain={handleTryAgain}
          onNewInterview={handleNewInterview}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<CVOptimizer />} />
          <Route path="/interview" element={<InterviewApp />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}