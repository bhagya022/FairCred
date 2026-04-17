"""FastAPI entry point for the credit risk backend."""

import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from credit_risk.audit import get_recent_logs, log_prediction
from credit_risk.schemas import (
    CreditRiskInput,
    ExplanationResponse,
    PredictionResponse,
    EvaluationReport,
    FairnessReport,
    ModelMetric,
)
from credit_risk.services.prediction_service import CreditRiskPredictor
from credit_risk.services.analytics_service import get_evaluation_report, get_fairness_report, get_model_metrics
from backend.auth import LoginRequest, verify_user


app = FastAPI(
    title="Credit Risk Backend",
    version="1.0.0",
    description="Backend API for the credit risk model and decision engine.",
)

# Allow the dashboard HTML to call the API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the dashboard HTML from /static
_STATIC_DIR = Path(__file__).parent.parent / "static"
if _STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(_STATIC_DIR)), name="static")

predictor = CreditRiskPredictor()


@app.get("/", include_in_schema=False)
def serve_dashboard():
    index = _STATIC_DIR / "index.html"
    if index.exists():
        return FileResponse(str(index))
    raise HTTPException(status_code=404, detail="Dashboard UI not found")


@app.post("/login")
def login(creds: LoginRequest) -> dict:
    if verify_user(creds):
        return {"status": "success", "token": "demo-token-xyz"}
    raise HTTPException(status_code=401, detail="Invalid credentials")


def _payload_to_dict(payload: CreditRiskInput) -> dict:
    if hasattr(payload, "model_dump"):
        return payload.model_dump()
    return payload.dict()


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "model_loaded": predictor.model is not None}


@app.get("/logs")
def logs(limit: int = 10) -> list[dict]:
    return get_recent_logs(limit)


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: CreditRiskInput) -> PredictionResponse:
    try:
        payload_dict = _payload_to_dict(payload)
        result = predictor.predict(payload_dict)
        log_prediction(payload_dict, result, mode="api")
        return PredictionResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/explain", response_model=ExplanationResponse)
def explain(payload: CreditRiskInput) -> ExplanationResponse:
    try:
        return ExplanationResponse(
            explanations=predictor.get_shap_explanation(_payload_to_dict(payload))
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/metrics", response_model=list[ModelMetric])
def metrics() -> list[dict]:
    return get_model_metrics()


@app.get("/evaluation", response_model=EvaluationReport)
def evaluation() -> dict:
    report = get_evaluation_report()
    if not report:
        raise HTTPException(status_code=404, detail="Evaluation artifacts not found")
    return report


@app.get("/fairness", response_model=FairnessReport)
def fairness() -> dict:
    report = get_fairness_report()
    if not report:
        raise HTTPException(status_code=404, detail="Prediction logs not found")
    return report

