"""Simple CRM storage using JSON file."""

import json
import os
from datetime import datetime

CRM_FILE = os.getenv("CRM_STORAGE_PATH", "sales_system/crm.json")


def load_crm():
    if not os.path.exists(CRM_FILE):
        return []
    with open(CRM_FILE, "r") as f:
        return json.load(f)


def save_crm(data):
    with open(CRM_FILE, "w") as f:
        json.dump(data, f, indent=2)


def add_lead(name: str, email: str, notes: str=""):
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
