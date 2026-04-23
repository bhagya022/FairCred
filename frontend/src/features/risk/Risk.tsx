import { useState } from 'react';
import { RiskForm } from './RiskForm';
import { RiskResults } from './RiskResults';
import { riskService } from './riskService';

export function Risk() {
  const [prediction, setPrediction] = useState<any>(null);
  const [explanation, setExplanation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const pred = await riskService.predict(formData);
      const expl = await riskService.explain(formData);
      setPrediction(pred);
      setExplanation(expl);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 pb-8">
      <RiskForm onSubmit={handleSubmit} isLoading={isLoading} />
      <RiskResults prediction={prediction} explanation={explanation} />
    </div>
  );
}
