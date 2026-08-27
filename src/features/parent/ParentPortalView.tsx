import React, { useState } from 'react';
import {
  UserCheck,
  CalendarCheck,
  BookOpen,
  Wallet,
  Send,
  Bell,
  CheckCircle2,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { Student, LeaveRequest, AttendanceRecord, GradeEntry } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatVND, formatDateVN } from '../../utils/formatters';

export const ParentPortalView: React.FC = () => {
  const students = localStore.getStudents();
  const child = students[0]; // Nguyễn Tuấn Anh
  const attendance = localStore.getAttendance().filter(a => a.studentId === child.id);
  const grades = localStore.getGrades().filter(g => g.studentId === child.id);
  const fees = localStore.getStudentFees().filter(f => f.studentId === child.id);

  // Leave Request Form State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('2026-08-27');
  const [toDate, setToDate] = useState('2026-08-27');
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveReason, setLeaveReason] = useState('');
  const [isNoticeAcknowledged, setIsNoticeAcknowledged] = useState(false);
  const [leaveToast, setLeaveToast] = useState(false);

  const handleSendLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason) return;

    const newReq: LeaveRequest = {
      id: 'leave-' + Math.random().toString(36).substring(2, 9),
      classId: child.classId,
      studentId: child.id,
      studentName: child.fullName,
      submittedByGuardianId: child.guardians[0]?.id || 'g-01',
      guardianName: child.guardians[0]?.fullName || 'Phụ huynh học sinh',
      guardianPhone: child.guardians[0]?.phone || '0912345111',
      fromDate,
      toDate,
      consecutiveDays: Number(leaveDays),
      reason: leaveReason,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString()
    };

    localStore.saveLeaveRequest(newReq);
    setIsLeaveModalOpen(false);
    setLeaveReason('');
    setLeaveToast(true);
    setTimeout(() => setLeaveToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Welcome Parent Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-100">
            <UserCheck className="w-4 h-4" />
            Cổng Thông tin Dành cho Cha mẹ Học sinh (Parent Portal)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Học sinh: {child.fullName} — Lớp 8A1
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm">
            GVCN: Thầy Nguyễn Văn An (SĐT: 0912 345 678) • Năm học 2026 - 2027
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Send className="w-4 h-4" />}
          onClick={() => setIsLeaveModalOpen(true)}
          className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold border-none shadow-md whitespace-nowrap"
        >
          Gửi Đơn xin Nghỉ học Online
        </Button>
      </div>

      {leaveToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Đã gửi đơn xin nghỉ học tới Thầy Giáo viên chủ nhiệm thành công!</span>
        </div>
      )}

      {/* School Announcements with Read Acknowledgement (COM-003) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Thông báo Quan trọng từ Nhà trường & GVCN
            </h3>
          </div>
          {isNoticeAcknowledged ? (
            <Badge variant="success" size="sm">Đã xác nhận đọc</Badge>
          ) : (
            <Badge variant="warning" size="sm">Chưa xác nhận</Badge>
          )}
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-2 text-slate-700">
          <p className="font-bold text-slate-900">
            Kế hoạch Chuẩn bị Lễ Khai giảng Năm học 2026 - 2027 và Họp Phụ huynh đầu năm
          </p>
          <p>
            Kính gửi Quý phụ huynh, Nhà trường trân trọng thông báo Lễ Khai giảng sẽ diễn ra lúc 07h00 ngày 05/09/2026. Hội nghị Cha mẹ học sinh lớp 8A1 được tổ chức vào 08h00 ngày Chủ Nhật 13/09/2026 tại Phòng học 204.
          </p>
          {!isNoticeAcknowledged && (
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                icon={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => setIsNoticeAcknowledged(true)}
                className="bg-brand-600 text-xs"
              >
                Tôi đã đọc và Xác nhận thông báo
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Attendance & Learning Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-600" />
              Tình hình Chuyên cần của Con
            </h3>
            <Badge variant="success" size="sm">Đi học đầy đủ 100%</Badge>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <p className="font-bold">Ghi nhận tháng 8/2026:</p>
            <p>• Số ngày có mặt: 10/10 ngày học</p>
            <p>• Số lần đi muộn: 0 lần</p>
            <p>• Số ngày nghỉ phép: 0 ngày</p>
          </div>
        </div>

        {/* Class Fund Contribution Status (FIN-009) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-600" />
              Các Khoản Đóng góp & Quỹ Lớp (Minh bạch)
            </h3>
            <Badge variant="success" size="sm">Đã hoàn thành</Badge>
          </div>

          <div className="space-y-2 text-xs">
            {fees.map((fee, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Quỹ hoạt động lớp HK1 (Tự nguyện)</p>
                  <p className="text-slate-500">Đã đóng góp: {formatVND(fee.paidAmount)}</p>
                </div>
                <Badge variant="success" size="sm">Đã nộp</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Scores Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Bảng Điểm & Đánh Giá Học Tập Công Bố
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5">Môn học</th>
                <th className="p-2.5 text-center">TX 1</th>
                <th className="p-2.5 text-center">TX 2</th>
                <th className="p-2.5 text-center">Giữa kỳ</th>
                <th className="p-2.5 text-center">ĐTB Môn</th>
                <th className="p-2.5">Nhận xét của Giáo viên</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.slice(0, 6).map(g => (
                <tr key={g.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-800">{g.subjectName}</td>
                  <td className="p-2.5 text-center font-mono">{g.tx1 ?? '-'}</td>
                  <td className="p-2.5 text-center font-mono">{g.tx2 ?? '-'}</td>
                  <td className="p-2.5 text-center font-mono font-bold text-brand-700">{g.gk ?? '-'}</td>
                  <td className="p-2.5 text-center font-mono font-bold text-emerald-700">{g.averageScore ?? 'Đạt'}</td>
                  <td className="p-2.5 text-slate-600 italic">{g.teacherComment || 'Tiếp thu bài tốt'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Online Leave Request Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-600" />
            <span>Gửi Đơn Xin Nghỉ Học cho Em {child.fullName}</span>
          </div>
        }
      >
        <form onSubmit={handleSendLeaveRequest} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nghỉ từ ngày *</label>
              <input
                type="date"
                required
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Đến hết ngày *</label>
              <input
                type="date"
                required
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Số ngày nghỉ liên tục</label>
            <input
              type="number"
              min={1}
              max={10}
              value={leaveDays}
              onChange={e => setLeaveDays(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Lý do xin nghỉ học cụ thể *</label>
            <textarea
              required
              rows={3}
              value={leaveReason}
              onChange={e => setLeaveReason(e.target.value)}
              placeholder="Kính gửi Thầy GVCN, gia đình xin phép cho cháu nghỉ học vì lý do..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsLeaveModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Gửi Đơn đến Thầy GVCN
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
