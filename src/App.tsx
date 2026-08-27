import React, { useState, useEffect } from 'react';
import { localStore } from './core/storage/localStore';
import { UserSession } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { CockpitDashboard } from './features/dashboard/CockpitDashboard';
import { StudentRegistry } from './features/students/StudentRegistry';
import { SeatingManager } from './features/seating/SeatingManager';
import { ClassFinanceManager } from './features/finance/ClassFinanceManager';
import { BehaviorLedgerManager } from './features/behavior/BehaviorLedgerManager';
import { AttendanceManager } from './features/attendance/AttendanceManager';
import { GradebookManager } from './features/gradebook/GradebookManager';
import { DigitalReportCardManager } from './features/reportcard/DigitalReportCardManager';
import { HomeroomBookManager } from './features/homeroom/HomeroomBookManager';
import { SupportCenter } from './features/support/SupportCenter';
import { ParentPortalView } from './features/parent/ParentPortalView';
import { StudentPortalView } from './features/student/StudentPortalView';
import { TaskManager } from './features/tasks/TaskManager';
import { SyncCenter } from './features/sync/SyncCenter';
import { ReportCenter } from './features/reports/ReportCenter';
import { SettingsCenter } from './features/settings/SettingsCenter';
import { AiAssistantModal } from './features/ai/AiAssistantModal';
import { Updater } from './components/common/Updater';

export function App() {
  const [session, setSession] = useState<UserSession>(localStore.getUserSession());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = localStore.subscribe(() => {
      setSession(localStore.getUserSession());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CockpitDashboard onNavigate={setActiveTab} onOpenAiAssistant={() => setIsAiModalOpen(true)} />;
      case 'students':
        return <StudentRegistry />;
      case 'seating':
        return <SeatingManager />;
      case 'finance':
        return <ClassFinanceManager />;
      case 'behavior':
        return <BehaviorLedgerManager />;
      case 'attendance':
        return <AttendanceManager />;
      case 'gradebook':
        return <GradebookManager />;
      case 'reportcard':
        return <DigitalReportCardManager />;
      case 'homeroom':
        return <HomeroomBookManager />;
      case 'support':
        return <SupportCenter />;
      case 'parent_portal':
        return <ParentPortalView />;
      case 'student_portal':
        return <StudentPortalView />;
      case 'tasks':
        return <TaskManager />;
      case 'sync':
        return <SyncCenter />;
      case 'reports':
        return <ReportCenter />;
      case 'settings':
        return <SettingsCenter />;
      default:
        return <CockpitDashboard onNavigate={setActiveTab} onOpenAiAssistant={() => setIsAiModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        session={session}
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onOpenSyncCenter={() => setActiveTab('sync')}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 lg:pb-8">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          role={session.activeRole}
        />

        {/* Dynamic Feature Content */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMenu={() => setIsSidebarOpen(true)}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      <Updater />
    </div>
  );
}

export default App;
