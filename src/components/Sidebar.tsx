"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Bot,
  Activity,
  Bell,
  Swords,
  ScrollText,
  Shield,
  Menu,
  X,
} from "lucide-react";

const navSections = [
  {
    label: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "MONITORING",
    items: [
      { name: "Agent Inventory", href: "/agents", icon: Bot },
      { name: "Activity Feed", href: "/activity", icon: Activity },
      { name: "Alerts", href: "/alerts", icon: Bell },
    ],
  },
  {
    label: "SECURITY",
    items: [
      { name: "Red Team", href: "/red-team", icon: Swords },
      { name: "Policies", href: "/policies", icon: ScrollText },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[6px] bg-black flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <div>
            <span className="font-semibold text-[15px] text-gray-900">Agent Shield</span>
            <span className="block text-[11px] text-gray-400 -mt-0.5">by Adaptive Security</span>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="md:hidden p-2 -mr-2 text-gray-400 hover:text-gray-600"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-[6px] text-[14px] font-medium transition-colors ${
                      isActive
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-semibold">AC</div>
          <div>
            <p className="text-sm font-medium text-gray-900">Acme Corp</p>
            <p className="text-xs text-gray-400">Enterprise Plan</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 flex items-center px-4 h-14">
        <button
          onClick={() => setOpen(true)}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <div className="w-7 h-7 rounded-[5px] bg-black flex items-center justify-center">
            <Shield className="text-white" size={15} />
          </div>
          <span className="font-semibold text-sm text-gray-900">Agent Shield</span>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 w-72 h-full bg-white flex flex-col transform transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r border-gray-200 bg-white flex-col h-full shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
}
