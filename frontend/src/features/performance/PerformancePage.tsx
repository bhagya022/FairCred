import { useState, useEffect } from 'react';
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
    return () => {
      isMounted = false;
    };
  }, []);

  let topModelTarget = '';
  if (metrics.length > 0) {
    const bestConfig = [...metrics].sort((a, b) => b.Accuracy - a.Accuracy)[0];
    topModelTarget = bestConfig.Model;
  }

  return (
    <div className="flex w-full justify-center pb-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="mb-8 flex items-end justify-between p-1">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900">Machine Learning Evaluation Matrix</h2>
            <p className="mt-2 text-sm text-stone-600">
              Benchmarking candidate predictive models concurrently parsing accuracy, recall, and precision validation streams.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="flex w-full flex-col items-center gap-5 rounded-2xl border border-stone-200 bg-stone-50/95 p-24 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
            <div className="h-12 w-12 rounded-full border-4 border-stone-300 border-t-amber-600 animate-spin" />
            <p className="font-semibold tracking-wide text-stone-600 animate-pulse">Evaluating historical pipelines...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 font-medium tracking-wide text-red-700">
            Warning: {error}
          </div>
        )}

        {!isLoading && metrics.length > 0 && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {metrics.map((model) => {
                const isChampion = model.Model === topModelTarget;

                return (
                  <div
                    key={model.Model}
                    className={`relative rounded-2xl border p-6 shadow-[0_20px_60px_rgba(120,53,15,0.08)] transition-all duration-300 ${
                      isChampion
                        ? 'scale-100 border-amber-300 bg-amber-50 ring-1 ring-amber-300 lg:scale-[1.02]'
                        : 'border-stone-200 bg-stone-50/95 hover:border-stone-300 hover:bg-stone-100/80'
                    }`}
                  >
                    {isChampion && (
                      <div className="absolute -right-3.5 -top-3.5 rounded-full bg-amber-700 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
                        Production Champion
                      </div>
                    )}

                    <h3 className={`mb-6 flex items-center justify-between text-2xl font-black ${isChampion ? 'text-amber-900' : 'text-stone-900'}`}>
                      {model.Model}
                      {isChampion && <span className="text-lg text-amber-700">Top</span>}
                    </h3>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                      <div className="rounded-xl border border-stone-200 bg-stone-100 p-3">
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">Accuracy</div>
                        <div className={`text-3xl font-mono font-black ${isChampion ? 'text-amber-800' : 'text-stone-800'}`}>{(model.Accuracy * 100).toFixed(1)}%</div>
                      </div>
                      <div className="rounded-xl border border-stone-200 bg-stone-100 p-3">
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">F1 Score</div>
                        <div className="text-3xl font-mono text-stone-800">{(model.F1_Score * 100).toFixed(1)}%</div>
                      </div>
                      <div className="px-2">
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">Precision</div>
                        <div className="text-lg font-mono text-stone-700">{(model.Precision * 100).toFixed(1)}%</div>
                      </div>
                      <div className="px-2">
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">AUC-ROC</div>
                        <div className="text-lg font-mono text-stone-700">{(model.AUC_ROC * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col rounded-2xl border border-stone-200 bg-stone-50/95 p-6 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
              <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-600">Head-to-Head Cross-Validation Chartings</h3>
              <div className="flex-1 w-full rounded-xl border border-stone-200 bg-stone-100 p-4">
                <PerformanceChart metrics={metrics} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
