# Dockerfile for AI System orchestrator
FROM python:3.11-slim
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir openclaw || true
ENTRYPOINT ["python", "orchestrator.py"]
