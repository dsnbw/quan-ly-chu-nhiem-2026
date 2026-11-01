import React, { useState } from 'react';
import {
  User,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Shield,
  BookOpen,
  Award,
  Clock,
  Send,
  FileText,
  AlertCircle,
  CheckCircle2,
  Smile,
  CalendarCheck,
  Trash2
} from 'lucide-react';
import { Student, ContactLog, GradeEntry, BehaviorObservation, AttendanceRecord } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatDateVN, formatDateTimeVN, getGenderLabel } from '../../utils/formatters';
import { localStore } from '../../core/storage/localStore';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'guardians' | 'learning' | 'behavior' | 'attendance' | 'health'>('overview');
  const [newLogSummary, setNewLogSummary] = useState('');
  const [newLogChannel, setNewLogChannel] = useState<'PHONE_CALL' | 'SMS' | 'ZALO' | 'IN_PERSON'>('PHONE_CALL');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(student);

  // Synchronize internal state when the prop changes
  React.useEffect(() => {
    setCurrentStudent(student);
  }, [student]);

  if (!currentStudent) return null;

  const contactLogs = localStore.getContactLogs().filter(l => l.studentId === currentStudent.id);
  const grades = localStore.getGrades().filter(g => g.studentId === currentStudent.id);
  const behaviorObs = localStore.getBehaviorObservations().filter(b => b.studentId === currentStudent.id);
  const attendance = localStore.getAttendance().filter(a => a.studentId === currentStudent.id);

  const handleToggleAttention = () => {
    const updated = { ...currentStudent, needsAttentionTag: currentStudent.needsAttentionTag ? undefined : 'Cần theo dõi' as any };
    localStore.saveStudent(updated);
    setCurrentStudent(updated);
  };

  const handleToggleVision = () => {
    const updated = {
      ...currentStudent,
      health: {
        ...currentStudent.health,
        visionImpairment: !currentStudent.health.visionImpairment,
        needsFrontRowSeat: !currentStudent.health.needsFrontRowSeat
      }
    };
    localStore.saveStudent(updated);
    setCurrentStudent(updated);
  };

  const handleStatusChange = (newStatus: Student['status']) => {
    const updated = { ...currentStudent, status: newStatus };
    localStore.saveStudent(updated);
    setCurrentStudent(updated);
  };

  const handleDeleteStudent = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa học sinh "${currentStudent.fullName}" (${currentStudent.studentCode}) khỏi danh sách lớp không?`)) {
      localStore.deleteStudent(currentStudent.id);
      onClose();
    }
  };

  const handleAddContactLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogSummary.trim()) return;

    const session = localStore.getUserSession();
    const log: ContactLog = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      guardianName: currentStudent.guardians[0]?.fullName || 'Phụ huynh',
      guardianPhone: currentStudent.guardians[0]?.phone || '',
      contactedByTeacherId: session.userId,
      contactedByTeacherName: session.fullName,
      timestamp: new Date().toISOString(),
      channel: newLogChannel,
      purpose: 'Trao đổi định kỳ tình hình học tập và rèn luyện',
      summary: newLogSummary.trim(),
      result: 'Phụ huynh đã tiếp nhận và thống nhất phối hợp.',
      isResolved: true,
      classification: 'PERSONAL'
    };

    localStore.addContactLog(log);
    setNewLogSummary('');
  };

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'guardians', label: `Phụ huynh & Liên lạc (${contactLogs.length})` },
    { id: 'learning', label: 'Kết quả Học tập' },
    { id: 'behavior', label: 'Nề nếp & Điểm' },
    { id: 'attendance', label: 'Chuyên cần' },
    { id: 'health', label: 'Sức khỏe & Hỗ trợ' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
            {currentStudent.fullName.split(' ').pop()?.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">{currentStudent.fullName}</h3>
              <Badge variant="primary" size="sm">{currentStudent.studentCode}</Badge>
              {currentStudent.needsAttentionTag && <Badge variant="warning" size="sm">Cần theo dõi</Badge>}
            </div>
            <p className="text-xs text-slate-500">Lớp {currentStudent.className} • {currentStudent.groupName || 'Chưa phân tổ'}</p>
          </div>
        </div>
      }
      maxWidth="4xl"
    >
      {/* Tabs navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-2 mb-4 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[38px] ${
              activeTab === t.id
                ? 'bg-brand-50 text-brand-700 border border-brand-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thông tin Nhân thân</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-400">Họ và tên khai sinh:</p>
                  <p className="font-bold text-slate-800">{currentStudent.fullName}</p>
                </div>
                <div>
                  <p className="text-slate-400">Giới tính:</p>
                  <p className="font-bold text-slate-800">{getGenderLabel(currentStudent.gender)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Ngày sinh:</p>
                  <p className="font-bold text-slate-800">{formatDateVN(currentStudent.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Dân tộc:</p>
                  <p className="font-bold text-slate-800">{currentStudent.ethnicity}</p>
                </div>
                <div>
                  <p className="text-slate-400">Nơi sinh:</p>
                  <p className="font-bold text-slate-800">{currentStudent.birthPlace}</p>
                </div>
                <div>
                  <p className="text-slate-400">Trạng thái học sinh:</p>
                  <select
                    value={currentStudent.status}
                    onChange={e => handleStatusChange(e.target.value as any)}
                    className="mt-0.5 text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded-lg outline-none focus:border-brand-500"
                  >
                    <option value="ACTIVE">Đang học (Active)</option>
                    <option value="TRANSFERRED">Chuyển trường</option>
                    <option value="TEMPORARILY_INACTIVE">Tạm dừng học</option>
                    <option value="WITHDRAWN">Thôi học</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Định danh & Trạng thái (GVCN)</span>
                <Button variant="outline" size="sm" onClick={handleToggleAttention} className="text-[10px] py-1 px-2 h-auto">
                  {currentStudent.needsAttentionTag ? 'Gỡ thẻ theo dõi' : 'Gắn thẻ theo dõi'}
                </Button>
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-slate-400">Mã định danh ngành GD:</p>
                  <p className="font-mono font-bold text-slate-800">{currentStudent.nationalEducationCode || 'Chưa đồng bộ'}</p>
                </div>
                <div>
                  <p className="text-slate-400">Mã hồ sơ học tập suốt đời (Lifelong Record):</p>
                  <p className="font-mono font-bold text-brand-700">{currentStudent.lifelongLearningRecordId || 'LLR-VN-2026-001'}</p>
                </div>
                <div>
                  <p className="text-slate-400">Địa chỉ cư trú hiện tại:</p>
                  <p className="font-medium text-slate-800">{currentStudent.currentAddress}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-brand-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">Vị trí chỗ ngồi trên sơ đồ lớp</p>
                <p className="text-xs text-slate-600">Hàng bàn {currentStudent.seatRow || 1}, Cột ghế {currentStudent.seatCol || 1} • {currentStudent.groupName || 'Tổ 1'}</p>
              </div>
            </div>
            {currentStudent.health.needsFrontRowSeat && (
              <Badge variant="warning" size="sm">Yêu cầu bàn đầu (Cận thị)</Badge>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={handleDeleteStudent}
              className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs"
            >
              Xóa học sinh khỏi lớp
            </Button>
          </div>
        </div>
      )}

      {/* Tab: Guardians & Contact Log */}
      {activeTab === 'guardians' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Guardian Info Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentStudent.guardians.map(g => (
              <div key={g.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-600" />
                    <span className="font-bold text-slate-800 text-sm">{g.fullName}</span>
                  </div>
                  <Badge variant="info" size="sm">{g.relationship === 'FATHER' ? 'Bố' : 'Mẹ'}</Badge>
                </div>
                <div className="text-xs space-y-1 text-slate-600">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-800">{g.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{g.address}</span>
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`tel:${g.phone}`}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors min-h-[38px]"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi điện trực tiếp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* New Contact Log Form */}
          <form onSubmit={handleAddContactLog} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              Ghi nhật ký Trao đổi / Làm việc với Phụ huynh
            </h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={newLogChannel}
                onChange={e => setNewLogChannel(e.target.value as any)}
                className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-brand-500 font-medium"
              >
                <option value="PHONE_CALL">Gọi điện thoại</option>
                <option value="ZALO">Nhắn tin Zalo / OTT</option>
                <option value="IN_PERSON">Gặp trực tiếp tại trường</option>
                <option value="SMS">Tin nhắn SMS</option>
              </select>
              <input
                type="text"
                value={newLogSummary}
                onChange={e => setNewLogSummary(e.target.value)}
                placeholder="Nhập nội dung tóm tắt cuộc trao đổi..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-brand-500"
              />
              <Button type="submit" variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
                Lưu nhật ký
              </Button>
            </div>
          </form>

          {/* Contact History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Lịch sử các lần liên lạc ({contactLogs.length})
            </h4>
            {contactLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Chưa có nhật ký liên lạc nào.</p>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {contactLogs.map(l => (
                  <div key={l.id} className="p-3 bg-white hover:bg-slate-50 transition-colors text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-2">
                        <Badge variant="info" size="sm">{l.channel === 'PHONE_CALL' ? 'Điện thoại' : l.channel}</Badge>
                        {l.purpose}
                      </span>
                      <span className="text-slate-400">{formatDateTimeVN(l.timestamp)}</span>
                    </div>
                    <p className="text-slate-700">{l.summary}</p>
                    <p className="text-[11px] text-slate-500 italic">Kết quả: {l.result} • Người ghi: {l.contactedByTeacherName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Learning & Gradebook */}
      {activeTab === 'learning' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Môn học</th>
                  <th className="p-2.5 text-center">TX 1</th>
                  <th className="p-2.5 text-center">TX 2</th>
                  <th className="p-2.5 text-center">TX 3</th>
                  <th className="p-2.5 text-center">Giữa kỳ</th>
                  <th className="p-2.5 text-center">Cuối kỳ</th>
                  <th className="p-2.5 text-center">ĐTB Môn</th>
                  <th className="p-2.5">Nhận xét của GV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map(g => (
                  <tr key={g.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-800">{g.subjectName}</td>
                    <td className="p-2.5 text-center font-mono">{g.tx1 ?? '-'}</td>
                    <td className="p-2.5 text-center font-mono">{g.tx2 ?? '-'}</td>
                    <td className="p-2.5 text-center font-mono">{g.tx3 ?? '-'}</td>
                    <td className="p-2.5 text-center font-mono font-bold text-brand-700">{g.gk ?? '-'}</td>
                    <td className="p-2.5 text-center font-mono font-bold text-brand-700">{g.ck ?? '-'}</td>
                    <td className="p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/50">
                      {g.averageScore ?? (g.evaluationResult === 'PASSED' ? 'Đạt' : 'C.Đạt')}
                    </td>
                    <td className="p-2.5 text-slate-600 italic max-w-xs truncate">{g.teacherComment || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Behavior */}
      {activeTab === 'behavior' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <div>
              <p className="text-xs font-bold text-emerald-900">Tổng điểm quy ước nề nếp tháng 8</p>
              <p className="text-[11px] text-emerald-700">Dữ liệu hỗ trợ theo dõi thi đua lớp học (Không thay thế đánh giá chính thức)</p>
            </div>
            <span className="text-xl font-extrabold text-emerald-800">
              +{behaviorObs.reduce((sum, o) => sum + o.points, 0)} điểm
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {behaviorObs.map(o => (
              <div key={o.id} className="p-3 bg-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    o.points > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {o.points > 0 ? `+${o.points}` : o.points}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 text-xs">{o.eventTitle}</p>
                    <p className="text-[11px] text-slate-500">{o.note} • Tiết {o.periodIndex || 1} ngày {formatDateVN(o.occurredDate)}</p>
                  </div>
                </div>
                <Badge variant={o.points > 0 ? 'success' : 'danger'} size="sm">
                  {o.points > 0 ? 'Tích cực' : 'Cần khắc phục'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Attendance & Leaves */}
      {activeTab === 'attendance' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* KPI Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[11px] font-bold text-emerald-800 block">Có mặt</span>
              <span className="text-lg font-extrabold text-emerald-700">
                {attendance.filter(a => a.status === 'PRESENT').length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[11px] font-bold text-amber-800 block">Vắng có phép</span>
              <span className="text-lg font-extrabold text-amber-700">
                {attendance.filter(a => a.status === 'ABSENT_EXCUSED').length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-[11px] font-bold text-rose-800 block">Vắng không phép</span>
              <span className="text-lg font-extrabold text-rose-700">
                {attendance.filter(a => a.status === 'ABSENT_UNEXCUSED').length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-center">
              <span className="text-[11px] font-bold text-orange-800 block">Đi muộn</span>
              <span className="text-lg font-extrabold text-orange-700">
                {attendance.filter(a => a.status === 'LATE').length}
              </span>
            </div>
          </div>

          {/* Attendance History Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 p-2.5 font-bold text-xs text-slate-700 border-b border-slate-200 flex items-center justify-between">
              <span>Lịch sử Điểm danh ({attendance.length} bản ghi)</span>
              <span className="text-slate-400 font-normal">Học kỳ 1</span>
            </div>
            {attendance.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-4 text-center">Chưa có bản ghi điểm danh nào cho học sinh này.</p>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2">Ngày</th>
                      <th className="p-2">Buổi / Tiết</th>
                      <th className="p-2">Trạng thái</th>
                      <th className="p-2">Lý do / Ghi chú</th>
                      <th className="p-2">Người ghi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendance.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="p-2 font-bold text-slate-800">{formatDateVN(a.date)}</td>
                        <td className="p-2 text-slate-600">{a.session === 'ALL_DAY' ? 'Cả ngày' : (a.session === 'MORNING' ? 'Buổi sáng' : 'Buổi chiều')}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              a.status === 'PRESENT' ? 'success' :
                              a.status === 'ABSENT_EXCUSED' ? 'warning' :
                              a.status === 'LATE' ? 'warning' : 'danger'
                            }
                            size="sm"
                          >
                            {a.status === 'PRESENT' ? 'Có mặt' :
                             a.status === 'ABSENT_EXCUSED' ? 'Vắng có phép' :
                             a.status === 'ABSENT_UNEXCUSED' ? 'Vắng không phép' :
                             a.status === 'LATE' ? 'Đi muộn' : a.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-slate-600 italic">{a.reason || '-'}</td>
                        <td className="p-2 text-slate-500 text-[11px]">{a.recordedByTeacherName || 'GVCN'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Leave Requests of this student */}
          {(() => {
            const leaves = localStore.getLeaveRequests().filter(r => r.studentId === currentStudent.id);
            if (leaves.length === 0) return null;
            return (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Đơn xin nghỉ học đã gửi ({leaves.length})</h4>
                <div className="space-y-1.5">
                  {leaves.map(req => (
                    <div key={req.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800">Từ {formatDateVN(req.fromDate)} đến {formatDateVN(req.toDate)} ({req.consecutiveDays} ngày)</span>
                        <p className="text-[11px] text-slate-500">Lý do: {req.reason}</p>
                      </div>
                      <Badge variant={req.status === 'HOMEROOM_APPROVED' ? 'success' : (req.status === 'REJECTED' ? 'danger' : 'warning')} size="sm">
                        {req.status === 'HOMEROOM_APPROVED' ? 'Đã duyệt' : (req.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tab: Health & Accommodations */}
      {activeTab === 'health' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-600" /> Thông tin Sức khỏe cần lưu ý trong lớp học</span>
              <Button variant="outline" size="sm" onClick={handleToggleVision} className="text-[10px] py-1 px-2 h-auto">
                {currentStudent.health.visionImpairment ? 'Bỏ đánh dấu Cận thị' : 'Đánh dấu Cận thị'}
              </Button>
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <span className="text-slate-400">Thị lực / Nghe:</span>
                <span className="font-bold text-slate-800">
                  {currentStudent.health.visionImpairment ? 'Cận thị (Cần ngồi gần bảng)' : 'Bình thường'}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-slate-400">Dị ứng:</span>
                <span className="font-bold text-slate-800">{currentStudent.health.allergyNotice || 'Không có ghi nhận'}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-slate-400">Liên hệ y tế khẩn cấp:</span>
                <span className="font-bold text-rose-700">{currentStudent.health.emergencyContactName} ({currentStudent.health.emergencyContactPhone})</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
