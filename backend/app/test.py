# test_stream.py
import cv2
stream_url = "http://192.168.31.159:8080/shot.jpg"  # Replace with correct URL
cap = cv2.VideoCapture(stream_url)
if not cap.isOpened():
    print("Cannot open stream")
    exit()
while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break
    cv2.imshow("Frame", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()