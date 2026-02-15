"use client";

import { useState } from "react";
import { activities } from "@/data/activities";
import { Activity as ActivityIcon, Filter } from "lucide-react";

const severityFilters = ["All", "info", "warning", "critical"];

export default function ActivityFeed() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? activities : activities.filter(a => a.severity === filter);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Activity Feed</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time log of all agent actions across your organization</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Filter size={14} className="text-gray-400" />
        {severityFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-[6px] capitalize transition-colors ${
              filter === s ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-[6px]">
        <div className="divide-y divide-gray-100">
          {filtered.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
              <div className="mt-0.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.severity === "critical" ? "bg-red-50" : activity.severity === "warning" ? "bg-yellow-50" : "bg-gray-50"
                }`}>
                  <ActivityIcon size={14} className={
                    activity.severity === "critical" ? "text-red-500" : activity.severity === "warning" ? "text-yellow-600" : "text-gray-400"
                  } />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-gray-900">{activity.agentName}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    activity.severity === "critical" ? "bg-red-50 text-red-700" : activity.severity === "warning" ? "bg-yellow-50 text-yellow-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {activity.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{activity.action}</span> {activity.resource}
                </p>
                <p className="text-xs text-gray-400 mt-1">{activity.details}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
