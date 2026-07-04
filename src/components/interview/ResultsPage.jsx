import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResultsPage({ config, questions, answers, scores, feedbackList, overallFeedback, onTryAgain, onNewInterview }) {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  const avg = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10)
    : 0;

  const scoreColor = avg >= 75 ? "#0e7490" : avg >= 50 ? "#d97706" : "#dc2626";
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const dash = (avg / 100) * circ;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

      {/* Score ring */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center space-y-4">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12"/>
          <circle cx="70" cy="70" r={radius} fill="none" stroke={scoreColor}
            strokeWidth="12" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform="rotate(-90 70 70)"
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
          <text x="70" y="66" textAnchor="middle" fill={scoreColor} fontSize="26" fontWeight="800">{avg}%</text>
          <text x="70" y="84" textAnchor="middle" fill="#94a3b8" fontSize="11">Overall</text>
        </svg>
        <div className="text-center">
          <p style={{ fontFamily: "Manrope, sans-serif" }} className="font-extrabold text-xl text-slate-900">
            {avg >= 75 ? "Excellent work!" : avg >= 50 ? "Good effort!" : "Keep practising!"}
          </p>
          <p className="text-slate-500 text-sm mt-1">
            {overallFeedback?.summary || `You completed the interview, ${config?.name}.`}
          </p>
        </div>
      </div>

      {/* Strengths */}
      {overallFeedback?.strengths?.length > 0 && (
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 space-y-3">
          <h3 className="font-bold text-green-700 flex items-center space-x-2 text-sm">
            <span className="material-symbols-outlined text-base">verified</span>
            <span>What You Did Well</span>
          </h3>
          <ul className="space-y-2">
            {overallFeedback.strengths.map((s, i) => (
              <li key={i} className="flex items-start space-x-2 text-sm text-slate-600">
                <span className="text-green-500 shrink-0 mt-0.5">•</span><span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {overallFeedback?.improvements?.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 space-y-3">
          <h3 className="font-bold text-amber-700 flex items-center space-x-2 text-sm">
            <span className="material-symbols-outlined text-base">tips_and_updates</span>
            <span>Areas To Improve</span>
          </h3>
          <ul className="space-y-2">
            {overallFeedback.improvements.map((s, i) => (
              <li key={i} className="flex items-start space-x-2 text-sm text-slate-600">
                <span className="text-amber-500 shrink-0 mt-0.5">•</span><span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next steps */}
      {overallFeedback?.nextSteps?.length > 0 && (
        <div className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-6 space-y-3">
          <h3 className="font-bold text-cyan-700 flex items-center space-x-2 text-sm">
            <span className="material-symbols-outlined text-base">rocket_launch</span>
            <span>Next Steps</span>
          </h3>
          <ul className="space-y-2">
            {overallFeedback.nextSteps.map((s, i) => (
              <li key={i} className="flex items-start space-x-2 text-sm text-slate-600">
                <span className="text-cyan-600 font-bold shrink-0">{i + 1}.</span><span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Per question breakdown */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-500 text-xs uppercase tracking-widest">Question Breakdown</h3>
        {questions.map((q, i) => {
          const fb = feedbackList[i];
          const sc = scores[i];
          const col = sc >= 7 ? "#0e7490" : sc >= 5 ? "#d97706" : "#dc2626";
          return (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <button onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="text-sm text-slate-700 font-medium pr-4 flex-1">{q}</span>
                <div className="flex items-center space-x-3 shrink-0">
                  <span className="font-bold text-sm" style={{ color: col }}>{sc}/10</span>
                  <span className="material-symbols-outlined text-slate-400 text-base">
                    {expanded === i ? "expand_less" : "expand_more"}
                  </span>
                </div>
              </button>
              {expanded === i && fb && (
                <div className="px-5 pb-4 pt-3 border-t border-slate-100 space-y-2 text-sm">
                  <p className="text-slate-400 italic">{answers[i]}</p>
                  <p className="text-green-600"><span className="font-semibold">Good: </span>{fb.good}</p>
                  <p className="text-amber-600"><span className="font-semibold">Improve: </span>{fb.improve}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex space-x-4 pt-2">
        <button onClick={onTryAgain}
          className="flex-1 py-4 rounded-xl font-bold text-sm bg-black text-white hover:bg-slate-800 transition-all active:scale-95">
          Try Again
        </button>
        <button onClick={onNewInterview}
          className="flex-1 py-4 rounded-xl font-bold text-sm bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
          New Interview
        </button>
        <button onClick={() => navigate("/")}
          className="flex-1 py-4 rounded-xl font-bold text-sm bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100 transition-all active:scale-95">
          Back to CV
        </button>
      </div>

    </div>
  );
}