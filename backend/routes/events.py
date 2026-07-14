"""
Key events endpoints.

GET /api/events              -> full list of researched events
GET /api/events/<event_id>   -> a single event by id
GET /api/events/categories   -> distinct event categories (for filter UI)
"""

from flask import Blueprint, jsonify, abort
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from data_utils import get_events_df

events_bp = Blueprint("events", __name__)


def _serialize(row):
    return {
        "event_id": int(row.event_id),
        "date": row.start_date.strftime("%Y-%m-%d"),
        "name": row.event_name,
        "category": row.category,
        "description": row.description,
    }


@events_bp.route("", methods=["GET"])
def get_events():
    df = get_events_df()
    return jsonify([_serialize(row) for row in df.itertuples()])


@events_bp.route("/categories", methods=["GET"])
def get_categories():
    df = get_events_df()
    return jsonify(sorted(df["category"].unique().tolist()))


@events_bp.route("/<int:event_id>", methods=["GET"])
def get_event(event_id):
    df = get_events_df()
    match = df[df["event_id"] == event_id]
    if match.empty:
        abort(404, description=f"No event with id {event_id}")
    return jsonify(_serialize(next(match.itertuples())))
