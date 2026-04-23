import { useState } from 'react';
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
    <div className="flex w-full flex-col items-center gap-8 pb-8 animate-in fade-in duration-500">
      {error && (
        <div className="mx-auto w-full max-w-7xl rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-700">
          Warning: {error}
        </div>
      )}

      <RiskForm onSubmit={handleSubmit} isLoading={isLoading} />

      {isLoading && (
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center space-y-4 p-12">
          <div className="h-12 w-12 rounded-full border-4 border-stone-300 border-t-emerald-500 animate-spin" />
          <p className="font-medium text-stone-600 animate-pulse">Running advanced machine learning inferences...</p>
        </div>
      )}

      {!isLoading && prediction && explanation && <RiskResults prediction={prediction} explanation={explanation} />}
    </div>
  );
}
