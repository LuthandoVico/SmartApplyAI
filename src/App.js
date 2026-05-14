import { useState } from "react";
import Form from "./components/Form";
import Result from "./components/Result";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-10 py-5 flex items-center space-x-3">
          <span className="material-symbols-outlined text-cyan-700 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            analytics
          </span>
          <div>
            <h1 style={{ fontFamily: "Manrope, sans-serif" }} className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
              SmartApply
            </h1>
            <p className="text-xs text-slate-400 font-medium">AI-Powered CV Analyzer</p>
          </div>
        </div>
      </header>

      {/* Page body */}
      <main className="max-w-7xl mx-auto px-10 py-10 space-y-12">
        <Form setResult={setResult} />
        <Result result={result} />
      </main>
    </div>
  );
}

export default App;