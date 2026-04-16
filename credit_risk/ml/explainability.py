"""SHAP explainability utilities."""

from __future__ import annotations

import importlib
import json
import os
import tempfile

import pandas as pd


def ensure_shap_available():
    shap = importlib.import_module("shap")
    _patch_shap_xgb_loader(shap)
    return shap


def _patch_shap_xgb_loader(shap_module) -> None:
    """Patch SHAP's XGBoost loader to close temporary model files cleanly."""
    tree_module = importlib.import_module("shap.explainers._tree")
    loader = tree_module.XGBTreeModelLoader

    if getattr(loader.read_xgb_params, "__name__", "") == "_safe_read_xgb_params":
        return

    def _safe_read_xgb_params(xgb_model):
        import xgboost
        from packaging import version

        with tempfile.TemporaryDirectory() as tmp_dir:
            if version.parse(xgboost.__version__) >= version.parse("1.6.0"):
                tmp_file = os.path.join(tmp_dir, "model.ubj")
                xgb_model.save_model(tmp_file)
                with open(tmp_file, "rb") as handle:
                    xgb_params = tree_module.decode_ubjson_buffer(handle)
            else:
                tmp_file = os.path.join(tmp_dir, "model.json")
                xgb_model.save_model(tmp_file)
                with open(tmp_file, encoding="utf-8") as handle:
                    xgb_params = json.load(handle)
        return xgb_params["learner"]

    loader.read_xgb_params = staticmethod(_safe_read_xgb_params)


def compute_global_shap_importance(model, X_train: pd.DataFrame, X_test: pd.DataFrame) -> pd.DataFrame:
    shap = ensure_shap_available()
    sample_size = min(500, len(X_test))
    background_size = min(100, len(X_train))

    X_background = X_train.sample(n=background_size, random_state=42)
    X_sample = X_test.sample(n=sample_size, random_state=42)

    if model.__class__.__name__ == "LogisticRegression":
        explainer = shap.LinearExplainer(model, X_background)
    else:
        explainer = shap.TreeExplainer(model)

    shap_values = explainer.shap_values(X_sample)
    if isinstance(shap_values, list):
        shap_values = shap_values[1]
    if len(shap_values.shape) == 3:
        shap_values = shap_values[:, :, 1]

    return (
        pd.DataFrame(
            {
                "Feature": X_sample.columns.tolist(),
                "Mean_SHAP_Value": abs(shap_values).mean(axis=0),
            }
        )
        .sort_values("Mean_SHAP_Value", ascending=False)
        .reset_index(drop=True)
    )
