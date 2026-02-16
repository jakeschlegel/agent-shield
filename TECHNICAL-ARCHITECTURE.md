# Agent Shield — Technical Architecture

## How Agent Shield Monitors AI Agents

Agent Shield provides four methods to monitor AI agents across any platform, LLM, or framework. Organizations can mix and match based on their setup.

---

## Monitoring Methods

### 1. SDK / Middleware (Recommended)
A lightweight SDK installed directly in the agent's codebase. Intercepts every LLM call, tool use, and data access — logs everything to Agent Shield in real-time.

**How it works:**
- Developer adds 2-3 lines of code to their existing agent
- SDK wraps LLM calls and tool executions transparently
- Every request, response, and action is captured and sent to Agent Shield's API
- Zero performance impact (async logging, <5ms overhead)

**Python Example:**
```python
from agentshield import monitor, AgentShield

shield = AgentShield(api_key="as_live_xxx", agent_id="sales-copilot")

@shield.monitor
def my_agent(prompt):
    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    return response
```

**TypeScript Example:**
```typescript
import { AgentShield } from '@agentshield/sdk';

const shield = new AgentShield({
  apiKey: 'as_live_xxx',
  agentId: 'support-agent'
});

const monitoredClient = shield.wrap(anthropicClient);
// Use monitoredClient exactly like the original — all calls are logged
```

**What gets captured:**
- Input prompts and output responses
- Model used, token counts, latency
- Tool/function calls (what was called, with what arguments, what was returned)
- Data accessed (CRM records, database queries, file reads)
- Errors and exceptions

**Best for:** Companies that build their own agents or use frameworks like LangChain, CrewAI, AutoGen.

---

### 2. API Proxy
Instead of calling the LLM provider directly, agents route through Agent Shield's proxy. No code changes needed — just update the API base URL.

**How it works:**
- Agent currently calls `https://api.openai.com/v1/chat/completions`
- Change to `https://proxy.agentshield.com/openai/v1/chat/completions`
- Agent Shield forwards the request to OpenAI, captures everything in transit
- Supports OpenAI, Anthropic, Google, Cohere, and any OpenAI-compatible API

**Setup (one line change):**
```python
# Before
client = OpenAI(api_key="sk-xxx")

# After — just add base_url
client = OpenAI(api_key="sk-xxx", base_url="https://proxy.agentshield.com/openai/v1")
```

**What gets captured:**
- Full request/response payloads
- Token usage and cost tracking
- Latency metrics
- Can apply real-time content filtering before responses reach the agent

**Best for:** Quick setup, no-code-change monitoring, organizations that want to monitor without touching agent code.

---

### 3. Webhook / Log Ingestion
For agents that already generate logs or events, Agent Shield can ingest them via webhooks or batch API.

**How it works:**
- Agent platforms emit events (LangSmith, Weights & Biases, custom logging)
- Configure a webhook URL pointing to Agent Shield
- Or use the batch API to send historical logs
- Agent Shield normalizes, analyzes, and alerts on the data

**Webhook endpoint:**
```
POST https://api.agentshield.com/v1/ingest
Authorization: Bearer as_live_xxx
Content-Type: application/json

{
  "agent_id": "data-pipeline-bot",
  "event_type": "tool_call",
  "timestamp": "2026-02-15T20:30:00Z",
  "tool": "database_query",
  "input": {"query": "SELECT * FROM customers WHERE revenue > 1000000"},
  "output": {"rows_returned": 847},
  "metadata": {"user": "jsmith", "session_id": "abc123"}
}
```

**Best for:** Organizations with existing observability pipelines, agents on platforms with built-in logging.

---

### 4. Platform Integrations (Roadmap)
Direct connectors to major agent hosting platforms. Agent Shield pulls monitoring data via the platform's native APIs.

**Planned integrations:**
- **Amazon Bedrock** — CloudWatch logs + Bedrock Guardrails API
- **Azure OpenAI** — Azure Monitor + Content Safety API
- **Google Vertex AI** — Cloud Logging + Model Monitoring
- **LangSmith** — Direct trace ingestion
- **Salesforce Einstein** — Einstein Trust Layer logs

