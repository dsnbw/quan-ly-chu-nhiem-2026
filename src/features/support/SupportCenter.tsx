import React, { useState } from 'react';
import {
  HeartHandshake,
  AlertTriangle,
  Award,
  ShieldAlert,
  Plus,
  CheckCircle2,
  Lock,
  Send,
  Eye,
  FileText
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { EarlyWarningSignal, CounselingCase, RewardProposal, IncidentRecord } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDateVN } from '../../utils/formatters';

export const SupportCenter: React.FC = () => {
  const students = localStore.getStudents();
  const [activeTab, setActiveTab] = useState<'early_warning' | 'counseling' | 'rewards' | 'incidents'>('early_warning');
  const [earlyWarnings, setEarlyWarnings] = useState<EarlyWarningSignal[]>(localStore.getEarlyWarnings());
  const [counselingCases, setCounselingCases] = useState<CounselingCase[]>(localStore.getCounselingCases());
  const [rewards, setRewards] = useState<RewardProposal[]>(localStore.getRewardProposals());
  const [incidents, setIncidents] = useState<IncidentRecord[]>(localStore.getIncidentRecords());

  // New Counseling Referral Modal
  const [isCounselingModalOpen, setIsCounselingModalOpen] = useState(false);
  const [refStudentId, setRefStudentId] = useState('');
  const [refReason, setRefReason] = useState('');
  const [refTriage, setRefTriage] = useState<'ROUTINE' | 'PRIORITY' | 'IMMEDIATE_SAFETY_CONCERN'>('ROUTINE');

  // New Reward Modal
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [rewStudentId, setRewStudentId] = useState('');
  const [rewTitle, setRewTitle] = useState('');
  const [rewDesc, setRewDesc] = useState('');
  const [rewLevel, setRewLevel] = useState<'CLASS_COMMENDATION' | 'SCHOOL_COMMENDATION' | 'DISTRICT_ABOVE'>('SCHOOL_COMMENDATION');

  const handleDismissWarning = (warnId: string) => {
    const reason = prompt('Nhập lý do đóng cảnh báo:');
    if (!reason) return;

    const warn = earlyWarnings.find(w => w.id === warnId);
    if (warn) {
      warn.status = 'DISMISSED';
      warn.dismissReason = reason;
      localStore.saveEarlyWarning(warn);
      setEarlyWarnings([...localStore.getEarlyWarnings()]);
    }
  };

  const handleSaveCounseling = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === refStudentId);
    if (!st || !refReason) return;

    const newCase: CounselingCase = {
      id: 'cns-' + Math.random().toString(36).substring(2, 9),
      caseCode: 'CNS-2026-' + Math.floor(Math.random() * 1000),
      studentId: st.id,
      studentName: st.fullName,
      className: '8A1',
      referredByTeacherName: localStore.getUserSession().fullName,
      referralReason: refReason,
      referralDate: new Date().toISOString().split('T')[0],
      assignedCounselorName: 'Cô Vũ Thị Hà (Tư vấn học đường)',
      triageLevel: refTriage,
      status: 'NEW',
      supportGoal: 'Xây dựng kế hoạch hỗ trợ tâm lý và điều chỉnh thói quen học tập',
      generalHomeroomAdvice: 'Động viên, tạo không khí học tập tích cực, không gây áp lực.',
      isSealed: false,
      classification: 'SENSITIVE'
    };

    localStore.saveCounselingCase(newCase);
    setCounselingCases(localStore.getCounselingCases());
    setIsCounselingModalOpen(false);
    setRefReason('');
  };

  const handleSaveReward = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === rewStudentId);
    if (!st || !rewTitle) return;

    const newRew: RewardProposal = {
      id: 'rwd-' + Math.random().toString(36).substring(2, 9),
      studentId: st.id,
      studentName: st.fullName,
      className: '8A1',
      achievementType: 'ETHICS_GOOD_DEED',
      title: rewTitle,
      description: rewDesc || rewTitle,
      proposedByTeacherName: localStore.getUserSession().fullName,
      proposedLevel: rewLevel,
      status: 'SUBMITTED'
    };

    localStore.saveRewardProposal(newRew);
    setRewards(localStore.getRewardProposals());
    setIsRewardModalOpen(false);
    setRewTitle('');
    setRewDesc('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <HeartHandshake className="w-6 h-6 text-indigo-600" />
            Tư Vấn Học Đường, Hỗ Trợ & Khen Thưởng (TT 18/2025 & TT 19/2025)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Hàng đợi cảnh báo sớm định lượng, giới thiệu tư vấn tâm lý bảo mật và quy trình khen thưởng học sinh
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {activeTab === 'counseling' && (
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCounselingModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 font-bold"
            >
              Gửi Phiếu Giới thiệu Tư vấn
            </Button>
          )}

          {activeTab === 'rewards' && (
            <Button
              variant="primary"
              size="md"
              icon={<Award className="w-4 h-4" />}
              onClick={() => setIsRewardModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 font-bold"
            >
              Đề xuất Khen thưởng
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('early_warning')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] whitespace-nowrap ${
            activeTab === 'early_warning' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Hàng đợi Cảnh báo Sớm ({earlyWarnings.filter(w => w.status === 'NEW').length})
        </button>
        <button
          onClick={() => setActiveTab('counseling')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] whitespace-nowrap ${
            activeTab === 'counseling' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tư vấn Tâm lý Học đường (TT 18/2025)
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] whitespace-nowrap ${
            activeTab === 'rewards' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Khen thưởng Học sinh (TT 19/2025)
        </button>
      </div>

      {/* View: Early Warning Queue */}
      {activeTab === 'early_warning' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <strong>Nguyên tắc Cảnh báo Sớm (CNS-021):</strong> Mọi tín hiệu cảnh báo phải kèm theo chỉ số định lượng rõ ràng (ví dụ: "Vắng 3 buổi trong 10 ngày"), không sử dụng điểm số mờ đục và không tự động gán nhãn kỳ thị học sinh.
          </div>

          <div className="space-y-3">
            {earlyWarnings.map(w => (
              <div key={w.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{w.title}</h3>
                      <Badge variant="warning" size="sm">{w.quantitativeMetric}</Badge>
                      <Badge variant="neutral" size="sm">Học sinh: {w.studentName}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{w.description}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Phát hiện lúc: {formatDateVN(w.detectedAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDismissWarning(w.id)}
                    className="text-xs"
                  >
                    Đóng cảnh báo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Counseling Cases */}
      {activeTab === 'counseling' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {counselingCases.map(c => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-900 text-sm">{c.studentName} ({c.caseCode})</span>
                  </div>
                  <Badge variant="purple" size="sm">Đang hỗ trợ (Active)</Badge>
                </div>

                <div className="text-xs text-slate-600 space-y-2">
                  <p><strong>Lý do giới thiệu:</strong> {c.referralReason}</p>
                  <p><strong>Cán bộ tư vấn phụ trách:</strong> {c.assignedCounselorName}</p>
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-indigo-900">
                    <p className="font-bold mb-0.5">Hướng dẫn dành cho GVCN:</p>
                    <p className="italic text-xs">{c.generalHomeroomAdvice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Rewards */}
      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map(r => (
              <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span className="font-bold text-slate-900 text-sm">{r.studentName}</span>
                  </div>
                  <Badge variant="success" size="sm">Đã duyệt khen thưởng</Badge>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5">
                  <p className="font-bold text-slate-800">{r.title}</p>
                  <p className="text-slate-600">{r.description}</p>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Cấp khen thưởng: {r.proposedLevel === 'SCHOOL_COMMENDATION' ? 'Khen thưởng cấp Trường' : 'Khen thưởng cấp Lớp'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Counseling Modal */}
      <Modal
        isOpen={isCounselingModalOpen}
        onClose={() => setIsCounselingModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-indigo-600" />
            <span>Gửi Phiếu Giới thiệu Tư vấn Tâm lý Học đường</span>
          </div>
        }
      >
        <form onSubmit={handleSaveCounseling} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Chọn học sinh cần hỗ trợ *</label>
            <select
              required
              value={refStudentId}
              onChange={e => setRefStudentId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-bold"
            >
              <option value="">-- Chọn học sinh trong danh sách --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.studentCode} - {s.fullName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mức độ ưu tiên tiếp nhận</label>
            <select
              value={refTriage}
              onChange={e => setRefTriage(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            >
              <option value="ROUTINE">Thông thường (Hẹn lịch trong tuần)</option>
              <option value="PRIORITY">Ưu tiên (Trong 24-48 giờ)</option>
              <option value="IMMEDIATE_SAFETY_CONCERN">Khẩn cấp (Hỗ trợ ngay lập tức)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dữ kiện quan sát thực tế & Lý do giới thiệu *</label>
            <textarea
              required
              rows={4}
              value={refReason}
              onChange={e => setRefReason(e.target.value)}
              placeholder="Ghi nhận các biểu hiện cụ thể, thay đổi hành vi hoặc vấn đề tâm lý cần chuyên gia hỗ trợ..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsCounselingModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Gửi Phiếu Giới thiệu
            </Button>
          </div>
        </form>
      </Modal>

      {/* New Reward Modal */}
      <Modal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Đề xuất Khen thưởng Học sinh</span>
          </div>
        }
      >
        <form onSubmit={handleSaveReward} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Chọn học sinh được đề xuất *</label>
            <select
              required
              value={rewStudentId}
              onChange={e => setRewStudentId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-bold"
            >
              <option value="">-- Chọn học sinh trong danh sách --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.studentCode} - {s.fullName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hình thức & Cấp khen thưởng</label>
            <select
              value={rewLevel}
              onChange={e => setRewLevel(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            >
              <option value="SCHOOL_COMMENDATION">Khen thưởng cấp Trường (Tuyên dương dưới cờ)</option>
              <option value="CLASS_COMMENDATION">Biểu dương cấp Lớp</option>
              <option value="DISTRICT_ABOVE">Đề xuất cấp Quận / Thành phố</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề thành tích *</label>
            <input
              type="text"
              required
              value={rewTitle}
              onChange={e => setRewTitle(e.target.value)}
              placeholder="VD: Nhặt được của rơi trả lại người đánh mất..."
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả chi tiết việc làm tốt</label>
            <textarea
              rows={3}
              value={rewDesc}
              onChange={e => setRewDesc(e.target.value)}
              placeholder="Mô tả hoàn cảnh, nhân chứng và giá trị giáo dục của hành động..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsRewardModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-amber-600 hover:bg-amber-700">
              Gửi Đề xuất
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
