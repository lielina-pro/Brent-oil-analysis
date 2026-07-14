"""
Change point model results endpoints (Task 2 outputs).

GET /api/changepoints                -> everything (full-series model, PELT
                                         breakpoints, focused case studies)
GET /api/changepoints/full-series    -> the mandatory full-history model result
GET /api/changepoints/pelt           -> multiple-change-point (PELT) extension
GET /api/changepoints/case-studies   -> focused case studies (COVID, Russia-Ukraine)
"""

import json
from pathlib import Path
from flask import Blueprint, jsonify

changepoints_bp = Blueprint("changepoints", __name__)

RESULTS_PATH = Path(__file__).resolve().parents[1] / "data" / "changepoint_results.json"


def _load():
    with open(RESULTS_PATH) as f:
        return json.load(f)


@changepoints_bp.route("", methods=["GET"])
def get_all():
    return jsonify(_load())


@changepoints_bp.route("/full-series", methods=["GET"])
def get_full_series():
    return jsonify(_load()["full_series_model"])


@changepoints_bp.route("/pelt", methods=["GET"])
def get_pelt():
    return jsonify(_load()["pelt_breakpoints"])


@changepoints_bp.route("/case-studies", methods=["GET"])
def get_case_studies():
    return jsonify(_load()["case_studies"])
