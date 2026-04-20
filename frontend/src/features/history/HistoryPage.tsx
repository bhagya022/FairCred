import React, { useState, useEffect } from 'react';
import { historyService } from './historyService';

export function HistoryPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const data = await historyService.getLogs(50);
        if (isMounted) setLogs(data);
      } catch (err: any) {
        if (isMounted) setError(err?.message || 'Failed to sync backend logs. Check connection.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchLogs();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDecisionColor = (decision: string) => {
    if (!decision) return 'text-slate-400 bg-slate-800 border-slate-700';
    if (decision === 'Approved') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (decision === 'Declined' || decision === 'Rejected') return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className="w-full flex justify-center pb-8 animate-in fade-in duration-500">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-200 tracking-tight">System Audit Logs</h2>
              <p className="text-sm text-slate-400 mt-2">
                Decentralized snapshot tracking of the last 50 predictive assessments hitting the core decision engine.
              </p>
            </div>
            {isLoading && (
              <div className="flex items-center gap-3 text-emerald-400 font-medium px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shadow-inner">
                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                Syncing Network...
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 shadow-inner font-medium">
              ⚠️ {error}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-800 shadow-2xl relative">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 z-10 w-full">
                <tr className="bg-slate-950 uppercase text-[10px] tracking-widest text-slate-500 border-b border-slate-800">
                  <th className="p-5 font-bold">Timestamp</th>
                  <th className="p-5 font-bold">Mode</th>
                  <th className="p-5 font-bold">Tier</th>
                  <th className="p-5 font-bold">Score</th>
                  <th className="p-5 font-bold">PD %</th>
                  <th className="p-5 font-bold">Income Level</th>
                  <th className="p-5 font-bold text-center">Issues</th>
                  <th className="p-5 font-bold text-right">Decision Engine</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {!isLoading && logs.length === 0 && !error && (
                  <tr>
                    <td colSpan={8} className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3 opacity-60">
                        <span className="text-5xl">📭</span>
                        <span className="text-slate-400 font-semibold tracking-wide">No predictive logs found in the core database.</span>
                      </div>
                    </td>
                  </tr>
                )}
                
                {logs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors group">
                     {/* Using proper React Maps instead of InnerHTML */}
                    <td className="p-5 text-slate-400 font-mono text-xs">{log.timestamp}</td>
                    <td className="p-5">
                      <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs tracking-wider uppercase">
                         {log.mode}
                      </span>
                    </td>
                    <td className="p-5 text-slate-200 font-bold">{log.risk_tier}</td>
                    <td className="p-5 font-mono text-lg font-black text-slate-300">{log.credit_score}</td>
                    <td className="p-5 font-mono font-medium text-slate-400">
                      {log.pd_probability !== undefined && log.pd_probability !== null ? (log.pd_probability * 100).toFixed(2) + '%' : '-'}
                    </td>
                    <td className="p-5 text-slate-400">{log.income_tier ? `Tier ${log.income_tier}` : '-'}</td>
                    <td className="p-5 text-center">
                      {log.issues_count > 0 ? (
                        <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-lg text-xs font-black font-mono shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                          {log.issues_count}
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors shadow-sm tracking-wide ${formatDecisionColor(log.decision)}`}>
                        {log.decision || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
