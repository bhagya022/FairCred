import React, { useState } from 'react';
import { RiskForm } from './RiskForm';
import { RiskResults } from './RiskResults';

export function Risk() {
  const [prediction, setPrediction] = useState<any>(null);
  const [explanation, setExplanation] = useState<any>(null);

  const handleResults = (pred: any, expl: any) => {
    setPrediction(pred);
    setExplanation(expl);
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 pb-8">
      <RiskForm onResults={handleResults} />
      <RiskResults prediction={prediction} explanation={explanation} />
    </div>
  );
}
