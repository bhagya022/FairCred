import React, { useState } from 'react';
import { RiskForm } from './RiskForm';
import { RiskResults } from './RiskResults';
import { riskService } from './riskService';

export function RiskPage() {
  const [prediction, setPrediction] = useState<any>(null);
  const [explanation, setExplanation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setExplanation(null);
    
    try {
      const predResponse = await riskService.predict(formData);
      const explResponse = await riskService.explain(formData);
      
      setPrediction(predResponse);
      setExplanation(explResponse);
    } catch (err: any) {
      console.error('API Error:', err);
      const message = err.response?.data?.detail || 'An error occurred while evaluating the risk profile. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 pb-8 animate-in fade-in duration-500">
      
      {/* Dynamic Error Messaging strictly governed by state */}
      {error && (
        <div className="w-full max-w-7xl mx-auto p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Presentation layer decouples state processing from DOM rendering */}
      <RiskForm onSubmit={handleSubmit} isLoading={isLoading} />
      
      {isLoading && (
        <div className="w-full max-w-7xl mx-auto p-12 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Running advanced machine learning inferences...</p>
        </div>
      )}

      {/* Conditionally drops in upon resolution without DOM manipulation */}
      {!isLoading && prediction && explanation && (
        <RiskResults prediction={prediction} explanation={explanation} />
      )}
    </div>
  );
}
