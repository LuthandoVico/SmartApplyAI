import { useState } from "react";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ icon, iconBg, iconColor, title, titleColor, action }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
          <span className={`material-symbols-outlined ${iconColor} text-base`} style={{ fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        </div>
        <h4 style={{ fontFamily: "Manrope, sans-serif" }} className={`font-bold text-base ${titleColor}`}>
          {title}
        </h4>
      </div>
      {action}
    </div>
  );
}

function Result({ result }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [showImprovedCV, setShowImprovedCV] = useState(false);

  if (!result) return null;

  const score = result.matchScore || 0;

  const scoreColor   = score >= 75 ? "#0e7490" : score >= 50 ? "#d97706" : "#dc2626";
  const scoreBg      = score >= 75 ? "bg-cyan-50" : score >= 50 ? "bg-amber-50" : "bg-red-50";
  const scoreBorder  = score >= 75 ? "border-cyan-200" : score >= 50 ? "border-amber-200" : "border-red-200";

  const verdictLabel = score >= 75 ? "Strong Candidate" : score >= 50 ? "Good Potential" : "Needs Work";
  const verdictIcon  = score >= 75 ? "verified" : score >= 50 ? "thumbs_up" : "trending_down";

  function handleCopyCoverLetter() {
    if (result.coverLetter) {
      navigator.clipboard.writeText(result.coverLetter);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }

  return (
    <div className="space-y-6" style={{ animation: "fadeIn 0.5s ease forwards" }}>

      {/* ── Row 1: Score · Strengths · Missing Skills ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Match Score */}
        <Card className={`${scoreBg} border ${scoreBorder}`}>
          <div className="px-6 py-8 flex flex-col items-center text-center space-y-3">
            <span
              style={{ fontFamily: "Manrope, sans-serif", fontSize: "4rem", fontWeight: 900, color: scoreColor, lineHeight: 1 }}
            >
              {score}%
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Match Score</span>
            <div className="pt-2 flex items-center space-x-2">
              <span className="material-symbols-outlined text-base" style={{ color: scoreColor, fontVariationSettings: "'FILL' 1" }}>
                {verdictIcon}
              </span>
              <span style={{ fontFamily: "Manrope, sans-serif", color: scoreColor }} className="font-bold text-sm">
                {verdictLabel}
              </span>
            </div>
          </div>
        </Card>

        {/* Strengths */}
        <Card>
          <CardHeader
            icon="verified"
            iconBg="bg-cyan-50"
            iconColor="text-cyan-700"
            title="Strengths"
            titleColor="text-cyan-700"
          />
          <ul className="px-6 py-4 space-y-3">
            {result.strengths?.map((s, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="material-symbols-outlined text-cyan-500 text-base mt-0.5 shrink-0">check_circle</span>
                <span className="text-sm text-slate-600">{s}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Missing Skills */}
        <Card>
          <CardHeader
            icon="warning"
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            title="Missing Skills"
            titleColor="text-purple-600"
          />
          <ul className="px-6 py-4 space-y-3">
            {result.missingSkills?.map((s, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="material-symbols-outlined text-purple-400 text-base mt-0.5 shrink-0">error_outline</span>
                <span className="text-sm text-slate-600">{s}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ── Row 2: Insights ── */}
      {result.insights?.length > 0 && (
        <Card>
          <CardHeader
            icon="lightbulb"
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            title="CV Optimization Insights"
            titleColor="text-slate-800"
          />
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {result.insights.map((insight, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-2">
                <div style={{ fontFamily: "Manrope, sans-serif", fontSize: "2rem", fontWeight: 900, color: "#0e7490", opacity: 0.18 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Row 3: Improved CV ── */}
      {result.improvedCV && (
        <Card>
          <CardHeader
            icon="edit_document"
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
            title="Improved CV"
            titleColor="text-slate-800"
            action={
              <button
                onClick={() => setShowImprovedCV(!showImprovedCV)}
                className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-base">
                  {showImprovedCV ? "visibility_off" : "visibility"}
                </span>
                <span>{showImprovedCV ? "Hide" : "Show"}</span>
              </button>
            }
          />
          {showImprovedCV && (
            <div className="px-6 py-5 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {result.improvedCV}
            </div>
          )}
        </Card>
      )}

      {/* ── Row 4: Cover Letter ── */}
      {result.coverLetter && (
        <Card>
          <CardHeader
            icon="mail"
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
            title="AI-Generated Cover Letter"
            titleColor="text-slate-800"
            action={
              <button
                onClick={handleCopyCoverLetter}
                className={`flex items-center space-x-1 text-xs font-bold transition-colors ${
                  copySuccess ? "text-green-600" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {copySuccess ? "check_circle" : "content_copy"}
                </span>
                <span>{copySuccess ? "Copied!" : "Copy"}</span>
              </button>
            }
          />
          <div className="px-6 py-5 text-sm text-slate-600 italic leading-relaxed whitespace-pre-line">
            {result.coverLetter}
          </div>
        </Card>
      )}

    </div>
  );
}

export default Result;
