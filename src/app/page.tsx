"use client";

import { agents } from "@/data/agents";
import { alerts } from "@/data/alerts";
import { Bot, AlertTriangle, Gauge, ScanSearch, TrendingDown, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Agents", value: agents.length.toString(), icon: Bot, change: "+3 this week", up: true, color: "bg-purple-50 text-purple-600" },
  { label: "Critical Alerts", value: alerts.filter(a => a.severity === "critical").toString().length < 2 ? alerts.filter(a => a.severity === "critical" && a.status !== "resolved").length.toString() : alerts.filter(a => a.severity === "critical" && a.status !== "resolved").length.toString(), icon: AlertTriangle, change: "+2 today", up: true, color: "bg-red-50 text-red-600" },
  { label: "Avg Risk Score", value: Math.round(agents.reduce((a, b) => a + b.riskScore, 0) / agents.length).toString(), icon: Gauge, change: "-4 from last week", up: false, color: "bg-orange-50 text-orange-600" },
  { label: "Agents Scanned", value: "16", icon: ScanSearch, change: "2 remaining", up: true, color: "bg-green-50 text-green-600" },
];

const riskTrendData = [32, 35, 33, 38, 41, 39, 42, 45, 43, 40, 38, 41];
const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

export default function Dashboard() {
  const criticalAlerts = alerts.filter(a => a.status !== "resolved").slice(0, 5);
  const highRiskAgents = [...agents].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">AI agent security overview for Acme Corp</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-[6px] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{stat.label}</span>
              <div className={`w-9 h-9 rounded-[6px] flex items-center justify-center ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
            <div className="flex items-center gap-1 mt-1.5">
              {stat.up ? <TrendingUp size={13} className="text-red-500" /> : <TrendingDown size={13} className="text-green-500" />}
              <span className={`text-xs ${stat.up && stat.label === "Critical Alerts" ? "text-red-500" : stat.up ? "text-gray-500" : "text-green-600"}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Risk Trend Chart */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-[6px] p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Risk Score Trend</h2>
          <p className="text-xs text-gray-400 mb-6">Average risk score across all agents (12 months)</p>
          <div className="flex items-end gap-2 h-40">
            {riskTrendData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-[4px] transition-all ${i === riskTrendData.length - 1 ? "bg-orange-500" : "bg-purple-200"}`}
                  style={{ height: `${(val / 50) * 100}%` }}
                />
                <span className="text-[10px] text-gray-400">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* High Risk Agents */}
        <div className="bg-white border border-gray-200 rounded-[6px] p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Highest Risk Agents</h2>
          <p className="text-xs text-gray-400 mb-4">Agents requiring attention</p>
          <div className="space-y-3">
            {highRiskAgents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${agent.riskLevel === "high" ? "bg-red-500" : agent.riskLevel === "medium" ? "bg-yellow-500" : "bg-green-500"}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-400">{agent.platform} · {agent.department}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${agent.riskLevel === "high" ? "text-red-600" : agent.riskLevel === "medium" ? "text-yellow-600" : "text-green-600"}`}>
                  {agent.riskScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="mt-6 bg-white border border-gray-200 rounded-[6px] p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Recent Alerts</h2>
        <p className="text-xs text-gray-400 mb-4">Latest security alerts requiring review</p>
        <div className="space-y-3">
          {criticalAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center gap-4 py-2.5 border-b border-gray-100 last:border-0">
              <span className={`shrink-0 w-2 h-2 rounded-full ${
                alert.severity === "critical" ? "bg-red-500" : alert.severity === "high" ? "bg-orange-500" : alert.severity === "medium" ? "bg-yellow-500" : "bg-blue-400"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{alert.title}</p>
                <p className="text-xs text-gray-400">{alert.agentName} · {alert.timestamp}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                alert.severity === "critical" ? "bg-red-50 text-red-700" : alert.severity === "high" ? "bg-orange-50 text-orange-700" : "bg-yellow-50 text-yellow-700"
              }`}>
                {alert.severity}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                alert.status === "open" ? "bg-red-50 text-red-600" : alert.status === "investigating" ? "bg-purple-50 text-purple-600" : "bg-green-50 text-green-600"
              }`}>
                {alert.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
