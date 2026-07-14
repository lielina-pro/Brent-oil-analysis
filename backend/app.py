"""
Brent Oil Analysis — Flask backend entrypoint.

Serves historical price data, the compiled key-events dataset, and the
Task 2 Bayesian change point model results to the React dashboard.

Run with:
    python app.py
Defaults to http://localhost:5000
"""

from flask import Flask, jsonify
from flask_cors import CORS

from routes.prices import prices_bp
from routes.events import events_bp
from routes.changepoints import changepoints_bp


def create_app():
    app = Flask(__name__)
    CORS(app)  # allow the React dev server (different origin/port) to call these APIs

    app.register_blueprint(prices_bp, url_prefix="/api/prices")
    app.register_blueprint(events_bp, url_prefix="/api/events")
    app.register_blueprint(changepoints_bp, url_prefix="/api/changepoints")

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"})

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
