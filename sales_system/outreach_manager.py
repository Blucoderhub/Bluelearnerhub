"""Manage email outreach; drafts must be approved manually before sending."""

import os
import smtplib
from email.mime.text import MIMEText

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
# timeout in seconds for SMTP connections
SMTP_TIMEOUT = int(os.getenv("SMTP_TIMEOUT", 10))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASSWORD")


def send_email(to_address: str, subject: str, body: str):
    if not SMTP_USER or not SMTP_PASS:
        raise ValueError("SMTP credentials not configured")
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = to_address

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=SMTP_TIMEOUT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)
    return "sent"


# note: this module should only send after manual approval
def prepare_and_send(to_address: str, subject: str, body: str, approved: bool=False):
    if not approved:
        return "email draft created; not sent"
    return send_email(to_address, subject, body)
