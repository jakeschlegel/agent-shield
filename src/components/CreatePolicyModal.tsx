"use client";

import { useState } from "react";
import { X, Plus, Trash2, Check } from "lucide-react";
import { agents } from "@/data/agents";
import type { Policy } from "@/data/policies";

interface Rule {
  id: string;
  description: string;
  action: "Block" | "Alert" | "Log";
}

interface CreatePolicyModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (policy: Policy) => void;
}

const CATEGORIES = ["Data Access", "Output Filtering", "Authentication", "Rate Limiting", "Content Safety", "Compliance"];
const SEVERITIES: Policy["severity"][] = ["critical", "high", "medium", "low"];
const STEPS = ["Policy Basics", "Rules", "Apply to Agents", "Review & Create"];
const DEPARTMENTS = [...new Set(agents.map(a => a.department))];
const PLATFORMS = [...new Set(agents.map(a => a.platform))];

export default function CreatePolicyModal({ open, onClose, onCreate }: CreatePolicyModalProps) {
  const [step, setStep] = useState(0);

  // Step 1
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [severity, setSeverity] = useState<Policy["severity"]>("medium");

  // Step 2
  const [rules, setRules] = useState<Rule[]>([]);
  const [newRuleDesc, setNewRuleDesc] = useState("");
  const [newRuleAction, setNewRuleAction] = useState<Rule["action"]>("Block");

  // Step 3
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());
  const [deptFilter, setDeptFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");

  const reset = () => {
    setStep(0);
    setName("");
    setDescription("");
    setCategory(CATEGORIES[0]);
    setSeverity("medium");
    setRules([]);
    setNewRuleDesc("");
    setNewRuleAction("Block");
    setSelectedAgents(new Set());
    setDeptFilter("");
    setPlatformFilter("");
  };

  const handleClose = () => { reset(); onClose(); };

  const addRule = () => {
    if (!newRuleDesc.trim()) return;
    setRules(prev => [...prev, { id: `r-${Date.now()}`, description: newRuleDesc.trim(), action: newRuleAction }]);
    setNewRuleDesc("");
    setNewRuleAction("Block");
  };

  const removeRule = (id: string) => setRules(prev => prev.filter(r => r.id !== id));

  const filteredAgents = agents.filter(a =>
    (!deptFilter || a.department === deptFilter) &&
    (!platformFilter || a.platform === platformFilter)
  );

  const toggleAgent = (id: string) => {
    setSelectedAgents(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedAgents(new Set(filteredAgents.map(a => a.id)));
  const deselectAll = () => setSelectedAgents(new Set());

  const canNext = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return rules.length > 0;
    if (step === 2) return selectedAgents.size > 0;
    return true;
  };

  const handleCreate = () => {
    const policy: Policy = {
      id: `pol-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category,
      enabled: true,
      severity,
      compliance: agents
        .filter(a => selectedAgents.has(a.id))
        .map(a => ({ agentId: a.id, agentName: a.name, compliant: true, lastChecked: "Just now" })),
    };
    onCreate(policy);
    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[6px] shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create Policy</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-1">
            {STEPS.map((label, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                    i < step ? "bg-orange-500 text-white" : i === step ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i <= step ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? "bg-orange-500" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. PII Data Access Restrictions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Describe what this policy enforces..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select value={severity} onChange={e => setSeverity(e.target.value as Policy["severity"])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white">
                    {SEVERITIES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Add rules that define what this policy enforces. Each rule specifies a condition and an action when violated.</p>
              {rules.map(rule => (
                <div key={rule.id} className="flex items-start gap-3 bg-gray-50 rounded-[6px] p-3 border border-gray-200">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{rule.description}</p>
                    <span className={`text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded-full ${
                      rule.action === "Block" ? "bg-red-50 text-red-700" : rule.action === "Alert" ? "bg-orange-50 text-orange-700" : "bg-blue-50 text-blue-600"
                    }`}>{rule.action}</span>
                  </div>
                  <button onClick={() => removeRule(rule.id)} className="text-gray-400 hover:text-red-500 mt-0.5"><Trash2 size={15} /></button>
                </div>
              ))}
              <div className="border border-gray-200 rounded-[6px] p-3 space-y-3">
                <input value={newRuleDesc} onChange={e => setNewRuleDesc(e.target.value)} placeholder="e.g. Agent must not access PII without authorization"
                  className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  onKeyDown={e => e.key === "Enter" && addRule()} />
                <div className="flex items-center gap-3">
                  <select value={newRuleAction} onChange={e => setNewRuleAction(e.target.value as Rule["action"])}
                    className="px-3 py-1.5 border border-gray-300 rounded-[6px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="Block">Block</option>
                    <option value="Alert">Alert</option>
                    <option value="Log">Log</option>
                  </select>
                  <button onClick={addRule} disabled={!newRuleDesc.trim()}
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-[6px] hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <Plus size={14} /> Add Rule
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-[6px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-[6px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="">All Platforms</option>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="flex gap-2 ml-auto">
                  <button onClick={selectAll} className="text-xs text-orange-600 hover:text-orange-700 font-medium">Select All</button>
                  <span className="text-gray-300">|</span>
                  <button onClick={deselectAll} className="text-xs text-gray-500 hover:text-gray-700 font-medium">Deselect All</button>
                </div>
              </div>
              <div className="space-y-1">
                {filteredAgents.map(agent => (
                  <label key={agent.id} className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={selectedAgents.has(agent.id)} onChange={() => toggleAgent(agent.id)}
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-800">{agent.name}</span>
                      <span className="text-xs text-gray-400 ml-2">{agent.department} · {agent.platform}</span>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400">{selectedAgents.size} agent{selectedAgents.size !== 1 ? "s" : ""} selected</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Policy Details</p>
                <div className="bg-gray-50 rounded-[6px] p-4 space-y-2 border border-gray-200">
                  <div className="flex justify-between"><span className="text-sm text-gray-500">Name</span><span className="text-sm font-medium text-gray-900">{name}</span></div>
                  {description && <div><span className="text-sm text-gray-500">Description</span><p className="text-sm text-gray-700 mt-0.5">{description}</p></div>}
                  <div className="flex justify-between"><span className="text-sm text-gray-500">Category</span><span className="text-sm text-gray-700">{category}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-500">Severity</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      severity === "critical" ? "bg-red-50 text-red-700" : severity === "high" ? "bg-orange-50 text-orange-700" : severity === "medium" ? "bg-yellow-50 text-yellow-700" : "bg-blue-50 text-blue-600"
                    }`}>{severity}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Rules ({rules.length})</p>
                <div className="space-y-1.5">
                  {rules.map(r => (
                    <div key={r.id} className="flex items-center gap-2 text-sm">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        r.action === "Block" ? "bg-red-50 text-red-700" : r.action === "Alert" ? "bg-orange-50 text-orange-700" : "bg-blue-50 text-blue-600"
                      }`}>{r.action}</span>
                      <span className="text-gray-700">{r.description}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Applied to ({selectedAgents.size} agents)</p>
                <div className="flex flex-wrap gap-1.5">
                  {agents.filter(a => selectedAgents.has(a.id)).map(a => (
                    <span key={a.id} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">{a.name}</span>
                  ))}
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
              className="px-5 py-2 bg-orange-500 text-white text-sm font-medium rounded-[6px] hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Next
            </button>
          ) : (
            <button onClick={handleCreate}
              className="px-5 py-2 bg-orange-500 text-white text-sm font-medium rounded-[6px] hover:bg-orange-600 transition-colors">
              Create Policy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
