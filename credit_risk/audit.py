"""Prediction audit logging."""

import csv
from datetime import datetime

import pandas as pd

from credit_risk.constants import DATA_DIR, PREDICTION_LOG_PATH


HEADERS = [
    "timestamp",
    "mode",
    "income_tier",
    "employment_type",
    "avg_payment_delay_days",
    "pd_probability",
    "credit_score",
    "risk_tier",
    "decision",
    "issues_count",
]


def init_log() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not PREDICTION_LOG_PATH.exists():
        with PREDICTION_LOG_PATH.open("w", newline="", encoding="utf-8") as handle:
            csv.writer(handle).writerow(HEADERS)


def log_prediction(user_input: dict, result: dict, mode: str = "api") -> None:
    init_log()
    row = [
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        mode,
        user_input.get("income_tier", ""),
        user_input.get("employment_type", ""),
        user_input.get("avg_payment_delay_days", ""),
        result.get("pd_probability", ""),
        result.get("credit_score", ""),
        result["risk_tier"]["tier"],
        result["decision"]["decision"],
        len(result.get("issues", [])),
    ]
    with PREDICTION_LOG_PATH.open("a", newline="", encoding="utf-8") as handle:
        csv.writer(handle).writerow(row)


def get_log_count() -> int:
    if not PREDICTION_LOG_PATH.exists():
        return 0
    with PREDICTION_LOG_PATH.open("r", encoding="utf-8") as handle:
        return max(sum(1 for _ in handle) - 1, 0)


def get_recent_logs(limit: int = 50) -> list[dict]:
    if not PREDICTION_LOG_PATH.exists():
        return []
    frame = pd.read_csv(PREDICTION_LOG_PATH)
    # Reverse the dataframe so the newest records appear at the top
    return frame.tail(limit).iloc[::-1].to_dict("records")
