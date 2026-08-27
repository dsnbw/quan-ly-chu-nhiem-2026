import React, { useState } from 'react';
import {
  Smile,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Users,
  Award,
  Filter,
  Sparkles
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { BehaviorEventType, BehaviorObservation, Student } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDateVN } from '../../utils/formatters';

export const BehaviorLedgerManager: React.FC = () => {
  const students = localStore.getStudents();
  const eventTypes = localStore.getBehaviorTypes();
  const [observations, setObservations] = useState<BehaviorObservation[]>(localStore.getBehaviorObservations());

  // Record Observation State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedEventTypeId, setSelectedEventTypeId] = useState<string>(eventTypes[0]?.id || '');
  const [obsDate, setObsDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [obsPeriod, setObsPeriod] = useState<number>(1);
  const [obsNote, setObsNote] = useState<string>('');

  const handleSelectAllStudents = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map(s => s.id));
    }
  };

  const handleToggleStudent = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter(sId => sId !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0 || !selectedEventTypeId) return;

    const eventType = eventTypes.find(t => t.id === selectedEventTypeId);
    if (!eventType) return;

    const session = localStore.getUserSession();
    selectedStudentIds.forEach(stId => {
      const student = students.find(s => s.id === stId);
      if (!student) return;

      const newObs: BehaviorObservation = {
        id: 'obs-' + Math.random().toString(36).substring(2, 9),
        classId: 'class-8a1',
        studentId: student.id,
        studentName: student.fullName,
        eventTypeId: eventType.id,
        eventTitle: eventType.title,
        eventType: eventType.type,
        points: eventType.defaultPoints,
        occurredDate: obsDate,
        recordedAt: new Date().toISOString(),
        periodIndex: obsPeriod,
        note: obsNote || eventType.title,
        recordedByTeacherName: session.fullName,
        visibility: eventType.visibility,
        status: 'POSTED'
      };

      localStore.addBehaviorObservation(newObs);
    });

    setObservations(localStore.getBehaviorObservations());
    setIsRecordModalOpen(false);
    setSelectedStudentIds([]);
    setObsNote('');
  };

  // Group total points by student
  const studentScores = students.map(st => {
    const studentObs = observations.filter(o => o.studentId === st.id && o.status === 'POSTED');
    const totalPoints = studentObs.reduce((sum, o) => sum + o.points, 0);
    const positiveCount = studentObs.filter(o => o.points > 0).length;
    const improvementCount = studentObs.filter(o => o.points < 0).length;
    return {
      student: st,
      totalPoints,
      positiveCount,
      improvementCount,
      recentObs: studentObs[0]
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Smile className="w-6 h-6 text-emerald-600" />
            Nhật ký Nề nếp & Điểm Quy ước Nội bộ Lớp 8A1
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ghi nhận thi đua hàng ngày, khuyến khích hành vi tích cực và hỗ trợ học sinh tiến bộ
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsRecordModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 font-bold"
        >
          Ghi nhận Nề nếp hôm nay
        </Button>
      </div>

      {/* Non-stigmatizing education policy notice (CORE-014, BHV-006) */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-3 text-xs sm:text-sm">
        <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Nguyên tắc Giáo dục Tích cực & Không gán nhãn kỳ thị (BHV-006):</p>
          <p className="text-blue-800 text-xs">
            Điểm nề nếp là <strong>công cụ quy ước nội bộ</strong> phục vụ công tác chủ nhiệm và theo dõi phong trào thi đua. Điểm này không tự động chuyển thành điểm rèn luyện chính thức hay quyết định kỷ luật học sinh.
          </p>
        </div>
      </div>

      {/* Main Grid: Leaderboard & Recent Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Summary per student */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Tổng hợp Điểm Quy ước Học sinh Lớp 8A1
            </h3>
            <span className="text-xs text-slate-500">{students.length} học sinh</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 text-center w-12">#</th>
                  <th className="p-3">Họ và tên học sinh</th>
                  <th className="p-3">Tổ</th>
                  <th className="p-3 text-center">Ghi nhận tích cực</th>
                  <th className="p-3 text-center">Cần cải thiện</th>
                  <th className="p-3 text-right">Tổng điểm quy ước</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentScores.map((item, idx) => (
                  <tr key={item.student.id} className="hover:bg-slate-50">
                    <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-800">{item.student.fullName}</td>
                    <td className="p-3 text-slate-500">{item.student.groupName || 'Tổ 1'}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs">
                        +{item.positiveCount}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-xs">
                        {item.improvementCount > 0 ? `-${item.improvementCount}` : '0'}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-700 text-base">
                      +{item.totalPoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Event Timeline */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
            Nhật ký Ghi nhận Gần nhất
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {observations.slice(0, 10).map(obs => (
              <div key={obs.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{obs.studentName}</span>
                  <Badge variant={obs.points > 0 ? 'success' : 'danger'} size="sm">
                    {obs.points > 0 ? `+${obs.points} đ` : `${obs.points} đ`}
                  </Badge>
                </div>
                <p className="text-slate-600 font-medium">{obs.eventTitle}</p>
                {obs.note && <p className="text-[11px] text-slate-500 italic">"{obs.note}"</p>}
                <p className="text-[10px] text-slate-400 pt-1">
                  Tiết {obs.periodIndex || 1} • {formatDateVN(obs.occurredDate)} • {obs.recordedByTeacherName}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Record Observation Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-emerald-600" />
            <span>Ghi nhận Nề nếp & Thi đua Học sinh</span>
          </div>
        }
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveObservation} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Chọn học sinh được ghi nhận ({selectedStudentIds.length} đã chọn) *
              </label>
              <button
                type="button"
                onClick={handleSelectAllStudents}
                className="text-xs text-brand-600 font-bold hover:underline"
              >
                {selectedStudentIds.length === students.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả cả lớp'}
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-slate-50">
              {students.map(st => (
                <label
                  key={st.id}
                  className={`px-2 py-1.5 rounded-lg text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                    selectedStudentIds.includes(st.id) ? 'bg-brand-100 text-brand-900 font-bold' : 'hover:bg-slate-200/60 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedStudentIds.includes(st.id)}
                    onChange={() => handleToggleStudent(st.id)}
                    className="rounded text-brand-600"
                  />
                  <span className="truncate">{st.fullName}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Loại sự kiện nề nếp *</label>
            <select
              value={selectedEventTypeId}
              onChange={e => setSelectedEventTypeId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-medium"
            >
              {eventTypes.map(t => (
                <option key={t.id} value={t.id}>
                  [{t.defaultPoints > 0 ? `+${t.defaultPoints}đ` : `${t.defaultPoints}đ`}] {t.title} ({t.type === 'POSITIVE' ? 'Tích cực' : 'Cần khắc phục'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ngày ghi nhận</label>
              <input
                type="date"
                value={obsDate}
                onChange={e => setObsDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tiết học</label>
              <input
                type="number"
                min={1}
                max={10}
                value={obsPeriod}
                onChange={e => setObsPeriod(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú cụ thể</label>
            <input
              type="text"
              value={obsNote}
              onChange={e => setObsNote(e.target.value)}
              placeholder="VD: Hăng hái phát biểu xây dựng bài trong giờ Toán..."
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsRecordModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Lưu Ghi nhận
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
