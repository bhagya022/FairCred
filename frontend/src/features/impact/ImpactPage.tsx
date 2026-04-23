import { useState, useEffect } from 'react';
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
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex w-full justify-center pb-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900">Business Impact Analysis</h2>
          <p className="mt-2 text-sm text-stone-600">
            Evaluating true false positive financial risk and false negative sales fallout consequences against automated precision trade-offs.
          </p>
        </div>

        {isLoading && (
          <div className="flex w-full flex-col items-center gap-5 rounded-2xl border border-stone-200 bg-stone-50/95 p-24 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
            <div className="h-12 w-12 rounded-full border-4 border-stone-300 border-t-amber-500 animate-spin" />
            <p className="font-semibold tracking-wide text-stone-600 animate-pulse">Computing operational fallout matrices...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 font-medium tracking-wide text-red-700">
            Warning: {error}
          </div>
        )}

        {!isLoading && report && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex transform flex-col items-center justify-center rounded-2xl border border-stone-200 bg-stone-50/95 p-8 text-center shadow-[0_20px_60px_rgba(120,53,15,0.08)] transition-transform hover:scale-[1.02]">
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-stone-500">Overall Precision</div>
                <div className="bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-6xl font-black text-transparent">
                  {(report.precision * 100).toFixed(1)}%
                </div>
                <p className="mt-4 text-xs font-medium text-stone-600">Strict adherence ratio ensuring approved users are genuinely low-risk.</p>
              </div>

              <div className="flex transform flex-col items-center justify-center rounded-2xl border border-stone-200 bg-stone-50/95 p-8 text-center shadow-[0_20px_60px_rgba(120,53,15,0.08)] transition-transform hover:scale-[1.02]">
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-stone-500">Model Recall</div>
                <div className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-6xl font-black text-transparent">
                  {(report.recall * 100).toFixed(1)}%
                </div>
                <p className="mt-4 text-xs font-medium text-stone-600">Volume capture matrix determining how many real optimal users were automatically approved.</p>
              </div>

              <div className="flex transform flex-col items-center justify-center rounded-2xl border border-stone-200 bg-stone-50/95 p-8 text-center shadow-[0_20px_60px_rgba(120,53,15,0.08)] transition-transform hover:scale-[1.02]">
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-stone-500">F1 Harmonic Base</div>
                <div className="bg-gradient-to-r from-stone-900 to-amber-700 bg-clip-text text-6xl font-black text-transparent">
                  {(report.f1 * 100).toFixed(1)}%
                </div>
                <p className="mt-4 text-xs font-medium text-stone-600">Harmonic baseline mean blending precision validation seamlessly with volume scale.</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="group relative overflow-hidden rounded-2xl border border-red-200 bg-stone-50/95 p-8 shadow-[0_20px_60px_rgba(120,53,15,0.08)] transition-colors hover:border-red-300">
                <div className="absolute right-0 top-0 -mr-6 -mt-6 h-48 w-48 rounded-full bg-red-100 blur-3xl transition-colors group-hover:bg-red-200/70" />
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <div className="mb-1.5 text-sm font-black uppercase tracking-widest text-stone-800">False Positives (FP)</div>
                    <p className="mb-8 max-w-[250px] text-xs text-stone-600">High-risk users who were incorrectly approved by the underlying neural structure.</p>

                    <div className="text-7xl font-black tracking-tighter text-red-700">{report.fp}</div>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-700">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      Direct Financial Credit Risk
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-stone-50/95 p-8 shadow-[0_20px_60px_rgba(120,53,15,0.08)] transition-colors hover:border-amber-300">
                <div className="absolute right-0 top-0 -mr-6 -mt-6 h-48 w-48 rounded-full bg-amber-100 blur-3xl transition-colors group-hover:bg-amber-200/70" />
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <div className="mb-1.5 text-sm font-black uppercase tracking-widest text-stone-800">False Negatives (FN)</div>
                    <p className="mb-8 max-w-[250px] text-xs text-stone-600">Low-risk highly optimal users who were incorrectly rejected natively.</p>

                    <div className="text-7xl font-black tracking-tighter text-amber-700">{report.fn}</div>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
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
