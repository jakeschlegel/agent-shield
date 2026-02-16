"use client";

import { useState } from "react";
import { X, Check, Shield, AlertTriangle, Info, Copy } from "lucide-react";
import type { Agent } from "@/data/agents";

interface AddAgentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (agent: Agent) => void;
}

const STEPS = ["Agent Details", "Permissions & Access", "Connection", "Review & Add"];

const MODEL_OPTIONS: Record<string, string[]> = {
  Claude: ["Claude 3.5 Sonnet", "Claude 3.5 Haiku", "Claude 3 Opus"],
  OpenAI: ["GPT-4o", "GPT-4o-mini"],
};

const DEPARTMENTS = ["Sales", "Support", "Engineering", "Marketing", "Finance", "HR"];

interface Permission {
  name: string;
  risk: "low" | "medium" | "high";
}

const PERMISSION_GROUPS: Record<string, Permission[]> = {
  Data: [
    { name: "CRM Read", risk: "low" },
    { name: "CRM Write", risk: "medium" },
    { name: "Database Read", risk: "medium" },
    { name: "Database Write", risk: "high" },
    { name: "Customer Data Read", risk: "medium" },
    { name: "Financial Data Read", risk: "high" },
    { name: "Employee Data Read", risk: "high" },
  ],
  Communication: [
    { name: "Email Send", risk: "medium" },
    { name: "Slack Post", risk: "low" },
    { name: "Social Media Post", risk: "high" },
  ],
  Tools: [
    { name: "GitHub Read", risk: "low" },
    { name: "GitHub Write", risk: "medium" },
    { name: "Calendar Read", risk: "low" },
    { name: "Calendar Write", risk: "low" },
    { name: "Report Generate", risk: "low" },
  ],
  Infrastructure: [
    { name: "AWS Console", risk: "high" },
    { name: "S3 Read", risk: "medium" },
    { name: "S3 Write", risk: "high" },
    { name: "Lambda Execute", risk: "high" },
    { name: "CI/CD Trigger", risk: "medium" },
  ],
};

const RISK_WEIGHTS: Record<string, number> = { low: 2, medium: 5, high: 12 };

function calcRiskScore(perms: string[]): number {
  const allPerms = Object.values(PERMISSION_GROUPS).flat();
  let score = 0;
  for (const p of perms) {
    const found = allPerms.find(x => x.name === p);
    if (found) score += RISK_WEIGHTS[found.risk];
  }
  return Math.min(100, score);
}

