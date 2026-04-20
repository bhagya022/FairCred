import React from 'react';

interface RiskResultsProps {
  prediction: any;
  explanation: any;
}

export function RiskResults({ prediction, explanation }: RiskResultsProps) {
  if (!prediction) return null;

  const { decision, pd_probability, credit_score, risk_tier, issues } = prediction;
  
  // Decide contextual display coloring
  const decisionColorClass = decision.decision === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
      : decision.decision === 'Declined' || decision.decision === 'Rejected' ? 'bg-red-500/10 border-red-500/30 text-red-400' 
      : 'bg-amber-500/10 border-amber-500/30 text-amber-400';

  const getDecisionEmoji = (status: string) => {
    if (status === 'Approved') return '✅';
    if (status === 'Declined' || status === 'Rejected') return '❌';
    return '⚠️';
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      {/* 1. Decision Banner */}
      <div className={`p-8 rounded-2xl border ${decisionColorClass} shadow-xl flex items-center justify-between transition-colors`}>
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-4">
            <span className="text-5xl drop-shadow-md">{getDecisionEmoji(decision.decision)}</span>
            {decision.decision}
          </h2>
          <p className="mt-3 opacity-90 font-medium tracking-wide">{decision.reason}</p>
        </div>
        <div className="text-right">
          <div className="text-6xl font-black">{credit_score}</div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-80 mt-2">Credit Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Risk Tier & PD Block */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-center">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Risk Profile Matrix</h3>
          
          <div className="flex items-center gap-5 mb-8 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-5xl drop-shadow-md">
               {risk_tier.tier.includes('Low') ? '🛡️' : risk_tier.tier.includes('Medium') ? '⚖️' : '🔥'}
            </div>
            <div>
              <div className="text-2xl font-black text-slate-200">{risk_tier.tier}</div>
              <div className="text-sm text-slate-400 mt-1 font-medium">{risk_tier.description}</div>
            </div>
          </div>

          <div className="space-y-3 px-1">
            <div className="flex justify-between items-end">
              <span className="text-sm font-semibold text-slate-400">Probability of Default (PD)</span>
              <span className="text-xl font-black text-slate-200">{(pd_probability * 100).toFixed(2)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-1000 ease-out" 
                style={{ width: `${Math.min(pd_probability * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 3. Eligibility Issues */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl lg:col-span-2 overflow-hidden flex flex-col h-72">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Underwriting Flags</h3>
          {issues && issues.length > 0 ? (
             <div className="flex-1 overflow-y-auto space-y-3 pr-4 scrollbar-thin scrollbar-thumb-slate-700">
               {issues.map((issue: any, idx: number) => (
                 <div key={idx} className="flex gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800/80 transition-hover hover:border-slate-700 hover:bg-slate-800/50">
                   <div className={`mt-1 rounded-full w-2.5 h-2.5 shrink-0 ${issue.severity === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`}></div>
                   <div>
                     <p className="text-sm font-bold text-slate-300">{issue.rule}</p>
                     <p className="text-xs text-slate-500 mt-1 leading-relaxed">{issue.detail}</p>
                   </div>
                 </div>
               ))}
             </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-emerald-500/50 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
               <span className="text-4xl mb-3">✅</span>
               <p className="text-sm font-semibold tracking-wide text-emerald-500/70">No critical eligibility issues detected.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. SHAP Explanations (Automated Interpretability) */}
      {explanation && explanation.explanations && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl w-full">
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Algorithmic Key Drivers (SHAP Integration)</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
             {explanation.explanations.slice(0, 9).map((shap: any, idx: number) => {
               const isPositive = shap.shap_value > 0;
               // Enhance scaling effect for visual bar clarity
               const barWidth = Math.min(Math.abs(shap.shap_value) * 100, 50);

               return (
                 <div key={idx} className="flex flex-col p-5 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-xs font-semibold text-slate-400 mb-1.5 truncate uppercase tracking-wide" title={shap.feature}>{shap.feature}</span>
                    <div className="flex items-center justify-between mb-3">
                       <span className="font-mono text-sm font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded">{shap.value}</span>
                       <span className={`font-mono font-bold text-sm ${isPositive ? 'text-red-400' : 'text-emerald-400'}`}>
                         {isPositive ? '+' : ''}{shap.shap_value.toFixed(4)}
                       </span>
                    </div>
                    
                    {/* SHAP Diverging Bar Chart Logic */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex items-center relative shadow-inner">
                       <div className="absolute w-[2px] h-full bg-slate-600 left-1/2 z-10 -ml-px"></div>
                       {isPositive ? (
                           <div className="absolute left-1/2 bg-gradient-to-r from-red-500/50 to-red-500 h-full rounded-r-full" style={{ width: `${barWidth}%` }}></div>
                       ) : (
                           <div className="absolute right-1/2 bg-gradient-to-l from-emerald-500/50 to-emerald-500 h-full rounded-l-full" style={{ width: `${barWidth}%` }}></div>
                       )}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-1.5">
                       <span>Decreasing Risk</span>
                       <span>Increasing Risk</span>
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
