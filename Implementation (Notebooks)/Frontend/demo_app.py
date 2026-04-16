import streamlit as st
import numpy as np
from datetime import datetime

# ============================================================================
# PAGE CONFIG
# ============================================================================

st.set_page_config(
    page_title="FairCred - Credit Scoring",
    page_icon="💳",
    layout="centered"
)

# ============================================================================
# CUSTOM CSS
# ============================================================================

st.markdown("""
<style>
    .main-header {
        text-align: center;
        color: #1f77b4;
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }
    .sub-header {
        text-align: center;
        color: #666;
        margin-bottom: 2rem;
    }
    .prediction-box {
        padding: 2rem;
        border-radius: 15px;
        margin: 2rem 0;
        text-align: center;
    }
    .approved {
        background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
        border: 3px solid #28a745;
    }
    .rejected {
        background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
        border: 3px solid #dc3545;
    }
    .review {
        background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
        border: 3px solid #ffc107;
    }
    .metric-card {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 10px;
        text-align: center;
        margin: 0.5rem 0;
    }
</style>
""", unsafe_allow_html=True)

# ============================================================================
# HEADER
# ============================================================================

st.markdown('<h1 class="main-header">💳 FairCred</h1>', unsafe_allow_html=True)
st.markdown('<p class="sub-header">Alternate Credit Scoring for Underbanked Populations</p>', unsafe_allow_html=True)

st.info("📌 **Demo Mode**: This interface uses 8 key features from our 25-feature model. Full integration pending in Phase 2 (April-May 2024).")

st.markdown("---")

# ============================================================================
# USER INPUT FORM
# ============================================================================

st.header("Enter Borrower Details")

# Layout in 2 columns
col1, col2 = st.columns(2)

with col1:
    st.subheader("💼 Socio-Economic")
    
    income_tier = st.select_slider(
        "Monthly Income Tier",
        options=[
            "Tier 1 (₹0-10k)",
            "Tier 2 (₹10-25k)",
            "Tier 3 (₹25-50k)",
            "Tier 4 (₹50-100k)",
            "Tier 5 (₹100k+)"
        ],
        value="Tier 3 (₹25-50k)"
    )
    income_tier_value = ["Tier 1 (₹0-10k)", "Tier 2 (₹10-25k)", "Tier 3 (₹25-50k)", 
                        "Tier 4 (₹50-100k)", "Tier 5 (₹100k+)"].index(income_tier) + 1
    
    employment_type = st.selectbox(
        "Employment Type",
        options=['Salaried', 'Self-Employed', 'Gig Worker', 'Student', 'Unemployed']
    )
    
    employment_tenure = st.number_input(
        "Employment Tenure (months)",
        min_value=0,
        max_value=600,
        value=24,
        step=6
    )
    
    dependents = st.number_input(
        "Number of Dependents",
        min_value=0,
        max_value=10,
        value=2
    )

with col2:
    st.subheader("📊 Behavioral Patterns")
    
    payment_delay = st.slider(
        "Average Payment Delay (days)",
        min_value=0,
        max_value=90,
        value=5,
        help="How many days late are you on average with bill payments?"
    )
    
    bill_consistency = st.slider(
        "Bill Payment Consistency",
        min_value=0.0,
        max_value=1.0,
        value=0.8,
        step=0.05,
        format="%.0f%%",
        help="What % of bills do you pay on time?"
    )
    
    upi_frequency = st.number_input(
        "UPI Transactions per Month",
        min_value=0,
        max_value=500,
        value=50,
        step=5
    )
    
    spending_volatility = st.slider(
        "Spending Volatility",
        min_value=0.0,
        max_value=5.0,
        value=0.8,
        step=0.1,
        help="How stable is your monthly spending? (0=very stable, 5=very volatile)"
    )

st.markdown("---")

# ============================================================================
# PREDICT BUTTON
# ============================================================================

