"""Route Telegram commands to the appropriate AI agent."""

from ai_system import orchestrator


def route_command(text: str) -> str:
    # simple parser: command and args separated by spaces
    parts = text.strip().split(maxsplit=1)
    if not parts:
        return "No command provided."
    cmd = parts[0].lstrip('/')
    if not cmd:
        return "No command provided."
    args = parts[1] if len(parts) > 1 else ""
    return orchestrator.handle_command(f"{cmd} {args}")
