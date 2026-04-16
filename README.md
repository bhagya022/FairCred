# FairCred AI

A credit risk prediction and fairness analytics platform.

This system consists of an end-to-end ML pipeline, a FastAPI backend serving the predictive model and analytics endpoints, and a Streamlit frontend visualizing business impacts and fairness metrics.

## Getting Started

### 1. Environment Setup

Ensure you have Python installed, then install the local requirements:

```bash
pip install -r requirements.txt
```

### 2. Run the ML Pipeline (Optional)

The project includes scripts to synthetically generate, preprocess, and train the machine learning models. If `models/` or `data/` is missing, you must run this first:

```bash
python scripts/generate_data.py
python scripts/preprocess_data.py
python scripts/train_models.py
```

### 3. Run the Backend API

The backend serves the XGBoost model at `/predict` and analytical payloads at `/metrics`, `/evaluation`, and `/fairness`.

```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend API documentation is available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 4. Run the Streamlit Frontend

The frontend enables risk assessment scoring and retrospective audits of model performance and bias. In a new terminal window:

```bash
streamlit run app.py
```

Access the UI at [http://localhost:8501](http://localhost:8501).

---

## Architecure Structure

- `frontend/`: The Streamlit views and components.
- `backend/`: The FastAPI entry point (`main.py`).
- `credit_risk/`: The core library for model inference (`prediction_service.py`), data schemas (`schemas.py`), and backend analytics (`analytics_service.py`).
- `scripts/`: Training and deployment automation.
- `data/` and `models/`: Dynamically generated run-time assets (ignored by Git).
