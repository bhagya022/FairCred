# ============================================================================
# PREDICTOR.PY - Loads your saved XGBoost model and makes predictions
# ============================================================================

import numpy as np
import pandas as pd
import joblib
import os


class CreditRiskPredictor:
    """Loads trained XGBoost + preprocessors and predicts PD."""

    def __init__(self):
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.feature_names = None
        self.feature_config = None
        self._load_artifacts()

    def _load_artifacts(self):
        """Load all saved model artifacts."""
        base_model = 'models/trained'
        base_prep = 'models/preprocessors'

        self.model = joblib.load(os.path.join(base_model, 'XGBoost.pkl'))
        self.scaler = joblib.load(os.path.join(base_prep, 'scaler.pkl'))
        self.label_encoder = joblib.load(os.path.join(base_prep, 'label_encoder.pkl'))
        self.feature_names = joblib.load(os.path.join(base_prep, 'feature_names.pkl'))
        self.feature_config = joblib.load(os.path.join(base_prep, 'feature_config.pkl'))

    def preprocess(self, user_input: dict) -> np.ndarray:
        """Convert raw user input to scaled features."""
        # Encode employment_type
        emp_type = user_input.get('employment_type', 'Salaried')
        mapping = self.feature_config['label_encoder_mapping']
        emp_encoded = mapping.get(emp_type, 0)

        # Build feature vector in correct order
        feature_vector = []
        for feat in self.feature_names:
            if feat == 'employment_type_encoded':
                feature_vector.append(emp_encoded)
            else:
                feature_vector.append(user_input.get(feat, 0))

        # Convert to array and scale
        feature_array = np.array(feature_vector).reshape(1, -1)
        scaled_array = self.scaler.transform(feature_array)

        return scaled_array

    def predict(self, user_input: dict) -> dict:
        """Full prediction pipeline."""
        scaled = self.preprocess(user_input)

        pd_probability = self.model.predict_proba(scaled)[0][1]
        predicted_class = self.model.predict(scaled)[0]

        return {
            'pd_probability': float(pd_probability),
            'predicted_class': int(predicted_class),
            'features_used': self.feature_names,
            'input_processed': True
        }

    def get_shap_explanation(self, user_input: dict, top_n: int = 10) -> list:
        """Get SHAP feature contributions."""
        try:
            import shap
            scaled = self.preprocess(user_input)

            explainer = shap.TreeExplainer(self.model)
            shap_values = explainer.shap_values(scaled)

            # Handle different formats
            if isinstance(shap_values, list):
                shap_vals = shap_values[1][0]  # positive class
            elif len(shap_values.shape) == 3:
                shap_vals = shap_values[0, :, 1]
            else:
                shap_vals = shap_values[0]

            # Build explanation list
            explanations = []
            for i, feat in enumerate(self.feature_names):
                raw_val = user_input.get(feat, 
                    user_input.get('employment_type', '') if feat == 'employment_type_encoded' else 0
                )
                explanations.append({
                    'feature': feat,
                    'value': raw_val,
                    'shap_value': float(shap_vals[i]),
                    'abs_shap': abs(float(shap_vals[i])),
                    'impact': 'Increases Risk ↑' if shap_vals[i] > 0 else 'Decreases Risk ↓'
                })

            explanations.sort(key=lambda x: x['abs_shap'], reverse=True)
            return explanations[:top_n]

        except Exception as e:
            return [{'feature': 'Error', 'value': str(e), 'shap_value': 0, 
                     'abs_shap': 0, 'impact': 'N/A'}]