**Best for:** Enterprise customers already on major cloud platforms.

---

## Core Analysis Engine

Once Agent Shield receives data (via any method above), it runs through:

### Real-Time Risk Scoring
- Every agent gets a dynamic risk score (0-100) based on:
  - Permissions granted (more access = higher base risk)
  - Data sensitivity of accessed resources (PII, financial data, credentials)
  - Behavioral patterns (unusual activity spikes, new data access patterns)
  - Policy compliance status
- Scores update in real-time as new events come in

### Security Alert Detection
Automated detection of:
- **Prompt injection attempts** — detecting malicious inputs trying to override agent instructions
- **Data exfiltration** — agent accessing or outputting sensitive data it shouldn't
- **Privilege escalation** — agent attempting actions beyond its permissions
- **Anomalous behavior** — deviation from normal activity patterns (e.g., agent usually reads 10 records/day, suddenly reads 10,000)
- **Policy violations** — actions that breach configured guardrails
- **Shadow AI** — unauthorized agents detected on the network

### Red Team Engine
Automated security testing that simulates attacks against monitored agents:
- **Prompt injection tests** — attempts to override system prompts
- **Data exfiltration tests** — tries to get agents to leak sensitive data
- **Jailbreak tests** — attempts to bypass safety guardrails
- **Privilege escalation tests** — tries to get agents to access unauthorized resources
- Tests run on-demand or on a schedule (weekly recommended)
- Results feed into the risk score

---

## V2: Agent Builder (Build + Monitor)

In addition to monitoring external agents, Agent Shield V2 allows organizations to build agents directly inside the platform — with security baked in from the start.

### How It Works
1. **Guided Setup** — "Shield AI" chatbot walks users through agent creation
2. **Integration Marketplace** — connect to Slack, HubSpot, Salesforce, Gmail, GitHub, Jira, Zendesk, Notion with pre-configured security policies
3. **Security-First Permissions** — every integration recommends minimum required access level
4. **Auto-Generated Policies** — guardrails are created automatically based on the agent's purpose and integrations
5. **Full Visibility** — since the agent is built inside Agent Shield, monitoring is automatic from day one

### Two Modes
| Feature | Built-In Agents (V2) | External Agents (V1) |
|---------|----------------------|---------------------|
| Agent creation | ✅ Guided builder | ❌ Built elsewhere |
| Monitoring | ✅ Automatic | ✅ Via SDK/Proxy/Webhook |
| Security policies | ✅ Auto-generated | ✅ Manual configuration |
| Red teaming | ✅ Full access | ✅ Full access |
| Integration access | ✅ Native | ⚠️ Depends on setup |

---

## Engineering Estimates

| Component | Effort | Priority |
|-----------|--------|----------|
| Python SDK | 2 weeks | P0 |
| TypeScript SDK | 2 weeks | P0 |
| API Proxy | 1 week | P0 |
| Ingestion API + data pipeline | 1-2 weeks | P0 |
| Real-time alerting engine | 2 weeks | P0 |
| Dashboard (already built as demo) | 1 week polish | P1 |
| Red team attack simulator | 3-4 weeks | P1 |
| Platform integrations | 1-2 weeks each | P2 |
| Agent builder (V2) | 4-6 weeks | P2 |

**MVP timeline: ~8-10 weeks** with a small team (2-3 engineers)

---

## Infrastructure

- **API + Dashboard:** Hosted on AWS/GCP, auto-scaling
- **Data Pipeline:** Event ingestion → Kafka/SQS → Processing → PostgreSQL + ClickHouse (analytics)
- **Real-Time Alerts:** WebSocket connections + email/Slack notifications
- **SDK:** Published to PyPI (Python) and npm (TypeScript)
- **Security:** SOC 2 Type II, encryption at rest and in transit, no customer data used for training

---

*Agent Shield — Build secure agents. Monitor everything.*
