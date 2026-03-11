# Dockerfile for Telegram bot
FROM python:3.11-slim
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir python-telegram-bot || true
ENTRYPOINT ["python", "bot.py"]
