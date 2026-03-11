"""Generate personalized outreach email drafts using AirLLM."""

from ai_model.airllm_model import AirLLMModel

model = AirLLMModel()


def _sanitize(text: str) -> str:
    # remove non-printable characters and newlines, limit length
    if text is None:
        return ""
    cleaned = ''.join(ch for ch in text if ch.isprintable())
    cleaned = cleaned.replace('\n', ' ').replace('\r', '')
    return cleaned.strip()


def draft_email(subject: str, recipient: str, context: str="") -> str:
    # sanitize user-controlled inputs to avoid prompt injection
    subject = _sanitize(subject)
    recipient = _sanitize(recipient)
    context = _sanitize(context)
    prompt = (
        f"Write a friendly outreach email with subject '{subject}' to {recipient}. "
        f"Context: {context}"
    )
    return model.generate(prompt)
