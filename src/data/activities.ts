export interface Activity {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  resource: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
  details: string;
}

export const activities: Activity[] = [
  { id: "act-001", agentId: "ag-007", agentName: "Data Pipeline Bot", action: "Executed", resource: "Production Database", severity: "warning", timestamp: "2 min ago", details: "Ran DELETE query on staging_events table (4,231 rows affected)" },
  { id: "act-002", agentId: "ag-001", agentName: "Sales Copilot", action: "Accessed", resource: "Salesforce CRM", severity: "info", timestamp: "5 min ago", details: "Retrieved 47 lead records for Q1 pipeline analysis" },
  { id: "act-003", agentId: "ag-011", agentName: "Incident Responder", action: "Modified", resource: "AWS EC2 Instances", severity: "critical", timestamp: "8 min ago", details: "Scaled up production fleet from 12 to 24 instances" },
  { id: "act-004", agentId: "ag-002", agentName: "Support Agent", action: "Resolved", resource: "Zendesk Ticket #8842", severity: "info", timestamp: "10 min ago", details: "Auto-resolved billing inquiry with standard response template" },
  { id: "act-005", agentId: "ag-005", agentName: "Finance Analyst", action: "Generated", resource: "Financial Report", severity: "warning", timestamp: "15 min ago", details: "Created Q4 revenue forecast report with access to all financial data" },
  { id: "act-006", agentId: "ag-003", agentName: "Code Reviewer", action: "Approved", resource: "GitHub PR #1247", severity: "info", timestamp: "18 min ago", details: "Approved pull request for auth service refactor" },
  { id: "act-007", agentId: "ag-004", agentName: "Marketing Writer", action: "Published", resource: "Company Blog", severity: "info", timestamp: "25 min ago", details: "Published blog post: 'AI Security Best Practices for 2026'" },
  { id: "act-008", agentId: "ag-011", agentName: "Incident Responder", action: "Accessed", resource: "CloudWatch Logs", severity: "warning", timestamp: "30 min ago", details: "Downloaded 2.3GB of production logs for incident analysis" },
  { id: "act-009", agentId: "ag-016", agentName: "Compliance Monitor", action: "Scanned", resource: "Audit Logs", severity: "info", timestamp: "35 min ago", details: "Completed daily compliance scan — 3 anomalies flagged" },
  { id: "act-010", agentId: "ag-006", agentName: "HR Assistant", action: "Accessed", resource: "Employee Records", severity: "warning", timestamp: "40 min ago", details: "Retrieved salary data for 12 employees in Engineering dept" },
  { id: "act-011", agentId: "ag-012", agentName: "Meeting Summarizer", action: "Posted", resource: "Slack #sales-team", severity: "info", timestamp: "45 min ago", details: "Posted summary of Q1 planning meeting with action items" },
  { id: "act-012", agentId: "ag-007", agentName: "Data Pipeline Bot", action: "Executed", resource: "S3 Bucket", severity: "critical", timestamp: "50 min ago", details: "Moved 15GB of customer data to new S3 bucket with modified permissions" },
  { id: "act-013", agentId: "ag-014", agentName: "Customer Insights", action: "Queried", resource: "Analytics Database", severity: "info", timestamp: "1 hr ago", details: "Ran cohort analysis on 50K customer records" },
  { id: "act-014", agentId: "ag-013", agentName: "Expense Processor", action: "Processed", resource: "Expense Reports", severity: "info", timestamp: "1 hr ago", details: "Auto-approved 23 expense reports totaling $14,320" },
  { id: "act-015", agentId: "ag-015", agentName: "QA Test Writer", action: "Created", resource: "GitHub Repository", severity: "info", timestamp: "1.5 hr ago", details: "Generated 47 unit tests for payment processing module" },
  { id: "act-016", agentId: "ag-005", agentName: "Finance Analyst", action: "Sent", resource: "Email", severity: "critical", timestamp: "2 hr ago", details: "Emailed detailed financial projections to external auditor" },
  { id: "act-017", agentId: "ag-017", agentName: "Recruitment Screener", action: "Updated", resource: "ATS Records", severity: "info", timestamp: "2.5 hr ago", details: "Screened 34 resumes and updated candidate statuses" },
  { id: "act-018", agentId: "ag-018", agentName: "Slack Bot", action: "Responded", resource: "Slack #general", severity: "info", timestamp: "3 hr ago", details: "Answered question about PTO policy for 2026" },
  { id: "act-019", agentId: "ag-010", agentName: "SEO Optimizer", action: "Modified", resource: "Website CMS", severity: "info", timestamp: "3.5 hr ago", details: "Updated meta descriptions on 12 landing pages" },
  { id: "act-020", agentId: "ag-008", agentName: "Legal Reviewer", action: "Reviewed", resource: "Contract Database", severity: "info", timestamp: "4 hr ago", details: "Flagged 2 vendor contracts with non-standard termination clauses" },
];
