import { useState, useEffect } from "react";

const TYPES = [
  { id: "technical",   icon: "code",   title: "Technical",   desc: "Coding & system design" },
  { id: "behavioural", icon: "people", title: "Behavioural", desc: "Situational & soft skills" },
  { id: "general",     icon: "work",   title: "General",     desc: "Common HR questions" },
];

export default function LandingPage({ onStart }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("junior");
  const [fromSmartApply, setFromSmartApply] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("smartapply_role");
    if (savedRole) {
      setRole(savedRole);
      setFromSmartApply(true);
      localStorage.removeItem("smartapply_role");
    }
  }, []);

  const canStart = name.trim().length >= 2 && role.trim().length >= 2 && type !== "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">

      <div className="text-center space-y-2">
        <h2 style={{ fontFamily: "Manrope, sans-serif" }}
          className="font-extrabold text-3xl text-slate-900">
          Interview Practice
        </h2>
        <p className="text-slate-500 text-sm">
          AI-powered mock interviews with instant feedback
        </p>
      </div>

      {fromSmartApply && (
        <div className="flex items-center space-x-2 bg-cyan-50 border border-cyan-200 rounded-xl px-4 py-3">
          <span className="material-symbols-outlined text-cyan-600 text-base">auto_awesome</span>
          <p className="text-cyan-700 text-sm font-medium">
            Role pre-filled from your CV analysis. Questions will target your skill gaps.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Your Name</label>
            <input type="text" placeholder="e.g. Thabo"
              value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Role</label>
            <input type="text" placeholder="e.g. Junior Frontend Developer"
              value={role} onChange={e => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Interview Type</label>
          <div className="grid grid-cols-3 gap-3">
            {TYPES.map(t => (
              <button key={t.id} onClick={() => setType(t.id)}
                className={`p-4 rounded-xl text-left border transition-all space-y-1 ${
                  type === t.id
                    ? "bg-cyan-50 border-cyan-400"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}>
                <span className={`material-symbols-outlined text-xl block ${type === t.id ? "text-cyan-600" : "text-slate-400"}`}>
                  {t.icon}
                </span>
                <p className={`font-bold text-sm ${type === t.id ? "text-cyan-700" : "text-slate-600"}`}>{t.title}</p>
                <p className="text-xs text-slate-400">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Difficulty</label>
          <div className="flex space-x-3">
            {["junior", "mid", "senior"].map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize border transition-all ${
                  difficulty === d
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => canStart && onStart({ name, role, type, difficulty })}
          disabled={!canStart}
          className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center space-x-2 transition-all active:scale-95 ${
            canStart
              ? "bg-black text-white hover:bg-slate-800 shadow-lg cursor-pointer"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}>
          <span className="material-symbols-outlined">play_arrow</span>
          <span>Start Interview</span>
        </button>

      </div>
    </div>
  );
}