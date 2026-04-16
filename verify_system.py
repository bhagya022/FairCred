import os
import sys
import unittest
from unittest.mock import patch, MagicMock

# Attempt to load backend and frontend components to ensure no syntax/import errors
try:
    from backend.main import app
    from credit_risk.schemas import EvaluationReport, FairnessReport, ModelMetric
    from credit_risk.services.analytics_service import get_evaluation_report, get_fairness_report, get_model_metrics
    
    import frontend.app
    import frontend.pages.risk
    import frontend.pages.history
    import frontend.pages.fairness
    import frontend.pages.model_perf
    import frontend.pages.error_impact
    import frontend.helpers
    import frontend.components
    import frontend.styles
    imports_successful = True
except Exception as e:
    imports_successful = False
    import_error = str(e)


class SystemIntegrationTests(unittest.TestCase):
    def test_01_imports(self):
        """Test that all newly split modules import successfully without circular dependencies or syntax errors."""
        self.assertTrue(imports_successful, f"Import error: {import_error if not imports_successful else ''}")

    def test_02_analytics_service_methods(self):
        """Test that analytics endpoints actually correspond to the correct data generation logic natively."""
        # Test model metrics return structure if the file exists
        if os.path.exists("data/model_metrics.csv"):
            metrics = get_model_metrics()
            self.assertIsInstance(metrics, list)
            if len(metrics) > 0:
                self.assertIn("Model", metrics[0])
                self.assertIn("AUC_ROC", metrics[0])

        # Test evaluation report signature
        if os.path.exists("models/trained/best_model.pkl") and os.path.exists("data/processed/X_test.csv"):
            report = get_evaluation_report()
            if report is not None:
                self.assertIn("tp", report)
                self.assertIn("precision", report)

    def test_03_frontend_connection_helpers(self):
        """Verify that frontend helpers correctly map to backend endpoints."""
        self.assertEqual(frontend.helpers.BACKEND_URL, os.getenv("BACKEND_URL", "http://127.0.0.1:8000"))

        with patch('requests.get') as mock_get:
            # Mock successful metrics fetch
            mock_response = MagicMock()
            mock_response.json.return_value = [{"Model": "XGBoost", "AUC_ROC": 0.9}]
            mock_get.return_value = mock_response

            res = frontend.helpers.fetch_metrics()
            self.assertEqual(res[0]["Model"], "XGBoost")
            mock_get.assert_called_with(f"{frontend.helpers.BACKEND_URL}/metrics", timeout=5)

            # Mock evaluation fetch
            mock_response.json.return_value = {"precision": 0.8}
            res = frontend.helpers.fetch_evaluation()
            self.assertEqual(res["precision"], 0.8)
            mock_get.assert_called_with(f"{frontend.helpers.BACKEND_URL}/evaluation", timeout=5)

            # Mock fairness fetch
            mock_response.json.return_value = {"approval_parity": 0.95}
            res = frontend.helpers.fetch_fairness_report()
            self.assertEqual(res["approval_parity"], 0.95)
            mock_get.assert_called_with(f"{frontend.helpers.BACKEND_URL}/fairness", timeout=5)

if __name__ == "__main__":
    print(f"Running System Verification...")
    unittest.main(verbosity=2)
