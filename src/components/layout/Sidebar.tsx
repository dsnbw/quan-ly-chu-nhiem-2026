import React from 'react';
import {
  LayoutDashboard,
  Users,
  Grid,
  Wallet,
  Smile,
  CalendarCheck,
  BookOpen,
  FileCheck,
  BookMarked,
  HeartHandshake,
  UserCheck,
  CheckSquare,
  RefreshCw,
  FileText,
  Settings,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ChevronRight,
  LogOut
} from 'lucide-react';
import clsx from 'clsx';
import { RoleType } from '../../types';

// Declare electronAPI on window
declare global {
  interface Window {
    electronAPI?: {
      closeApp: () => void;
    }
  }
}

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  role: RoleType;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
  role
}) => {
  const isParent = role === 'PARENT_GUARDIAN';
  const isStudent = role === 'STUDENT';

  const navGroups = isParent ? [
    {
      title: 'Dành cho Phụ huynh',
      items: [
        { id: 'parent_portal', label: 'Cổng Phụ huynh (Tổng quan)', icon: <UserCheck className="w-5 h-5" /> },
        { id: 'attendance', label: 'Theo dõi Chuyên cần', icon: <CalendarCheck className="w-5 h-5" /> },
        { id: 'gradebook', label: 'Kết quả Học tập', icon: <BookOpen className="w-5 h-5" /> },
        { id: 'finance', label: 'Khoản thu & Quỹ lớp', icon: <Wallet className="w-5 h-5" /> },
        { id: 'reportcard', label: 'Tra cứu Học bạ số', icon: <FileCheck className="w-5 h-5" /> },
      ]
    }
  ] : isStudent ? [
    {
      title: 'Dành cho Học sinh',
      items: [
        { id: 'student_portal', label: 'Góc Học tập của em', icon: <GraduationCap className="w-5 h-5" /> },
        { id: 'seating', label: 'Sơ đồ Chỗ ngồi Lớp', icon: <Grid className="w-5 h-5" /> },
        { id: 'gradebook', label: 'Bảng điểm của em', icon: <BookOpen className="w-5 h-5" /> },
        { id: 'behavior', label: 'Điểm Rèn luyện / Nề nếp', icon: <Smile className="w-5 h-5" /> },
      ]
    }
  ] : [
    {
      title: 'Bàn làm việc',
      items: [
        { id: 'dashboard', label: 'Bàn làm việc chủ nhiệm', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'tasks', label: 'Nhiệm vụ & Lịch tuần', icon: <CheckSquare className="w-5 h-5" /> },
      ]
    },
    {
      title: 'Công tác Chủ nhiệm Lớp',
      items: [
        { id: 'students', label: 'Hồ sơ Học sinh 360°', icon: <Users className="w-5 h-5" /> },
        { id: 'seating', label: 'Sơ đồ Lớp & Chia tổ', icon: <Grid className="w-5 h-5" /> },
        { id: 'attendance', label: 'Chuyên cần & Nghỉ học', icon: <CalendarCheck className="w-5 h-5" /> },
        { id: 'behavior', label: 'Nhật ký Nề nếp Lớp', icon: <Smile className="w-5 h-5" /> },
        { id: 'finance', label: 'Quỹ lớp & Thu chi (TT55)', icon: <Wallet className="w-5 h-5" /> },
        { id: 'homeroom', label: 'Sổ chủ nhiệm & Sinh hoạt', icon: <BookMarked className="w-5 h-5" /> },
      ]
    },
    {
      title: 'Học tập & Đánh giá',
      items: [
        { id: 'gradebook', label: 'Sổ điểm Điện tử (TT22)', icon: <BookOpen className="w-5 h-5" /> },
        { id: 'reportcard', label: 'Học bạ số (TT70/2026)', icon: <FileCheck className="w-5 h-5" /> },
        { id: 'support', label: 'Tư vấn & Khen thưởng/Kỷ luật', icon: <HeartHandshake className="w-5 h-5" /> },
      ]
    },
    {
      title: 'Hệ thống & Báo cáo',
      items: [
        { id: 'reports', label: '18 Báo cáo Pháp lý Chuẩn', icon: <FileText className="w-5 h-5" /> },
        { id: 'sync', label: 'Đồng bộ & Xử lý Xung đột', icon: <RefreshCw className="w-5 h-5" /> },
        { id: 'settings', label: 'Cấu hình, Phân quyền & Lưu trữ', icon: <Settings className="w-5 h-5" /> },
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 lg:sticky lg:top-16 lg:z-30 h-full lg:h-[calc(100vh-4rem)] bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out',
          isOpen ? 'translate-x-0 w-64 opacity-100' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0 lg:border-none lg:overflow-hidden'
        )}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <h4 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-left">
                {group.title}
              </h4>
              <div className="space-y-0.5 pt-1">
                {group.items.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      className={clsx(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] text-left',
                        isActive
                          ? 'bg-brand-50 text-brand-700 font-bold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <div className="flex items-center gap-3 w-full text-left">
                        <span className={clsx(isActive ? 'text-brand-600' : 'text-slate-400')}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-brand-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
          {window.electronAPI && (
            <button
              onClick={() => window.electronAPI?.closeApp()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Đóng chương trình</span>
            </button>
          )}
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-center">
            <p className="text-[11px] font-bold text-slate-700">Năm học 2026 - 2027</p>
            <p className="text-[10px] text-slate-500">Học kỳ 1 • Tuần 4 (Baseline 26/08)</p>
          </div>
        </div>
      </aside>
    </>
  );
};