if st.button("🎯 PREDICT CREDIT RISK", type="primary", use_container_width=True):
    
    with st.spinner("Analyzing creditworthiness..."):
        import time
        time.sleep(1)  # Simulate processing
        
        # ====================================================================
        # PREDICTION LOGIC
        # ====================================================================
        
        risk_score = 0.0
        risk_factors = []
        protective_factors = []
        
        # Payment delay (highest weight - 30%)
        if payment_delay > 30:
            risk_score += 0.30
            risk_factors.append(f"High payment delay: {payment_delay} days")
        elif payment_delay > 15:
            risk_score += 0.15
            risk_factors.append(f"Moderate payment delay: {payment_delay} days")
        else:
            protective_factors.append(f"Low payment delay: {payment_delay} days")
        
        # Bill consistency (weight - 20%)
        if bill_consistency < 0.5:
            risk_score += 0.20
            risk_factors.append(f"Poor bill consistency: {bill_consistency*100:.0f}%")
        elif bill_consistency > 0.8:
            risk_score -= 0.15
            protective_factors.append(f"Good bill consistency: {bill_consistency*100:.0f}%")
        
        # Income tier (weight - 25%)
        if income_tier_value <= 2:
            risk_score += 0.20
            risk_factors.append(f"Low income: {income_tier}")
        elif income_tier_value >= 4:
            risk_score -= 0.20
            protective_factors.append(f"High income: {income_tier}")
        
        # Spending volatility (weight - 15%)
        if spending_volatility > 2.5:
            risk_score += 0.15
            risk_factors.append(f"High spending volatility: {spending_volatility:.1f}")
        elif spending_volatility < 1.0:
            protective_factors.append(f"Stable spending pattern: {spending_volatility:.1f}")
        
        # Employment type (weight - 15%)
        if employment_type in ['Gig Worker', 'Unemployed']:
            risk_score += 0.15
            risk_factors.append(f"Unstable employment: {employment_type}")
        elif employment_type == 'Salaried':
            risk_score -= 0.10
            protective_factors.append("Stable salaried employment")
        
        # Employment tenure (weight - 10%)
        if employment_tenure > 36:
            risk_score -= 0.08
            protective_factors.append(f"Long tenure: {employment_tenure} months")
        elif employment_tenure < 6:
            risk_score += 0.08
            risk_factors.append(f"Short tenure: {employment_tenure} months")
        
        # UPI frequency (weight - 8%)
        if upi_frequency > 100:
            risk_score -= 0.05
            protective_factors.append(f"High digital activity: {upi_frequency} txns/month")
        elif upi_frequency < 10:
            risk_score += 0.05
        
        # Dependents (weight - 7%)
        if dependents > 4:
            risk_score += 0.07
            risk_factors.append(f"High dependents: {dependents}")
        
        # Normalize risk score to 0-1
        risk_score = max(0, min(1, risk_score + 0.35))
        
        # Calculate credit score (300-900 scale)
        credit_score = int(900 - (risk_score * 600))
        
        # Determine decision
        if risk_score < 0.3:
            risk_category = "LOW RISK"
            decision = "APPROVED ✅"
            box_class = "approved"
            interest_rate = "8-10%"
            recommendation = "Standard loan approval recommended"
            emoji = "🟢"
        elif risk_score < 0.6:
            risk_category = "MEDIUM RISK"
            decision = "MANUAL REVIEW ⚠️"
            box_class = "review"
            interest_rate = "12-15%"
            recommendation = "Approve with higher interest or manual underwriting"
            emoji = "🟡"
        else:
            risk_category = "HIGH RISK"
            decision = "REJECTED ❌"
            box_class = "rejected"
            interest_rate = "N/A"
            recommendation = "High default probability - loan rejection recommended"
            emoji = "🔴"
        
        # ====================================================================
        # DISPLAY RESULTS
        # ====================================================================
        
        st.markdown("---")
        st.markdown("## 📊 Prediction Results")
        
        # Main result box
        st.markdown(f'<div class="prediction-box {box_class}">', unsafe_allow_html=True)
        st.markdown(f"# {emoji} {decision}")
        st.markdown(f"### {risk_category}")
        st.markdown(f"**Recommendation**: {recommendation}")
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Metrics
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            st.metric("Default Probability", f"{risk_score*100:.1f}%")
            st.markdown('</div>', unsafe_allow_html=True)
        
        with col2:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            st.metric("Credit Score", f"{credit_score}/900")
            st.markdown('</div>', unsafe_allow_html=True)
        
        with col3:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            st.metric("Interest Rate", interest_rate)
            st.markdown('</div>', unsafe_allow_html=True)
        
        # Contributing factors
        st.markdown("---")
        st.subheader("🔍 Key Factors Analyzed")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("**⚠️ Risk Increasing Factors:**")
            if risk_factors:
                for factor in risk_factors:
                    st.markdown(f"- {factor}")
            else:
                st.success("No major risk factors detected")
        
        with col2:
            st.markdown("**✅ Protective Factors:**")
            if protective_factors:
                for factor in protective_factors:
                    st.markdown(f"- {factor}")
            else:
                st.warning("No strong protective factors found")
        
        # Explanation
        st.markdown("---")
        st.info("""
        **How we calculated this:**
        
        This prediction is based on 8 key features from our 25-feature model:
        - Payment delay (30% weight)
        - Income tier (25% weight)
        - Bill consistency (20% weight)
        - Employment stability (15% weight)
        - Spending volatility (15% weight)
        - Employment tenure (10% weight)
        - Digital activity (8% weight)
        - Dependents (7% weight)
        
        The full production model uses 25 features and ML algorithms (Random Forest/XGBoost) for higher accuracy.
        """)

# ============================================================================
# SIDEBAR
# ============================================================================

st.sidebar.title("ℹ️ About FairCred")

st.sidebar.markdown("""
**FairCred v0.5**  
Alternate Credit Scoring System

**Current Status**: 50% Complete

**Features Used (Demo)**:
- 8/25 key features
- Rule-based prediction
- Real-time analysis

**Full Model (Phase 2)**:
- All 25 features
- XGBoost ML model
- SHAP explainability
- Real API integration

**Tech Stack**:
- Python
- Scikit-learn
- XGBoost
- SHAP
- Streamlit

---

**Next Review**: April/May 2024
""")

st.sidebar.markdown("---")
st.sidebar.caption(f"Demo Session: {datetime.now().strftime('%Y-%m-%d %H:%M')}")

# ============================================================================
# FOOTER
# ============================================================================

st.markdown("---")
st.caption("FairCred Demo v0.5 | 50% Milestone | Built with Streamlit | Powered by Explainable AI")