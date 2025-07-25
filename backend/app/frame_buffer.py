import threading

class FrameBuffer:
    def __init__(self):
        self.lock = threading.Lock()
        self.frame = None

    def set(self, frame):
        with self.lock:
            self.frame = frame.copy()

    def get(self):
        with self.lock:
            return self.frame.copy() if self.frame is not None else None

frame_buffer = FrameBuffer()
annotated_buffer = FrameBuffer() 