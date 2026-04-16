# ============================================================================
# RISK_ENGINE.PY - Enhanced Credit Risk Scoring & Decision Logic
# ============================================================================

def pd_to_credit_score(pd_value: float) -> int:
    """Convert PD to credit score (300-900)."""
    score = int((1 - pd_value) * 600 + 300)
    return max(300, min(900, score))


def get_risk_tier(score: int) -> dict:
    """Assign risk tier with styling."""
    if score >= 750:
        return {
            'tier': 'Low Risk',
            'color': '#22c55e',
            'emoji': '🟢',
            'description': 'Excellent creditworthiness'
        }
    elif score >= 600:
        return {
            'tier': 'Medium Risk',
            'color': '#f59e0b',
            'emoji': '🟡',
            'description': 'Moderate risk - manual review recommended'
        }
    else:
        return {
            'tier': 'High Risk',
            'color': '#ef4444',
            'emoji': '🔴',
            'description': 'High probability of default'
        }


def check_eligibility(user: dict) -> list:
    """Rule-based hard filters."""
    issues = []

    if user.get('avg_payment_delay_days', 0) > 60:
        issues.append({
            'rule': 'Payment Delay Exceeded',
            'detail': f"Delay: {user['avg_payment_delay_days']:.0f} days (max: 60)",
            'severity': 'HIGH'
        })

    if user.get('loan_inquiry_count_6m', 0) > 8:
        issues.append({
            'rule': 'Excessive Loan Inquiries',
            'detail': f"Inquiries: {user['loan_inquiry_count_6m']} (max: 8)",
            'severity': 'HIGH'
        })

    if user.get('bounce_rate_txn', 0) > 0.5:
        issues.append({
            'rule': 'High Bounce Rate',
            'detail': f"Bounce: {user['bounce_rate_txn']:.0%} (max: 50%)",
            'severity': 'HIGH'
        })

    if user.get('bill_payment_consistency', 1) < 0.3:
        issues.append({
            'rule': 'Poor Payment History',
            'detail': f"Consistency: {user['bill_payment_consistency']:.0%}",
            'severity': 'MEDIUM'
        })

    if user.get('kyc_completion_score', 1) < 0.75:
        issues.append({
            'rule': 'Incomplete KYC',
            'detail': f"KYC: {user['kyc_completion_score']:.0%}",
            'severity': 'MEDIUM'
        })

    return issues


def final_decision(score: int, issues: list) -> dict:
    """Combine score + rules for final decision."""
    high_severity = [i for i in issues if i['severity'] == 'HIGH']

    if high_severity:
        return {
            'decision': 'REJECTED',
            'color': '#ef4444',
            'emoji': '❌',
            'reason': f"Failed {len(high_severity)} eligibility rule(s)",
            'override': True
        }

    if score >= 750:
        return {
            'decision': 'APPROVED',
            'color': '#22c55e',
            'emoji': '✅',
            'reason': 'Excellent credit profile',
            'override': False
        }
    elif score >= 600:
        return {
            'decision': 'MANUAL REVIEW',
            'color': '#f59e0b',
            'emoji': '⚠️',
            'reason': 'Moderate risk - needs human review',
            'override': False
        }
    else:
        return {
            'decision': 'REJECTED',
            'color': '#ef4444',
            'emoji': '❌',
            'reason': 'Credit score below threshold',
            'override': False
        }


def get_recommendations(score: int, issues: list, user: dict) -> list:
    """Generate improvement suggestions."""
    recs = []

    if user.get('avg_payment_delay_days', 0) > 15:
        recs.append("⏰ Reduce payment delays - set up auto-pay")

    if user.get('savings_ratio', 0) < 0.15:
        recs.append("💰 Increase savings ratio to at least 15%")

    if user.get('kyc_completion_score', 0) < 1.0:
        recs.append("📋 Complete full KYC verification")

    if user.get('bounce_rate_txn', 0) > 0.1:
        recs.append("🏦 Maintain sufficient balance")

    if user.get('utility_auto_payment_flag', 0) == 0:
        recs.append("🔄 Enable auto-payment for utilities")

    if user.get('insurance_ownership_flag', 0) == 0:
        recs.append("🛡️ Consider getting insurance")

    if score < 600:
        recs.append("📊 Build 6+ months of consistent history")

    return recs[:5]


def evaluate_user(pd_value: float, user: dict) -> dict:
    """Complete risk evaluation pipeline."""
    score = pd_to_credit_score(pd_value)
    risk = get_risk_tier(score)
    issues = check_eligibility(user)
    decision = final_decision(score, issues)
    recommendations = get_recommendations(score, issues, user)

    return {
        'pd_probability': round(pd_value, 4),
        'credit_score': score,
        'risk_tier': risk,
        'decision': decision,
        'issues': issues,
        'recommendations': recommendations,
        'score_breakdown': {
            'max_score': 900,
            'min_score': 300,
            'current_score': score,
            'percentile': round((score - 300) / 600 * 100, 1)
        }
    }