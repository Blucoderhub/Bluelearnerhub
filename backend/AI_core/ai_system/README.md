# AI System

This directory contains a lightweight multi-agent system built on the OpenClaw
SDK. The orchestrator initializes several role-specific agents and routes
commands to them. Agents can be extended or replaced with real AI models.

## Files

* `orchestrator.py` - central router and REPL for issuing commands
* `cto_agent.py` - CTO-specific actions
* `dev_agent.py` - Developer assistance actions
* `product_agent.py` - Product management actions
* `sales_agent.py` - Sales and marketing actions

## Usage

Create a Python virtual env and install any dependencies you may need (OpenClaw
SDK when available):

```bash
cd ai_system
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install openclaw python-dotenv  # if you have the SDK
python orchestrator.py
```

Type commands at the `orchestrator>` prompt, e.g. `CTO analyze architecture` or
`Sales write email`.
