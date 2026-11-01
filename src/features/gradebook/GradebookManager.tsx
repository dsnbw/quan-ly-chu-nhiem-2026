import React, { useState } from 'react';
import {
  BookOpen,
  Save,
  Download,
  Lock,
  Unlock,
  Sparkles,
  Clipboard,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { GradeEntry, Subject, Student } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { AssessmentRuleEngine } from '../../core/assessment/ruleEngine';
import { ExcelService } from '../../core/export/excelExport';

export const GradebookManager: React.FC = () => {
  const subjects = localStore.getSubjects();
  const students = localStore.getStudents();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub-math');
  const [selectedTerm, setSelectedTerm] = useState<1 | 2>(1);
  const [grades, setGrades] = useState<GradeEntry[]>(localStore.getGrades());
  const [isLocked, setIsLocked] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Excel paste modal state
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteDataText, setPasteDataText] = useState('');

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);

  // Map student grades for current subject and term
  const rows = students.map(st => {
    const entry = grades.find(g => g.studentId === st.id && g.subjectId === selectedSubjectId && g.term === selectedTerm);
    return {
      student: st,
      grade: entry || {
        id: `grade-${st.id}-${selectedSubjectId}`,
        classId: 'class-8a1',
        subjectId: selectedSubjectId,
        subjectName: currentSubject?.name || 'Môn học',
        studentId: st.id,
        studentName: st.fullName,
        term: selectedTerm,
        academicYearId: 'ay-2026-2027',
        commentVisibility: 'HOMEROOM' as const,
        isLocked: false,
        lastModifiedBy: localStore.getUserSession().fullName,
        lastModifiedAt: new Date().toISOString()
      }
    };
  });

  const handleScoreChange = (studentId: string, field: 'tx1' | 'tx2' | 'tx3' | 'gk' | 'ck', value: string) => {
    let numVal: number | undefined = undefined;
    if (value !== '') {
      const parsed = Number(value);
      if (!isNaN(parsed)) {
        numVal = Math.min(10, Math.max(0, parsed));
      }
    }

    let modifiedGrade: GradeEntry | undefined;
    const updated = rows.map(r => {
      if (r.student.id === studentId) {
        const newGrade = { ...r.grade, [field]: numVal };
        newGrade.averageScore = AssessmentRuleEngine.calculateSubjectAverage(newGrade);
        modifiedGrade = newGrade;
        return newGrade;
      }
      return r.grade;
    });

    if (modifiedGrade) {
      localStore.saveGradeEntry(modifiedGrade);
    }
    setGrades(localStore.getGrades());
  };

  const handleCommentChange = (studentId: string, comment: string) => {
    let modifiedGrade: GradeEntry | undefined;
    const updated = rows.map(r => {
      if (r.student.id === studentId) {
        const newGrade = { ...r.grade, teacherComment: comment };
        modifiedGrade = newGrade;
        return newGrade;
      }
      return r.grade;
    });

    if (modifiedGrade) {
      localStore.saveGradeEntry(modifiedGrade);
    }
    setGrades(localStore.getGrades());
  };

  const handleExportExcel = () => {
    const subjectGrades = rows.map(r => r.grade);
    ExcelService.exportGradebook(subjectGrades, '8A1', currentSubject?.name || 'MonHoc');
  };

  const handleApplyPasteData = () => {
    if (!pasteDataText.trim()) return;
    const lines = pasteDataText.trim().split('\n');

    lines.forEach((line, idx) => {
      if (idx >= students.length) return;
      const student = students[idx];
      const tokens = line.split('\t').map(t => t.trim());

      const tx1 = tokens[0] && !isNaN(Number(tokens[0])) ? Number(tokens[0]) : undefined;
      const tx2 = tokens[1] && !isNaN(Number(tokens[1])) ? Number(tokens[1]) : undefined;
      const gk = tokens[2] && !isNaN(Number(tokens[2])) ? Number(tokens[2]) : undefined;
      const ck = tokens[3] && !isNaN(Number(tokens[3])) ? Number(tokens[3]) : undefined;

      const existing = rows.find(r => r.student.id === student.id)?.grade;
      if (existing) {
        const updatedGrade: GradeEntry = {
          ...existing,
          tx1,
          tx2,
          gk,
          ck,
          averageScore: AssessmentRuleEngine.calculateSubjectAverage({ ...existing, tx1, tx2, gk, ck })
        };
        localStore.saveGradeEntry(updatedGrade);
      }
    });

    setGrades(localStore.getGrades());
    setIsPasteModalOpen(false);
    setPasteDataText('');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Sổ Điểm Điện Tử & Đánh Giá Môn Học (Thông tư 22/2021)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Nhập điểm kiểm tra thường xuyên (TX), giữa kỳ (GK) và cuối kỳ (CK), tự động tính ĐTB môn học
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={<Clipboard className="w-4 h-4 text-purple-600" />}
            onClick={() => setIsPasteModalOpen(true)}
            className="text-xs sm:text-sm font-bold"
          >
            Dán khối từ Excel
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={<Download className="w-4 h-4 text-emerald-600" />}
            onClick={handleExportExcel}
            className="text-xs sm:text-sm font-bold"
          >
            Xuất Excel Sổ điểm
          </Button>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Đã lưu điểm số thành công và ghi nhận nhật ký thay đổi!
        </div>
      )}

      {/* Subject & Term Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Môn học</label>
            <select
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-bold text-slate-800"
            >
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.teacherName || 'GVBM'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Học kỳ</label>
            <select
              value={selectedTerm}
              onChange={e => setSelectedTerm(Number(e.target.value) as any)}
              className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-bold text-slate-800"
            >
              <option value={1}>Học kỳ 1 (2026 - 2027)</option>
              <option value={2}>Học kỳ 2 (2026 - 2027)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isLocked ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Unlock className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isLocked ? 'Đã khóa sổ điểm' : 'Sổ điểm đang mở'}</span>
          </button>
        </div>
      </div>

      {/* Gradebook Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3 text-center w-12">STT</th>
                <th className="p-3 min-w-[180px]">Họ và tên học sinh</th>
                <th className="p-3 text-center w-20">TX 1</th>
                <th className="p-3 text-center w-20">TX 2</th>
                <th className="p-3 text-center w-20">TX 3</th>
                <th className="p-3 text-center w-24">Giữa kỳ (GK)</th>
                <th className="p-3 text-center w-24">Cuối kỳ (CK)</th>
                <th className="p-3 text-center w-24">ĐTB Môn</th>
                <th className="p-3 min-w-[220px]">Nhận xét của Giáo viên</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, i) => (
                <tr key={r.student.id} className="hover:bg-slate-50">
                  <td className="p-3 text-center font-bold text-slate-400">{i + 1}</td>
                  <td className="p-3 font-bold text-slate-800">
                    <p>{r.student.fullName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{r.student.studentCode}</p>
                  </td>

                  {/* TX1 */}
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      disabled={isLocked}
                      value={r.grade.tx1 ?? ''}
                      onChange={e => handleScoreChange(r.student.id, 'tx1', e.target.value)}
                      className="w-16 p-1.5 text-center font-mono font-bold border border-slate-200 rounded-lg outline-none focus:border-brand-500 bg-white"
                    />
                  </td>

                  {/* TX2 */}
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      disabled={isLocked}
                      value={r.grade.tx2 ?? ''}
                      onChange={e => handleScoreChange(r.student.id, 'tx2', e.target.value)}
                      className="w-16 p-1.5 text-center font-mono font-bold border border-slate-200 rounded-lg outline-none focus:border-brand-500 bg-white"
                    />
                  </td>

                  {/* TX3 */}
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      disabled={isLocked}
                      value={r.grade.tx3 ?? ''}
                      onChange={e => handleScoreChange(r.student.id, 'tx3', e.target.value)}
                      className="w-16 p-1.5 text-center font-mono font-bold border border-slate-200 rounded-lg outline-none focus:border-brand-500 bg-white"
                    />
                  </td>

                  {/* GK (Trọng số 2) */}
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      disabled={isLocked}
                      value={r.grade.gk ?? ''}
                      onChange={e => handleScoreChange(r.student.id, 'gk', e.target.value)}
                      className="w-20 p-1.5 text-center font-mono font-bold border border-brand-300 rounded-lg outline-none focus:border-brand-500 bg-brand-50/50 text-brand-800"
                    />
                  </td>

                  {/* CK (Trọng số 3) */}
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      disabled={isLocked}
                      value={r.grade.ck ?? ''}
                      onChange={e => handleScoreChange(r.student.id, 'ck', e.target.value)}
                      className="w-20 p-1.5 text-center font-mono font-bold border border-indigo-300 rounded-lg outline-none focus:border-indigo-500 bg-indigo-50/50 text-indigo-800"
                    />
                  </td>

                  {/* ĐTB */}
                  <td className="p-3 text-center font-bold text-emerald-700 bg-emerald-50/40 text-base font-mono">
                    {r.grade.averageScore ?? (r.grade.evaluationResult === 'PASSED' ? 'Đạt' : '-')}
                  </td>

                  {/* Comment */}
                  <td className="p-2">
                    <input
                      type="text"
                      disabled={isLocked}
                      value={r.grade.teacherComment || ''}
                      onChange={e => handleCommentChange(r.student.id, e.target.value)}
                      placeholder="Nhận xét sự tiến bộ..."
                      className="w-full p-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-brand-500 bg-white"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paste Block Modal */}
      <Modal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-purple-600" />
            <span>Dán khối điểm nhanh từ Excel (Copy-Paste)</span>
          </div>
        }
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsPasteModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" onClick={handleApplyPasteData}>
              Áp dụng điểm số
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            Mở file Excel của bạn, quét chọn 4 cột điểm (<strong>TX1, TX2, Giữa kỳ, Cuối kỳ</strong>) theo đúng thứ tự danh sách học sinh rồi nhấn <strong>Ctrl+C</strong> và <strong>Ctrl+V</strong> vào ô dưới đây:
          </p>

          <textarea
            value={pasteDataText}
            onChange={e => setPasteDataText(e.target.value)}
            placeholder="8.5	9.0	8.5	9.0&#10;7.0	7.5	7.0	8.0&#10;9.0	9.5	9.0	9.5..."
            rows={8}
            className="w-full p-3 font-mono text-xs border border-slate-200 rounded-xl outline-none focus:border-brand-500 bg-slate-50"
          />
        </div>
      </Modal>
    </div>
  );
};
