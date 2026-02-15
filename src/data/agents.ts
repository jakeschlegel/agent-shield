export interface Agent {
  id: string;
  name: string;
  platform: "Claude" | "OpenAI";
  model: string;
  department: string;
  permissions: string[];
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  lastActive: string;
  status: "active" | "idle" | "disabled";
  description: string;
}

export const agents: Agent[] = [
  { id: "ag-001", name: "Sales Copilot", platform: "OpenAI", model: "GPT-4o", department: "Sales", permissions: ["CRM Read", "CRM Write", "Email Send", "Calendar Read"], riskScore: 23, riskLevel: "low", lastActive: "2 min ago", status: "active", description: "Assists sales reps with lead scoring and outreach drafts" },
  { id: "ag-002", name: "Support Agent", platform: "Claude", model: "Claude 3.5 Sonnet", department: "Support", permissions: ["Ticket Read", "Ticket Write", "KB Read", "Customer Data Read"], riskScore: 31, riskLevel: "low", lastActive: "5 min ago", status: "active", description: "Handles tier-1 support tickets automatically" },
  { id: "ag-003", name: "Code Reviewer", platform: "Claude", model: "Claude 3.5 Sonnet", department: "Engineering", permissions: ["GitHub Read", "GitHub Write", "Jira Read"], riskScore: 45, riskLevel: "medium", lastActive: "12 min ago", status: "active", description: "Reviews PRs and suggests improvements" },
  { id: "ag-004", name: "Marketing Writer", platform: "OpenAI", model: "GPT-4o", department: "Marketing", permissions: ["CMS Write", "Analytics Read", "Social Media Post"], riskScore: 18, riskLevel: "low", lastActive: "1 hr ago", status: "active", description: "Generates blog posts and social media content" },
  { id: "ag-005", name: "Finance Analyst", platform: "Claude", model: "Claude 3 Opus", department: "Finance", permissions: ["ERP Read", "Financial Data Read", "Report Generate", "Email Send"], riskScore: 72, riskLevel: "high", lastActive: "30 min ago", status: "active", description: "Analyzes financial data and generates reports" },
  { id: "ag-006", name: "HR Assistant", platform: "OpenAI", model: "GPT-4o-mini", department: "HR", permissions: ["HRIS Read", "Employee Data Read", "Email Send"], riskScore: 56, riskLevel: "medium", lastActive: "3 hr ago", status: "idle", description: "Answers employee questions about benefits and policies" },
  { id: "ag-007", name: "Data Pipeline Bot", platform: "Claude", model: "Claude 3.5 Haiku", department: "Engineering", permissions: ["Database Read", "Database Write", "S3 Read", "S3 Write", "Lambda Execute"], riskScore: 81, riskLevel: "high", lastActive: "1 min ago", status: "active", description: "Orchestrates ETL pipelines and data transformations" },
  { id: "ag-008", name: "Legal Reviewer", platform: "Claude", model: "Claude 3 Opus", department: "Finance", permissions: ["Document Read", "Contract Database Read"], riskScore: 34, riskLevel: "low", lastActive: "2 hr ago", status: "idle", description: "Reviews contracts for compliance issues" },
  { id: "ag-009", name: "Onboarding Guide", platform: "OpenAI", model: "GPT-4o-mini", department: "HR", permissions: ["HRIS Read", "Slack Post", "Calendar Write"], riskScore: 15, riskLevel: "low", lastActive: "1 day ago", status: "idle", description: "Guides new hires through onboarding process" },
  { id: "ag-010", name: "SEO Optimizer", platform: "OpenAI", model: "GPT-4o", department: "Marketing", permissions: ["CMS Read", "CMS Write", "Analytics Read"], riskScore: 22, riskLevel: "low", lastActive: "45 min ago", status: "active", description: "Optimizes website content for search engines" },
  { id: "ag-011", name: "Incident Responder", platform: "Claude", model: "Claude 3.5 Sonnet", department: "Engineering", permissions: ["PagerDuty Read", "PagerDuty Write", "AWS Console", "Slack Post", "Database Read"], riskScore: 88, riskLevel: "high", lastActive: "8 min ago", status: "active", description: "Triages and responds to production incidents" },
  { id: "ag-012", name: "Meeting Summarizer", platform: "OpenAI", model: "GPT-4o-mini", department: "Sales", permissions: ["Calendar Read", "Transcript Read", "Slack Post"], riskScore: 12, riskLevel: "low", lastActive: "20 min ago", status: "active", description: "Summarizes meetings and posts action items" },
  { id: "ag-013", name: "Expense Processor", platform: "OpenAI", model: "GPT-4o", department: "Finance", permissions: ["ERP Read", "ERP Write", "Email Send", "Receipt OCR"], riskScore: 48, riskLevel: "medium", lastActive: "4 hr ago", status: "idle", description: "Processes and categorizes expense reports" },
  { id: "ag-014", name: "Customer Insights", platform: "Claude", model: "Claude 3.5 Sonnet", department: "Marketing", permissions: ["Analytics Read", "CRM Read", "Report Generate"], riskScore: 29, riskLevel: "low", lastActive: "1 hr ago", status: "active", description: "Analyzes customer behavior and generates insights" },
  { id: "ag-015", name: "QA Test Writer", platform: "Claude", model: "Claude 3.5 Haiku", department: "Engineering", permissions: ["GitHub Read", "GitHub Write", "CI/CD Trigger"], riskScore: 37, riskLevel: "low", lastActive: "15 min ago", status: "active", description: "Generates automated test cases from requirements" },
  { id: "ag-016", name: "Compliance Monitor", platform: "Claude", model: "Claude 3 Opus", department: "Finance", permissions: ["All Data Read", "Audit Log Read", "Report Generate", "Email Send"], riskScore: 62, riskLevel: "medium", lastActive: "10 min ago", status: "active", description: "Monitors regulatory compliance across systems" },
  { id: "ag-017", name: "Recruitment Screener", platform: "OpenAI", model: "GPT-4o", department: "HR", permissions: ["ATS Read", "ATS Write", "Email Send", "Calendar Write"], riskScore: 41, riskLevel: "medium", lastActive: "2 hr ago", status: "idle", description: "Screens resumes and schedules interviews" },
  { id: "ag-018", name: "Slack Bot", platform: "OpenAI", model: "GPT-4o-mini", department: "Support", permissions: ["Slack Read", "Slack Post", "KB Read"], riskScore: 19, riskLevel: "low", lastActive: "Just now", status: "active", description: "Answers internal questions in Slack channels" },
];
