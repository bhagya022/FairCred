"""Synthetic data generation converted from the notebook workflow."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd


@dataclass(slots=True)
class DataGenerationResult:
    dataset: pd.DataFrame
    default_threshold: float
    default_rate: float


def _norm(values: np.ndarray, min_value: float, max_value: float) -> np.ndarray:
    return (np.asarray(values) - min_value) / (max_value - min_value + 1e-8)


def generate_synthetic_credit_data(
    n_samples: int = 50_000,
    random_state: int = 42,
) -> DataGenerationResult:
    np.random.seed(random_state)
    data: dict[str, np.ndarray] = {}

    data["income_tier"] = np.random.choice(
        [1, 2, 3, 4, 5],
        size=n_samples,
        p=[0.15, 0.30, 0.35, 0.15, 0.05],
    )

    employment_options = {
        1: ["Gig_Worker", "Unemployed", "Student"],
        2: ["Gig_Worker", "Self_Employed", "Salaried"],
        3: ["Salaried", "Self_Employed", "Gig_Worker"],
        4: ["Salaried", "Self_Employed"],
        5: ["Salaried", "Self_Employed"],
    }
    data["employment_type"] = np.asarray(
        [np.random.choice(employment_options[income]) for income in data["income_tier"]]
    )

    base_tenure = np.random.gamma(shape=2, scale=15, size=n_samples)
    tenure_multiplier = np.where(
        data["employment_type"] == "Salaried",
        1.5,
        np.where(data["employment_type"] == "Gig_Worker", 0.6, 1.0),
    )
    data["employment_tenure_months"] = np.clip(base_tenure * tenure_multiplier, 0, 600).astype(int)
    data["education_level"] = np.clip(data["income_tier"] + np.random.randint(-1, 2, n_samples), 1, 5)
    data["residence_stability_years"] = np.clip(np.random.gamma(shape=2, scale=3, size=n_samples), 0, 50).astype(int)
    data["dependents_count"] = np.random.choice(
        [0, 1, 2, 3, 4, 5],
        size=n_samples,
        p=[0.25, 0.25, 0.25, 0.15, 0.07, 0.03],
    )

    income = np.asarray(data["income_tier"])
    employment = np.asarray(data["employment_type"])

    base_txn = np.random.poisson(lam=20, size=n_samples)
    data["upi_txn_frequency"] = np.clip(base_txn * (1 + income * 0.3), 0, 500).astype(int)

    base_delay = np.random.exponential(scale=5, size=n_samples)
    delay_multiplier = np.ones(n_samples)
    delay_multiplier[income <= 2] *= 2.5
    delay_multiplier[employment == "Gig_Worker"] *= 2.0
    delay_multiplier[employment == "Unemployed"] *= 3.0
    delay_multiplier[employment == "Salaried"] *= 0.5
    data["avg_payment_delay_days"] = np.clip(base_delay * delay_multiplier, 0, 90)

    data["bill_payment_consistency"] = np.clip(
        1.0 - (data["avg_payment_delay_days"] / 90) + np.random.normal(0, 0.1, n_samples),
        0.0,
        1.0,
    )

    base_volatility = np.random.gamma(shape=2, scale=0.3, size=n_samples)
    vol_multiplier = np.ones(n_samples)
    vol_multiplier[employment == "Gig_Worker"] *= 2.5
    vol_multiplier[employment == "Unemployed"] *= 3.0
    vol_multiplier[employment == "Salaried"] *= 0.5
    vol_multiplier[income >= 4] *= 0.6
    data["spending_volatility_cv"] = np.clip(base_volatility * vol_multiplier, 0, 5.0)

    base_savings = np.random.beta(a=2, b=5, size=n_samples)
    data["savings_ratio"] = np.clip(base_savings * (income / 5), 0, 0.8)
    autopay_prob = 0.3 + (income / 5) * 0.4
    data["utility_auto_payment_flag"] = np.random.binomial(1, autopay_prob, n_samples)
    data["bounce_rate_txn"] = np.clip(
        (data["avg_payment_delay_days"] / 90) * 0.5 + np.random.beta(1, 10, n_samples),
        0.0,
        1.0,
    )
    data["wallet_min_balance"] = np.clip(np.random.gamma(shape=2, scale=500, size=n_samples) * income, 0, 50_000)
    data["merchant_diversity_score"] = np.clip(np.random.poisson(lam=10, size=n_samples) + income * 2, 1, 100)

    usage_prob = 0.6 + income * 0.05
    data["app_usage_regularity_days"] = np.clip(np.random.binomial(n=365, p=usage_prob, size=n_samples), 0, 365)
    data["device_stability_score"] = np.clip(
        np.random.beta(a=5, b=2, size=n_samples) + (data["residence_stability_years"] / 50) * 0.2,
        0.0,
        1.0,
    )
    data["ecommerce_txn_frequency"] = np.clip(np.random.poisson(lam=3, size=n_samples) * income, 0, 100)
    data["recharge_regularity"] = np.clip(np.random.beta(a=8, b=2, size=n_samples), 0, 1)
    social_prob = 0.5 + (data["education_level"] / 5) * 0.3
    data["social_media_linked_flag"] = np.random.binomial(1, social_prob, n_samples)
    data["kyc_completion_score"] = np.random.choice([0.5, 0.75, 1.0], size=n_samples, p=[0.05, 0.15, 0.80])

    inquiry_lambda = 2.0 - (income / 5) * 1.5
    data["loan_inquiry_count_6m"] = np.clip(np.random.poisson(lam=inquiry_lambda, size=n_samples), 0, 20)
    data["existing_loan_flag"] = np.random.choice([0, 1], size=n_samples, p=[0.65, 0.35])
    insurance_prob = 0.2 + (income / 5) * 0.5
    data["insurance_ownership_flag"] = np.random.binomial(1, insurance_prob, n_samples)
    data["account_age_months"] = np.clip(np.random.gamma(shape=3, scale=20, size=n_samples), 0, 360).astype(int)

    pd_score = np.zeros(n_samples)
    pd_score += 0.30 * _norm(data["avg_payment_delay_days"], 0, 90)
    pd_score += 0.25 * _norm(data["spending_volatility_cv"], 0, 5)
    pd_score += 0.20 * _norm(data["bounce_rate_txn"], 0, 1)
    pd_score += 0.12 * _norm(data["loan_inquiry_count_6m"], 0, 20)
    pd_score += 0.08 * _norm(data["dependents_count"], 0, 10)
    pd_score += 0.06 * data["existing_loan_flag"]
    pd_score += 0.10 * (employment == "Gig_Worker").astype(int)
    pd_score += 0.12 * (employment == "Unemployed").astype(int)
    pd_score -= 0.25 * _norm(income, 1, 5)
    pd_score -= 0.20 * _norm(data["bill_payment_consistency"], 0, 1)
    pd_score -= 0.15 * _norm(data["account_age_months"], 0, 360)
    pd_score -= 0.12 * _norm(data["kyc_completion_score"], 0, 1)
    pd_score -= 0.10 * _norm(data["upi_txn_frequency"], 0, 500)
    pd_score -= 0.10 * _norm(data["employment_tenure_months"], 0, 600)
    pd_score -= 0.08 * _norm(data["device_stability_score"], 0, 1)
    pd_score -= 0.08 * _norm(data["savings_ratio"], 0, 0.8)
    pd_score -= 0.08 * _norm(data["recharge_regularity"], 0, 1)
    pd_score -= 0.06 * _norm(data["residence_stability_years"], 0, 50)
    pd_score -= 0.06 * _norm(data["app_usage_regularity_days"], 0, 365)
    pd_score -= 0.06 * _norm(data["education_level"], 1, 5)
    pd_score -= 0.06 * _norm(data["wallet_min_balance"], 0, 50_000)
    pd_score -= 0.05 * data["insurance_ownership_flag"]
    pd_score -= 0.05 * _norm(data["ecommerce_txn_frequency"], 0, 100)
    pd_score -= 0.04 * data["utility_auto_payment_flag"]
    pd_score -= 0.04 * _norm(data["merchant_diversity_score"], 1, 100)
    pd_score -= 0.03 * data["social_media_linked_flag"]
    pd_score += np.random.normal(0, 0.08, n_samples)

    pd_probability = 1 / (1 + np.exp(-pd_score * 4))
    threshold = float(np.percentile(pd_probability, 78))
    default_flag = (pd_probability > threshold).astype(int)

    dataset = pd.DataFrame(data)
    dataset["pd_score"] = pd_probability
    dataset["default_flag"] = default_flag
    return DataGenerationResult(dataset=dataset, default_threshold=threshold, default_rate=float(default_flag.mean()))
