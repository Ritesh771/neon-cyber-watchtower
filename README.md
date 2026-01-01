# Neon Cyber Watchtower

Welcome to the **Neon Cyber Watchtower** backend, a Python-based solution for real-time crime and anomaly detection using IP webcam streams. This software integrates advanced machine learning models to ensure effective monitoring and alerting.

---

## Features
- **Real-Time Detection**: Detects unusual behavior and criminal activities.
- **Integrated AI Models**:
  - **YOLOv8n** for object detection.
  - **MoViNet** for action recognition.
  - Optical flow for anomaly detection.
- **Alerting System**: Configurable integration with Telegram for instant notifications.
- **System Logs**: Comprehensive incident logs for review.

---

## Getting Started

### Prerequisites
Ensure the following are installed on your system:
- Python 3.8 or later
- Virtual Environment (venv)

### Setup

1. **Install Dependencies**:
    ```bash
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

2. **Configuration**:
    - Update `app/main.py` and `app/routes.py` with your IP webcam URL:
      ```python
      # Example: Update with your IP Camera URL
      CAMERA_URL = "http://192.168.31.159:8080/video"
      ```
    - Set your **Telegram bot token** and **chat ID** in `app/main.py`.

3. **Running the Application**:
    - Give execution permissions to the `run.sh` script and launch:
      ```bash
      chmod +x run.sh
      ./run.sh
      ```

---

## API Endpoints

| Method | Endpoint        | Description                                              |
|--------|-----------------|----------------------------------------------------------|
| `GET`  | `/status`       | Check system status and alert counts.                    |
| `GET`  | `/frame`        | Fetch the current annotated frame in JPEG format.        |
| `GET`  | `/logs`         | Retrieve incident logs with timestamps.                  |
| `POST` | `/configure`    | Placeholder for updating application settings.           |

---

## Additional Notes
- Designed to run **on CPU** (GPU not required).
- CORS enabled for seamless integration with a React frontend hosted at `http://localhost:3000`.
- Logs are saved in the `app/logs/` directory.

---

## License
This project is open-source. Feel free to contribute or modify for your needs.

---

For any questions or contributions, please feel free to [open an issue](https://github.com/Ritesh771/neon-cyber-watchtower/issues) or reach out via GitHub.
