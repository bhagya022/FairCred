import React, { useState, useEffect } from 'react';
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
    
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="w-full flex justify-center pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-200 tracking-tight">Fairness & Bias Dashboard</h2>
            <p className="text-sm text-slate-400 mt-2">
              Evaluating algorithmic bias by computing parity metrics across marginalized demographic data points.
            </p>
          </div>
        </div>

        {isLoading && (
           <div className="w-full p-24 flex flex-col items-center gap-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
             <div className="w-12 h-12 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
             <p className="text-slate-400 font-semibold tracking-wide animate-pulse">Running advanced matrix factorization parity models...</p>
           </div>
        )}

        {error && (
           <div className="p-5 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 shadow-inner font-medium tracking-wide">
             ⚠️ {error}
           </div>
        )}

        {!isLoading && report && (
          <div className="space-y-8">
            {/* Core KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl flex items-center justify-between hover:border-slate-700 hover:shadow-2xl transition-all">
                <div>
                   <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Approval Parity Discrepancy</div>
                   <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                     {(report.approval_parity * 100).toFixed(1)}%
                   </div>
                </div>
                <div className="h-16 w-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center text-3xl shadow-inner">
                  ⚖️
                </div>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl flex items-center justify-between hover:border-slate-700 hover:shadow-2xl transition-all">
                <div>
                   <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Score Balance Standard Deviation</div>
                   <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                     {(report.score_balance * 100).toFixed(1)}%
                   </div>
                </div>
                <div className="h-16 w-16 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center text-3xl shadow-inner">
                  📊
                </div>
              </div>
            </div>

            {/* Split Dimension Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
                <h3 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">Demographic Disparity: Income Tier Isolation</h3>
                <div className="flex-1 min-h-[300px]">
                  <IncomeChart data={report.income_metrics} />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
                <h3 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">Demographic Disparity: Socio-Employment Axis</h3>
                <div className="flex-1 min-h-[300px]">
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
