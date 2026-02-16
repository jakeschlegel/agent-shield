"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { RedTeamTest } from "@/data/redteam";
import { X, CheckCircle2, XCircle, AlertTriangle, Download, ChevronDown, ChevronRight, Loader2 } from "lucide-react";

type TestResult = "pass" | "fail" | "partial";
type TestState = "pending" | "running" | "done";

interface RunningTest {
  categoryId: string;
  testIndex: number;
  name: string;
  agentName: string;
  severity: string;
  state: TestState;
  result?: TestResult;
  details?: string;
}

interface CategoryResult {
  attackType: string;
  total: number;
  passed: number;
  failed: number;
  partial: number;
}

interface Props {
  categories: RedTeamTest[];
  initialCategoryId?: string;
  open: boolean;
  onClose: () => void;
}

export default function RedTeamTestRunner({ categories, initialCategoryId, open, onClose }: Props) {
  const [tests, setTests] = useState<RunningTest[]>([]);
  const [phase, setPhase] = useState<"running" | "summary">("running");
  const [completedCount, setCompletedCount] = useState(0);
  const [expandedFailures, setExpandedFailures] = useState<Set<string>>(new Set());
  const abortRef = useRef(false);

  const totalTests = tests.length;

  const startRun = useCallback(async (catIds: string[]) => {
    abortRef.current = false;
    const filtered = categories.filter(c => catIds.includes(c.id));
    const allTests: RunningTest[] = [];
    for (const cat of filtered) {
      for (let i = 0; i < cat.tests.length; i++) {
        const t = cat.tests[i];
        allTests.push({
          categoryId: cat.id,
          testIndex: i,
          name: t.name,
          agentName: t.agentName,
          severity: t.severity,
          state: "pending",
        });
      }
    }
    setTests(allTests);
    setCompletedCount(0);
    setPhase("running");

    // Run tests sequentially with delays
    for (let i = 0; i < allTests.length; i++) {
      if (abortRef.current) return;
      // Set current test to running
      setTests(prev => prev.map((t, idx) => idx === i ? { ...t, state: "running" } : t));
      
      // Random delay 500-1500ms
      const delay = 500 + Math.random() * 1000;
      await new Promise(r => setTimeout(r, delay));
      
      if (abortRef.current) return;

      // Simulate result - use original data's result
      const cat = filtered.find(c => c.id === allTests[i].categoryId)!;
      const originalTest = cat.tests[allTests[i].testIndex];
      
      setTests(prev => prev.map((t, idx) => idx === i ? {
        ...t,
        state: "done",
        result: originalTest.result,
        details: originalTest.details,
      } : t));
      setCompletedCount(i + 1);
    }

    // Small delay then show summary
    await new Promise(r => setTimeout(r, 600));
    if (!abortRef.current) setPhase("summary");
  }, [categories]);

  useEffect(() => {
    if (open) {
      const catIds = initialCategoryId
        ? [initialCategoryId]
        : categories.map(c => c.id);
      startRun(catIds);
    }
    return () => { abortRef.current = true; };
  }, [open]);

  if (!open) return null;

  const categoryResults: CategoryResult[] = [];
  const catMap = new Map<string, CategoryResult>();
  for (const t of tests) {
    const cat = categories.find(c => c.id === t.categoryId)!;
    if (!catMap.has(t.categoryId)) {
      const cr = { attackType: cat.attackType, total: 0, passed: 0, failed: 0, partial: 0 };
      catMap.set(t.categoryId, cr);
      categoryResults.push(cr);
    }
    const cr = catMap.get(t.categoryId)!;
    cr.total++;
    if (t.result === "pass") cr.passed++;
    else if (t.result === "fail") cr.failed++;
    else if (t.result === "partial") cr.partial++;
  }

  const totalPassed = tests.filter(t => t.result === "pass").length;
  const passRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
  const failures = tests.filter(t => t.state === "done" && t.result !== "pass");

  const toggleFailure = (key: string) => {
    setExpandedFailures(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleClose = () => {
    abortRef.current = true;
    onClose();
  };

  const exportReport = () => {
    const lines = [
      "Red Team Test Report",
      `Date: ${new Date().toISOString()}`,
      `Overall Pass Rate: ${passRate}%`,
      "",
      ...categoryResults.map(cr => `${cr.attackType}: ${Math.round((cr.passed / cr.total) * 100)}% (${cr.passed}/${cr.total})`),
      "",
      "Failures:",
      ...failures.map(f => `  - [${f.severity.toUpperCase()}] ${f.name} (${f.agentName}): ${f.details}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "red-team-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Group tests by category for display
  const groupedTests = new Map<string, RunningTest[]>();
  for (const t of tests) {
    const cat = categories.find(c => c.id === t.categoryId)!;
    if (!groupedTests.has(cat.attackType)) groupedTests.set(cat.attackType, []);
    groupedTests.get(cat.attackType)!.push(t);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[6px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {phase === "running" ? "Running Red Team Tests..." : "Test Results"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {phase === "running"
                ? `${completedCount} of ${totalTests} tests complete`
                : `${totalTests} tests completed`}
            </p>
          </div>
          <button onClick={handleClose} className="p-1.5 hover:bg-gray-100 rounded-[6px] transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100 shrink-0">
          <div
            className="h-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${totalTests > 0 ? (completedCount / totalTests) * 100 : 0}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {phase === "running" ? (
            <div className="space-y-6">
              {Array.from(groupedTests.entries()).map(([catName, catTests]) => (
                <div key={catName}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">{catName}</h3>
                  <div className="space-y-1">
                    {catTests.map((t, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 px-3 py-2 rounded-[6px] transition-all duration-300 ${
                          t.state === "running" ? "bg-purple-50" : t.state === "done" ? "bg-gray-50" : ""
                        }`}
                      >
                        {/* Status icon */}
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          {t.state === "pending" && (
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                          )}
                          {t.state === "running" && (
                            <Loader2 size={16} className="text-purple-500 animate-spin" />
                          )}
                          {t.state === "done" && t.result === "pass" && (
                            <CheckCircle2 size={16} className="text-green-500 animate-in zoom-in duration-200" />
                          )}
                          {t.state === "done" && t.result === "fail" && (
                            <XCircle size={16} className="text-red-500 animate-in zoom-in duration-200" />
                          )}
                          {t.state === "done" && t.result === "partial" && (
                            <AlertTriangle size={16} className="text-yellow-500 animate-in zoom-in duration-200" />
                          )}
                        </div>
                        <span className={`text-sm flex-1 ${
                          t.state === "pending" ? "text-gray-400" : "text-gray-700"
                        }`}>
                          {t.name}
                        </span>
                        <span className="text-xs text-gray-400">{t.agentName}</span>
                        {t.state === "done" && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-[6px] animate-in fade-in duration-300 ${
                            t.result === "pass" ? "bg-green-50 text-green-700" :
                            t.result === "fail" ? "bg-red-50 text-red-700" :
                            "bg-yellow-50 text-yellow-700"
                          }`}>
                            {t.result?.toUpperCase()}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Summary phase */
            <div className="space-y-6">
              {/* Big pass rate */}
              <div className="text-center py-4">
                <div className={`text-6xl font-bold ${passRate >= 80 ? "text-green-600" : passRate >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                  {passRate}%
                </div>
                <p className="text-sm text-gray-500 mt-1">Overall Pass Rate</p>
              </div>

              {/* Per-category breakdown */}
              <div className="grid grid-cols-2 gap-3">
                {categoryResults.map(cr => {
                  const rate = Math.round((cr.passed / cr.total) * 100);
                  return (
                    <div key={cr.attackType} className="bg-gray-50 rounded-[6px] p-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">{cr.attackType}</p>
                      <div className="flex items-end justify-between">
                        <span className={`text-xl font-bold ${rate >= 80 ? "text-green-600" : rate >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                          {rate}%
                        </span>
                        <span className="text-xs text-gray-400">{cr.passed}/{cr.total} passed</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Failures */}
              {failures.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Issues Found ({failures.length})
                  </h3>
                  <div className="space-y-1">
                    {failures.map((f, i) => {
                      const key = `${f.categoryId}-${f.testIndex}`;
                      const expanded = expandedFailures.has(key);
                      return (
                        <div key={i} className="border border-gray-200 rounded-[6px] overflow-hidden">
                          <button
                            onClick={() => toggleFailure(key)}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                          >
                            {expanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                            {f.result === "fail" ? (
                              <XCircle size={14} className="text-red-500 shrink-0" />
                            ) : (
                              <AlertTriangle size={14} className="text-yellow-500 shrink-0" />
                            )}
                            <span className="text-sm text-gray-700 flex-1">{f.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              f.severity === "critical" ? "bg-red-50 text-red-700" : f.severity === "high" ? "bg-orange-50 text-orange-700" : "bg-yellow-50 text-yellow-700"
                            }`}>{f.severity}</span>
                          </button>
                          {expanded && (
                            <div className="px-3 pb-3 pt-1 text-xs text-gray-500 border-t border-gray-100 bg-gray-50 animate-in slide-in-from-top-1 duration-150">
                              <p><span className="font-medium text-gray-600">Agent:</span> {f.agentName}</p>
                              <p className="mt-1">{f.details}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {phase === "summary" && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
            <button
              onClick={exportReport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-[6px] hover:bg-gray-200 transition-colors"
            >
              <Download size={14} />
              Export Report
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-[6px] hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
