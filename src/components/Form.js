import { useState } from "react";
import { analyzeCV } from "../services/api";

function Form({ setResult }) {
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = async () => {
    if (!cvText.trim() || !jobDescription.trim()) return;
    setResult(null);
    const data = { cvText, jobDescription };
    const result = await analyzeCV(data);

    // save for InterviewPrep to read
    const detectedRole = jobDescription.split("\n")[0].trim().slice(0, 60);
    localStorage.setItem("smartapply_role", detectedRole);
    localStorage.setItem("smartapply_missing", JSON.stringify(result.missingSkills || []));

    setResult(result);
  };

  const canSubmit = cvText.trim() && jobDescription.trim();

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Resume */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <h3 style={{ fontFamily: "Manrope, sans-serif" }} className="font-bold text-2xl tracking-tight text-slate-900">
              Your Resume
            </h3>
            <span className="text-cyan-700 text-xs font-bold uppercase tracking-widest">Step 01</span>
          </div>
          <textarea
            placeholder="Paste your CV here..."
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            rows={10}
            className="w-full bg-white rounded-2xl p-6 border border-slate-200 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 resize-none text-sm text-slate-700 placeholder:text-slate-300 outline-none transition-all shadow-sm"
          />
        </div>

        {/* Job Description */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <h3 style={{ fontFamily: "Manrope, sans-serif" }} className="font-bold text-2xl tracking-tight text-slate-900">
              Job Description
            </h3>
            <span className="text-cyan-700 text-xs font-bold uppercase tracking-widest">Step 02</span>
          </div>
          <textarea
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            className="w-full bg-white rounded-2xl p-6 border border-slate-200 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 resize-none text-sm text-slate-700 placeholder:text-slate-300 outline-none transition-all shadow-sm"
          />
        </div>
      </section>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{ fontFamily: "Manrope, sans-serif" }}
          className={`px-12 py-4 rounded-2xl font-bold text-lg flex items-center space-x-3 transition-all active:scale-95 min-w-[220px] justify-center ${
            canSubmit
              ? "bg-black text-white hover:bg-slate-800 shadow-lg hover:shadow-xl cursor-pointer"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          <span className="material-symbols-outlined">analytics</span>
          <span>Analyze Match</span>
        </button>
      </div>
    </div>
  );
}

export default Form;