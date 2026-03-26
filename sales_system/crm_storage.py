"""Simple CRM storage using JSON file."""

import json
import os
import threading
from datetime import datetime

CRM_FILE = os.getenv("CRM_STORAGE_PATH", "sales_system/crm.json")

# simple in-process lock to prevent concurrent writes
_LOCK = threading.Lock()


def load_crm():
    if not os.path.exists(CRM_FILE):
        return []
    try:
        with open(CRM_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, ValueError):
        # corrupted file – return empty list to avoid crashing
        return []


def save_crm(data):
    with open(CRM_FILE, "w") as f:
        json.dump(data, f, indent=2)


def add_lead(name: str, email: str, notes: str=""):
    with _LOCK:
        leads = load_crm()
        leads.append({
            "name": name,
            "email": email,
            "notes": notes,
            "added": datetime.utcnow().isoformat()
        })
        save_crm(leads)
    return "lead added"


def list_leads():
    return load_crm()
