import { type FormEvent, type ReactNode, useMemo, useState } from 'react';

type EmploymentType = 'Gig_Worker' | 'Salaried' | 'Self_Employed' | 'Student' | 'Unemployed';
type IncomeBand = 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
type EducationBand = 'school' | 'diploma' | 'graduate' | 'postgraduate' | 'professional';
type TenureBand = 'new' | 'short' | 'steady' | 'long' | 'veteran';
type ResidenceBand = 'new' | 'settled' | 'rooted' | 'long_term';
type DependentsBand = 'none' | 'one' | 'two' | 'three' | 'four_plus';
type PaymentDelayBand = 'on_time' | 'minor' | 'moderate' | 'late' | 'severe';
type ReliabilityBand = 'excellent' | 'good' | 'mixed' | 'poor';
type VolatilityBand = 'stable' | 'variable' | 'volatile' | 'highly_volatile';
type SavingsBand = 'none' | 'low' | 'healthy' | 'strong';
type BounceBand = 'none' | 'rare' | 'some' | 'frequent';
type BalanceBand = 'thin' | 'basic' | 'comfortable' | 'strong';
type ActivityBand = 'light' | 'regular' | 'active';
type KycBand = 'complete' | 'partial' | 'basic';
type InquiryBand = 'none' | 'few' | 'several' | 'many';
type AccountAgeBand = 'new' | 'developing' | 'established' | 'mature';

type FriendlyProfile = {
  income_band: IncomeBand;
  employment_type: EmploymentType;
  tenure_band: TenureBand;
  education_band: EducationBand;
  residence_band: ResidenceBand;
  dependents_band: DependentsBand;
  payment_delay_band: PaymentDelayBand;
  reliability_band: ReliabilityBand;
  volatility_band: VolatilityBand;
  savings_band: SavingsBand;
  autopay_enabled: boolean;
  bounce_band: BounceBand;
  balance_band: BalanceBand;
  merchant_activity: ActivityBand;
  app_activity: ActivityBand;
  device_consistency: ActivityBand;
  ecommerce_activity: ActivityBand;
  recharge_reliability: ReliabilityBand;
  social_linked: boolean;
  kyc_band: KycBand;
  inquiry_band: InquiryBand;
  has_existing_loan: boolean;
  has_insurance: boolean;
  account_age_band: AccountAgeBand;
};

type BackendPayload = {
  income_tier: number;
  employment_type: EmploymentType;
  employment_tenure_months: number;
  education_level: number;
  residence_stability_years: number;
  dependents_count: number;
  upi_txn_frequency: number;
  avg_payment_delay_days: number;
  bill_payment_consistency: number;
  spending_volatility_cv: number;
  savings_ratio: number;
  utility_auto_payment_flag: number;
  bounce_rate_txn: number;
  wallet_min_balance: number;
  merchant_diversity_score: number;
  app_usage_regularity_days: number;
  device_stability_score: number;
  ecommerce_txn_frequency: number;
  recharge_regularity: number;
  social_media_linked_flag: number;
  kyc_completion_score: number;
  loan_inquiry_count_6m: number;
  existing_loan_flag: number;
  insurance_ownership_flag: number;
  account_age_months: number;
};

type StepDefinition = {
  kicker: string;
  title: string;
  description: string;
};

const defaultProfile: FriendlyProfile = {
  income_band: 'moderate',
  employment_type: 'Salaried',
  tenure_band: 'steady',
  education_band: 'graduate',
  residence_band: 'settled',
  dependents_band: 'none',
  payment_delay_band: 'minor',
  reliability_band: 'good',
  volatility_band: 'variable',
  savings_band: 'healthy',
  autopay_enabled: true,
  bounce_band: 'none',
  balance_band: 'basic',
  merchant_activity: 'regular',
  app_activity: 'regular',
  device_consistency: 'regular',
  ecommerce_activity: 'regular',
  recharge_reliability: 'good',
  social_linked: true,
  kyc_band: 'complete',
  inquiry_band: 'none',
  has_existing_loan: false,
  has_insurance: false,
  account_age_band: 'established',
};

