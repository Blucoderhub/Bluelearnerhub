# Sales System

Contains modules for generating leads, drafting outreach emails, managing
outreach, and storing CRM data.

Components:

* `lead_generator.py` – uses the local AirLLM model to identify customer segments.
* `email_writer.py` – drafts personalized email content.
* `outreach_manager.py` – sends emails via SMTP after manual approval.
* `crm_storage.py` – simple JSON-backed CRM for storing leads.

## Setup

Configure environment variables (see `.env.example`).

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASSWORD=your-app-specific-password-here   # Gmail requires an App
                                              # Password; do NOT use your
                                              # regular account password.
CRM_STORAGE_PATH=sales_system/crm.json
```

- Never commit `.env` files into version control; add `.env` to `.gitignore`.
- For production use a secrets manager or environment-specific injection and
  rotate credentials regularly.
- Consider using OAuth2 or another secure authentication method instead of
  plain passwords where supported.

Make sure the AirLLM model is available (see `ai_model` docs).

## Usage

```bash
cd sales_system
python -c "from lead_generator import generate_segments; print(generate_segments('edtech startups'))"
```