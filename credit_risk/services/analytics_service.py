import os
import pandas as pd
import joblib
from sklearn.metrics import confusion_matrix, f1_score, precision_score, recall_score

from credit_risk.constants import PREDICTION_LOG_PATH

MODEL_METRICS_PATH = "data/model_metrics.csv"
BEST_MODEL_PATH = "models/trained/best_model.pkl"
X_TEST_PATH = "data/processed/X_test.csv"
Y_TEST_PATH = "data/processed/y_test.csv"

def get_model_metrics() -> list[dict]:
    if not os.path.exists(MODEL_METRICS_PATH):
        return []
    frame = pd.read_csv(MODEL_METRICS_PATH, index_col=0).reset_index().rename(columns={"index": "Model"})
    return frame.to_dict("records")

def get_evaluation_report() -> dict | None:
    if not (os.path.exists(BEST_MODEL_PATH) and os.path.exists(X_TEST_PATH) and os.path.exists(Y_TEST_PATH)):
        return None

    model = joblib.load(BEST_MODEL_PATH)
    X_test = pd.read_csv(X_TEST_PATH)
    y_test = pd.read_csv(Y_TEST_PATH).iloc[:, 0]
    y_pred = model.predict(X_test)

    matrix = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = matrix.ravel()
    total = int(matrix.sum()) or 1

    return {
        "tn": int(tn),
        "fp": int(fp),
        "fn": int(fn),
        "tp": int(tp),
        "precision": float(precision_score(y_test, y_pred)),
        "recall": float(recall_score(y_test, y_pred)),
        "f1": float(f1_score(y_test, y_pred)),
        "fp_rate": float(fp / total),
        "fn_rate": float(fn / total),
        "tp_rate": float(tp / total),
        "tn_rate": float(tn / total),
        "total": total,
    }

def fairness_parity_index(series: pd.Series) -> float:
    clean = pd.to_numeric(series, errors="coerce").dropna()
    if clean.empty or clean.max() == 0:
        return 0.0
    return float(clean.min() / clean.max())

def get_fairness_report() -> dict | None:
    if not PREDICTION_LOG_PATH.exists():
        return None
    
    frame = pd.read_csv(PREDICTION_LOG_PATH)
    if frame.empty:
        return None

    work = frame.copy()
    work["approved_flag"] = (work["decision"].str.lower() == "approved").astype(int)

    income_summary = (
        work.groupby("income_tier", dropna=False)
        .agg(
            approval_rate=("approved_flag", "mean"),
            avg_credit_score=("credit_score", "mean"),
            records=("approved_flag", "size"),
        )
        .reset_index()
        .sort_values("income_tier")
    )

    employment_summary = (
        work.groupby("employment_type", dropna=False)
        .agg(
            approval_rate=("approved_flag", "mean"),
            avg_credit_score=("credit_score", "mean"),
            records=("approved_flag", "size"),
        )
        .reset_index()
        .sort_values("approval_rate", ascending=False)
    )

    histogram = work.copy()
    histogram["score_bin"] = pd.cut(
        histogram["credit_score"],
        bins=[300, 400, 500, 600, 650, 700, 750, 800, 850, 900],
        include_lowest=True,
        right=False,
    )
    score_distribution = (
        histogram.groupby("score_bin", dropna=False)
        .size()
        .reset_index(name="count")
    )
    score_distribution["label"] = score_distribution["score_bin"].astype(str)

    income_summary["approval_rate"] = income_summary["approval_rate"] * 100
    employment_summary["approval_rate"] = employment_summary["approval_rate"] * 100

    approval_parity = fairness_parity_index(income_summary["approval_rate"] if not income_summary.empty else pd.Series(dtype=float))
    score_balance = fairness_parity_index(employment_summary["avg_credit_score"] if not employment_summary.empty else pd.Series(dtype=float))

    return {
        "approval_parity": approval_parity,
        "score_balance": score_balance,
        "total_records": int(len(frame)),
        "income_metrics": income_summary.to_dict("records"),
        "employment_metrics": employment_summary.to_dict("records"),
        "score_distribution": score_distribution.to_dict("records"),
    }