function riskLevel(score: number): "low" | "medium" | "high" {
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

const SDK_SNIPPET = `npm install @agent-shield/sdk

import { AgentShield } from '@agent-shield/sdk';

const shield = new AgentShield({
  apiKey: 'your-api-key',
  webhookUrl: 'https://your-app.com/webhook',
});

shield.connect();`;

export default function AddAgentModal({ open, onClose, onAdd }: AddAgentModalProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState<"Claude" | "OpenAI">("Claude");
  const [model, setModel] = useState(MODEL_OPTIONS.Claude[0]);
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set());
  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [connectionTab, setConnectionTab] = useState<"api" | "sdk">("api");
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setStep(0); setName(""); setDescription(""); setPlatform("Claude");
    setModel(MODEL_OPTIONS.Claude[0]); setDepartment(DEPARTMENTS[0]);
    setSelectedPerms(new Set()); setApiKey(""); setWebhookUrl("");
    setConnectionTab("api"); setCopied(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const togglePerm = (p: string) => {
    setSelectedPerms(prev => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  };

  const canNext = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return selectedPerms.size > 0;
    return true;
  };

  const score = calcRiskScore([...selectedPerms]);
  const level = riskLevel(score);

  const handleAdd = () => {
    const agent: Agent = {
      id: `ag-${Date.now()}`,
      name: name.trim(),
      platform,
      model,
      department,
      permissions: [...selectedPerms],
      riskScore: score,
      riskLevel: level,
      lastActive: "Just now",
      status: "active",
      description: description.trim(),
    };
    onAdd(agent);
    handleClose();
  };

  const handlePlatformChange = (p: "Claude" | "OpenAI") => {
    setPlatform(p);
    setModel(MODEL_OPTIONS[p][0]);
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(SDK_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  const riskBadge = (r: "low" | "medium" | "high") => {
    const cls = r === "high" ? "bg-red-50 text-red-700" : r === "medium" ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700";
    return <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${cls}`}>{r}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[6px] shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add Agent</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-1">
            {STEPS.map((label, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                    i < step ? "bg-black text-white" : i === step ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i <= step ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? "bg-black" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* STEP 1 — Agent Details */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sales Copilot"
                  className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="What does this agent do?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <select value={platform} onChange={e => handlePlatformChange(e.target.value as "Claude" | "OpenAI")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
                    <option value="Claude">Claude</option>
                    <option value="OpenAI">OpenAI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <select value={model} onChange={e => setModel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
                    {MODEL_OPTIONS[platform].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select value={department} onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2 — Permissions */}
          {step === 1 && (
            <div className="space-y-5">
              <p className="text-sm text-gray-500">Select the permissions this agent will have. Risk levels are shown for each permission.</p>
              {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => (
                <div key={group}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{group}</p>
                  <div className="space-y-0.5">
                    {perms.map(p => (
                      <label key={p.name} className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" checked={selectedPerms.has(p.name)} onChange={() => togglePerm(p.name)}
                          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black" />
                        <span className="text-sm text-gray-800 flex-1">{p.name}</span>
                        {riskBadge(p.risk)}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400">{selectedPerms.size} permission{selectedPerms.size !== 1 ? "s" : ""} selected</p>
            </div>
          )}

          {/* STEP 3 — Connection */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Configure how this agent connects to Agent Shield. Choose your preferred integration method.</p>
              <div className="flex gap-2 border-b border-gray-200">
                <button onClick={() => setConnectionTab("api")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${connectionTab === "api" ? "border-black text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                  API Key &amp; Webhook
                </button>
                <button onClick={() => setConnectionTab("sdk")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${connectionTab === "sdk" ? "border-black text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                  Connect via SDK
                </button>
              </div>

              {connectionTab === "api" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                    <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-••••••••••••••••"
                      className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
                    <p className="text-xs text-gray-400 mt-1">Your platform API key for agent communication</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                    <input type="url" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://your-app.com/agent-shield/webhook"
                      className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
                    <p className="text-xs text-gray-400 mt-1">Agent Shield will send policy events to this endpoint</p>
                  </div>
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-[6px] p-3">
                    <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-700">This is a demo — no actual connection will be made. In production, these credentials would securely connect your agent to Agent Shield&apos;s monitoring pipeline.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 rounded-[6px] p-4 text-xs font-mono overflow-x-auto leading-relaxed">{SDK_SNIPPET}</pre>
                    <button onClick={copySnippet}
                      className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors">
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-[6px] p-3">
                    <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-700">Install the SDK and initialize it in your agent&apos;s codebase. Agent Shield will automatically intercept and monitor all tool calls.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4 — Review */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Agent Details</p>
                <div className="bg-gray-50 rounded-[6px] p-4 space-y-2 border border-gray-200">
                  <div className="flex justify-between"><span className="text-sm text-gray-500">Name</span><span className="text-sm font-medium text-gray-900">{name}</span></div>
                  {description && <div><span className="text-sm text-gray-500">Description</span><p className="text-sm text-gray-700 mt-0.5">{description}</p></div>}
                  <div className="flex justify-between"><span className="text-sm text-gray-500">Platform</span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${platform === "Claude" ? "bg-purple-50 text-purple-700" : "bg-green-50 text-green-700"}`}>{platform}</span>
                  </div>
                  <div className="flex justify-between"><span className="text-sm text-gray-500">Model</span><span className="text-sm text-gray-700">{model}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-500">Department</span><span className="text-sm text-gray-700">{department}</span></div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Permissions ({selectedPerms.size})</p>
                <div className="flex flex-wrap gap-1.5">
                  {[...selectedPerms].map(p => {
                    const perm = Object.values(PERMISSION_GROUPS).flat().find(x => x.name === p);
                    return (
                      <span key={p} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center gap-1">
                        {p}
                        {perm && (
                          <span className={`w-1.5 h-1.5 rounded-full ${perm.risk === "high" ? "bg-red-500" : perm.risk === "medium" ? "bg-yellow-500" : "bg-green-500"}`} />
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Initial Risk Assessment</p>
                <div className="bg-gray-50 rounded-[6px] p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {level === "high" ? <AlertTriangle size={18} className="text-red-500" /> :
                       level === "medium" ? <AlertTriangle size={18} className="text-yellow-500" /> :
                       <Shield size={18} className="text-green-500" />}
                      <span className={`text-2xl font-bold ${level === "high" ? "text-red-600" : level === "medium" ? "text-yellow-600" : "text-green-600"}`}>{score}</span>
                      <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full ${
                        level === "high" ? "bg-red-50 text-red-700" : level === "medium" ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"
                      }`}>{level} risk</span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${level === "high" ? "bg-red-500" : level === "medium" ? "bg-yellow-500" : "bg-green-500"}`}
                          style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Risk score calculated based on {selectedPerms.size} selected permission{selectedPerms.size !== 1 ? "s" : ""} and their individual risk levels.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <button onClick={step === 0 ? handleClose : () => setStep(s => s - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
            {step === 0 ? "Cancel" : "Back"}
          </button>
          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
              className="px-5 py-2 bg-black text-white text-sm font-medium rounded-[6px] hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Next
            </button>
          ) : (
            <button onClick={handleAdd}
              className="px-5 py-2 bg-black text-white text-sm font-medium rounded-[6px] hover:bg-gray-800 transition-colors">
              Add Agent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
