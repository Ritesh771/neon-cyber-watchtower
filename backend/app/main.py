from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
import uvicorn
import asyncio
import threading
from app.global_camera import camera
from app.detector import Detector
from app.anomaly import AnomalyDetector
from app.notifier import Notifier
from app.utils import ensure_dir
import os
from app.frame_buffer import frame_buffer, annotated_buffer

app = FastAPI(title="Crime Detection Backend")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

def capture_frames(camera):
    while True:
        ret, frame = camera.cap.read()
        if ret:
            frame_buffer.set(frame)

def run_detection(detector, anomaly_detector, notifier):
    while True:
        frame = frame_buffer.get()
        if frame is not None:
            # Run detections
            detections = detector.detect(frame)
            anomalies = anomaly_detector.detect(frame)
            # Process alerts (optional, as before)
            for alert_type, details in detections + anomalies:
                notifier.send_alert(alert_type, details, frame)
            # Save annotated frame
            annotated_buffer.set(frame)

@app.on_event("startup")
def start_threads():
    from app.global_camera import camera
    detector = Detector()
    anomaly_detector = AnomalyDetector()
    notifier = Notifier("your_bot_token", "your_chat_id")
    import threading
    threading.Thread(target=capture_frames, args=(camera,), daemon=True).start()
    threading.Thread(target=run_detection, args=(detector, anomaly_detector, notifier), daemon=True).start()

if __name__ == "__main__":
    # Run FastAPI
    uvicorn.run(app, host="0.0.0.0", port=8000)