# Dockerfile for Telegram bot
FROM python:3.11-slim
WORKDIR /app
COPY . /app
# pin python-telegram-bot and fail if install fails
RUN pip install --no-cache-dir "python-telegram-bot==23.15.2"
ENTRYPOINT ["python", "bot.py"]
