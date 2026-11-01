import React, { useState } from 'react';
import {
  BookMarked,
  Calendar,
  CheckCircle2,
  Users,
  Award,
  Send,
  Plus,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { HomeroomBook, ClassMeeting } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDateVN } from '../../utils/formatters';

export const HomeroomBookManager: React.FC = () => {
  const school = localStore.getSchoolConfig();
  const classRoom = localStore.getClasses()[0] || { id: 'class-default', name: 'Lớp 8A1', roomName: 'Phòng 101' };
  const students = localStore.getStudents();
  const [book, setBook] = useState<HomeroomBook>(localStore.getHomeroomBook());
  const [meetings, setMeetings] = useState<ClassMeeting[]>(localStore.getClassMeetings());
  const [activeTab, setActiveTab] = useState<'book' | 'meetings'>('book');

  // New Meeting Modal
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [meetingWeek, setMeetingWeek] = useState<number>(4);
  const [meetingAgenda, setMeetingAgenda] = useState<string>('1. Sơ kết nề nếp tuần 3\n2. Phổ biến kế hoạch tuần 4\n3. Thảo luận chuyên đề');
  const [meetingSummary, setMeetingSummary] = useState<string>('');
  const [saveToast, setSaveToast] = useState(false);

  const handleSubmitMonthlyReview = () => {
    const updatedBook: HomeroomBook = {
      ...book,
      status: 'SUBMITTED',
      monthlyProgress: [
        ...book.monthlyProgress,
        {
          month: 9,
          summary: 'Ổn định nề nếp tháng 9, 100% học sinh chấp hành tốt nội quy lớp học.',
          achievements: 'Hoàn thành thu quỹ tự nguyện và bầu ban cán sự lớp.',
          pendingIssues: '01 học sinh cần theo dõi thêm môn Toán.',
          submittedAt: new Date().toISOString(),
          reviewedByPrincipal: true
        }
      ]
    };
    localStore.saveHomeroomBook(updatedBook);
    setBook(localStore.getHomeroomBook());
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleSaveMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const newMeeting: ClassMeeting = {
      id: `meeting-w${meetingWeek}`,
      classId: classRoom.id,
      weekNumber: Number(meetingWeek),
      date: new Date().toISOString().split('T')[0],
      agenda: meetingAgenda.split('\n').filter(l => l.trim()),
      attendanceCount: students.length,
      positiveHighlights: ['Lớp học trật tự, đi học đúng giờ.'],
      issuesToImprove: ['Vệ sinh lớp cần hoàn thành trước 07h15.'],
      studentFeedback: ['Đề xuất luân chuyển dãy bàn học sinh.'],
      nextWeekTasks: ['Thi đua hoa điểm 10 trong tuần.'],
      meetingMinutesSummary: meetingSummary || 'Buổi sinh hoạt diễn ra sôi nổi, học sinh nhất trí kế hoạch tuần mới.',
      recordedBy: 'Trần Bảo Châu (Thư ký)',
      status: 'COMPLETED'
    };

    localStore.saveClassMeeting(newMeeting);
    setMeetings(localStore.getClassMeetings());
    setIsMeetingModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <BookMarked className="w-6 h-6 text-purple-600" />
            Sổ Chủ Nhiệm Điện Tử & Sinh Hoạt {classRoom.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tự động tổng hợp hồ sơ, quản lý kế hoạch năm học và lưu trữ theo Thông tư 08/2025/TT-BGDĐT
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            icon={<Send className="w-4 h-4" />}
            onClick={handleSubmitMonthlyReview}
            className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm font-bold shadow-md"
          >
            Nộp Sổ Tháng 9 cho BGH duyệt
          </Button>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Đã nộp sổ chủ nhiệm tháng cho Ban Giám hiệu phê duyệt thành công!
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('book')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] ${
            activeTab === 'book' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Sổ Chủ nhiệm Toàn diện (Mục A - K)
        </button>
        <button
          onClick={() => setActiveTab('meetings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] ${
            activeTab === 'meetings' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Biên bản Sinh hoạt Lớp theo Tuần ({meetings.length})
        </button>
      </div>

      {/* View: Homeroom Book Full Content */}
      {activeTab === 'book' && (
        <div className="space-y-6">
          {/* Section A & B: Class Information */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-600" />
                Mục A & B: Thông tin Chung & Ban Cán sự {classRoom.name}
              </h3>
              <Badge variant="primary" size="sm">Sĩ số: {students.length} học sinh</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="text-slate-400">Giáo viên chủ nhiệm:</p>
                <p className="font-bold text-slate-900 text-sm">{book.homeroomTeacherName}</p>
                <p className="text-slate-500">Phòng học: {classRoom.roomName}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="text-slate-400">Ban cán sự lớp:</p>
                <p className="font-bold text-slate-900">Lớp trưởng: Nguyễn Tuấn Anh</p>
                <p className="text-slate-500">Lớp phó: Trần Bảo Châu • Đỗ Thảo Hương</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="text-slate-400">Thời hạn lưu trữ hồ sơ (TT 08/2025):</p>
                <p className="font-bold text-purple-700">Hết khóa học (UNTIL_COURSE_END)</p>
                <p className="text-slate-500">Mã lưu trữ: RET-SECONDARY-HOMEROOM</p>
              </div>
            </div>
          </div>

          {/* Section D: Goals & Plans */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-amber-500" />
              Mục D & E: Đặc điểm Tình hình & Mục tiêu Giáo dục Học kỳ 1
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">1. Thuận lợi & Khó khăn:</p>
                <p className="text-xs text-slate-600">{book.semester1Plan.strengths}</p>
                <p className="text-xs text-slate-600 mt-1">{book.semester1Plan.challenges}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">2. Chỉ tiêu phấn đấu:</p>
                <p className="text-xs text-slate-600">• Học sinh Xuất sắc / Giỏi: {book.semester1Plan.targetHonorsCount} em (60%)</p>
                <p className="text-xs text-slate-600">• Kết quả Rèn luyện Tốt: {book.semester1Plan.targetGoodConductCount} em (93%)</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">3. Các giải pháp và kế hoạch hành động trọng tâm:</p>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                  {book.semester1Plan.actionPlans.map((plan, pIdx) => (
                    <li key={pIdx}>{plan}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section C: Attendance Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-5 h-5 text-emerald-500" />
              Mục C: Tổng hợp Điểm danh & Chuyên cần (Bản nháp)
            </h3>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
              <p>Dữ liệu được tổng hợp tự động từ module Điểm danh hàng ngày.</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Tháng 8: 100% chuyên cần</li>
                <li>Tháng 9: Vắng 2 lượt (Có phép: 1, Không phép: 1)</li>
              </ul>
            </div>
          </div>

          {/* Section F: Special Needs / Follow-up */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-rose-500" />
              Mục F: Theo dõi Học sinh Cá biệt / Cần Hỗ trợ (Bảo mật)
            </h3>
            <div className="space-y-3">
              {students.filter(s => s.needsAttentionTag).length > 0 ? (
                students.filter(s => s.needsAttentionTag).map(st => (
                  <div key={st.id} className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs">
                    <p className="font-bold text-rose-900">{st.fullName} ({st.studentCode})</p>
                    <p className="text-rose-700 mt-1">Lý do theo dõi: {st.needsAttentionTag}</p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs italic text-slate-500">
                  Chưa có học sinh nào nằm trong danh sách cần theo dõi đặc biệt.
                </div>
              )}
            </div>
          </div>

          {/* Section G: End of Year Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-indigo-500" />
              Mục G: Sơ kết Học kỳ & Tổng kết Cuối năm
            </h3>
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-900 space-y-2">
              <p><strong>Thống kê Lên lớp (Dự kiến):</strong></p>
              <ul className="list-disc list-inside space-y-1 text-indigo-800">
                <li>Lên lớp thẳng: {book.endOfYearSummary?.promotedCount || 30} học sinh</li>
                <li>Rèn luyện hè: {book.endOfYearSummary?.remedialCount || 0} học sinh</li>
                <li>Ở lại lớp: {book.endOfYearSummary?.retainedCount || 0} học sinh</li>
              </ul>
              <p className="pt-2 italic">"{book.endOfYearSummary?.generalComment || 'Chưa có nhận xét tổng kết năm học.'}"</p>
            </div>
          </div>
        </div>
      )}

      {/* View: Class Meetings */}
      {activeTab === 'meetings' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsMeetingModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 font-bold"
            >
              Tạo Biên bản Sinh hoạt Tuần mới
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetings.map(m => (
              <div key={m.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    Sinh hoạt Lớp Tuần {m.weekNumber}
                  </span>
                  <Badge variant="success" size="sm">{formatDateVN(m.date)}</Badge>
                </div>

                <div className="text-xs text-slate-600 space-y-2">
                  <div>
                    <p className="font-bold text-slate-700">Nội dung nghị sự:</p>
                    <ul className="list-disc list-inside text-slate-600 pl-1">
                      {m.agenda.map((a, idx) => <li key={idx}>{a}</li>)}
                    </ul>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-700 mb-0.5">Biên bản kết luận:</p>
                    <p className="italic text-slate-600">{m.meetingMinutesSummary}</p>
                    <p className="text-[10px] text-slate-400 pt-1">Thư ký ghi: {m.recordedBy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Meeting Modal */}
      <Modal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span>Lập Kế hoạch & Biên bản Sinh hoạt Lớp</span>
          </div>
        }
      >
        <form onSubmit={handleSaveMeeting} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tuần sinh hoạt *</label>
            <input
              type="number"
              min={1}
              max={35}
              value={meetingWeek}
              onChange={e => setMeetingWeek(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung chương trình nghị sự (mỗi dòng 1 mục) *</label>
            <textarea
              rows={4}
              value={meetingAgenda}
              onChange={e => setMeetingAgenda(e.target.value)}
              className="w-full p-3 text-xs border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tóm tắt biên bản và ý kiến học sinh</label>
            <textarea
              rows={3}
              value={meetingSummary}
              onChange={e => setMeetingSummary(e.target.value)}
              placeholder="VD: Cả lớp thống nhất kế hoạch trang trí bảng tin và thi đua hoa điểm 10..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsMeetingModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-purple-600 hover:bg-purple-700">
              Lưu Biên bản
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
