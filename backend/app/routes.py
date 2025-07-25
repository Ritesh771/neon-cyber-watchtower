from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse, StreamingResponse
import cv2
import numpy as np
import os
import glob
import time
from app.global_camera import camera
from app.frame_buffer import annotated_buffer

router = APIRouter()
alert_count = 0
logs = []

@router.get("/status")
def get_status():
    """Return system status and alert count."""
    global alert_count
    return {"status": "running", "alert_count": alert_count}

@router.get("/frame")
def get_frame():
    """Return the current annotated frame."""
    frame = annotated_buffer.get()
    if frame is None:
        return JSONResponse(status_code=404, content={"message": "No frame available"})
    _, buffer = cv2.imencode('.jpg', frame)
    return Response(content=buffer.tobytes(), media_type="image/jpeg")

@router.get("/mjpeg")
def mjpeg_stream():
    def generate():
        while True:
            frame = annotated_buffer.get()
            if frame is not None:
                _, buffer = cv2.imencode('.jpg', frame)
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
            time.sleep(0.03)  # ~30 FPS
    return StreamingResponse(generate(), media_type='multipart/x-mixed-replace; boundary=frame')

@router.get("/logs")
def get_logs():
    """Return incident logs."""
    global logs
    log_files = glob.glob("app/logs/*.jpg")
    logs = [{"timestamp": os.path.basename(f).split('_')[1].split('.')[0], "type": os.path.basename(f).split('_')[0]}
            for f in log_files]
    return {"logs": logs}

@router.post("/configure")
def configure(settings: dict):
    """Update detection settings (placeholder)."""
    return {"message": "Settings updated", "settings": settings}