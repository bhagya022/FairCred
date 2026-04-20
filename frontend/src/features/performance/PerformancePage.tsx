import React, { useState, useEffect } from 'react';
import { performanceService } from './performanceService';
import { PerformanceChart } from './PerformanceChart';

export function PerformancePage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        const data = await performanceService.getMetrics();
        if (isMounted) setMetrics(data);
      } catch (err: any) {
         if (isMounted) setError(err?.message || 'Failed to sync core validation metrics directly from the testing backend framework.');
      } finally {
         if (isMounted) setIsLoading(false);
      }
    };
    fetchMetrics();
    return () => { isMounted = false; };
  }, []);

  // Isolate highest-performing framework
  let topModelTarget = '';
  if (metrics.length > 0) {
     // Sort strictly by raw accuracy, highest ascending priority
    const bestConfig = [...metrics].sort((a,b) => b.Accuracy - a.Accuracy)[0];
    topModelTarget = bestConfig.Model;
  }

  return (
    <div className="w-full flex justify-center pb-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        <div className="mb-8 p-1 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-200 tracking-tight">Machine Learning Evaluation Matrix</h2>
            <p className="text-sm text-slate-400 mt-2">
               Benchmarking candidate predictive models concurrently parsing accuracy, recall, and precision validation streams.
            </p>
          </div>
        </div>

        {isLoading && (
           <div className="w-full p-24 flex flex-col items-center gap-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
             <div className="w-12 h-12 border-4 border-slate-700 border-t-sky-500 rounded-full animate-spin"></div>
             <p className="text-slate-400 font-semibold tracking-wide animate-pulse">Evaluating historical pipelines...</p>
           </div>
        )}

        {error && (
           <div className="p-5 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 shadow-inner font-medium tracking-wide">
             ⚠️ {error}
           </div>
        )}

        {!isLoading && metrics.length > 0 && (
          <div className="space-y-10">
            {/* Array of Disaggregated Candidate Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map((model) => {
                const isChampion = model.Model === topModelTarget;
                
                return (
                  <div key={model.Model} className={`relative bg-slate-900 border rounded-2xl p-6 shadow-xl transition-all duration-300 ${isChampion ? 'border-sky-500/50 bg-sky-950/20 ring-1 ring-sky-500/50 transform scale-100 lg:scale-[1.02]' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/30'}`}>
                    
                    {isChampion && (
                      <div className="absolute -top-3.5 -right-3.5 bg-sky-500 text-white text-[10px] font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.6)] animate-pulse">
                        Production Champion
                      </div>
                    )}
                    
                    <h3 className={`text-2xl font-black mb-6 flex items-center justify-between ${isChampion ? 'text-sky-400' : 'text-slate-200'}`}>
                      {model.Model}
                      {isChampion && <span className="text-2xl">🏆</span>}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Accuracy</div>
                        <div className={`text-3xl font-mono font-black ${isChampion ? 'text-sky-400' : 'text-slate-300'}`}>{(model.Accuracy * 100).toFixed(1)}%</div>
                      </div>
                      <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">F1 Score</div>
                        <div className="text-3xl font-mono text-slate-300">{(model.F1_Score * 100).toFixed(1)}%</div>
                      </div>
                      <div className="px-2">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Precision</div>
                        <div className="text-lg font-mono text-slate-400">{(model.Precision * 100).toFixed(1)}%</div>
                      </div>
                      <div className="px-2">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">AUC-ROC</div>
                        <div className="text-lg font-mono text-slate-400">{(model.AUC_ROC * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Performance Plot Wrapper */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
              <h3 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">Head-to-Head Cross-Validation Chartings</h3>
              <div className="flex-1 w-full bg-slate-950/40 rounded-xl p-4 border border-slate-800/50">
                <PerformanceChart metrics={metrics} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
