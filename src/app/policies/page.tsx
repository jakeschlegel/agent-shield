"use client";

import { useState } from "react";
import { policies as initialPolicies, type Policy } from "@/data/policies";
import { CheckCircle2, XCircle, ChevronDown, ChevronRight } from "lucide-react";
import CreatePolicyModal from "@/components/CreatePolicyModal";

export default function PoliciesPage() {
  const [allPolicies, setAllPolicies] = useState<Policy[]>(initialPolicies);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [enabledState, setEnabledState] = useState<Record<string, boolean>>(
    Object.fromEntries(initialPolicies.map(p => [p.id, p.enabled]))
  );
  const [showCreate, setShowCreate] = useState(false);

  const handleCreatePolicy = (policy: Policy) => {
    setAllPolicies(prev => [policy, ...prev]);
    setEnabledState(prev => ({ ...prev, [policy.id]: true }));
  };

  const toggleEnabled = (id: string) => {
    setEnabledState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalViolations = allPolicies.reduce((acc, p) => acc + p.compliance.filter(c => !c.compliant).length, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Policies & Guardrails</h1>
          <p className="text-sm text-gray-500 mt-1">{allPolicies.length} policies configured · {totalViolations} active violations</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-[6px] hover:bg-orange-600 transition-colors">
          + Create Policy
        </button>
      </div>

      <CreatePolicyModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreatePolicy} />

      <div className="space-y-3">
        {allPolicies.map((policy) => {
          const isExpanded = expanded === policy.id;
          const violations = policy.compliance.filter(c => !c.compliant).length;
          const enabled = enabledState[policy.id];

          return (
            <div key={policy.id} className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : policy.id)}
              >
                {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{policy.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      policy.severity === "critical" ? "bg-red-50 text-red-700" : policy.severity === "high" ? "bg-orange-50 text-orange-700" : policy.severity === "medium" ? "bg-yellow-50 text-yellow-700" : "bg-blue-50 text-blue-600"
                    }`}>{policy.severity}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{policy.category}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{policy.description}</p>
                </div>
                {violations > 0 && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-700">
                    {violations} violation{violations > 1 ? "s" : ""}
                  </span>
                )}
                {violations === 0 && enabled && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700">
                    Compliant
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleEnabled(policy.id); }}
                  className={`relative w-10 h-5.5 rounded-full transition-colors ${enabled ? "bg-orange-500" : "bg-gray-200"}`}
                  style={{ height: "22px" }}
                >
                  <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${enabled ? "left-5" : "left-0.5"}`}
                    style={{ width: "18px", height: "18px" }} />
                </button>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 px-5 py-3 bg-gray-50/30">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Agent Compliance</p>
                  <div className="space-y-2">
                    {policy.compliance.map((c) => (
                      <div key={c.agentId} className="flex items-center gap-3">
                        {c.compliant ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )}
                        <span className="text-sm text-gray-700 flex-1">{c.agentName}</span>
                        <span className={`text-xs font-medium ${c.compliant ? "text-green-600" : "text-red-600"}`}>
                          {c.compliant ? "Compliant" : "Violation"}
                        </span>
                        <span className="text-xs text-gray-400">{c.lastChecked}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
