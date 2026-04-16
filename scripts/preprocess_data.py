"""Preprocess the training-ready dataset and save artifacts."""

import pandas as pd
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from credit_risk.constants import TRAINING_READY_DATA_PATH
from credit_risk.ml.preprocessing import preprocess_training_data, save_preprocessing_artifacts


def main() -> None:
    dataset = pd.read_csv(TRAINING_READY_DATA_PATH)
    artifacts = preprocess_training_data(dataset)
    save_preprocessing_artifacts(artifacts)
    print("Saved processed training and test datasets to data/processed")
    print("Saved preprocessing artifacts to models/preprocessors")


if __name__ == "__main__":
    main()
