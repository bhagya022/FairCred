import React, { useState } from 'react';

export function RiskForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) {
  const [formData, setFormData] = useState({
    income_tier: 3,
    employment_type: 'Salaried',
    employment_tenure_months: 24,
    education_level: 3,
    residence_stability_years: 2,
    dependents_count: 0,
    upi_txn_frequency: 15,
    avg_payment_delay_days: 0.0,
    bill_payment_consistency: 0.8,
    spending_volatility_cv: 0.5,
    savings_ratio: 0.2,
    utility_auto_payment_flag: 1,
    bounce_rate_txn: 0.0,
    wallet_min_balance: 1000,
    merchant_diversity_score: 50,
    app_usage_regularity_days: 15,
    device_stability_score: 0.9,
    ecommerce_txn_frequency: 5,
    recharge_regularity: 0.8,
    social_media_linked_flag: 1,
    kyc_completion_score: 1.0,
    loan_inquiry_count_6m: 0,
    existing_loan_flag: 0,
    insurance_ownership_flag: 0,
    account_age_months: 12
  });

  const schemaDefinition = [
    { name: 'income_tier', label: 'Income Tier (1-5)', type: 'number', min: 1, max: 5 },
    { name: 'employment_type', label: 'Employment Type', type: 'select', options: ['Gig_Worker', 'Salaried', 'Self_Employed', 'Student', 'Unemployed'] },
    { name: 'employment_tenure_months', label: 'Tenure (Months)', type: 'number', min: 0 },
    { name: 'education_level', label: 'Education Level (1-5)', type: 'number', min: 1, max: 5 },
    { name: 'residence_stability_years', label: 'Residence Stability (Yrs)', type: 'number', min: 0 },
    { name: 'dependents_count', label: 'Dependents', type: 'number', min: 0 },
    { name: 'upi_txn_frequency', label: 'UPI Frequency', type: 'number', min: 0 },
    { name: 'avg_payment_delay_days', label: 'Avg Delay (Days)', type: 'number', step: '0.1', min: 0 },
    { name: 'bill_payment_consistency', label: 'Bill Consistency (0-1)', type: 'number', step: '0.01', min: 0, max: 1 },
    { name: 'spending_volatility_cv', label: 'Spending Volatility', type: 'number', step: '0.01', min: 0 },
    { name: 'savings_ratio', label: 'Savings Ratio (0-1)', type: 'number', step: '0.01', min: 0, max: 1 },
    { name: 'utility_auto_payment_flag', label: 'Auto Pay Utility', type: 'select', options: [0, 1] },
    { name: 'bounce_rate_txn', label: 'Bounce Rate (0-1)', type: 'number', step: '0.01', min: 0, max: 1 },
    { name: 'wallet_min_balance', label: 'Wallet Min Balance', type: 'number', min: 0 },
    { name: 'merchant_diversity_score', label: 'Merchant Diversity', type: 'number', min: 1, max: 100 },
    { name: 'app_usage_regularity_days', label: 'App Usage (Days/Mo)', type: 'number', min: 0, max: 365 },
    { name: 'device_stability_score', label: 'Device Stability (0-1)', type: 'number', step: '0.01', min: 0, max: 1 },
    { name: 'ecommerce_txn_frequency', label: 'Ecomm Frequency', type: 'number', min: 0 },
    { name: 'recharge_regularity', label: 'Recharge Regularity (0-1)', type: 'number', step: '0.01', min: 0, max: 1 },
    { name: 'social_media_linked_flag', label: 'Social Media Linked', type: 'select', options: [0, 1] },
    { name: 'kyc_completion_score', label: 'KYC Score (0-1)', type: 'number', step: '0.01', min: 0, max: 1 },
    { name: 'loan_inquiry_count_6m', label: 'Loan Inquiries 6M', type: 'number', min: 0 },
    { name: 'existing_loan_flag', label: 'Existing Loan', type: 'select', options: [0, 1] },
    { name: 'insurance_ownership_flag', label: 'Insurance Ownership', type: 'select', options: [0, 1] },
    { name: 'account_age_months', label: 'Account Age (Months)', type: 'number', min: 0 }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    
    if (type === 'number') {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = 0;
    } else if (name.endsWith('_flag')) {
      parsedValue = parseInt(value, 10);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl w-full max-w-7xl mx-auto">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-slate-200">Submit Risk Profile</h3>
        <p className="text-sm text-slate-400 mt-1">Configure ML attributes to simulate behavior-driven credit profiling.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 h-[55vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-700">
        {schemaDefinition.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 truncate" title={field.label}>
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={String(formData[field.name as keyof typeof formData])}
                onChange={handleChange}
                disabled={isLoading}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none shadow-inner disabled:opacity-50"
                required
              >
                {field.options?.map(opt => (
                  <option key={String(opt)} value={String(opt)}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                step={field.step || '1'}
                min={field.min}
                max={field.max}
                disabled={isLoading}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors shadow-inner font-mono text-sm disabled:opacity-50"
                required
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold rounded-lg shadow-lg active:scale-95 transition-all disabled:opacity-50 tracking-wide flex items-center justify-center min-w-[240px]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
               <span>Executing Engine...</span>
            </div>
          ) : 'Calculate Machine Learning Output'}
        </button>
      </div>
    </form>
  );
}
