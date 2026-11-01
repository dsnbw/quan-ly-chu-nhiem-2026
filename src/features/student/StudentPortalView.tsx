import React from 'react';
import {
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Grid,
  Smile,
  Award,
  Sparkles
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { Badge } from '../../components/common/Badge';

export const StudentPortalView: React.FC = () => {
  const session = localStore.getUserSession();
  const students = localStore.getStudents();
  const me = (session.studentId ? students.find(s => s.id === session.studentId) : null) || students[0];

  if (!me) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
        <p className="text-slate-500 font-bold">Chưa có thông tin học sinh.</p>
      </div>
    );
  }

  const grades = localStore.getGrades().filter(g => g.studentId === me.id);
  const behaviorObs = localStore.getBehaviorObservations().filter(b => b.studentId === me.id);
  const totalPoints = behaviorObs.reduce((s, o) => s + o.points, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-100">
            <GraduationCap className="w-4 h-4" />
            Góc Học Tập & Rèn Luyện của Học sinh
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Xin chào {me.fullName}! (Lớp 8A1)
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm">
            Chức vụ: Lớp trưởng • {me.groupName || 'Tổ 1'} • Vị trí: Bàn {me.seatRow}, Ghế {me.seatCol}
          </p>
        </div>

        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
          <p className="text-xs text-blue-200">Điểm Nề nếp Tháng 8</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-yellow-300">+{totalPoints} đ</p>
          <p className="text-[10px] text-blue-100">Hạng 1 phong trào thi đua</p>
        </div>
      </div>

      {/* Main Grid: My Grades & Behavior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Grades */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Kết quả Học tập của Em (Học kỳ 1)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Môn học</th>
                  <th className="p-2.5 text-center">TX1</th>
                  <th className="p-2.5 text-center">TX2</th>
                  <th className="p-2.5 text-center">Giữa kỳ</th>
                  <th className="p-2.5 text-center">ĐTB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map(g => (
                  <tr key={g.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-800">{g.subjectName}</td>
                    <td className="p-2.5 text-center font-mono">{g.tx1 ?? '-'}</td>
                    <td className="p-2.5 text-center font-mono">{g.tx2 ?? '-'}</td>
                    <td className="p-2.5 text-center font-mono font-bold text-brand-700">{g.gk ?? '-'}</td>
                    <td className="p-2.5 text-center font-bold text-emerald-700">{g.averageScore ?? 'Đạt'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Behavior History */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Smile className="w-5 h-5 text-emerald-600" />
            Nhật ký Khen thưởng & Ghi nhận Tích cực
          </h3>

          <div className="space-y-3">
            {behaviorObs.map(obs => (
              <div key={obs.id} className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">{obs.eventTitle}</span>
                  <Badge variant="success" size="sm">+{obs.points} điểm</Badge>
                </div>
                <p className="text-slate-600">{obs.note}</p>
                <p className="text-[10px] text-slate-400">Người ghi nhận: {obs.recordedByTeacherName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
