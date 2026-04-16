"""Project-wide constants."""

from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
MODEL_DIR = PROJECT_ROOT / "models"
TRAINED_MODELS_DIR = MODEL_DIR / "trained"
PREPROCESSOR_DIR = MODEL_DIR / "preprocessors"

RAW_DATA_PATH = DATA_DIR / "synthetic_credit_data.csv"
TRAINING_READY_DATA_PATH = DATA_DIR / "credit_data_training_ready.csv"
RAW_DATA_LEGACY_PATH = DATA_DIR / "synthetic_credit_data.xls"
PREDICTION_LOG_PATH = DATA_DIR / "predictions_log.csv"

EMPLOYMENT_TYPES = [
    "Gig_Worker",
    "Salaried",
    "Self_Employed",
    "Student",
    "Unemployed",
]

FEATURE_COLUMNS = [
    "income_tier",
    "employment_tenure_months",
    "education_level",
    "residence_stability_years",
    "dependents_count",
    "upi_txn_frequency",
    "avg_payment_delay_days",
    "bill_payment_consistency",
    "spending_volatility_cv",
    "savings_ratio",
    "utility_auto_payment_flag",
    "bounce_rate_txn",
    "wallet_min_balance",
    "merchant_diversity_score",
    "app_usage_regularity_days",
    "device_stability_score",
    "ecommerce_txn_frequency",
    "recharge_regularity",
    "social_media_linked_flag",
    "kyc_completion_score",
    "loan_inquiry_count_6m",
    "existing_loan_flag",
    "insurance_ownership_flag",
    "account_age_months",
    "employment_type_encoded",
]
