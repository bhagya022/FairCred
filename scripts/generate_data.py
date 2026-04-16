"""Generate the synthetic credit dataset."""

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from credit_risk.constants import RAW_DATA_LEGACY_PATH, RAW_DATA_PATH, TRAINING_READY_DATA_PATH
from credit_risk.ml.data_generation import generate_synthetic_credit_data


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--samples", type=int, default=50_000)
    parser.add_argument("--random-state", type=int, default=42)
    args = parser.parse_args()

    result = generate_synthetic_credit_data(
        n_samples=args.samples,
        random_state=args.random_state,
    )

    RAW_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    result.dataset.to_csv(RAW_DATA_PATH, index=False)
    result.dataset.to_csv(RAW_DATA_LEGACY_PATH, index=False)
    result.dataset.drop(columns=["pd_score"]).to_csv(TRAINING_READY_DATA_PATH, index=False)

    print(f"Saved raw dataset to {RAW_DATA_PATH}")
    print(f"Saved legacy export to {RAW_DATA_LEGACY_PATH}")
    print(f"Saved training-ready dataset to {TRAINING_READY_DATA_PATH}")
    print(f"Default threshold: {result.default_threshold:.4f}")
    print(f"Default rate: {result.default_rate:.2%}")


if __name__ == "__main__":
    main()
