"use client";

import { useState } from "react";
import { redTeamTests } from "@/data/redteam";
import { Syringe, DatabaseZap, ShieldAlert, Lock, CheckCircle2, XCircle, AlertTriangle, Play } from "lucide-react";
import RedTeamTestRunner from "@/components/RedTeamTestRunner";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Syringe,
  DatabaseZap,
  ShieldAlert,
  Lock,
};

export default function RedTeamPage() {
  const [runnerOpen, setRunnerOpen] = useState(false);
  const [runnerCategoryId, setRunnerCategoryId] = useState<string | undefined>(undefined);

  const overallPass = redTeamTests.reduce((acc, t) => acc + t.tests.filter(x => x.result === "pass").length, 0);
  const overallTotal = redTeamTests.reduce((acc, t) => acc + t.tests.length, 0);

  const handleRunAll = () => {
    setRunnerCategoryId(undefined);
    setRunnerOpen(true);
  };

  const handleRunCategory = (categoryId: string) => {
    setRunnerCategoryId(categoryId);
    setRunnerOpen(true);
  };

  const handleClose = () => {
    setRunnerOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Red Team</h1>
          <p className="text-sm text-gray-500 mt-1">Simulated attack results across your AI agent fleet</p>
        </div>
        <button
          onClick={handleRunAll}
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-[6px] hover:bg-gray-800 transition-colors"
        >
          Run All Tests
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {redTeamTests.map((test) => {
          const Icon = iconMap[test.icon] || ShieldAlert;
          return (
            <div key={test.id} className="bg-white border border-gray-200 rounded-[6px] p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-purple-500" />
                  <span className="text-xs font-medium text-gray-500">{test.attackType}</span>
                </div>
                <button
                  onClick={() => handleRunCategory(test.id)}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-[6px] hover:bg-purple-100 transition-colors"
                >
                  <Play size={10} />
                  Run
                </button>
              </div>
              <div className="flex items-end justify-between">
                <span className={`text-2xl font-bold ${test.passRate >= 80 ? "text-green-600" : test.passRate >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                  {test.passRate}%
                </span>
                <span className="text-xs text-gray-400">pass rate</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Results */}
      <div className="space-y-6">
        {redTeamTests.map((test) => {
          const Icon = iconMap[test.icon] || ShieldAlert;
          return (
            <div key={test.id} className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[6px] bg-purple-50 flex items-center justify-center">
                    <Icon size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{test.attackType}</h3>
                    <p className="text-xs text-gray-400">{test.description}</p>
                  </div>
                  <button
                    onClick={() => handleRunCategory(test.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-[6px] hover:bg-purple-100 transition-colors mr-3"
                  >
                    <Play size={12} />
                    Run Tests
                  </button>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${test.passRate >= 80 ? "text-green-600" : test.passRate >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                      {test.passRate}% pass
                    </span>
                    <p className="text-xs text-gray-400">Last run: {test.lastRun}</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {test.tests.map((t, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 hover:bg-gray-50/50">
                    {t.result === "pass" ? (
                      <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                    ) : t.result === "fail" ? (
                      <XCircle size={18} className="text-red-500 shrink-0" />
                    ) : (
                      <AlertTriangle size={18} className="text-yellow-500 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{t.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          t.severity === "critical" ? "bg-red-50 text-red-700" : t.severity === "high" ? "bg-orange-50 text-orange-700" : "bg-yellow-50 text-yellow-700"
                        }`}>{t.severity}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{t.details}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{t.agentName}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-[6px] ${
                      t.result === "pass" ? "bg-green-50 text-green-700" : t.result === "fail" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                    }`}>
                      {t.result.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <RedTeamTestRunner
        categories={redTeamTests}
        initialCategoryId={runnerCategoryId}
        open={runnerOpen}
        onClose={handleClose}
      />
    </div>
  );
}
