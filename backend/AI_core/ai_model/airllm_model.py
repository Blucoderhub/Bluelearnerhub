"""Wrapper around an AirLLM local language model instance."""

from .model_loader import load_model

class AirLLMModel:
    def __init__(self, model_path=None):
        self.model = load_model(model_path)

    def generate(self, prompt: str, **kwargs) -> str:
        """Generate text from the local AirLLM model."""
        if not self.model:
            return "[model not loaded]"
        # mock generation for now
        return f"Generated (stub) for: {prompt}"
