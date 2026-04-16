"""Backend API smoke tests."""

import unittest

from fastapi.testclient import TestClient

from backend.main import app


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


class BackendApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["status"], "ok")
        self.assertTrue(payload["model_loaded"])

    def test_predict_endpoint(self):
        response = self.client.post("/predict", json=SAMPLE_PAYLOAD)
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("pd_probability", payload)
        self.assertIn("credit_score", payload)
        self.assertIn("decision", payload)
        self.assertGreaterEqual(payload["credit_score"], 300)
        self.assertLessEqual(payload["credit_score"], 900)

    def test_explain_endpoint(self):
        response = self.client.post("/explain", json=SAMPLE_PAYLOAD)
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("explanations", payload)
        self.assertGreater(len(payload["explanations"]), 0)


if __name__ == "__main__":
    unittest.main()
