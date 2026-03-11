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

## Configuration

Set SMTP credentials in environment variables or `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASSWORD=yourpassword
CRM_STORAGE_PATH=sales_system/crm.json
```

CRM data persists in JSON file specified by `CRM_STORAGE_PATH`.
