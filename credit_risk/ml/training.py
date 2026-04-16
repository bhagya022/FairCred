"""Model training and persistence converted from the notebooks."""

from __future__ import annotations

from dataclasses import dataclass

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
from xgboost import XGBClassifier

from credit_risk.constants import DATA_DIR, TRAINED_MODELS_DIR


@dataclass(slots=True)
class TrainingResult:
    models: dict[str, object]
    metrics: pd.DataFrame
    best_model_name: str


def train_models(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    X_test: pd.DataFrame,
    y_test: pd.Series,
) -> TrainingResult:
    models: dict[str, object] = {
        "Logistic_Regression": LogisticRegression(
            max_iter=1000,
            random_state=42,
            class_weight="balanced",
            solver="liblinear",
        ),
        "Random_Forest": RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=10,
            min_samples_leaf=5,
            random_state=42,
            class_weight="balanced",
            n_jobs=1,
        ),
        "XGBoost": XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42,
            scale_pos_weight=3,
            eval_metric="logloss",
        ),
    }

    metrics: dict[str, dict[str, float]] = {}
    for model_name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]
        metrics[model_name] = {
            "Accuracy": accuracy_score(y_test, y_pred),
            "Precision": precision_score(y_test, y_pred),
            "Recall": recall_score(y_test, y_pred),
            "F1_Score": f1_score(y_test, y_pred),
            "AUC_ROC": roc_auc_score(y_test, y_prob),
        }

    metrics_frame = pd.DataFrame(metrics).T.sort_values("AUC_ROC", ascending=False)
    best_model_name = str(metrics_frame.index[0])
    return TrainingResult(models=models, metrics=metrics_frame, best_model_name=best_model_name)


def save_training_artifacts(result: TrainingResult) -> None:
    TRAINED_MODELS_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    for model_name, model in result.models.items():
        joblib.dump(model, TRAINED_MODELS_DIR / f"{model_name}.pkl")

    joblib.dump(result.models[result.best_model_name], TRAINED_MODELS_DIR / "best_model.pkl")
    result.metrics.to_csv(DATA_DIR / "model_metrics.csv")
