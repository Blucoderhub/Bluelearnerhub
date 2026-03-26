# Dockerfile for AI System orchestrator
FROM python:3.11-slim
WORKDIR /app
COPY . /app
# pin openclaw to a known version; remove '|| true' so build fails on errors
RUN pip install --no-cache-dir "openclaw==0.1.0"
ENTRYPOINT ["python", "orchestrator.py"]
