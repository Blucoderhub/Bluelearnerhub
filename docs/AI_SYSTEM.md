# AI Multi-Agent System

The `ai_system/` directory contains a set of lightweight Python agents orchestrated
by an OpenClaw-based orchestrator. These agents are intended to assist project
teams with technical, product, development, and sales tasks.

## Agents

* **CTO Agent** – architecture review and deployment commands (`cto_agent.py`).
* **Developer Agent** – code suggestions, bug fixes (`dev_agent.py`).
* **Product Agent** – roadmap and UX feedback (`product_agent.py`).
* **Sales Agent** – marketing ideas and outreach drafts (`sales_agent.py`).

## Orchestrator

`orchestrator.py` initializes each agent and provides a simple REPL for manual
interaction. Commands are routed based on keyword matching.

### Running locally

```bash
cd ai_system
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install openclaw python-dotenv  # optional
python orchestrator.py
```

Type commands such as:
```
CTO analyze architecture
Dev suggest code for new login API
Product roadmap
Sales write email about new feature
```

## Integration

Other modules (telegram bot, sales system) call into `ai_system` to execute
agent functions. The orchestrator can also be imported by backend services for
programmatic use.
