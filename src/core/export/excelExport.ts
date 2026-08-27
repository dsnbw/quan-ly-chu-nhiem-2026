// ============================================================================
// EXCEL FAST IMPORT & EXPORT GENERATOR (108C Appendix L, FIN-012, ASM-003.3)
// Supports Vietnamese column alias recognition & multi-sheet exports
// ============================================================================

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Student, GradeEntry, FinancialTransaction, StudentFeeEntry } from '../../types';

export class ExcelService {
  /**
   * Xuất danh sách học sinh lớp ra file Excel
   */
  public static exportStudentRoster(students: Student[], className: string) {
    const data = students.map((st, i) => ({
      'STT': i + 1,
      'Mã học sinh': st.studentCode,
      'Họ và tên': st.fullName,
      'Ngày sinh': st.dateOfBirth,
      'Giới tính': st.gender === 'MALE' ? 'Nam' : 'Nữ',
      'Dân tộc': st.ethnicity,
      'Tổ': st.groupName || '',
      'Họ tên phụ huynh': st.guardians[0]?.fullName || '',
      'SĐT phụ huynh': st.guardians[0]?.phone || '',
      'Địa chỉ': st.currentAddress,
      'Ghi chú sức khỏe': st.health.visionImpairment ? 'Cận thị' : (st.health.allergyNotice || '')
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `DanhSach_${className}`);

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `Danh_sach_hoc_sinh_${className}_2026.xlsx`);
  }

  /**
   * Nhận diện cột và Import danh sách học sinh từ file Excel
   */
  public static parseStudentExcel(fileData: ArrayBuffer): Partial<Student>[] {
    const wb = XLSX.read(fileData, { type: 'array' });
    const firstSheetName = wb.SheetNames[0];
    const ws = wb.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(ws);

    // Alias mapping (Appendix L)
    const codeAliases = ['mã học sinh', 'ma hs', 'mã hs', 'student id', 'mshs', 'stt'];
    const nameAliases = ['họ và tên', 'họ tên', 'hoten', 'họ tên học sinh', 'tên học sinh', 'full name'];
    const dobAliases = ['ngày sinh', 'ngaysinh', 'dob', 'năm sinh'];
    const genderAliases = ['giới tính', 'gioitinh', 'phái', 'gender'];
    const parentAliases = ['phụ huynh', 'họ tên phụ huynh', 'người giám hộ', 'bố mẹ'];
    const phoneAliases = ['sđt phụ huynh', 'điện thoại phụ huynh', 'số điện thoại', 'sdt', 'phone'];
    const addressAliases = ['địa chỉ', 'diachi', 'nơi ở'];

    return rows.map((row, idx) => {
      let studentCode = `HS08${String(idx + 1).padStart(3, '0')}`;
      let fullName = '';
      let dateOfBirth = '2012-01-01';
      let gender: Student['gender'] = 'MALE';
      let parentName = '';
      let phone = '';
      let address = '';

      Object.entries(row).forEach(([rawKey, val]) => {
        const key = rawKey.toLowerCase().trim();
        if (codeAliases.some(a => key.includes(a)) && val) studentCode = String(val).trim();
        if (nameAliases.some(a => key.includes(a)) && val) fullName = String(val).trim();
        if (dobAliases.some(a => key.includes(a)) && val) dateOfBirth = String(val).trim();
        if (genderAliases.some(a => key.includes(a)) && val) {
          const gStr = String(val).toLowerCase();
          gender = (gStr.includes('nữ') || gStr === 'female' || gStr === 'f') ? 'FEMALE' : 'MALE';
        }
        if (parentAliases.some(a => key.includes(a)) && val) parentName = String(val).trim();
        if (phoneAliases.some(a => key.includes(a)) && val) phone = String(val).trim();
        if (addressAliases.some(a => key.includes(a)) && val) address = String(val).trim();
      });

      return {
        studentCode,
        fullName: fullName || `Học sinh ${idx + 1}`,
        dateOfBirth,
        gender,
        currentAddress: address || 'Hà Nội',
        guardians: [
          {
            id: `g-imp-${idx + 1}`,
            studentId: `s-imp-${idx + 1}`,
            fullName: parentName || 'Phụ huynh học sinh',
            relationship: 'FATHER',
            phone: phone || '0912000000',
            address: address || 'Hà Nội',
            isPrimaryContact: true,
            isVerified: true,
            hasPortalAccess: true
          }
        ]
      };
    });
  }

  /**
   * Xuất Bảng điểm tổng hợp ra file Excel
   */
  public static exportGradebook(grades: GradeEntry[], className: string, subjectName: string) {
    const data = grades.map((g, i) => ({
      'STT': i + 1,
      'Mã học sinh': g.studentId.replace('student-', '').toUpperCase(),
      'Họ và tên': g.studentName,
      'Môn học': g.subjectName,
      'Điểm TX 1': g.tx1 ?? '',
      'Điểm TX 2': g.tx2 ?? '',
      'Điểm TX 3': g.tx3 ?? '',
      'Điểm Giữa kỳ': g.gk ?? '',
      'Điểm Cuối kỳ': g.ck ?? '',
      'ĐTB Môn': g.averageScore ?? (g.evaluationResult === 'PASSED' ? 'Đạt' : 'C.Đạt'),
      'Nhận xét của GV': g.teacherComment ?? ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `BangDiem_${subjectName}`);

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `Bang_diem_${subjectName}_${className}_2026.xlsx`);
  }

  /**
   * Xuất Sổ cái Thu - Chi Quỹ lớp ra Excel
   */
  public static exportFinanceLedger(transactions: FinancialTransaction[], className: string) {
    const data = transactions.map((t, i) => ({
      'STT': i + 1,
      'Thời gian': t.occurredAt,
      'Loại': t.type === 'INCOME' ? 'Thu' : (t.type === 'EXPENSE' ? 'Chi' : 'Điều chỉnh'),
      'Danh mục': t.category,
      'Nội dung thu/chi': t.title,
      'Số tiền (VNĐ)': t.amount,
      'Hình thức': t.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'Tiền mặt',
      'Người nộp / Người nhận': t.payerOrPayee,
      'Mã chứng từ / Hóa đơn': t.referenceNo || '',
      'Người ghi sổ': t.recordedByTeacherName,
      'Trạng thái': t.status === 'POSTED' ? 'Đã ghi sổ' : 'Đã đảo giao dịch'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `SoQuyLop_${className}`);

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `So_quy_thu_chi_${className}_2026.xlsx`);
  }
}
