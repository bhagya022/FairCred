# ============================================================================
# LOGGER.PY - Audit Trail
# ============================================================================

import csv
import os
from datetime import datetime

LOG_FILE = 'data/predictions_log.csv'

HEADERS = [
    'timestamp', 'mode', 'income_tier', 'employment_type',
    'avg_payment_delay_days', 'pd_probability', 'credit_score',
    'risk_tier', 'decision', 'issues_count'
]

def init_log():
    os.makedirs('data', exist_ok=True)
    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(HEADERS)

def log_prediction(user_input: dict, result: dict, mode: str = 'demo'):
    init_log()
    row = [
        datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        mode,
        user_input.get('income_tier', ''),
        user_input.get('employment_type', ''),
        user_input.get('avg_payment_delay_days', ''),
        result.get('pd_probability', ''),
        result.get('credit_score', ''),
        result['risk_tier']['tier'],
        result['decision']['decision'],
        len(result.get('issues', []))
    ]
    with open(LOG_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(row)

def get_log_count() -> int:
    if not os.path.exists(LOG_FILE):
        return 0
    with open(LOG_FILE, 'r') as f:
        return sum(1 for _ in f) - 1

def get_recent_logs(n: int = 10) -> list:
    if not os.path.exists(LOG_FILE):
        return []
    import pandas as pd
    df = pd.read_csv(LOG_FILE)
    return df.tail(n).to_dict('records')