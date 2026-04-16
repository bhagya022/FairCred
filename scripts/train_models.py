"""Train and persist the credit risk models."""

import pandas as pd
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from credit_risk.constants import PROCESSED_DATA_DIR
from credit_risk.ml.training import save_training_artifacts, train_models


def main() -> None:
    X_train = pd.read_csv(PROCESSED_DATA_DIR / "X_train.csv")
    X_test = pd.read_csv(PROCESSED_DATA_DIR / "X_test.csv")
    y_train = pd.read_csv(PROCESSED_DATA_DIR / "y_train.csv").iloc[:, 0]
    y_test = pd.read_csv(PROCESSED_DATA_DIR / "y_test.csv").iloc[:, 0]

    result = train_models(X_train, y_train, X_test, y_test)
    save_training_artifacts(result)
    print(f"Best model: {result.best_model_name}")
    print(result.metrics.to_string())


if __name__ == "__main__":
    main()
