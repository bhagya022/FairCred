"""Generate global SHAP feature importance for the trained model."""

import joblib
import pandas as pd
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from credit_risk.constants import DATA_DIR, PROCESSED_DATA_DIR, TRAINED_MODELS_DIR
from credit_risk.ml.explainability import compute_global_shap_importance


def main() -> None:
    X_train = pd.read_csv(PROCESSED_DATA_DIR / "X_train.csv")
    X_test = pd.read_csv(PROCESSED_DATA_DIR / "X_test.csv")
    model = joblib.load(TRAINED_MODELS_DIR / "best_model.pkl")
    importance = compute_global_shap_importance(model, X_train, X_test)
    output_path = DATA_DIR / "shap_global_importance.csv"
    importance.to_csv(output_path, index=False)
    print(f"Saved SHAP feature importance to {output_path}")


if __name__ == "__main__":
    main()
