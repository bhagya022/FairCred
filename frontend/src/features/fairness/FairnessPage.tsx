import { useState, useEffect } from 'react';
import { fairnessService } from './fairnessService';
import { IncomeChart } from './IncomeChart';
import { EmploymentChart } from './EmploymentChart';

export function FairnessPage() {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFairness = async () => {
      try {
        setIsLoading(true);
        const data = await fairnessService.getFairnessReport();
        if (isMounted) setReport(data);
      } catch (err: any) {
        if (isMounted) {
          setError(err?.response?.data?.detail || 'Failed to fetch model bias analytics. Make sure there are logged predictions.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFairness();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex w-full justify-center pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900">Fairness & Bias Dashboard</h2>
            <p className="mt-2 text-sm text-stone-600">
              Evaluating algorithmic bias by computing parity metrics across marginalized demographic data points.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="flex w-full flex-col items-center gap-5 rounded-2xl border border-stone-200 bg-stone-50/95 p-24 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
            <div className="h-12 w-12 rounded-full border-4 border-stone-300 border-t-amber-600 animate-spin" />
            <p className="font-semibold tracking-wide text-stone-600 animate-pulse">Running advanced matrix factorization parity models...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 font-medium tracking-wide text-red-700">
            Warning: {error}
          </div>
        )}

        {!isLoading && report && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50/95 p-8 shadow-[0_20px_60px_rgba(120,53,15,0.08)] transition-all hover:border-stone-300 hover:shadow-xl">
                <div>
                  <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-stone-500">Approval Parity Discrepancy</div>
                  <div className="bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-6xl font-black text-transparent">
                    {(report.approval_parity * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-2xl text-amber-800 shadow-inner">
                  AP
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50/95 p-8 shadow-[0_20px_60px_rgba(120,53,15,0.08)] transition-all hover:border-stone-300 hover:shadow-xl">
                <div>
                  <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-stone-500">Score Balance Standard Deviation</div>
                  <div className="bg-gradient-to-r from-stone-900 to-amber-700 bg-clip-text text-6xl font-black text-transparent">
                    {(report.score_balance * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-2xl text-stone-700 shadow-inner">
                  SB
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="flex flex-col rounded-2xl border border-stone-200 bg-stone-50/95 p-6 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
                <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-600">Demographic Disparity: Income Tier Isolation</h3>
                <div className="min-h-[300px] flex-1">
                  <IncomeChart data={report.income_metrics} />
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-stone-200 bg-stone-50/95 p-6 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
                <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-600">Demographic Disparity: Socio-Employment Axis</h3>
                <div className="min-h-[300px] flex-1">
                  <EmploymentChart data={report.employment_metrics} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
