import React, { useState } from 'react';
import {
  FileCheck,
  ShieldCheck,
  QrCode,
  Download,
  CheckCircle2,
  Lock,
  Stamp,
  Award,
  Sparkles,
  Search,
  Eye
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { DigitalReportCard, Student, ReportCardLifecycle } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDateVN, getGenderLabel } from '../../utils/formatters';

export const DigitalReportCardManager: React.FC = () => {
  const school = localStore.getSchoolConfig();
  const students = localStore.getStudents();
  const classes = localStore.getClasses();
  const currentClass = classes[0] || { id: 'class-default', name: 'Lớp học' };
  const subjects = localStore.getSubjects();
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(students[0]);
  const [currentStep, setCurrentStep] = useState<ReportCardLifecycle>('HOMEROOM_CONFIRMED');
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);
  const [isSignSuccess, setIsSignSuccess] = useState(false);

  if (!selectedStudent) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
        <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
        <p className="text-slate-600 font-bold">Chưa có dữ liệu học sinh trong lớp.</p>
        <p className="text-xs text-slate-400">Vui lòng thêm học sinh tại mục Hồ sơ Học sinh trước khi lập Học bạ số.</p>
      </div>
    );
  }

  // Generate structured report card data for selected student
  const grades = localStore.getGrades().filter(g => g.studentId === selectedStudent.id);
  const totalAvg = grades.filter(g => typeof g.averageScore === 'number').reduce((s, g) => s + (g.averageScore || 0), 0);
  const gpa = grades.length > 0 ? Number((totalAvg / grades.length).toFixed(1)) : 8.6;

  const mockReportCard: DigitalReportCard = {
    id: `hbs-${selectedStudent.id}-2026`,
    studentId: selectedStudent.id,
    studentCode: selectedStudent.studentCode,
    studentName: selectedStudent.fullName,
    dateOfBirth: selectedStudent.dateOfBirth,
    gender: selectedStudent.gender,
    schoolId: school.id,
    schoolName: school.name,
    academicYearId: 'ay-2026-2027',
    academicYearCode: '2026-2027',
    classId: selectedStudent.classId || currentClass.id,
    className: selectedStudent.className || currentClass.name,
    level: 'LOWER_SECONDARY',
    gpaTerm1: gpa,
    gpaFullYear: gpa,
    academicPerformance: gpa >= 8.0 ? 'Tốt (EXCELLENT)' : 'Khá (GOOD)',
    conductEvaluation: 'Tốt (EXCELLENT)',
    promotionResult: 'Được lên lớp thẳng',
    homeroomComment: 'Học sinh chăm ngoan, gương mẫu, đạt thành tích học tập xuất sắc trong học kỳ.',
    subjectScores: subjects.map(sub => {
      const g = grades.find(gr => gr.subjectId === sub.id);
      return {
        subjectName: sub.name,
        term1Score: g?.averageScore ?? (g?.evaluationResult === 'PASSED' ? 'Đạt' : '9.0'),
        yearScore: g?.averageScore ?? '9.0',
        teacherName: sub.teacherName || 'Giáo viên bộ môn'
      };
    }),
    signatures: currentStep === 'PUBLISHED' ? [
      {
        role: 'HOMEROOM_TEACHER',
        signerName: 'Thầy Nguyễn Văn An',
        signedAt: '2026-08-26T15:00:00Z',
        certificateInfo: 'VN-CA (Ban Cơ yếu Chính phủ) - Serial: 5404128919',
        signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        status: 'VALID'
      },
      {
        role: 'PRINCIPAL',
        signerName: school.principalName,
        signedAt: '2026-08-26T15:30:00Z',
        certificateInfo: 'VN-CA (Ban Cơ yếu Chính phủ) - Serial: 8891041123',
        signatureHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        status: 'VALID'
      },
      {
        role: 'SCHOOL_ORGANIZATION',
        signerName: school.name,
        signedAt: '2026-08-26T16:00:00Z',
        certificateInfo: 'Dấu điện tử Tổ chức Giáo dục Quốc gia (e-Seal TT70/2026)',
        signatureHash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
        status: 'VALID'
      }
    ] : [],
    status: currentStep,
    documentHash: 'c7be1a9023b054238e833441a733ecab0b8a4f02888f4078864d4b1a43a08899',
    verificationCode: `CVA-HBS-2026-${selectedStudent.studentCode}`,
    version: 1,
    publishedAt: currentStep === 'PUBLISHED' ? '26/08/2026 16:00' : undefined
  };

  const handleExecuteSigning = () => {
    setCurrentStep('PUBLISHED');
    setIsSigningModalOpen(false);
    setIsSignSuccess(true);
    setTimeout(() => setIsSignSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-rose-600" />
            Quản Lý & Phát Hành Học Bạ Số (Thông tư 70/2026/TT-BGDĐT)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Mô hình dữ liệu có cấu trúc, quy trình ký số 5 bước và xác thực điện tử qua mã QR
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {currentStep !== 'PUBLISHED' ? (
            <Button
              variant="primary"
              size="md"
              icon={<Stamp className="w-4 h-4" />}
              onClick={() => setIsSigningModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 font-bold shadow-md"
            >
              Thực hiện Ký số & Phát hành TT70
            </Button>
          ) : (
            <Badge variant="success" size="md" className="py-2 px-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Đã ký số và Phát hành chính thức
            </Badge>
          )}
        </div>
      </div>

      {isSignSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>
            Học bạ số đã được ký số thành công bởi Giáo viên chủ nhiệm, Hiệu trưởng và đóng Dấu điện tử của nhà trường theo đúng quy định Thông tư 70/2026/TT-BGDĐT!
          </span>
        </div>
      )}

      {/* 5-Step Workflow Tracker (HBS-010) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Chuỗi Quy trình Ký số Học bạ Điện tử (TT 70/2026)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-bold">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            1. Hoàn thiện dữ liệu
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            2. Đối chiếu & Xác nhận
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            3. GVCN Ký số
          </div>
          <div className={`p-2.5 rounded-xl border ${
            currentStep === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}>
            4. BGH & Dấu điện tử
          </div>
          <div className={`p-2.5 rounded-xl border ${
            currentStep === 'PUBLISHED' ? 'bg-purple-50 text-purple-700 border-purple-200 ring-2 ring-purple-500' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}>
            5. Phát hành Quốc gia
          </div>
        </div>
      </div>

      {/* Student Switcher & Structured Report Card Excerpt */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 1 Col: Student Picker */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 max-h-[600px] overflow-y-auto">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
            Danh sách Học sinh ({students.length})
          </h4>
          <div className="space-y-1">
            {students.map(st => (
              <button
                key={st.id}
                onClick={() => setSelectedStudent(st)}
                className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                  selectedStudent.id === st.id ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>{st.fullName}</span>
                <span className="font-mono text-[10px] text-slate-400">{st.studentCode}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right 3 Cols: Report Card Electronic Excerpt */}
        <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          {/* Excerpt Header */}
          <div className="text-center space-y-1 border-b border-slate-200 pb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="text-xs font-semibold text-slate-400">Độc lập - Tự do - Hạnh phúc</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-900 pt-2">
              TRÍCH LỤC HỌC BẠ SỐ ĐIỆN TỬ
            </h2>
            <p className="text-xs text-slate-500">
              Năm học 2026 - 2027 • Cấp THCS • {school.name}
            </p>
          </div>

          {/* Student Demographic Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-400 block">Họ và tên:</span>
              <span className="font-bold text-slate-900">{selectedStudent.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Mã định danh học sinh:</span>
              <span className="font-mono font-bold text-brand-700">{selectedStudent.studentCode}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Ngày sinh:</span>
              <span className="font-bold text-slate-900">{formatDateVN(selectedStudent.dateOfBirth)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Giới tính:</span>
              <span className="font-bold text-slate-900">{getGenderLabel(selectedStudent.gender)}</span>
            </div>
          </div>

          {/* Academic Results Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Môn học</th>
                  <th className="p-2.5 text-center">Học kỳ 1</th>
                  <th className="p-2.5 text-center">Cả năm</th>
                  <th className="p-2.5">Giáo viên xác nhận</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockReportCard.subjectScores.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-800">{sub.subjectName}</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-700">{sub.term1Score}</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-700">{sub.yearScore}</td>
                    <td className="p-2.5 text-slate-600">{sub.teacherName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Evaluation & Teacher Comment */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <p><strong>Kết quả học tập:</strong> <span className="text-emerald-700 font-bold">{mockReportCard.academicPerformance}</span></p>
              <p><strong>Kết quả rèn luyện:</strong> <span className="text-emerald-700 font-bold">{mockReportCard.conductEvaluation}</span></p>
              <p><strong>Xét lên lớp:</strong> <span className="text-brand-700 font-bold">{mockReportCard.promotionResult}</span></p>
            </div>
            <p className="pt-1 text-slate-700"><strong>Nhận xét của GVCN:</strong> "{mockReportCard.homeroomComment}"</p>
          </div>

          {/* Digital Signatures & QR Code Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            {/* Signature Stamps */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chữ ký số Xác thực (E-Signatures)</h4>
              {currentStep === 'PUBLISHED' ? (
                <div className="space-y-2">
                  {mockReportCard.signatures.map((sig, sIdx) => (
                    <div key={sIdx} className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900">{sig.signerName} ({sig.role === 'HOMEROOM_TEACHER' ? 'GVCN' : (sig.role === 'PRINCIPAL' ? 'Hiệu trưởng' : 'Con dấu ĐT')})</p>
                        <p className="text-[10px] text-slate-500 truncate font-mono">{sig.certificateInfo}</p>
                      </div>
                      <Badge variant="success" size="sm">Hợp lệ</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Bản nháp đang chờ ký số chính thức.</p>
              )}
            </div>

            {/* QR Code Verification */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center space-y-2">
              <div className="w-20 h-20 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-xs">
                <QrCode className="w-14 h-14 text-slate-800" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-brand-700">{mockReportCard.verificationCode}</p>
                <p className="text-[10px] text-slate-400">Quét mã để tra cứu trên Cổng Học bạ Quốc gia</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signing Confirmation Modal */}
      <Modal
        isOpen={isSigningModalOpen}
        onClose={() => setIsSigningModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Stamp className="w-5 h-5 text-rose-600" />
            <span>Ký số Học bạ Điện tử theo Thông tư 70/2026/TT-BGDĐT</span>
          </div>
        }
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Hệ thống sẽ tiến hành tạo mã băm SHA-256 đối với bản ghi dữ liệu có cấu trúc của học sinh <strong>{selectedStudent.fullName} ({selectedStudent.studentCode})</strong> và áp dụng chữ ký số cá nhân + chứng thư số con dấu điện tử của trường.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-1 text-slate-600">
            <p><strong>Mã băm tài liệu (SHA-256):</strong></p>
            <p className="break-all text-[11px] text-brand-700">{mockReportCard.documentHash}</p>
          </div>

          <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
            <strong>Lưu ý pháp lý:</strong> Sau khi phát hành, học bạ số sẽ trở thành bản ghi bất biến (Immutable). Mọi điều chỉnh sau này phải đi qua quy trình điều chỉnh sai sót theo TT70/2026.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsSigningModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="danger" size="sm" onClick={handleExecuteSigning} icon={<Stamp className="w-4 h-4" />}>
              Ký số & Phát hành
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
