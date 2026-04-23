import { useState, useEffect } from 'react';
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
    if (!decision) return 'text-stone-700 bg-stone-100 border-stone-200';
    if (decision === 'Approved') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (decision === 'Declined' || decision === 'Rejected') return 'text-red-700 bg-red-50 border-red-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  return (
    <div className="flex w-full justify-center pb-8 animate-in fade-in duration-500">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="rounded-2xl border border-stone-200 bg-stone-50/95 p-8 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-stone-900">System Audit Logs</h2>
              <p className="mt-2 text-sm text-stone-600">
                Decentralized snapshot tracking of the last 50 predictive assessments hitting the core decision engine.
              </p>
            </div>
            {isLoading && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 font-medium text-emerald-700 shadow-inner">
                <div className="h-4 w-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                Syncing Network...
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-700 shadow-inner">
              Warning: {error}
            </div>
          )}

          <div className="relative overflow-x-auto rounded-xl border border-stone-200 shadow-lg">
            <table className="w-full whitespace-nowrap border-collapse text-left">
              <thead className="sticky top-0 z-10 w-full">
                <tr className="border-b border-stone-200 bg-stone-100 uppercase text-[10px] tracking-widest text-stone-500">
                  <th className="p-5 font-bold">Timestamp</th>
                  <th className="p-5 font-bold">Mode</th>
                  <th className="p-5 font-bold">Tier</th>
                  <th className="p-5 font-bold">Score</th>
                  <th className="p-5 font-bold">PD %</th>
                  <th className="p-5 font-bold">Income Level</th>
                  <th className="p-5 text-center font-bold">Issues</th>
                  <th className="p-5 text-right font-bold">Decision Engine</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-200 text-sm">
                {!isLoading && logs.length === 0 && !error && (
                  <tr>
                    <td colSpan={8} className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3 opacity-70">
                        <span className="text-stone-500 font-semibold tracking-wide">
                          No predictive logs found in the core database.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

                {logs.map((log, i) => (
                  <tr key={i} className="group transition-colors hover:bg-stone-100/80">
                    <td className="p-5 font-mono text-xs text-stone-600">{log.timestamp}</td>
                    <td className="p-5">
                      <span className="rounded bg-stone-100 px-2 py-1 text-xs uppercase tracking-wider text-stone-700">
                        {log.mode}
                      </span>
                    </td>
                    <td className="p-5 font-bold text-stone-900">{log.risk_tier}</td>
                    <td className="p-5 font-mono text-lg font-black text-stone-800">{log.credit_score}</td>
                    <td className="p-5 font-mono font-medium text-stone-600">
                      {log.pd_probability !== undefined && log.pd_probability !== null ? (log.pd_probability * 100).toFixed(2) + '%' : '-'}
                    </td>
                    <td className="p-5 text-stone-600">{log.income_tier ? `Tier ${log.income_tier}` : '-'}</td>
                    <td className="p-5 text-center">
                      {log.issues_count > 0 ? (
                        <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 font-mono text-xs font-black text-amber-700">
                          {log.issues_count}
                        </span>
                      ) : (
                        <span className="text-stone-400">-</span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <span className={`rounded-xl border px-4 py-2 text-xs font-bold tracking-wide shadow-sm transition-colors ${formatDecisionColor(log.decision)}`}>
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
