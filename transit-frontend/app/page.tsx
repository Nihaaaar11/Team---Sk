'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import TelemetryDashboard from '@/components/TelemetryDashboard';
import AIInsightsPanel from '@/components/AIInsightsPanel';

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <TopBar />
      <div className="flex flex-1 h-full w-full overflow-hidden">
        <Sidebar className="w-64 border-r border-border shrink-0 hidden md:flex flex-col" />
        <main className="flex-1 relative h-full w-full">
          <TelemetryDashboard />
          <div className="absolute top-4 right-4 z-10 hidden lg:block">
            <AIInsightsPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
