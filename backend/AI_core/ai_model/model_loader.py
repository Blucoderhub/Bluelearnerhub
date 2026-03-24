"""Load AirLLM models from disk."""

import os


def load_model(model_path=None):
    """Attempt to load a lightweight AirLLM model from the given path."""
    if model_path is None:
        model_path = os.getenv("AIRLLM_MODEL_PATH")
    # placeholder: real loader would initialize the AirLLM runtime
    if model_path and os.path.exists(model_path):
        return f"Loaded model at {model_path}"
    return None
