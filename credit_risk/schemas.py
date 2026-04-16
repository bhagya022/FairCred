"""Pydantic schemas for the backend."""

from typing import Literal

from pydantic import BaseModel, Field


class CreditRiskInput(BaseModel):
    income_tier: int = Field(ge=1, le=5)
    employment_type: Literal[
        "Gig_Worker",
        "Salaried",
        "Self_Employed",
        "Student",
        "Unemployed",
    ]
    employment_tenure_months: int = Field(ge=0, le=600)
    education_level: int = Field(ge=1, le=5)
    residence_stability_years: int = Field(ge=0, le=50)
    dependents_count: int = Field(ge=0, le=10)
    upi_txn_frequency: int = Field(ge=0, le=500)
    avg_payment_delay_days: float = Field(ge=0, le=90)
    bill_payment_consistency: float = Field(ge=0, le=1)
    spending_volatility_cv: float = Field(ge=0, le=5)
    savings_ratio: float = Field(ge=0, le=0.8)
    utility_auto_payment_flag: int = Field(ge=0, le=1)
    bounce_rate_txn: float = Field(ge=0, le=1)
    wallet_min_balance: float = Field(ge=0, le=50000)
    merchant_diversity_score: int = Field(ge=1, le=100)
    app_usage_regularity_days: int = Field(ge=0, le=365)
    device_stability_score: float = Field(ge=0, le=1)
    ecommerce_txn_frequency: int = Field(ge=0, le=100)
    recharge_regularity: float = Field(ge=0, le=1)
    social_media_linked_flag: int = Field(ge=0, le=1)
    kyc_completion_score: float = Field(ge=0, le=1)
    loan_inquiry_count_6m: int = Field(ge=0, le=20)
    existing_loan_flag: int = Field(ge=0, le=1)
    insurance_ownership_flag: int = Field(ge=0, le=1)
    account_age_months: int = Field(ge=0, le=360)


class RiskTier(BaseModel):
    tier: str
    color: str
    emoji: str
    description: str


class Decision(BaseModel):
    decision: str
    color: str
    emoji: str
    reason: str
    override: bool


class EligibilityIssue(BaseModel):
    rule: str
    detail: str
    severity: str


class ScoreBreakdown(BaseModel):
    max_score: int
    min_score: int
    current_score: int
    percentile: float


class ShapExplanation(BaseModel):
    feature: str
    value: str | float | int
    shap_value: float
    abs_shap: float
    impact: str


class PredictionResponse(BaseModel):
    pd_probability: float
    predicted_class: int
    credit_score: int
    risk_tier: RiskTier
    decision: Decision
    issues: list[EligibilityIssue]
    recommendations: list[str]
    score_breakdown: ScoreBreakdown
    features_used: list[str]
    input_processed: bool


class ExplanationResponse(BaseModel):
    explanations: list[ShapExplanation]


class ModelMetric(BaseModel):
    Model: str
    Accuracy: float
    Precision: float
    Recall: float
    F1_Score: float
    AUC_ROC: float


class EvaluationReport(BaseModel):
    tn: int
    fp: int
    fn: int
    tp: int
    precision: float
    recall: float
    f1: float
    fp_rate: float
    fn_rate: float
    tp_rate: float
    tn_rate: float
    total: int


class GroupSummary(BaseModel):
    approval_rate: float
    avg_credit_score: float
    records: int


class IncomeSummary(GroupSummary):
    income_tier: int


class EmploymentSummary(GroupSummary):
    employment_type: str


class ScoreBin(BaseModel):
    count: int
    label: str


class FairnessReport(BaseModel):
    approval_parity: float
    score_balance: float
    total_records: int
    income_metrics: list[IncomeSummary]
    employment_metrics: list[EmploymentSummary]
    score_distribution: list[ScoreBin]
