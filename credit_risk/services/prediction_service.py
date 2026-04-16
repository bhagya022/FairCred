"""Reusable prediction service for the backend and other clients."""

from __future__ import annotations

import joblib
import numpy as np
import pandas as pd
from sklearn.utils.validation import check_is_fitted

from credit_risk.constants import FEATURE_COLUMNS, PREPROCESSOR_DIR, TRAINED_MODELS_DIR
from credit_risk.ml.explainability import ensure_shap_available
from credit_risk.risk_engine import evaluate_user


class CreditRiskPredictor:
    """Load trained artifacts and serve consistent predictions."""

    def __init__(self):
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.feature_names = None
        self.feature_config = None
        self._load_artifacts()

    def _load_artifacts(self) -> None:
        self.model = joblib.load(TRAINED_MODELS_DIR / "XGBoost.pkl")
        self.scaler = joblib.load(PREPROCESSOR_DIR / "scaler.pkl")
        self.label_encoder = joblib.load(PREPROCESSOR_DIR / "label_encoder.pkl")
        self.feature_names = joblib.load(PREPROCESSOR_DIR / "feature_names.pkl")
        self.feature_config = joblib.load(PREPROCESSOR_DIR / "feature_config.pkl")
        check_is_fitted(self.scaler)

    def preprocess(self, user_input: dict) -> np.ndarray:
        employment_type = user_input.get("employment_type", "Salaried")
        mapping = self.feature_config["label_encoder_mapping"]
        employment_encoded = mapping.get(employment_type)
        if employment_encoded is None:
            raise ValueError(f"Unsupported employment_type: {employment_type}")

        feature_vector = []
        for feature_name in self.feature_names:
            if feature_name == "employment_type_encoded":
                feature_vector.append(employment_encoded)
            else:
                feature_vector.append(user_input.get(feature_name, 0))

        feature_frame = pd.DataFrame(
            [np.array(feature_vector, dtype=float)],
            columns=self.feature_names,
        )
        return self.scaler.transform(feature_frame)

    def predict(self, user_input: dict) -> dict:
        scaled = self.preprocess(user_input)
        pd_probability = float(self.model.predict_proba(scaled)[0][1])
        predicted_class = int(self.model.predict(scaled)[0])
        evaluation = evaluate_user(pd_probability, user_input)
        return {
            "pd_probability": pd_probability,
            "predicted_class": predicted_class,
            "features_used": FEATURE_COLUMNS,
            "input_processed": True,
            **evaluation,
        }

    def get_shap_explanation(self, user_input: dict, top_n: int = 10) -> list[dict]:
        try:
            shap = ensure_shap_available()
        except ImportError as exc:
            raise RuntimeError(
                "SHAP is not installed. Install project requirements before using explanations."
            ) from exc

        scaled = self.preprocess(user_input)
        explainer = shap.TreeExplainer(self.model)
        shap_values = explainer.shap_values(scaled)

        if isinstance(shap_values, list):
            shap_values = shap_values[1][0]
        elif len(shap_values.shape) == 3:
            shap_values = shap_values[0, :, 1]
        else:
            shap_values = shap_values[0]

        explanations = []
        for index, feature_name in enumerate(self.feature_names):
            raw_value = user_input.get(feature_name)
            if feature_name == "employment_type_encoded":
                raw_value = user_input.get("employment_type", "")
            shap_value = float(shap_values[index])
            explanations.append(
                {
                    "feature": feature_name,
                    "value": raw_value if raw_value is not None else 0,
                    "shap_value": shap_value,
                    "abs_shap": abs(shap_value),
                    "impact": "Increases Risk" if shap_value > 0 else "Decreases Risk",
                }
            )

        explanations.sort(key=lambda item: item["abs_shap"], reverse=True)
        return explanations[:top_n]
