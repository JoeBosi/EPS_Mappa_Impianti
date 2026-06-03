"""
Mappa Italia - Server Flask
Legge e scrive i marker nel file markers.csv
"""

from flask import Flask, jsonify, request, send_from_directory
import csv
import os
import uuid

app = Flask(__name__, static_folder=".")
CSV_FILE = os.path.join(os.path.dirname(__file__), "markers.csv")
FIELDNAMES = ["id", "nome", "indirizzo", "lat", "lng"]


def read_markers():
    if not os.path.exists(CSV_FILE):
        return []
    with open(CSV_FILE, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return [row for row in reader]


def write_markers(markers):
    with open(CSV_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(markers)


@app.route("/")
def index():
    return send_from_directory(".", "index.html")


@app.route("/api/markers", methods=["GET"])
def get_markers():
    return jsonify(read_markers())


@app.route("/api/markers", methods=["POST"])
def add_marker():
    data = request.get_json()
    if not data or not data.get("nome") or not data.get("lat") or not data.get("lng"):
        return jsonify({"error": "Dati mancanti"}), 400
    marker = {
        "id": str(uuid.uuid4())[:8],
        "nome": data["nome"].strip(),
        "indirizzo": data.get("indirizzo", "").strip(),
        "lat": str(data["lat"]),
        "lng": str(data["lng"]),
    }
    markers = read_markers()
    markers.append(marker)
    write_markers(markers)
    return jsonify(marker), 201


@app.route("/api/markers/<marker_id>", methods=["DELETE"])
def delete_marker(marker_id):
    markers = read_markers()
    new_markers = [m for m in markers if m["id"] != marker_id]
    if len(new_markers) == len(markers):
        return jsonify({"error": "Marker non trovato"}), 404
    write_markers(new_markers)
    return jsonify({"ok": True})


if __name__ == "__main__":
    print("=" * 50)
    print("  Mappa Italia - Server avviato")
    print("  Apri il browser su: http://localhost:5000")
    print("=" * 50)
    app.run(debug=False, port=5000)
