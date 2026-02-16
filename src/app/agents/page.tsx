"use client";

import { useState } from "react";
import { agents as initialAgents, type Agent } from "@/data/agents";
import { Search, Filter, Bot } from "lucide-react";
import AddAgentModal from "@/components/AddAgentModal";

const departments = ["All", "Sales", "Support", "Engineering", "Marketing", "Finance", "HR"];
const platforms = ["All", "Claude", "OpenAI"];

export default function AgentInventory() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [agentList, setAgentList] = useState<Agent[]>(initialAgents);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = agentList.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.department.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === "All" || a.department === dept;
    const matchPlatform = platform === "All" || a.platform === platform;
    return matchSearch && matchDept && matchPlatform;
  });

  const handleAddAgent = (agent: Agent) => {
    setAgentList(prev => [agent, ...prev]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Agent Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">{agentList.length} agents monitored across your organization</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-black text-white text-sm font-medium rounded-[6px] hover:bg-gray-800 transition-colors flex items-center gap-2">
          <Bot size={16} />
          + Add Agent
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative w-full sm:max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 min-h-[44px] text-sm border border-gray-200 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter size={14} className="text-gray-400" />
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={`px-3 py-2 min-h-[44px] sm:min-h-0 sm:py-1.5 text-xs font-medium rounded-[6px] transition-colors ${
                dept === d ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {d}
            </button>
          ))}
          <span className="w-px h-5 bg-gray-200 hidden sm:block" />
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-2 min-h-[44px] sm:min-h-0 sm:py-1.5 text-xs font-medium rounded-[6px] transition-colors ${
                platform === p ? "bg-purple-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-[6px] overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Agent</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Platform</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Department</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Permissions</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Risk Score</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Last Active</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((agent) => (
              <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-400">{agent.model}</p>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    agent.platform === "Claude" ? "bg-purple-50 text-purple-700" : "bg-green-50 text-green-700"
                  }`}>
                    {agent.platform}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-600">{agent.department}</td>
                <td className="px-5 py-3.5 text-sm text-gray-600">{agent.permissions.length}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${agent.riskLevel === "high" ? "bg-red-500" : agent.riskLevel === "medium" ? "bg-yellow-500" : "bg-green-500"}`}
                        style={{ width: `${agent.riskScore}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${agent.riskLevel === "high" ? "text-red-600" : agent.riskLevel === "medium" ? "text-yellow-600" : "text-green-600"}`}>
                      {agent.riskScore}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs text-gray-500">{agent.lastActive}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    agent.status === "active" ? "text-green-600" : agent.status === "idle" ? "text-gray-400" : "text-red-500"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      agent.status === "active" ? "bg-green-500" : agent.status === "idle" ? "bg-gray-300" : "bg-red-500"
                    }`} />
                    {agent.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddAgentModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAddAgent} />
    </div>
  );
}
