import type { ReactNode } from "react";
import { Badge } from "../../../app/components/ui/badge";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({
  roleLabel,
  title = "Role Dashboard",
  description = "Unified operations console for transport and tourism workflows.",
  showSidebar = true,
  children,
}: {
  roleLabel: string;
  title?: string;
  description?: string;
  showSidebar?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        {showSidebar ? <DashboardSidebar /> : null}
        <main className="w-full p-4 md:p-6">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>
            <Badge variant="outline">{roleLabel}</Badge>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
