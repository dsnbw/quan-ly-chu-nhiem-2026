import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
  Save,
  Check,
  X,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { AttendanceRecord, AttendanceStatus, LeaveRequest, Student } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDateVN } from '../../utils/formatters';

export const AttendanceManager: React.FC = () => {
  const students = localStore.getStudents();
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-26');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(localStore.getAttendance());
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(localStore.getLeaveRequests());
  const [saveToast, setSaveToast] = useState(false);

  // Review leave request modal
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  // Map student attendance for the selected date
  const recordsForDate = students.map(st => {
    const rec = attendanceRecords.find(r => r.date === selectedDate && r.studentId === st.id);
    return {
      student: st,
      record: rec || {
        id: `att-${selectedDate}-${st.id}`,
        classId: 'class-8a1',
        studentId: st.id,
        studentName: st.fullName,
        date: selectedDate,
        session: 'ALL_DAY' as const,
        status: 'PRESENT' as AttendanceStatus,
        recordedByTeacherId: 'teacher-nguyen-van-an',
        recordedByTeacherName: 'Thầy Nguyễn Văn An',
        recordedAt: new Date().toISOString(),
        isLocked: false
      }
    };
  });

  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    const updated = recordsForDate.map(item => {
      if (item.student.id === studentId) {
        return {
          ...item.record,
          status: newStatus
        };
      }
      return item.record;
    });

    localStore.saveAttendanceBatch(updated);
    setAttendanceRecords(localStore.getAttendance());
  };

  const handleReasonChange = (studentId: string, reason: string) => {
    const updated = recordsForDate.map(item => {
      if (item.student.id === studentId) {
        return {
          ...item.record,
          reason
        };
      }
      return item.record;
    });

    localStore.saveAttendanceBatch(updated);
    setAttendanceRecords(localStore.getAttendance());
  };

  const handleMarkAllPresent = () => {
    const updated = recordsForDate.map(item => ({
      ...item.record,
      status: 'PRESENT' as AttendanceStatus,
      reason: undefined
    }));

    localStore.saveAttendanceBatch(updated);
    setAttendanceRecords(localStore.getAttendance());
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleApproveLeave = (req: LeaveRequest, approved: boolean) => {
    const session = localStore.getUserSession();
    const updatedReq: LeaveRequest = {
      ...req,
      status: approved ? 'HOMEROOM_APPROVED' : 'REJECTED',
      reviewedByTeacherId: session.userId,
      reviewedByTeacherName: session.fullName,
      reviewComment: reviewComment || (approved ? 'Đồng ý cho học sinh nghỉ phép.' : 'Không duyệt đơn.'),
      reviewedAt: new Date().toISOString()
    };

    localStore.saveLeaveRequest(updatedReq);
    setLeaveRequests(localStore.getLeaveRequests());

    // If approved, update attendance status
    if (approved) {
      handleStatusChange(req.studentId, 'ABSENT_EXCUSED');
      handleReasonChange(req.studentId, `Nghỉ phép có đơn: ${req.reason}`);
    }

    setSelectedRequest(null);
    setReviewComment('');
  };

  const presentCount = recordsForDate.filter(r => r.record.status === 'PRESENT').length;
  const absentCount = recordsForDate.filter(r => r.record.status.includes('ABSENT')).length;
  const lateCount = recordsForDate.filter(r => r.record.status === 'LATE').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <CalendarCheck className="w-6 h-6 text-brand-600" />
            Điểm danh Chuyên cần & Phê duyệt Nghỉ học
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Theo dõi sĩ số, đơn xin phép của phụ huynh và thẩm quyền duyệt nghỉ không quá 03 ngày (Thông tư 15/2026/TT-BGDĐT)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-bold"
          />

          <Button
            variant="success"
            size="md"
            icon={<UserCheck className="w-4 h-4" />}
            onClick={handleMarkAllPresent}
            className="text-xs sm:text-sm font-bold shadow-xs"
          >
            Đánh dấu Tất cả Có mặt
          </Button>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Đã lưu dữ liệu điểm danh và đồng bộ ra Outbox thành công!
        </div>
      )}

      {/* Leave Requests Queue (TT15/2026: GVCN approvals <= 3 days) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            Hàng đợi Đơn xin nghỉ học từ Phụ huynh ({leaveRequests.length} đơn)
          </h3>
          <Badge variant="info" size="sm">Quyền GVCN: Duyệt tối đa 03 ngày liên tục</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {leaveRequests.map(req => (
            <div key={req.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{req.studentName}</span>
                <Badge
                  variant={
                    req.status === 'HOMEROOM_APPROVED' ? 'success' : (req.status === 'REJECTED' ? 'danger' : 'warning')
                  }
                  size="sm"
                >
                  {req.status === 'HOMEROOM_APPROVED' ? 'GVCN đã duyệt' : (req.status === 'REJECTED' ? 'Đã từ chối' : 'Chờ duyệt')}
                </Badge>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p><span className="text-slate-400">Thời gian nghỉ:</span> <strong>{req.consecutiveDays} ngày</strong> (từ {formatDateVN(req.fromDate)} đến {formatDateVN(req.toDate)})</p>
                <p><span className="text-slate-400">Lý do:</span> {req.reason}</p>
                <p><span className="text-slate-400">Người gửi đơn:</span> {req.guardianName} ({req.guardianPhone})</p>
                {req.reviewComment && (
                  <p className="text-emerald-700 italic pt-1">Ý kiến GVCN: "{req.reviewComment}"</p>
                )}
              </div>

              {req.status === 'SUBMITTED' && (
                <div className="pt-2 flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedRequest(req)}
                    className="flex-1 text-xs"
                  >
                    Xem & Phê duyệt
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Stats & Roster Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              Có mặt: {presentCount}
            </span>
            <span className="text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              Vắng: {absentCount}
            </span>
            <span className="text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
              Đi muộn: {lateCount}
            </span>
          </div>

          <span className="text-xs text-slate-400">Ngày điểm danh: {formatDateVN(selectedDate)}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 text-center w-12">STT</th>
                <th className="p-3">Học sinh</th>
                <th className="p-3">Tổ</th>
                <th className="p-3 text-center">Trạng thái điểm danh</th>
                <th className="p-3">Lý do / Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recordsForDate.map((item, idx) => (
                <tr key={item.student.id} className="hover:bg-slate-50">
                  <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                  <td className="p-3 font-bold text-slate-800">
                    <p>{item.student.fullName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{item.student.studentCode}</p>
                  </td>
                  <td className="p-3 text-slate-500">{item.student.groupName || 'Tổ 1'}</td>
                  <td className="p-3 text-center">
                    <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 gap-1">
                      <button
                        onClick={() => handleStatusChange(item.student.id, 'PRESENT')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          item.record.status === 'PRESENT' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Có mặt
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.student.id, 'ABSENT_EXCUSED')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          item.record.status === 'ABSENT_EXCUSED' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Có phép
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.student.id, 'ABSENT_UNEXCUSED')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          item.record.status === 'ABSENT_UNEXCUSED' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Không phép
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.student.id, 'LATE')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          item.record.status === 'LATE' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Đi muộn
                      </button>
                    </div>
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={item.record.reason || ''}
                      onChange={e => handleReasonChange(item.student.id, e.target.value)}
                      placeholder="Nhập lý do nếu vắng/muộn..."
                      className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg outline-none focus:border-brand-500 bg-white"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Leave Modal */}
      {selectedRequest && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRequest(null)}
          title={
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <span>Phê duyệt Đơn xin nghỉ học — {selectedRequest.studentName}</span>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
              <p><strong>Học sinh:</strong> {selectedRequest.studentName}</p>
              <p><strong>Thời gian nghỉ:</strong> {selectedRequest.consecutiveDays} ngày liên tục (từ {formatDateVN(selectedRequest.fromDate)} đến {formatDateVN(selectedRequest.toDate)})</p>
              <p><strong>Lý do nghỉ:</strong> {selectedRequest.reason}</p>
              <p><strong>Phụ huynh gửi đơn:</strong> {selectedRequest.guardianName} ({selectedRequest.guardianPhone})</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ý kiến phản hồi của Giáo viên chủ nhiệm *</label>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Nhập lời dặn dò hoặc ý kiến phê duyệt..."
                rows={3}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApproveLeave(selectedRequest, false)}
                className="text-rose-600 hover:bg-rose-50 border-rose-200"
              >
                Từ chối đơn
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => handleApproveLeave(selectedRequest, true)}
                className="font-bold"
              >
                Phê duyệt nghỉ có phép
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
