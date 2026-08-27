import React, { useState } from 'react';
import {
  Users,
  CalendarCheck,
  Wallet,
  CheckSquare,
  AlertTriangle,
  Sparkles,
  Grid,
  Smile,
  BookOpen,
  BookMarked,
  Phone,
  FileCheck,
  ChevronRight,
  Clock,
  Award
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatVND, formatDateVN } from '../../utils/formatters';

interface CockpitDashboardProps {
  onNavigate: (tabId: string) => void;
  onOpenAiAssistant: () => void;
}

export const CockpitDashboard: React.FC<CockpitDashboardProps> = ({
  onNavigate,
  onOpenAiAssistant
}) => {
  const session = localStore.getUserSession();
  const school = localStore.getSchoolConfig();
  const students = localStore.getStudents();
  const attendance = localStore.getAttendance();
  const transactions = localStore.getFinancialTransactions();
  const tasks = localStore.getTasks().filter(t => !t.isCompleted);
  const earlyWarnings = localStore.getEarlyWarnings().filter(w => w.status === 'NEW');
  const homeroomBook = localStore.getHomeroomBook();

  // Compute stats
  const presentCount = attendance.filter(a => a.status === 'PRESENT').length;
  const lateCount = attendance.filter(a => a.status === 'LATE').length;
  const absentCount = attendance.filter(a => a.status.includes('ABSENT')).length;

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
  const fundBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Welcome Cockpit */}
      <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 transform origin-top-right pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-brand-100 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Năm học 2026 - 2027 • Học kỳ 1 • Tuần 4
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bàn làm việc Chủ nhiệm — Lớp 8A1
            </h1>
            <p className="text-brand-100 text-sm max-w-xl">
              Chào {session.fullName}! Hôm nay là ngày 26/08/2026. Lớp học có {students.length} học sinh. Sẵn sàng cho ngày làm việc mới!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="md"
              icon={<Sparkles className="w-4 h-4 text-purple-600" />}
              onClick={onOpenAiAssistant}
              className="bg-white hover:bg-slate-50 text-slate-900 border-none font-bold"
            >
              Gợi ý từ AI
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<CalendarCheck className="w-4 h-4" />}
              onClick={() => onNavigate('attendance')}
              className="bg-emerald-500 hover:bg-emerald-600 border-none font-bold text-white shadow-md"
            >
              Điểm danh hôm nay
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Sĩ số lớp 8A1"
          value={`${students.length} / ${school.maxClassSize || 35}`}
          subtitle="100% hồ sơ đã hoàn thiện"
          variant="blue"
          icon={<Users className="w-6 h-6" />}
          onClick={() => onNavigate('students')}
        />
        <StatCard
          title="Chuyên cần hôm nay"
          value={`${presentCount} có mặt`}
          subtitle={`${absentCount} vắng phép, ${lateCount} muộn`}
          variant="green"
          icon={<CalendarCheck className="w-6 h-6" />}
          onClick={() => onNavigate('attendance')}
        />
        <StatCard
          title="Số dư Quỹ lớp"
          value={formatVND(fundBalance)}
          subtitle={`Đã thu: ${formatVND(totalIncome)} • Đã chi: ${formatVND(totalExpense)}`}
          variant="amber"
          icon={<Wallet className="w-6 h-6" />}
          onClick={() => onNavigate('finance')}
        />
        <StatCard
          title="Nhiệm vụ đến hạn"
          value={`${tasks.length} việc`}
          subtitle="Cần hoàn thành trong tuần này"
          variant="purple"
          icon={<CheckSquare className="w-6 h-6" />}
          onClick={() => onNavigate('tasks')}
        />
      </div>

      {/* Early Warning Signal Card (CNS-020, CNS-023) */}
      {earlyWarnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-amber-900 text-sm sm:text-base">
                    Tín hiệu Xem xét Sớm (Early Warning Queue): {earlyWarnings[0].title}
                  </h3>
                  <Badge variant="warning" size="sm">Cần chú ý</Badge>
                </div>
                <p className="text-xs sm:text-sm text-amber-800">
                  {earlyWarnings[0].description} ({earlyWarnings[0].quantitativeMetric})
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('support')}
              className="bg-white text-amber-900 border-amber-300 hover:bg-amber-100 text-xs font-bold whitespace-nowrap"
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
      )}

      {/* Main Grid: Quick Action Cockpit & Tasks / Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quick Action Hub */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                Công cụ Tác vụ Nhanh GVCN (Daily Cockpit)
              </h2>
              <span className="text-xs text-slate-500 font-medium">1 chạm đến chức năng</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onNavigate('seating')}
                className="p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-left group flex flex-col justify-between min-h-[110px]"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm group-hover:text-brand-700">Sơ đồ Lớp & Chia tổ</p>
                  <p className="text-[11px] text-slate-500">Xếp chỗ 1 chạm & Xuất Word A4</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('behavior')}
                className="p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-left group flex flex-col justify-between min-h-[110px]"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smile className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm group-hover:text-brand-700">Nhật ký Nề nếp</p>
                  <p className="text-[11px] text-slate-500">Ghi nhận điểm thi đua nội bộ</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('gradebook')}
                className="p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-left group flex flex-col justify-between min-h-[110px]"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm group-hover:text-brand-700">Sổ điểm Điện tử</p>
                  <p className="text-[11px] text-slate-500">Nhập TX/GK & Dán từ Excel</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('finance')}
                className="p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-left group flex flex-col justify-between min-h-[110px]"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm group-hover:text-brand-700">Quỹ lớp & Thu chi</p>
                  <p className="text-[11px] text-slate-500">Đối soát & Minh bạch TT55</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('homeroom')}
                className="p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-left group flex flex-col justify-between min-h-[110px]"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookMarked className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm group-hover:text-brand-700">Sổ Chủ nhiệm</p>
                  <p className="text-[11px] text-slate-500">Sinh hoạt lớp & Nộp duyệt BGH</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('reportcard')}
                className="p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-left group flex flex-col justify-between min-h-[110px]"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm group-hover:text-brand-700">Học bạ số TT70</p>
                  <p className="text-[11px] text-slate-500">Ký số & Trích lục điện tử</p>
                </div>
              </button>
            </div>
          </div>

          {/* Student Attention Highlights */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Học sinh cần quan tâm & Liên lạc nhanh Phụ huynh
              </h2>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('students')} className="text-xs text-brand-600 font-bold">
                Xem tất cả 30 em <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="divide-y divide-slate-100">
              {students.slice(0, 4).map(st => (
                <div key={st.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 font-bold text-brand-700 flex items-center justify-center text-sm border border-slate-200">
                      {st.fullName.split(' ').pop()?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{st.fullName}</p>
                      <p className="text-xs text-slate-500">
                        {st.groupName} • Bàn {st.seatRow}, Ghế {st.seatCol} {st.health.visionImpairment && '• (Cận thị)'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${st.guardians[0]?.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold flex items-center gap-1.5 border border-brand-200 transition-colors min-h-[38px]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Gọi PH ({st.guardians[0]?.phone})</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Homeroom Progress & Task Queue */}
        <div className="space-y-6">
          {/* Homeroom Book Progress Status */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center justify-between">
              <span>Tiến độ Sổ Chủ nhiệm 8A1</span>
              <Badge variant="success" size="sm">Đang mở (HK1)</Badge>
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>Hoàn thiện nội dung tháng 9</span>
                <span>85%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-600 rounded-full w-[85%]" />
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 space-y-1.5">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Kế hoạch học kỳ 1: Đã hoàn tất
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Sơ đồ bố trí chỗ ngồi: Đã xuất bản
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Biên bản sinh hoạt tuần 4: Đang soạn
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('homeroom')}
              className="w-full text-xs font-bold mt-2"
            >
              Mở Sổ Chủ nhiệm Điện tử
            </Button>
          </div>

          {/* Pending Tasks Queue */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-brand-600" />
                Việc cần xử lý
              </h3>
              <Badge variant="neutral" size="sm">{tasks.length} việc</Badge>
            </div>

            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {task.title}
                    </p>
                    <Badge variant={task.priority === 'HIGH' ? 'danger' : 'neutral'} size="sm">
                      {task.priority === 'HIGH' ? 'Gấp' : 'Thường'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Hạn chót: {formatDateVN(task.dueDate)}
                  </p>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('tasks')}
              className="w-full text-xs font-bold"
            >
              Xem tất cả nhiệm vụ & Lịch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
