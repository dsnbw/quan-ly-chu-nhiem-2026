import React, { useState } from 'react';
import {
  GraduationCap,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  UserCheck,
  ChevronDown,
  Search,
  Menu
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { PermissionEngine } from '../../core/auth/permissionEngine';
import { RoleType, UserSession } from '../../types';
import { Badge } from '../common/Badge';

interface NavbarProps {
  session: UserSession;
  onOpenAiAssistant: () => void;
  onOpenSyncCenter: () => void;
  onToggleSidebar: () => void;
  activeTab: string;
  onNavigate: (tabId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  onOpenAiAssistant,
  onOpenSyncCenter,
  onToggleSidebar,
  onNavigate
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const school = localStore.getSchoolConfig();
  const syncConfig = localStore.getSyncConfig();
  const outbox = localStore.getOutbox();
  const conflicts = localStore.getConflicts();
  const unreadWarnings = localStore.getEarlyWarnings().filter(w => w.status === 'NEW').length;

  const rolesList: RoleType[] = [
    'HOMEROOM_TEACHER',
    'SUBJECT_TEACHER',
    'PRINCIPAL',
    'VICE_PRINCIPAL',
    'ACADEMIC_LEAD',
    'SCHOOL_ADMIN',
    'COUNSELOR_SOCIAL_WORK',
    'SCHOOL_HEALTH',
    'PARENT_GUARDIAN',
    'STUDENT',
    'TEAM_YOUTH_OFFICER',
    'OFFICE_RECORDS',
    'DATA_OPERATOR',
    'SUPER_ADMIN_TECH',
    'AUDITOR_READONLY'
  ];

  const handleRoleSelect = (role: RoleType) => {
    localStore.switchUserRole(role);
    setIsRoleDropdownOpen(false);
    if (role === 'PARENT_GUARDIAN') onNavigate('parent_portal');
    else if (role === 'STUDENT') onNavigate('student_portal');
    else onNavigate('dashboard');
  };

  const getSyncStatusBadge = () => {
    if (conflicts.some(c => c.resolvedStatus === 'UNRESOLVED')) {
      return (
        <button
          onClick={onOpenSyncCenter}
          className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
          title="Có xung đột đồng bộ cần xử lý"
        >
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
          <span>Xung đột ({conflicts.filter(c => c.resolvedStatus === 'UNRESOLVED').length})</span>
        </button>
      );
    }

    if (syncConfig.mode === 'LOCAL_ONLY') {
      return (
        <button
          onClick={onOpenSyncCenter}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-medium border border-slate-300 transition-colors"
          title="Đang làm việc ngoại tuyến (Offline-First). Bấm để xem cài đặt máy chủ."
        >
          <WifiOff className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Cục bộ (Offline)</span>
          {outbox.length > 0 && (
            <span className="bg-brand-600 text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {outbox.length}
            </span>
          )}
        </button>
      );
    }

    return (
      <button
        onClick={onOpenSyncCenter}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium border border-emerald-300 transition-colors"
      >
        <Wifi className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">Đã kết nối trường</span>
      </button>
    );
  };

  return (
    <header 
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand & School */}
        <div className="flex items-center gap-2 sm:gap-3" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            aria-label="Mở/Đóng danh mục"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 leading-tight">
                  {school.name}
                </span>
                <span className="bg-brand-50 text-brand-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-brand-200">
                  Lớp 8A1
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Nền tảng Quản lý Chủ nhiệm & Phối hợp Giáo dục 2026
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search & Quick alerts */}
        <div className="hidden xl:flex items-center flex-1 max-w-xs mx-4" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm học sinh, sổ điểm, báo cáo (Ctrl+K)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-transparent focus:border-brand-500 rounded-xl transition-all outline-none"
              onClick={() => onNavigate('students')}
            />
          </div>
        </div>

        {/* Right: Actions, Sync Badge, AI, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          {/* Sync Status Badge */}
          {getSyncStatusBadge()}

          {/* AI Homeroom Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95"
            title="Trợ lý AI Hỗ trợ Chủ nhiệm (Draft-only & Human in the loop)"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
            <span className="hidden sm:inline">Trợ lý AI</span>
          </button>

          {/* Role Switcher Dropdown (16 roles supported) */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all min-h-[44px] text-left"
              aria-label="Đổi vai trò người dùng"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight max-w-[130px] truncate">
                  {session.fullName}
                </p>
                <p className="text-[10px] text-brand-600 font-semibold truncate">
                  {PermissionEngine.getRoleDisplayName(session.activeRole)}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Chuyển đổi vai trò trải nghiệm
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Thử nghiệm hệ thống phân quyền chi tiết (RBAC + ABAC)
                  </p>
                </div>
                <div className="max-h-72 overflow-y-auto py-1">
                  {rolesList.map(role => (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        session.activeRole === role ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span>{PermissionEngine.getRoleDisplayName(role)}</span>
                      {session.activeRole === role && (
                        <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
