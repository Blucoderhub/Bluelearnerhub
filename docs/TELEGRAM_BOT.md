# Telegram Bot Control Center

The `telegram_bot/` directory holds a simple bot that exposes the AI multi-agent
system via Telegram commands.

## Setup

1. Create a Telegram Bot via [BotFather](https://t.me/BotFather) and obtain a
   `TELEGRAM_TOKEN`.
2. Add the token to your `.env` or export it in your shell:
   ```bash
   export TELEGRAM_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
   ```
3. Install dependencies and make project modules available:
   ```bash
   cd telegram_bot
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install python-telegram-bot
   # ensure the main project is importable (editable install):
   pip install -e ..
   ```
4. Run the bot:
   ```bash
   python bot.py
   ```

## Commands

- `/status` – basic health check.
- `/cto ...` – route to CTO agent (e.g. `/cto review_code`).
- `/dev ...` – route to Developer agent.
- `/product ...` – route to Product agent.
- `/sales ...` – route to Sales agent (e.g. `/sales write_email`).
- `/deploy website` – alias to trigger deployment via CTO agent.

The `command_router` module splits incoming messages and passes them through the
`ai_system.orchestrator`.
