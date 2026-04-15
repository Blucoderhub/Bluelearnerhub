# Deprecated Components

This directory contains legacy/obsolete components that have been superseded by newer implementations.

## Contents

| Directory | Status | Replacement |
|-----------|--------|-------------|
| `ai_system/` | Deprecated | Use `ai-services/system/` (JavaScript) |
| `ai_model/` | Placeholder | Use `ai-services/app/ai/airllm_service.py` |
| `ai-agent/` | Unused | Standalone CLI, not integrated |
| `telegram_bot/` | Inactive | No active deployment |
| `sales_system/` | Code only | README.md exists, no implementation |

## Reasoning

- **ai_system/**: Python multi-agent system based on OpenClaw SDK. Replaced by `ai-services/system/` which uses Gemini API directly.
- **ai_model/**: AirLLM model loading helpers - functionality moved to `app/ai/airllm_service.py`
- **ai-agent/**: Standalone CLI assistant - never integrated with main platform
- **telegram_bot/**: Telegram command interface - no active bot deployment
- **sales_system/**: CRM components - planned but never implemented

## Action Required

If any of these components are needed:
1. Review the deprecated code for reusable parts
2. Move to active `ai-services/` directory
3. Remove this deprecated directory

**Last Updated**: April 2026
