import cv2
import os

class Camera:
    def __init__(self, stream_url):
        self.cap = cv2.VideoCapture(stream_url)
        if not self.cap.isOpened():
            raise ValueError("Cannot open video stream")
        self.annotated_frame = None

    def get_frame(self):
        """Get the latest frame from the stream."""
        ret, frame = self.cap.read()
        return frame if ret else None

    def set_annotated_frame(self, frame):
        """Store the annotated frame for API access."""
        self.annotated_frame = frame.copy()

    def save_frame(self, frame, path):
        """Save frame to disk."""
        cv2.imwrite(path, frame)

    def get_annotated_frame(self):
        """Return the latest annotated frame."""
        return self.annotated_frame

    def release(self):
        """Release the capture."""
        self.cap.release()