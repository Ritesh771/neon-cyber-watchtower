from telegram import Bot
import asyncio
import cv2
import numpy as np

class Notifier:
    def __init__(self, token, chat_id):
        self.bot = Bot(token=token)
        self.chat_id = chat_id

    async def send_alert_async(self, alert_type, details, frame):
        """Send alert with snapshot to Telegram."""
        message = f"🚨 {alert_type}\nDetails: {details}\nTime: {details['timestamp']}"
        _, img_encoded = cv2.imencode('.jpg', frame)
        await self.bot.send_photo(chat_id=self.chat_id, photo=img_encoded.tobytes(), caption=message)

    def send_alert(self, alert_type, details, frame):
        """Synchronous wrapper for async Telegram alert."""
        asyncio.run(self.send_alert_async(alert_type, details, frame))