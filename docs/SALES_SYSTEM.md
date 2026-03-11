# Sales Automation System

This section describes the components in `sales_system/` used for lead
generation and outreach.

## Components

* `lead_generator.py` – uses the AirLLM model to brainstorm customer segments.
* `email_writer.py` – drafts outreach emails using the local model.
* `outreach_manager.py` – handles sending emails via SMTP after manual approval.
* `crm_storage.py` – simple JSON-based CRM store.

## Workflow

1. Use `lead_generator.generate_segments()` to identify potential customers.
2. Add leads to CRM with `crm_storage.add_lead()`.
3. Draft email using `email_writer.draft_email()`.
4. Manually review the draft, then call `outreach_manager.prepare_and_send(..., approved=True)`
   to send via SMTP.

## Consent & Opt-Out Controls

- Obtain explicit consent from every lead before adding them: record a timestamp,
  source of consent (form, verbal, etc.), and any verification details in the CRM.
- Include an unsubscribe/opt-out link or instruction in every outreach email
  footer; honor every opt-out immediately by marking the address in the CRM and
  excluding it from future sends.
- Maintain a suppression list in `crm_storage`; `outreach_manager.prepare_and_send`
  must check this list and refuse to send to opted‑out or bounced addresses.
- Log bounce and complaint events and mark those leads as non-deliverable;
  implement a retry policy and escalate repeated failures.

## Configuration

Set SMTP credentials in environment variables or `.env` (Gmail
requires an **App Password**, not your account password).  Do not commit `.env`
to VCS; use a secrets manager for production and rotate credentials regularly.

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASSWORD=your-app-specific-password-here
CRM_STORAGE_PATH=sales_system/crm.json
```

CRM data persists in JSON file specified by `CRM_STORAGE_PATH`.

### Data Privacy & Security

- The JSON file is intended for development and testing only; **do not use**
  plain file storage in production without encryption and strict access
  controls.
- For real deployment, enable encryption at rest and restrict file permissions.
- Comply with GDPR/CCPA by retaining consent and opt-out records, and implement
  deletion/retention policies.
- File-based storage has concurrency limitations; use a lock or migrate to a
  proper database (PostgreSQL/MySQL) for production workloads.
- Migrate by exporting JSON data to the database and update application config
  accordingly.  See CRM_STORAGE_PATH for location.
