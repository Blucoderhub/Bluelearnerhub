"""Generate personalized outreach email drafts using AirLLM."""

from ai_model.airllm_model import AirLLMModel

model = AirLLMModel()

def draft_email(subject: str, recipient: str, context: str="") -> str:
    prompt = f"Write a friendly outreach email with subject '{subject}' to {recipient}. Context: {context}"
    return model.generate(prompt)
