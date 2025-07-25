from ultralytics import YOLO
import numpy as np
import cv2
import tensorflow as tf
import tensorflow_hub as hub
import time

class Detector:
    def __init__(self):
        # Load YOLOv8n for object detection
        self.yolo = YOLO("yolov8n.pt")
        # Load MoViNet for action recognition
        # self.movinet = hub.load("https://tfhub.dev/google/MoViNet-A2-Base/1")
        # self.movinet_classifier = tf.keras.Sequential([
        #     tf.keras.layers.Input(shape=(None, 224, 224, 3)),
        #     self.movinet,
        #     tf.keras.layers.Dense(5, activation='softmax')  # Example: 5 action classes
        # ])
        # self.action_labels = ["normal", "fighting", "snatching", "kidnapping", "theft"]
        # self.frame_buffer = []
        # self.buffer_size = 16  # Frames for action recognition

    def detect(self, frame):
        """Detect objects and actions in the frame."""
        alerts = []

        # YOLO object detection
        results = self.yolo(frame, classes=[0, 76, 77])  # Person, knife, gun
        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls = int(box.cls)
                conf = float(box.conf)
                if conf > 0.5:
                    label = self.yolo.names[cls]
                    if label in ["knife", "gun"]:
                        alerts.append(("Weapon Detected", {
                            "type": label,
                            "confidence": conf,
                            "timestamp": time.strftime("%Y%m%d_%H%M%S")
                        }))
                    elif label == "person":
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1-10),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # Action recognition with MoViNet (DISABLED)
        # resized_frame = cv2.resize(frame, (224, 224))
        # self.frame_buffer.append(resized_frame)
        # if len(self.frame_buffer) == self.buffer_size:
        #     input_frames = np.array(self.frame_buffer)[None, ...] / 255.0
        #     predictions = self.movinet_classifier.predict(input_frames, verbose=0)
        #     action_idx = np.argmax(predictions[0])
        #     action_conf = predictions[0][action_idx]
        #     if action_conf > 0.7 and action_idx != 0:  # Ignore "normal"
        #         alerts.append((self.action_labels[action_idx].capitalize(), {
        #             "confidence": float(action_conf),
        #             "timestamp": time.strftime("%Y%m%d_%H%M%S")
        #         }))
        #     self.frame_buffer.pop(0)

        return alerts