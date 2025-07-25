import cv2
import numpy as np
import time

class AnomalyDetector:
    def __init__(self):
        self.prev_frame = None
        self.flow = None
        self.anomaly_threshold = 5000  # Adjust based on testing
        self.consecutive_anomalies = 0
        self.min_consecutive = 5  # Require 5 frames to confirm anomaly

    def detect(self, frame):
        """Detect motion-based anomalies using optical flow and frame differencing."""
        alerts = []
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Frame differencing
        if self.prev_frame is not None:
            diff = cv2.absdiff(gray, self.prev_frame)
            _, thresh = cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY)
            diff_score = np.sum(thresh) / 255

            # Optical flow
            flow = cv2.calcOpticalFlowFarneback(self.prev_frame, gray, None,
                                                0.5, 3, 15, 3, 5, 1.2, 0)
            mag, _ = cv2.cartToPolar(flow[..., 0], flow[..., 1])
            flow_score = np.mean(mag)

            # Anomaly detection
            if diff_score > self.anomaly_threshold or flow_score > 5:
                self.consecutive_anomalies += 1
                if self.consecutive_anomalies >= self.min_consecutive:
                    alerts.append(("Unusual Behavior", {
                        "type": "Sudden motion or loitering",
                        "score": max(diff_score, flow_score * 1000),
                        "timestamp": time.strftime("%Y%m%d_%H%M%S")
                    }))
                    cv2.putText(frame, "Anomaly Detected", (10, 30),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            else:
                self.consecutive_anomalies = 0

        self.prev_frame = gray.copy()
        return alerts