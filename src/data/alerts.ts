export interface Alert {
  id: string;
  agentId: string;
  agentName: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  timestamp: string;
  status: "open" | "investigating" | "resolved";
  category: string;
}

export const alerts: Alert[] = [
  { id: "alt-001", agentId: "ag-011", agentName: "Incident Responder", severity: "critical", title: "Unauthorized Infrastructure Scaling", description: "Agent scaled production fleet without human approval. Auto-scaling policy was bypassed.", timestamp: "8 min ago", status: "open", category: "Privilege Escalation" },
  { id: "alt-002", agentId: "ag-007", agentName: "Data Pipeline Bot", severity: "critical", title: "Bulk Data Movement Detected", description: "15GB of customer data moved to new S3 bucket with modified access permissions.", timestamp: "50 min ago", status: "investigating", category: "Data Exfiltration" },
  { id: "alt-003", agentId: "ag-005", agentName: "Finance Analyst", severity: "high", title: "Sensitive Data Shared Externally", description: "Detailed financial projections emailed to external email address without approval.", timestamp: "2 hr ago", status: "open", category: "Data Leak" },
  { id: "alt-004", agentId: "ag-006", agentName: "HR Assistant", severity: "high", title: "Excessive PII Access", description: "Accessed salary data for 12 employees outside of normal query patterns.", timestamp: "40 min ago", status: "investigating", category: "Access Anomaly" },
  { id: "alt-005", agentId: "ag-007", agentName: "Data Pipeline Bot", severity: "high", title: "Destructive Query Executed", description: "DELETE query executed on staging_events table affecting 4,231 rows.", timestamp: "2 min ago", status: "open", category: "Data Destruction" },
  { id: "alt-006", agentId: "ag-003", agentName: "Code Reviewer", severity: "medium", title: "Auto-Approval Without Review", description: "Agent approved PR #1247 for auth service without flagging security-sensitive changes.", timestamp: "18 min ago", status: "open", category: "Policy Violation" },
  { id: "alt-007", agentId: "ag-016", agentName: "Compliance Monitor", severity: "medium", title: "Compliance Anomalies Detected", description: "3 anomalies flagged during daily compliance scan requiring human review.", timestamp: "35 min ago", status: "investigating", category: "Compliance" },
  { id: "alt-008", agentId: "ag-013", agentName: "Expense Processor", severity: "medium", title: "High-Value Auto-Approval", description: "Auto-approved 23 expense reports totaling $14,320 without manager review.", timestamp: "1 hr ago", status: "resolved", category: "Policy Violation" },
  { id: "alt-009", agentId: "ag-001", agentName: "Sales Copilot", severity: "low", title: "Bulk Data Access", description: "Retrieved 47 lead records in single query — above normal threshold of 20.", timestamp: "5 min ago", status: "resolved", category: "Access Anomaly" },
  { id: "alt-010", agentId: "ag-011", agentName: "Incident Responder", severity: "low", title: "Large Log Download", description: "Downloaded 2.3GB of production logs. Within policy but flagged for volume.", timestamp: "30 min ago", status: "resolved", category: "Data Access" },
  { id: "alt-011", agentId: "ag-017", agentName: "Recruitment Screener", severity: "low", title: "Batch Resume Processing", description: "Processed 34 resumes in automated batch — verify bias checks were applied.", timestamp: "2.5 hr ago", status: "resolved", category: "Compliance" },
  { id: "alt-012", agentId: "ag-005", agentName: "Finance Analyst", severity: "critical", title: "Unrestricted Financial Data Access", description: "Agent accessed all financial datasets without scope limitation during report generation.", timestamp: "15 min ago", status: "open", category: "Access Anomaly" },
];
