import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Grid,
  Users,
  CalendarCheck,
  Wallet,
  Smile,
  BookOpen,
  Award,
  ShieldCheck
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatDateVN } from '../../utils/formatters';
import { ExcelService } from '../../core/export/excelExport';

export const ReportCenter: React.FC = () => {
  const school = localStore.getSchoolConfig();
  const students = localStore.getStudents();
  const attendance = localStore.getAttendance();
  const transactions = localStore.getFinancialTransactions();
  const grades = localStore.getGrades();
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-01');

  const reportCatalog = [
    { id: 'rep-01', title: '1. Danh sách Trích ngang Học sinh Lớp 8A1', category: 'HỒ SƠ LỚP', icon: <Users className="w-4 h-4" /> },
    { id: 'rep-02', title: '2. Sơ đồ Chỗ ngồi & Phân chia Tổ Học kỳ 1', category: 'CHỦ NHIỆM', icon: <Grid className="w-4 h-4" /> },
    { id: 'rep-03', title: '3. Báo cáo Tổng hợp Chuyên cần & Điểm danh Tháng 8', category: 'CHUYÊN CẦN', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'rep-04', title: '4. Sổ cái Thu - Chi & Đối soát Quỹ Lớp (TT55)', category: 'TÀI CHÍNH', icon: <Wallet className="w-4 h-4" /> },
    { id: 'rep-05', title: '5. Nhật ký Điểm Nề nếp & Thi đua Lớp', category: 'NỀ NẾP', icon: <Smile className="w-4 h-4" /> },
    { id: 'rep-06', title: '6. Bảng Tổng hợp Kết quả Đánh giá Học tập (TT22)', category: 'ĐÁNH GIÁ', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'rep-07', title: '7. Danh sách Đề xuất Khen thưởng Học sinh', category: 'KHEN THƯỞNG', icon: <Award className="w-4 h-4" /> },
    { id: 'rep-08', title: '8. Báo cáo Kiểm toán Truy cập Dữ liệu Nhạy cảm (Audit)', category: 'BẢO MẬT', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (selectedReportId === 'rep-01') {
      ExcelService.exportStudentRoster(students, '8A1');
    } else if (selectedReportId === 'rep-04') {
      ExcelService.exportFinanceLedger(transactions, '8A1');
    } else {
      alert('Đã sẵn sàng tải xuống mẫu báo cáo điện tử!');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-brand-600" />
            Bộ 18 Báo Cáo Pháp Lý & Nghiệp Vụ Chuẩn (RPT-*)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Sinh tự động từ nguồn dữ liệu chuẩn, không yêu cầu giáo viên nhập lại báo cáo thủ công
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
            className="text-xs sm:text-sm font-bold"
          >
            In Báo cáo (Print)
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportExcel}
            className="text-xs sm:text-sm font-bold shadow-xs"
          >
            Xuất File Báo cáo
          </Button>
        </div>
      </div>

      {/* Main Grid: Catalog List & Preview Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Report Catalog */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 pb-1 border-b border-slate-100">
            Danh mục Báo cáo Chuẩn
          </h3>

          <div className="space-y-1">
            {reportCatalog.map(rep => (
              <button
                key={rep.id}
                onClick={() => setSelectedReportId(rep.id)}
                className={`w-full text-left p-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
                  selectedReportId === rep.id
                    ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={selectedReportId === rep.id ? 'text-brand-600' : 'text-slate-400'}>
                  {rep.icon}
                </span>
                <span className="truncate">{rep.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Report Preview Sheet */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 print:shadow-none print:border-none">
          {/* Formal School Header */}
          <div className="text-center space-y-1 border-b border-slate-200 pb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="text-xs font-semibold text-slate-400">Độc lập - Tự do - Hạnh phúc</p>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 pt-3">
              {reportCatalog.find(r => r.id === selectedReportId)?.title.substring(3).toUpperCase()}
            </h2>
            <p className="text-xs text-slate-500">
              Lớp: 8A1 • Trường: {school.name} • Năm học: 2026 - 2027
            </p>
          </div>

          {/* Report Body Content Preview */}
          {selectedReportId === 'rep-01' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-medium">Tổng sĩ số: <strong>{students.length} học sinh</strong> (Nam: {students.filter(s=>s.gender==='MALE').length}, Nữ: {students.filter(s=>s.gender==='FEMALE').length})</p>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2 text-center w-10">STT</th>
                      <th className="p-2">Mã HS</th>
                      <th className="p-2">Họ và tên</th>
                      <th className="p-2">Ngày sinh</th>
                      <th className="p-2">Phụ huynh</th>
                      <th className="p-2">SĐT liên hệ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.slice(0, 10).map((st, i) => (
                      <tr key={st.id}>
                        <td className="p-2 text-center">{i + 1}</td>
                        <td className="p-2 font-mono">{st.studentCode}</td>
                        <td className="p-2 font-bold">{st.fullName}</td>
                        <td className="p-2">{formatDateVN(st.dateOfBirth)}</td>
                        <td className="p-2">{st.guardians[0]?.fullName}</td>
                        <td className="p-2 font-mono">{st.guardians[0]?.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedReportId === 'rep-04' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">Sổ cái đối soát thu chi quỹ lớp theo Thông tư 55/2011/TT-BGDĐT.</p>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2">Thời gian</th>
                      <th className="p-2">Khoản mục</th>
                      <th className="p-2 text-right">Thu vào</th>
                      <th className="p-2 text-right">Chi ra</th>
                      <th className="p-2">Người nộp/nhận</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((t, idx) => (
                      <tr key={idx}>
                        <td className="p-2">{formatDateVN(t.occurredAt)}</td>
                        <td className="p-2 font-bold">{t.title}</td>
                        <td className="p-2 text-right font-mono text-emerald-700">{t.type === 'INCOME' ? t.amount.toLocaleString('vi-VN') + ' đ' : '-'}</td>
                        <td className="p-2 text-right font-mono text-rose-700">{t.type === 'EXPENSE' ? t.amount.toLocaleString('vi-VN') + ' đ' : '-'}</td>
                        <td className="p-2">{t.payerOrPayee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Signature Block */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200 text-center text-xs">
            <div>
              <p className="font-bold">BAN GIÁM HIỆU PHÊ DUYỆT</p>
              <p className="text-slate-400 italic">(Ký và đóng dấu)</p>
              <div className="h-16" />
              <p className="font-bold">{school.principalName}</p>
            </div>
            <div>
              <p className="text-slate-500 italic">Hà Nội, ngày 26 tháng 08 năm 2026</p>
              <p className="font-bold">GIÁO VIÊN CHỦ NHIỆM</p>
              <p className="text-slate-400 italic">(Ký và ghi rõ họ tên)</p>
              <div className="h-16" />
              <p className="font-bold">Thầy Nguyễn Văn An</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
