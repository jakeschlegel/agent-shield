export interface Policy {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  severity: "critical" | "high" | "medium" | "low";
  compliance: { agentId: string; agentName: string; compliant: boolean; lastChecked: string }[];
}

export const policies: Policy[] = [
  {
    id: "pol-001", name: "Human-in-the-Loop for Infrastructure Changes", description: "Require human approval before any agent modifies production infrastructure, including scaling, deployments, and configuration changes.", category: "Access Control", enabled: true, severity: "critical",
    compliance: [
      { agentId: "ag-011", agentName: "Incident Responder", compliant: false, lastChecked: "8 min ago" },
      { agentId: "ag-007", agentName: "Data Pipeline Bot", compliant: false, lastChecked: "2 min ago" },
      { agentId: "ag-003", agentName: "Code Reviewer", compliant: true, lastChecked: "18 min ago" },
      { agentId: "ag-015", agentName: "QA Test Writer", compliant: true, lastChecked: "15 min ago" },
    ]
  },
  {
    id: "pol-002", name: "PII Data Access Restrictions", description: "Agents may only access personally identifiable information when directly relevant to their assigned task. Bulk PII access requires justification.", category: "Data Protection", enabled: true, severity: "critical",
    compliance: [
      { agentId: "ag-006", agentName: "HR Assistant", compliant: false, lastChecked: "40 min ago" },
      { agentId: "ag-017", agentName: "Recruitment Screener", compliant: true, lastChecked: "2.5 hr ago" },
      { agentId: "ag-002", agentName: "Support Agent", compliant: true, lastChecked: "5 min ago" },
      { agentId: "ag-014", agentName: "Customer Insights", compliant: true, lastChecked: "1 hr ago" },
    ]
  },
  {
    id: "pol-003", name: "External Communication Approval", description: "All external-facing communications (emails, social posts) must be reviewed before sending. No automated external emails without human approval.", category: "Communication", enabled: true, severity: "high",
    compliance: [
      { agentId: "ag-005", agentName: "Finance Analyst", compliant: false, lastChecked: "2 hr ago" },
      { agentId: "ag-001", agentName: "Sales Copilot", compliant: true, lastChecked: "5 min ago" },
      { agentId: "ag-004", agentName: "Marketing Writer", compliant: true, lastChecked: "25 min ago" },
      { agentId: "ag-009", agentName: "Onboarding Guide", compliant: true, lastChecked: "1 day ago" },
    ]
  },
  {
    id: "pol-004", name: "Data Movement Restrictions", description: "Agents cannot move data between storage systems or modify access permissions without explicit authorization and audit logging.", category: "Data Protection", enabled: true, severity: "critical",
    compliance: [
      { agentId: "ag-007", agentName: "Data Pipeline Bot", compliant: false, lastChecked: "50 min ago" },
      { agentId: "ag-010", agentName: "SEO Optimizer", compliant: true, lastChecked: "45 min ago" },
    ]
  },
  {
    id: "pol-005", name: "Financial Data Scope Limitation", description: "Agents accessing financial data must operate within defined scope boundaries. Full dataset access is prohibited without CFO approval.", category: "Access Control", enabled: true, severity: "high",
    compliance: [
      { agentId: "ag-005", agentName: "Finance Analyst", compliant: false, lastChecked: "15 min ago" },
      { agentId: "ag-013", agentName: "Expense Processor", compliant: true, lastChecked: "1 hr ago" },
      { agentId: "ag-008", agentName: "Legal Reviewer", compliant: true, lastChecked: "2 hr ago" },
    ]
  },
  {
    id: "pol-006", name: "Auto-Approval Spending Limits", description: "Automated expense approvals capped at $500 per transaction and $2,000 per day. Exceeding amounts require human review.", category: "Financial Controls", enabled: true, severity: "medium",
    compliance: [
      { agentId: "ag-013", agentName: "Expense Processor", compliant: false, lastChecked: "1 hr ago" },
    ]
  },
  {
    id: "pol-007", name: "Prompt Injection Defense", description: "All agents must have active prompt injection detection enabled. Agents failing red team injection tests must be remediated within 48 hours.", category: "Security", enabled: true, severity: "high",
    compliance: [
      { agentId: "ag-006", agentName: "HR Assistant", compliant: false, lastChecked: "2 hr ago" },
      { agentId: "ag-007", agentName: "Data Pipeline Bot", compliant: false, lastChecked: "2 hr ago" },
      { agentId: "ag-002", agentName: "Support Agent", compliant: true, lastChecked: "2 hr ago" },
      { agentId: "ag-001", agentName: "Sales Copilot", compliant: true, lastChecked: "2 hr ago" },
    ]
  },
  {
    id: "pol-008", name: "Audit Logging Required", description: "All agent actions must be logged with timestamps, resources accessed, and action descriptions. Logs must be retained for 90 days.", category: "Compliance", enabled: true, severity: "medium",
    compliance: [
      { agentId: "ag-001", agentName: "Sales Copilot", compliant: true, lastChecked: "5 min ago" },
      { agentId: "ag-002", agentName: "Support Agent", compliant: true, lastChecked: "5 min ago" },
      { agentId: "ag-018", agentName: "Slack Bot", compliant: true, lastChecked: "3 hr ago" },
    ]
  },
  {
    id: "pol-009", name: "Bias Monitoring for HR Agents", description: "All HR-facing agents must have bias detection active for resume screening, performance reviews, and hiring decisions.", category: "Compliance", enabled: false, severity: "medium",
    compliance: [
      { agentId: "ag-017", agentName: "Recruitment Screener", compliant: false, lastChecked: "2.5 hr ago" },
      { agentId: "ag-006", agentName: "HR Assistant", compliant: false, lastChecked: "3 hr ago" },
    ]
  },
  {
    id: "pol-010", name: "Rate Limiting", description: "Agents must respect API rate limits and cannot exceed 100 requests per minute to any single resource.", category: "Security", enabled: true, severity: "low",
    compliance: [
      { agentId: "ag-001", agentName: "Sales Copilot", compliant: true, lastChecked: "5 min ago" },
      { agentId: "ag-007", agentName: "Data Pipeline Bot", compliant: true, lastChecked: "1 min ago" },
      { agentId: "ag-011", agentName: "Incident Responder", compliant: true, lastChecked: "8 min ago" },
    ]
  },
];
