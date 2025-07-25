Crime Detection Backend
A Python-based backend for real-time crime and unusual behavior detection using an IP webcam stream.
Setup

Install Dependencies:
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt


Configure:

Update app/main.py, app/routes.py with your IP webcam URL (e.g., http://192.168.31.159:8080/video).
Set Telegram bot token and chat ID in app/main.py.


Run:
chmod +x run.sh
./run.sh



API Endpoints

GET /status: System status and alert count.
GET /frame: Current annotated frame (JPEG).
GET /logs: Incident logs with timestamps.
POST /configure: Update settings (placeholder).

Notes

Runs on CPU (no GPU required).
Uses YOLOv8n for object detection, MoViNet for action recognition, and optical flow for anomaly detection.
Logs saved in app/logs/.
CORS enabled for React frontend at http://localhost:3000.

