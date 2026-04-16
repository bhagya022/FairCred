"""Preprocessing pipeline converted from the notebook workflow."""

from __future__ import annotations

from dataclasses import dataclass

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

from credit_risk.constants import FEATURE_COLUMNS, PREPROCESSOR_DIR, PROCESSED_DATA_DIR


@dataclass(slots=True)
class PreprocessingArtifacts:
    X_train: pd.DataFrame
    X_test: pd.DataFrame
    y_train: pd.Series
    y_test: pd.Series
    scaler: StandardScaler
    label_encoder: LabelEncoder
    feature_names: list[str]


def preprocess_training_data(
    dataset: pd.DataFrame,
    test_size: float = 0.30,
    random_state: int = 42,
) -> PreprocessingArtifacts:
    frame = dataset.copy()
    if "pd_score" in frame.columns:
        frame = frame.drop(columns=["pd_score"])

    X = frame.drop(columns=["default_flag"])
    y = frame["default_flag"]

    label_encoder = LabelEncoder()
    X["employment_type_encoded"] = label_encoder.fit_transform(X["employment_type"])
    X = X.drop(columns=["employment_type"])
    X = X[FEATURE_COLUMNS]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=y,
    )

    scaler = StandardScaler()
    X_train_scaled = pd.DataFrame(
        scaler.fit_transform(X_train),
        columns=FEATURE_COLUMNS,
        index=X_train.index,
    )
    X_test_scaled = pd.DataFrame(
        scaler.transform(X_test),
        columns=FEATURE_COLUMNS,
        index=X_test.index,
    )

    return PreprocessingArtifacts(
        X_train=X_train_scaled,
        X_test=X_test_scaled,
        y_train=y_train.reset_index(drop=True),
        y_test=y_test.reset_index(drop=True),
        scaler=scaler,
        label_encoder=label_encoder,
        feature_names=FEATURE_COLUMNS.copy(),
    )


def save_preprocessing_artifacts(artifacts: PreprocessingArtifacts) -> None:
    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    PREPROCESSOR_DIR.mkdir(parents=True, exist_ok=True)

    artifacts.X_train.to_csv(PROCESSED_DATA_DIR / "X_train.csv", index=False)
    artifacts.X_test.to_csv(PROCESSED_DATA_DIR / "X_test.csv", index=False)
    artifacts.y_train.to_csv(PROCESSED_DATA_DIR / "y_train.csv", index=False)
    artifacts.y_test.to_csv(PROCESSED_DATA_DIR / "y_test.csv", index=False)

    (PROCESSED_DATA_DIR / "feature_names.txt").write_text(
        "\n".join(artifacts.feature_names),
        encoding="utf-8",
    )

    feature_config = {
        "feature_names": artifacts.feature_names,
        "label_encoder_classes": artifacts.label_encoder.classes_.tolist(),
        "label_encoder_mapping": {
            label: int(code)
            for code, label in enumerate(artifacts.label_encoder.classes_.tolist())
        },
        "scaler_mean": artifacts.scaler.mean_.tolist(),
        "scaler_scale": artifacts.scaler.scale_.tolist(),
    }

    joblib.dump(artifacts.scaler, PREPROCESSOR_DIR / "scaler.pkl")
    joblib.dump(artifacts.label_encoder, PREPROCESSOR_DIR / "label_encoder.pkl")
    joblib.dump(artifacts.feature_names, PREPROCESSOR_DIR / "feature_names.pkl")
    joblib.dump(feature_config, PREPROCESSOR_DIR / "feature_config.pkl")
