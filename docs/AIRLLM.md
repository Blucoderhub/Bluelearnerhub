# AirLLM Local Model Setup

We use an open-source, lightweight language model via the AirLLM project to
provide local reasoning and content generation for our agents. No external API
calls are required ensuring offline functionality and zero cost.

## Requirements

- A laptop or desktop with at least **8 GB RAM** (6–8 GB may work for heavily
  quantized models but 8 GB+ is recommended).
- Python 3.11
- Model binary (free open-source model such as `TinyLlama`)

## Configuration

1. Place the model file under `ai_model/knowledge_base/`.
2. Set the environment variable `AIRLLM_MODEL_PATH` to point to the file.
   Example in `.env`:
   ```env
   AIRLLM_MODEL_PATH=./ai_model/knowledge_base/model.bin
   ```
3. Place reference documents in `ai_model/knowledge_base/` if you plan to
   build a retrieval‑augmented pipeline. **Note:** dropping files there does not
   magically change a pre-trained model; you must implement a retriever/vector
   database or fine‑tune the model on that data to actually use it at runtime.
   The directory simply holds assets for any such workflow.

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
- Prefer smaller or highly‑quantized models where possible. Modern
  quantized models (e.g. TinyLlama ~1.1 GB) may exceed 1 GB; aim for ≲1.5 GB and
  benchmark on your target machine to ensure acceptable memory/latency.
  Quantization and model size trade‑offs are application‑specific.
