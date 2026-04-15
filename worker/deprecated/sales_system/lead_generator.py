"""Lead generator identifies potential customer segments."""

from ai_model.airllm_model import AirLLMModel

model = AirLLMModel()

def generate_segments(prompt: str) -> str:
    # Use local model to brainstorm segments
    return model.generate(f"Generate customer segments for: {prompt}")
