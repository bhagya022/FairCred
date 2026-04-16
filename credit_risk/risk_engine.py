"""Business rules and risk scoring."""


def pd_to_credit_score(pd_value: float) -> int:
    score = int((1 - pd_value) * 600 + 300)
    return max(300, min(900, score))


def get_risk_tier(score: int) -> dict:
    if score >= 750:
        return {
            "tier": "Low Risk",
            "color": "#22c55e",
            "emoji": "LOW",
            "description": "Excellent creditworthiness",
        }
    if score >= 600:
        return {
            "tier": "Medium Risk",
            "color": "#f59e0b",
            "emoji": "MEDIUM",
            "description": "Moderate risk - manual review recommended",
        }
    return {
        "tier": "High Risk",
        "color": "#ef4444",
        "emoji": "HIGH",
        "description": "High probability of default",
    }


def check_eligibility(user: dict) -> list[dict]:
    issues: list[dict] = []

    if user.get("avg_payment_delay_days", 0) > 60:
        issues.append(
            {
                "rule": "Payment Delay Exceeded",
                "detail": f"Delay: {user['avg_payment_delay_days']:.0f} days (max: 60)",
                "severity": "HIGH",
            }
        )
    if user.get("loan_inquiry_count_6m", 0) > 8:
        issues.append(
            {
                "rule": "Excessive Loan Inquiries",
                "detail": f"Inquiries: {user['loan_inquiry_count_6m']} (max: 8)",
                "severity": "HIGH",
            }
        )
    if user.get("bounce_rate_txn", 0) > 0.5:
        issues.append(
            {
                "rule": "High Bounce Rate",
                "detail": f"Bounce: {user['bounce_rate_txn']:.0%} (max: 50%)",
                "severity": "HIGH",
            }
        )
    if user.get("bill_payment_consistency", 1) < 0.3:
        issues.append(
            {
                "rule": "Poor Payment History",
                "detail": f"Consistency: {user['bill_payment_consistency']:.0%}",
                "severity": "MEDIUM",
            }
        )
    if user.get("kyc_completion_score", 1) < 0.75:
        issues.append(
            {
                "rule": "Incomplete KYC",
                "detail": f"KYC: {user['kyc_completion_score']:.0%}",
                "severity": "MEDIUM",
            }
        )
    return issues


def final_decision(score: int, issues: list[dict]) -> dict:
    high_severity = [issue for issue in issues if issue["severity"] == "HIGH"]
    if high_severity:
        return {
            "decision": "REJECTED",
            "color": "#ef4444",
            "emoji": "REJECTED",
            "reason": f"Failed {len(high_severity)} eligibility rule(s)",
            "override": True,
        }
    if score >= 750:
        return {
            "decision": "APPROVED",
            "color": "#22c55e",
            "emoji": "APPROVED",
            "reason": "Excellent credit profile",
            "override": False,
        }
    if score >= 600:
        return {
            "decision": "MANUAL REVIEW",
            "color": "#f59e0b",
            "emoji": "REVIEW",
            "reason": "Moderate risk - needs human review",
            "override": False,
        }
    return {
        "decision": "REJECTED",
        "color": "#ef4444",
        "emoji": "REJECTED",
        "reason": "Credit score below threshold",
        "override": False,
    }


def get_recommendations(score: int, issues: list[dict], user: dict) -> list[str]:
    recommendations: list[str] = []
    if user.get("avg_payment_delay_days", 0) > 15:
        recommendations.append("Reduce payment delays and enable auto-pay.")
    if user.get("savings_ratio", 0) < 0.15:
        recommendations.append("Increase savings ratio to at least 15%.")
    if user.get("kyc_completion_score", 0) < 1.0:
        recommendations.append("Complete full KYC verification.")
    if user.get("bounce_rate_txn", 0) > 0.1:
        recommendations.append("Maintain sufficient balance to reduce transaction bounces.")
    if user.get("utility_auto_payment_flag", 0) == 0:
        recommendations.append("Enable utility auto-payment to improve consistency.")
    if user.get("insurance_ownership_flag", 0) == 0:
        recommendations.append("Consider obtaining insurance coverage.")
    if score < 600:
        recommendations.append("Build at least six months of consistent financial history.")
    return recommendations[:5]


def evaluate_user(pd_value: float, user: dict) -> dict:
    score = pd_to_credit_score(pd_value)
    risk = get_risk_tier(score)
    issues = check_eligibility(user)
    decision = final_decision(score, issues)
    recommendations = get_recommendations(score, issues, user)
    return {
        "pd_probability": round(pd_value, 4),
        "credit_score": score,
        "risk_tier": risk,
        "decision": decision,
        "issues": issues,
        "recommendations": recommendations,
        "score_breakdown": {
            "max_score": 900,
            "min_score": 300,
            "current_score": score,
            "percentile": round((score - 300) / 600 * 100, 1),
        },
    }
