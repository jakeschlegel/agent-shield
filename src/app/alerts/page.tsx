"use client";

import { useState } from "react";
import { alerts } from "@/data/alerts";
import { Bell, Filter } from "lucide-react";

const severityFilters = ["All", "critical", "high", "medium", "low"];
const statusFilters = ["All", "open", "investigating", "resolved"];

export default function AlertsPage() {
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");

  const filtered = alerts.filter(a => {
    return (severity === "All" || a.severity === severity) && (status === "All" || a.status === status);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Alerts</h1>
          <p className="text-sm text-gray-500 mt-1">{alerts.filter(a => a.status !== "resolved").length} active alerts requiring review</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-700">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {alerts.filter(a => a.severity === "critical" && a.status !== "resolved").length} critical
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Severity:</span>
          {severityFilters.map((s) => (
            <button key={s} onClick={() => setSeverity(s)}
              className={`px-3 py-2 min-h-[44px] sm:min-h-0 sm:py-1.5 text-xs font-medium rounded-[6px] capitalize transition-colors ${
                severity === s ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>{s}</button>
          ))}
        </div>
        <div className="w-px h-5 bg-gray-200 hidden sm:block" />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Status:</span>
          {statusFilters.map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-2 min-h-[44px] sm:min-h-0 sm:py-1.5 text-xs font-medium rounded-[6px] capitalize transition-colors ${
                status === s ? "bg-purple-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((alert) => (
          <div key={alert.id} className="bg-white border border-gray-200 rounded-[6px] p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`mt-0.5 w-3 h-3 rounded-full shrink-0 ${
                alert.severity === "critical" ? "bg-red-500" : alert.severity === "high" ? "bg-black" : alert.severity === "medium" ? "bg-yellow-500" : "bg-blue-400"
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900">{alert.title}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    alert.severity === "critical" ? "bg-red-50 text-red-700" : alert.severity === "high" ? "bg-orange-50 text-orange-700" : alert.severity === "medium" ? "bg-yellow-50 text-yellow-700" : "bg-blue-50 text-blue-600"
                  }`}>{alert.severity}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    alert.status === "open" ? "bg-red-50 text-red-600" : alert.status === "investigating" ? "bg-purple-50 text-purple-600" : "bg-green-50 text-green-600"
                  }`}>{alert.status}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{alert.agentName}</span>
                  <span>·</span>
                  <span>{alert.category}</span>
                  <span>·</span>
                  <span>{alert.timestamp}</span>
                </div>
              </div>
              {alert.status !== "resolved" && (
                <button className="shrink-0 px-3 py-1.5 text-xs font-medium text-gray-900 bg-gray-50 rounded-[6px] hover:bg-gray-100 transition-colors">
                  Investigate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