const maps = {
  income: { very_low: 1, low: 2, moderate: 3, high: 4, very_high: 5 },
  education: { school: 1, diploma: 2, graduate: 3, postgraduate: 4, professional: 5 },
  tenure: { new: 3, short: 12, steady: 36, long: 84, veteran: 144 },
  residence: { new: 1, settled: 4, rooted: 10, long_term: 20 },
  dependents: { none: 0, one: 1, two: 2, three: 3, four_plus: 5 },
  paymentDelay: { on_time: 0, minor: 5, moderate: 18, late: 40, severe: 70 },
  reliability: { excellent: 0.95, good: 0.78, mixed: 0.48, poor: 0.22 },
  volatility: { stable: 0.35, variable: 0.85, volatile: 1.65, highly_volatile: 2.8 },
  savings: { none: 0.02, low: 0.08, healthy: 0.2, strong: 0.38 },
  bounce: { none: 0, rare: 0.08, some: 0.25, frequent: 0.58 },
  balance: { thin: 500, basic: 2500, comfortable: 8500, strong: 20000 },
  activity: {
    light: { upi: 12, ecommerce: 2, merchants: 14, appDays: 120 },
    regular: { upi: 45, ecommerce: 8, merchants: 34, appDays: 245 },
    active: { upi: 95, ecommerce: 18, merchants: 62, appDays: 330 },
  },
  device: { light: 0.5, regular: 0.78, active: 0.94 },
  recharge: { excellent: 0.95, good: 0.82, mixed: 0.55, poor: 0.25 },
  kyc: { complete: 1, partial: 0.75, basic: 0.5 },
  inquiries: { none: 0, few: 2, several: 5, many: 10 },
  accountAge: { new: 6, developing: 18, established: 48, mature: 120 },
} as const;

const steps: StepDefinition[] = [
  {
    kicker: 'Step 1',
    title: 'Borrower Snapshot',
    description: 'Capture the applicant at a high level using a few broad identity and stability signals.',
  },
  {
    kicker: 'Step 2',
    title: 'Money Behaviour',
    description: 'Describe repayment rhythm and day-to-day financial discipline without asking for raw numbers.',
  },
  {
    kicker: 'Step 3',
    title: 'Digital Confidence',
    description: 'Use digital behaviour, KYC, and engagement signals as alternative-credit proxies.',
  },
  {
    kicker: 'Step 4',
    title: 'Obligations & History',
    description: 'Confirm existing liabilities, inquiry behaviour, and history before scoring.',
  },
];

const summaryLabels = {
  income_band: {
    very_low: 'Income up to Rs 10k',
    low: 'Income Rs 10k - 25k',
    moderate: 'Income Rs 25k - 50k',
    high: 'Income Rs 50k - 100k',
    very_high: 'Income above Rs 100k',
  },
  employment_type: {
    Salaried: 'Salaried',
    Self_Employed: 'Self-employed',
    Gig_Worker: 'Gig worker',
    Student: 'Student',
    Unemployed: 'Unemployed',
  },
  tenure_band: {
    new: 'Work stability under 6 months',
    short: 'Work stability 6-18 months',
    steady: 'Work stability 2-4 years',
    long: 'Work stability 5-8 years',
    veteran: 'Work stability 8+ years',
  },
  payment_delay_band: {
    on_time: 'Bills usually on time',
    minor: 'Minor bill delays',
    moderate: 'Moderate bill delays',
    late: 'Often late on bills',
    severe: 'Severely delayed bills',
  },
  kyc_band: {
    complete: 'Full KYC complete',
    partial: 'Partial KYC',
    basic: 'Basic KYC only',
  },
  inquiry_band: {
    none: 'No recent loan inquiries',
    few: '1-2 recent inquiries',
    several: '3-5 recent inquiries',
    many: 'Many recent inquiries',
  },
} as const;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function deriveBackendPayload(profile: FriendlyProfile): BackendPayload {
  const incomeTier = maps.income[profile.income_band];
  const merchant = maps.activity[profile.merchant_activity];
  const app = maps.activity[profile.app_activity];
  const ecommerce = maps.activity[profile.ecommerce_activity];

  return {
    income_tier: incomeTier,
    employment_type: profile.employment_type,
    employment_tenure_months: maps.tenure[profile.tenure_band],
    education_level: maps.education[profile.education_band],
    residence_stability_years: maps.residence[profile.residence_band],
    dependents_count: maps.dependents[profile.dependents_band],
    upi_txn_frequency: clamp(Math.round(merchant.upi * (0.8 + incomeTier * 0.08)), 0, 500),
    avg_payment_delay_days: maps.paymentDelay[profile.payment_delay_band],
    bill_payment_consistency: maps.reliability[profile.reliability_band],
    spending_volatility_cv: maps.volatility[profile.volatility_band],
    savings_ratio: maps.savings[profile.savings_band],
    utility_auto_payment_flag: profile.autopay_enabled ? 1 : 0,
    bounce_rate_txn: maps.bounce[profile.bounce_band],
    wallet_min_balance: maps.balance[profile.balance_band],
    merchant_diversity_score: clamp(Math.round(merchant.merchants + incomeTier * 3), 1, 100),
    app_usage_regularity_days: app.appDays,
    device_stability_score: maps.device[profile.device_consistency],
    ecommerce_txn_frequency: clamp(Math.round(ecommerce.ecommerce * incomeTier), 0, 100),
    recharge_regularity: maps.recharge[profile.recharge_reliability],
    social_media_linked_flag: profile.social_linked ? 1 : 0,
    kyc_completion_score: maps.kyc[profile.kyc_band],
    loan_inquiry_count_6m: maps.inquiries[profile.inquiry_band],
    existing_loan_flag: profile.has_existing_loan ? 1 : 0,
    insurance_ownership_flag: profile.has_insurance ? 1 : 0,
    account_age_months: maps.accountAge[profile.account_age_band],
  };
}

function CompactChoiceGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string; hint?: string }>;
}) {
  return (
    <div className="space-y-3">
      <div className="text-[11px] font-black uppercase tracking-[0.24em] text-stone-600">{label}</div>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`min-w-[150px] rounded-[22px] border-2 px-4 py-3 text-left transition-all ${
                isActive
                  ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-[0_0_0_1px_rgba(217,119,6,0.14)]'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              <span className="block text-sm font-bold">{option.label}</span>
              {option.hint && <span className="mt-1 block text-xs text-stone-500">{option.hint}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BooleanChoice({
  label,
  value,
  onChange,
  trueLabel,
  falseLabel,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  trueLabel: string;
  falseLabel: string;
}) {
  return (
    <div className="space-y-3">
      <div className="text-[11px] font-black uppercase tracking-[0.24em] text-stone-600">{label}</div>
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label: trueLabel, value: true },
          { label: falseLabel, value: false },
        ].map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-[22px] border-2 px-4 py-3 text-sm font-bold transition-all ${
                isActive
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BuilderSection({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[32px] border-2 border-stone-300 bg-stone-50/95 p-6 shadow-[0_20px_60px_rgba(120,53,15,0.08)] lg:p-8">
      <div className="mb-6 border-b border-stone-200 pb-5">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-700">{kicker}</p>
        <h4 className="mt-2 text-2xl font-black tracking-tight text-stone-900">{title}</h4>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export function RiskForm({ onSubmit, isLoading }: { onSubmit: (data: BackendPayload) => void; isLoading: boolean }) {
  const [profile, setProfile] = useState<FriendlyProfile>(defaultProfile);
  const [activeStep, setActiveStep] = useState(0);
  const payload = useMemo(() => deriveBackendPayload(profile), [profile]);

  const update = <Key extends keyof FriendlyProfile>(key: Key, value: FriendlyProfile[Key]) => {
    setProfile((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(payload);
  };

  const nextStep = () => setActiveStep((previous) => Math.min(previous + 1, steps.length - 1));
  const previousStep = () => setActiveStep((previous) => Math.max(previous - 1, 0));

  const topSummary = [
    summaryLabels.income_band[profile.income_band],
    summaryLabels.employment_type[profile.employment_type],
    summaryLabels.tenure_band[profile.tenure_band],
    summaryLabels.payment_delay_band[profile.payment_delay_band],
    summaryLabels.kyc_band[profile.kyc_band],
    summaryLabels.inquiry_band[profile.inquiry_band],
  ];

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-7xl space-y-6">
      <div className="rounded-[32px] border-2 border-stone-300 bg-gradient-to-br from-stone-50 via-stone-50 to-amber-50 p-6 shadow-[0_24px_70px_rgba(120,53,15,0.08)] lg:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-amber-700">Alternative Credit Intake</p>
            <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900 lg:text-4xl">Guided Borrower Profile Builder</h3>
            <p className="mt-3 text-sm leading-6 text-stone-600">Complete the borrower details below to generate a risk score.</p>
          </div>

          <div className="rounded-[24px] border-2 border-amber-300 bg-white/80 p-4 text-sm text-stone-700 shadow-sm">
            <div className="text-[11px] font-black uppercase tracking-[0.24em] text-amber-700">Progress</div>
            <div className="mt-2 font-bold text-stone-900">
              {activeStep + 1} of {steps.length} sections
            </div>
            <div className="mt-3 h-2 w-56 max-w-full overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-700 to-orange-500 transition-all"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isPast = index < activeStep;
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`rounded-[24px] border-2 p-4 text-left transition-all ${
                    isActive
                      ? 'border-amber-400 bg-amber-50 text-amber-900'
                      : isPast
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : 'border-stone-300 bg-stone-50/90 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <div className="text-[11px] font-black uppercase tracking-[0.24em]">{`0${index + 1}`}</div>
                  <div className="mt-2 text-sm font-bold">{step.title}</div>
                </button>
              );
            })}
          </div>

          {activeStep === 0 && (
            <BuilderSection {...steps[0]}>
              <CompactChoiceGroup
                label="Approximate monthly income band"
                value={profile.income_band}
                onChange={(value) => update('income_band', value)}
                options={[
                  { value: 'very_low', label: 'Up to Rs 10k' },
                  { value: 'low', label: 'Rs 10k - 25k' },
                  { value: 'moderate', label: 'Rs 25k - 50k' },
                  { value: 'high', label: 'Rs 50k - 100k' },
                  { value: 'very_high', label: 'Rs 100k+' },
                ]}
              />
              <CompactChoiceGroup
                label="Employment pattern"
                value={profile.employment_type}
                onChange={(value) => update('employment_type', value)}
                options={[
                  { value: 'Salaried', label: 'Salaried', hint: 'Predictable monthly income' },
                  { value: 'Self_Employed', label: 'Self-employed', hint: 'Business or professional income' },
                  { value: 'Gig_Worker', label: 'Gig worker', hint: 'Platform or task-based income' },
                  { value: 'Student', label: 'Student', hint: 'Limited or supported income' },
                  { value: 'Unemployed', label: 'Unemployed', hint: 'No regular employment income' },
                ]}
              />
              <div className="grid gap-6 lg:grid-cols-2">
                <CompactChoiceGroup
                  label="How long has this work pattern been stable?"
                  value={profile.tenure_band}
                  onChange={(value) => update('tenure_band', value)}
                  options={[
                    { value: 'new', label: 'Less than 6 months' },
                    { value: 'short', label: '6-18 months' },
                    { value: 'steady', label: '2-4 years' },
                    { value: 'long', label: '5-8 years' },
                    { value: 'veteran', label: '8+ years' },
                  ]}
                />
                <CompactChoiceGroup
                  label="Education level"
                  value={profile.education_band}
                  onChange={(value) => update('education_band', value)}
                  options={[
                    { value: 'school', label: 'School level' },
                    { value: 'diploma', label: 'Diploma' },
                    { value: 'graduate', label: 'Graduate' },
                    { value: 'postgraduate', label: 'Postgraduate' },
                    { value: 'professional', label: 'Professional degree' },
                  ]}
                />
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <CompactChoiceGroup
                  label="Residence stability"
                  value={profile.residence_band}
                  onChange={(value) => update('residence_band', value)}
                  options={[
                    { value: 'new', label: 'Moved recently' },
                    { value: 'settled', label: '1-5 years' },
                    { value: 'rooted', label: '5-15 years' },
                    { value: 'long_term', label: '15+ years' },
                  ]}
                />
                <CompactChoiceGroup
                  label="Household dependents"
                  value={profile.dependents_band}
                  onChange={(value) => update('dependents_band', value)}
                  options={[
                    { value: 'none', label: 'No dependents' },
                    { value: 'one', label: '1 dependent' },
                    { value: 'two', label: '2 dependents' },
                    { value: 'three', label: '3 dependents' },
                    { value: 'four_plus', label: '4 or more' },
                  ]}
                />
              </div>
            </BuilderSection>
          )}

          {activeStep === 1 && (
            <BuilderSection {...steps[1]}>
              <div className="grid gap-6 lg:grid-cols-2">
                <CompactChoiceGroup
                  label="How late are bills usually paid?"
                  value={profile.payment_delay_band}
                  onChange={(value) => update('payment_delay_band', value)}
                  options={[
                    { value: 'on_time', label: 'Usually on time' },
                    { value: 'minor', label: 'Small delays' },
                    { value: 'moderate', label: 'Occasional late cycle' },
                    { value: 'late', label: 'Often late' },
                    { value: 'severe', label: 'Severely delayed' },
                  ]}
                />
                <CompactChoiceGroup
                  label="Bill payment reliability"
                  value={profile.reliability_band}
                  onChange={(value) => update('reliability_band', value)}
                  options={[
                    { value: 'excellent', label: 'Excellent' },
                    { value: 'good', label: 'Good' },
                    { value: 'mixed', label: 'Mixed' },
                    { value: 'poor', label: 'Poor' },
                  ]}
                />
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <CompactChoiceGroup
                  label="Monthly spending pattern"
                  value={profile.volatility_band}
                  onChange={(value) => update('volatility_band', value)}
                  options={[
                    { value: 'stable', label: 'Stable' },
                    { value: 'variable', label: 'Variable' },
                    { value: 'volatile', label: 'Volatile' },
                    { value: 'highly_volatile', label: 'Highly volatile' },
                  ]}
                />
                <CompactChoiceGroup
                  label="Savings habit"
                  value={profile.savings_band}
                  onChange={(value) => update('savings_band', value)}
                  options={[
                    { value: 'none', label: 'Rarely saves' },
                    { value: 'low', label: 'Saves a little' },
                    { value: 'healthy', label: 'Saves regularly' },
                    { value: 'strong', label: 'Strong buffer' },
                  ]}
                />
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <CompactChoiceGroup
                  label="Failed or bounced payments"
                  value={profile.bounce_band}
                  onChange={(value) => update('bounce_band', value)}
                  options={[
                    { value: 'none', label: 'None recently' },
                    { value: 'rare', label: 'Rare' },
                    { value: 'some', label: 'Some' },
                    { value: 'frequent', label: 'Frequent' },
                  ]}
                />
                <CompactChoiceGroup
                  label="Minimum balance buffer"
                  value={profile.balance_band}
                  onChange={(value) => update('balance_band', value)}
                  options={[
                    { value: 'thin', label: 'Thin buffer' },
                    { value: 'basic', label: 'Basic buffer' },
                    { value: 'comfortable', label: 'Comfortable buffer' },
                    { value: 'strong', label: 'Strong buffer' },
                  ]}
                />
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <BooleanChoice
                  label="Utility bill auto-pay"
                  value={profile.autopay_enabled}
                  onChange={(value) => update('autopay_enabled', value)}
                  trueLabel="Enabled"
                  falseLabel="Not enabled"
                />
                <CompactChoiceGroup
                  label="Merchant variety"
                  value={profile.merchant_activity}
                  onChange={(value) => update('merchant_activity', value)}
                  options={[
                    { value: 'light', label: 'Limited merchants' },
                    { value: 'regular', label: 'Regular variety' },
                    { value: 'active', label: 'Wide variety' },
                  ]}
                />
              </div>
            </BuilderSection>
          )}

          {activeStep === 2 && (
            <BuilderSection {...steps[2]}>
              <div className="grid gap-6 lg:grid-cols-2">
                <CompactChoiceGroup
                  label="App usage"
                  value={profile.app_activity}
                  onChange={(value) => update('app_activity', value)}
                  options={[
                    { value: 'light', label: 'Light usage' },
                    { value: 'regular', label: 'Regular usage' },
                    { value: 'active', label: 'Very active' },
                  ]}
                />
                <CompactChoiceGroup
                  label="Device consistency"
                  value={profile.device_consistency}
                  onChange={(value) => update('device_consistency', value)}
                  options={[
                    { value: 'light', label: 'Often changes device' },
                    { value: 'regular', label: 'Mostly same device' },
                    { value: 'active', label: 'Highly consistent' },
                  ]}
                />
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <CompactChoiceGroup
                  label="E-commerce activity"
                  value={profile.ecommerce_activity}
                  onChange={(value) => update('ecommerce_activity', value)}
                  options={[
                    { value: 'light', label: 'Rare purchases' },
                    { value: 'regular', label: 'Regular purchases' },
                    { value: 'active', label: 'Frequent purchases' },
                  ]}
                />
                <CompactChoiceGroup
                  label="Mobile recharge pattern"
                  value={profile.recharge_reliability}
                  onChange={(value) => update('recharge_reliability', value)}
                  options={[
                    { value: 'excellent', label: 'Always regular' },
                    { value: 'good', label: 'Mostly regular' },
                    { value: 'mixed', label: 'Sometimes irregular' },
                    { value: 'poor', label: 'Often irregular' },
                  ]}
                />
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <CompactChoiceGroup
                  label="KYC completion"
                  value={profile.kyc_band}
                  onChange={(value) => update('kyc_band', value)}
                  options={[
                    { value: 'complete', label: 'Full KYC complete' },
                    { value: 'partial', label: 'Partial KYC' },
                    { value: 'basic', label: 'Basic details only' },
                  ]}
                />
                <BooleanChoice
                  label="Optional social account linked"
                  value={profile.social_linked}
                  onChange={(value) => update('social_linked', value)}
                  trueLabel="Linked"
                  falseLabel="Not linked"
                />
              </div>
            </BuilderSection>
          )}

          {activeStep === 3 && (
            <BuilderSection {...steps[3]}>
              <div className="grid gap-6 lg:grid-cols-2">
                <CompactChoiceGroup
                  label="Recent loan enquiries"
                  value={profile.inquiry_band}
                  onChange={(value) => update('inquiry_band', value)}
                  options={[
                    { value: 'none', label: 'No recent enquiries' },
                    { value: 'few', label: '1-2 enquiries' },
                    { value: 'several', label: '3-5 enquiries' },
                    { value: 'many', label: 'Many enquiries' },
                  ]}
                />
                <CompactChoiceGroup
                  label="Primary account age"
                  value={profile.account_age_band}
                  onChange={(value) => update('account_age_band', value)}
                  options={[
                    { value: 'new', label: 'New account' },
                    { value: 'developing', label: '1-2 years' },
                    { value: 'established', label: '3-6 years' },
                    { value: 'mature', label: '7+ years' },
                  ]}
                />
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <BooleanChoice
                  label="Existing loan"
                  value={profile.has_existing_loan}
                  onChange={(value) => update('has_existing_loan', value)}
                  trueLabel="Has loan"
                  falseLabel="No loan"
                />
                <BooleanChoice
                  label="Insurance ownership"
                  value={profile.has_insurance}
                  onChange={(value) => update('has_insurance', value)}
                  trueLabel="Covered"
                  falseLabel="No cover"
                />
              </div>
            </BuilderSection>
          )}

          <div className="flex flex-col gap-3 rounded-[28px] border-2 border-stone-300 bg-stone-50/95 p-4 shadow-[0_20px_60px_rgba(120,53,15,0.08)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={previousStep}
                disabled={activeStep === 0}
                className="rounded-[20px] border-2 border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              {activeStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-[20px] border-2 border-stone-900 bg-stone-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-stone-800"
                >
                  Next section
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-[20px] border-2 border-amber-700 bg-gradient-to-r from-amber-700 to-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:from-amber-600 hover:to-orange-500 disabled:opacity-50"
                >
                  {isLoading ? 'Scoring...' : 'Score Profile'}
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[32px] border-2 border-stone-300 bg-stone-50/95 p-6 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
            <div className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">Selected Snapshot</div>
            <h4 className="mt-2 text-xl font-black text-stone-900">Current borrower profile</h4>

            <div className="mt-5 flex flex-wrap gap-2">
              {topSummary.map((item) => (
                <span key={item} className="rounded-[18px] border-2 border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-5 space-y-3 rounded-[24px] border-2 border-stone-300 bg-white p-4 text-sm text-stone-700">
              <div className="flex items-center justify-between">
                <span>Auto-pay enabled</span>
                <span className={`font-black ${profile.autopay_enabled ? 'text-emerald-700' : 'text-stone-500'}`}>{profile.autopay_enabled ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Social account linked</span>
                <span className={`font-black ${profile.social_linked ? 'text-emerald-700' : 'text-stone-500'}`}>{profile.social_linked ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Existing loan</span>
                <span className={`font-black ${profile.has_existing_loan ? 'text-amber-700' : 'text-emerald-700'}`}>{profile.has_existing_loan ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Insurance ownership</span>
                <span className={`font-black ${profile.has_insurance ? 'text-emerald-700' : 'text-stone-500'}`}>{profile.has_insurance ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}
