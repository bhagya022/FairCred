"""ML pipeline smoke tests."""

import unittest
import warnings

from credit_risk.constants import FEATURE_COLUMNS
from credit_risk.ml.data_generation import generate_synthetic_credit_data
from credit_risk.ml.explainability import compute_global_shap_importance
from credit_risk.ml.preprocessing import preprocess_training_data
from credit_risk.ml.training import train_models
from credit_risk.services.prediction_service import CreditRiskPredictor


SAMPLE_PAYLOAD = {
    "income_tier": 3,
    "employment_type": "Salaried",
    "employment_tenure_months": 36,
    "education_level": 4,
    "residence_stability_years": 5,
    "dependents_count": 1,
    "upi_txn_frequency": 40,
    "avg_payment_delay_days": 5,
    "bill_payment_consistency": 0.75,
    "spending_volatility_cv": 0.5,
    "savings_ratio": 0.2,
    "utility_auto_payment_flag": 1,
    "bounce_rate_txn": 0.05,
    "wallet_min_balance": 5000,
    "merchant_diversity_score": 25,
    "app_usage_regularity_days": 250,
    "device_stability_score": 0.8,
    "ecommerce_txn_frequency": 8,
    "recharge_regularity": 0.85,
    "social_media_linked_flag": 1,
    "kyc_completion_score": 1.0,
    "loan_inquiry_count_6m": 1,
    "existing_loan_flag": 0,
    "insurance_ownership_flag": 0,
    "account_age_months": 36,
}


class PipelineTests(unittest.TestCase):
    def test_generated_pipeline_training(self):
        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always")
            generated = generate_synthetic_credit_data(n_samples=600, random_state=42)
            self.assertEqual(generated.dataset.shape[1], 27)
            self.assertGreater(generated.default_rate, 0)
            self.assertLess(generated.default_rate, 1)

            artifacts = preprocess_training_data(generated.dataset)
            self.assertEqual(list(artifacts.X_train.columns), FEATURE_COLUMNS)
            self.assertEqual(artifacts.X_train.shape[1], 25)

            result = train_models(
                artifacts.X_train,
                artifacts.y_train,
                artifacts.X_test,
                artifacts.y_test,
            )

        self.assertIn("XGBoost", result.models)
        self.assertIn(result.best_model_name, result.models)
        self.assertGreater(result.metrics.loc[result.best_model_name, "AUC_ROC"], 0.85)
        self.assertFalse(
            any(isinstance(item.message, DeprecationWarning) for item in caught),
            f"Unexpected training warnings: {[str(item.message) for item in caught]}",
        )

    def test_saved_predictor_inference(self):
        predictor = CreditRiskPredictor()
        result = predictor.predict(SAMPLE_PAYLOAD)
        self.assertIn("pd_probability", result)
        self.assertIn("risk_tier", result)
        self.assertGreaterEqual(result["credit_score"], 300)
        self.assertLessEqual(result["credit_score"], 900)

        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always")
            explanations = predictor.get_shap_explanation(SAMPLE_PAYLOAD, top_n=5)
        self.assertEqual(len(explanations), 5)
        self.assertIn("feature", explanations[0])
        self.assertFalse(
            any(isinstance(item.message, ResourceWarning) for item in caught),
            f"Unexpected explanation warnings: {[str(item.message) for item in caught]}",
        )

    def test_shap_global_importance(self):
        generated = generate_synthetic_credit_data(n_samples=400, random_state=7)
        artifacts = preprocess_training_data(generated.dataset)
        result = train_models(
            artifacts.X_train,
            artifacts.y_train,
            artifacts.X_test,
            artifacts.y_test,
        )
        importance = compute_global_shap_importance(
            result.models[result.best_model_name],
            artifacts.X_train,
            artifacts.X_test,
        )
        self.assertFalse(importance.empty)
        self.assertEqual(list(importance.columns), ["Feature", "Mean_SHAP_Value"])


if __name__ == "__main__":
    unittest.main()
