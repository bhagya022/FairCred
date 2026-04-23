interface RiskResultsProps {
  prediction: any;
  explanation: any;
}

function formatFeatureName(feature: string) {
  return feature
    .replace(/_encoded$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function RiskResults({ prediction, explanation }: RiskResultsProps) {
  if (!prediction) return null;

  const { decision, pd_probability, credit_score, risk_tier, issues } = prediction;
  const decisionStatus = String(decision.decision).toUpperCase();
  const decisionColorClass =
    decisionStatus === 'APPROVED'
      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
      : decisionStatus === 'DECLINED' || decisionStatus === 'REJECTED'
        ? 'bg-red-500/10 border-red-500/30 text-red-400'
        : 'bg-amber-500/10 border-amber-500/30 text-amber-400';

  const decisionMarker =
    decisionStatus === 'APPROVED'
      ? 'OK'
      : decisionStatus === 'DECLINED' || decisionStatus === 'REJECTED'
        ? 'NO'
        : 'RV';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className={`p-8 rounded-2xl border ${decisionColorClass} shadow-xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between transition-colors`}>
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-4">
            <span className="rounded-xl border border-current/20 bg-current/10 px-3 py-2 text-xl drop-shadow-md">
              {decisionMarker}
            </span>
            {decision.decision}
          </h2>
          <p className="mt-3 opacity-90 font-medium tracking-wide">{decision.reason}</p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-6xl font-black">{credit_score}</div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-80 mt-2">Credit Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col justify-center rounded-2xl border border-stone-200 bg-stone-50/95 p-6 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
          <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-500">Risk Profile Matrix</h3>

          <div className="mb-8 flex items-center gap-5 rounded-xl border border-stone-200 bg-stone-100 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-sm font-black text-stone-800 drop-shadow-md">
              {risk_tier.tier.includes('Low') ? 'LOW' : risk_tier.tier.includes('Medium') ? 'MED' : 'HIGH'}
            </div>
            <div>
              <div className="text-2xl font-black text-stone-900">{risk_tier.tier}</div>
              <div className="mt-1 text-sm font-medium text-stone-600">{risk_tier.description}</div>
            </div>
          </div>

          <div className="space-y-3 px-1">
            <div className="flex justify-between items-end">
              <span className="text-sm font-semibold text-stone-600">Probability of Default</span>
              <span className="text-xl font-black text-stone-900">{(pd_probability * 100).toFixed(2)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(pd_probability * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex h-72 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/95 p-6 shadow-[0_20px_60px_rgba(120,53,15,0.08)] lg:col-span-2">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">Underwriting Flags</h3>
          {issues && issues.length > 0 ? (
            <div className="flex-1 space-y-3 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-stone-300">
              {issues.map((issue: any, idx: number) => (
                <div key={idx} className="flex gap-4 rounded-xl border border-stone-200 bg-stone-100 p-4 transition-hover hover:border-stone-300 hover:bg-stone-200/60">
                  <div className={`mt-1 rounded-full w-2.5 h-2.5 shrink-0 ${String(issue.severity).toUpperCase() === 'HIGH' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`} />
                  <div>
                    <p className="text-sm font-bold text-stone-800">{issue.rule}</p>
                    <p className="mt-1 text-xs leading-relaxed text-stone-500">{issue.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-emerald-500/50 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
              <span className="mb-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm font-black text-emerald-400">
                CLEAR
              </span>
              <p className="text-sm font-semibold tracking-wide text-emerald-500/70">No critical eligibility issues detected.</p>
            </div>
          )}
        </div>
      </div>

      {explanation && explanation.explanations && (
        <div className="w-full rounded-2xl border border-stone-200 bg-stone-50/95 p-6 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
          <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-500">Algorithmic Key Drivers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {explanation.explanations.slice(0, 9).map((shap: any, idx: number) => {
              const isPositive = shap.shap_value > 0;
              const barWidth = Math.min(Math.abs(shap.shap_value) * 100, 50);

              return (
                <div key={idx} className="flex flex-col rounded-xl border border-stone-200 bg-stone-100 p-5">
                  <span className="mb-1.5 truncate text-xs font-semibold uppercase tracking-wide text-stone-600" title={shap.feature}>
                    {formatFeatureName(shap.feature)}
                  </span>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded bg-stone-200 px-2 py-0.5 font-mono text-sm font-medium text-stone-800">{String(shap.value)}</span>
                    <span className={`font-mono font-bold text-sm ${isPositive ? 'text-red-400' : 'text-emerald-400'}`}>
                      {isPositive ? '+' : ''}{shap.shap_value.toFixed(4)}
                    </span>
                  </div>

                  <div className="relative flex h-1.5 w-full items-center overflow-hidden rounded-full bg-stone-200 shadow-inner">
                    <div className="absolute left-1/2 z-10 -ml-px h-full w-[2px] bg-stone-400" />
                    {isPositive ? (
                      <div className="absolute left-1/2 bg-gradient-to-r from-red-500/50 to-red-500 h-full rounded-r-full" style={{ width: `${barWidth}%` }} />
                    ) : (
                      <div className="absolute right-1/2 bg-gradient-to-l from-emerald-500/50 to-emerald-500 h-full rounded-l-full" style={{ width: `${barWidth}%` }} />
                    )}
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    <span>Lower risk</span>
                    <span>Higher risk</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
