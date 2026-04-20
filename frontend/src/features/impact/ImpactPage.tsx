import React, { useState, useEffect } from 'react';
import { impactService } from './impactService';

export function ImpactPage() {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchEval = async () => {
      try {
        setIsLoading(true);
        const data = await impactService.getEvaluation();
        if (isMounted) setReport(data);
      } catch (err: any) {
         if (isMounted) setError(err?.message || 'Failed to fetch business level impact analytics.');
      } finally {
         if (isMounted) setIsLoading(false);
      }
    };
    fetchEval();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="w-full flex justify-center pb-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-200 tracking-tight">Business Impact Analysis</h2>
          <p className="text-sm text-slate-400 mt-2">
            Evaluating true false positive financial risk and false negative sales fallout consequences against automated precision trade-offs.
          </p>
        </div>

        {isLoading && (
           <div className="w-full p-24 flex flex-col items-center gap-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
             <div className="w-12 h-12 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin"></div>
             <p className="text-slate-400 font-semibold tracking-wide animate-pulse">Computing operational fallout matrices...</p>
           </div>
        )}

        {error && (
           <div className="p-5 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 shadow-inner font-medium tracking-wide">
             ⚠️ {error}
           </div>
        )}

        {!isLoading && report && (
          <div className="space-y-8">
            
            {/* Core Classification Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-[1.02] transition-transform">
                 <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Overall Precision</div>
                 <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
                   {(report.precision * 100).toFixed(1)}%
                 </div>
                 <p className="text-xs font-medium text-slate-400 mt-4">Strict adherence ratio ensuring approved users are genuinely low-risk.</p>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-[1.02] transition-transform">
                 <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Model Recall</div>
                 <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                   {(report.recall * 100).toFixed(1)}%
                 </div>
                 <p className="text-xs font-medium text-slate-400 mt-4">Volume capture matrix determining how many real optimal users were automatically approved.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-[1.02] transition-transform">
                 <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">F1 Harmonic Base</div>
                 <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                   {(report.f1 * 100).toFixed(1)}%
                 </div>
                 <p className="text-xs font-medium text-slate-400 mt-4">Harmonic baseline mean blending precision validation seamlessly with volume scale.</p>
              </div>
            </div>

            {/* Error Fallout Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden group hover:border-red-500/50 transition-colors">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-48 h-48 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors"></div>
                <div className="flex items-start justify-between relative z-10">
                   <div>
                     <div className="text-sm font-black text-slate-300 uppercase tracking-widest mb-1.5">False Positives (FP)</div>
                     <p className="text-xs text-slate-400 mb-8 max-w-[250px]">High-risk users who were incorrectly approved by the underlying neural structure.</p>
                     
                     <div className="text-7xl font-black text-red-500/90 tracking-tighter drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                       {report.fp}
                     </div>
                     <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-red-400/80 uppercase tracking-wider bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                       <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                       Direct Financial Credit Risk
                     </div>
                   </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden group hover:border-amber-500/50 transition-colors">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
                <div className="flex items-start justify-between relative z-10">
                   <div>
                     <div className="text-sm font-black text-slate-300 uppercase tracking-widest mb-1.5">False Negatives (FN)</div>
                     <p className="text-xs text-slate-400 mb-8 max-w-[250px]">Low-risk highly optimal users who were incorrectly rejected natively.</p>
                     
                     <div className="text-7xl font-black text-amber-500/90 tracking-tighter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                       {report.fn}
                     </div>
                     <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-amber-400/80 uppercase tracking-wider bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                       <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                       Lost Revenue Volume
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
