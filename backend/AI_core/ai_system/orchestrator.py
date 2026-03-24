"""Orchestrator for the BlueLearnerHub multi-agent system.

This module initializes OpenClaw agents and routes commands between them.
"""

import os

try:
    from openclaw import OpenClawAgent, OpenClawOrchestrator
except ImportError as e:
    # stub classes if OpenClaw SDK is not installed; log error
    print(f"OpenClaw SDK not available: {e} (running in stub mode)")
    class OpenClawAgent:
        def __init__(self, name, system_prompt="", role=""):
            self.name = name
            self.system_prompt = system_prompt
            self.role = role
        def perform(self, task: str):
            return f"[{self.name} stub performing '{task}']"

    class OpenClawOrchestrator:
        def __init__(self, agents):
            self.agents = agents
        def route(self, command: str):
            # naive routing based on keyword
            for agent in self.agents:
                if agent.name.lower() in command.lower():
                    return agent.perform(command)
            return "[no agent matched command]"


# instantiate agents
cto = OpenClawAgent(
    name="CTO",
    system_prompt="You are the CTO agent. Analyze architecture, monitor health, trigger deployments.",
    role="technical oversight",
)
dev = OpenClawAgent(
    name="Dev",
    system_prompt="You are the Developer agent. Generate code suggestions, fix bugs, propose features.",
    role="development assistance",
)
product = OpenClawAgent(
    name="Product",
    system_prompt="You are the Product agent. Suggest roadmap, improve UX, propose product enhancements.",
    role="product management",
)
sales = OpenClawAgent(
    name="Sales",
    system_prompt="You are the Sales agent. Generate marketing ideas, suggest customer segments, write outreach emails.",
    role="sales support",
)

orchestrator = OpenClawOrchestrator([cto, dev, product, sales])


def handle_command(command: str) -> str:
    """Route a command string to the appropriate agent."""
    return orchestrator.route(command)


if __name__ == "__main__":
    print("BlueLearnerHub AI orchestrator ready.")
    while True:
        try:
            cmd = input("orchestrator> ")
        except (KeyboardInterrupt, EOFError):
            break
        if not cmd.strip():
            continue
        try:
            print(handle_command(cmd))
        except Exception as err:
            print(f"Error handling command: {err}")
