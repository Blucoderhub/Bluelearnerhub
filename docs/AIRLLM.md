# AirLLM Local Model Setup

We use an open-source, lightweight language model via the AirLLM project to
provide local reasoning and content generation for our agents. No external API
calls are required ensuring offline functionality and zero cost.

## Requirements

- A normal laptop with 4+ GB RAM
- Python 3.11
- Model binary (free open-source model such as `tiny-llama`)

## Configuration

1. Place the model file under `ai_model/knowledge_base/`.
2. Set the environment variable `AIRLLM_MODEL_PATH` to point to the file.
   Example in `.env`:
   ```env
   AIRLLM_MODEL_PATH=./ai_model/knowledge_base/model.bin
   ```
3. Optionally add reference documents to `ai_model/knowledge_base/` to expand
the knowledge base.

## Usage

```bash
cd ai_model
python -c "from airllm_model import AirLLMModel; print(AirLLMModel().generate('Hello'))"
```

Agents across the system import `AirLLMModel` and call the `.generate()` method
to obtain text output.

## Notes

- The current implementation is a stub; integrate the real AirLLM library when
  available.
- Keep the model under 1GB for smooth performance on modest hardware.
