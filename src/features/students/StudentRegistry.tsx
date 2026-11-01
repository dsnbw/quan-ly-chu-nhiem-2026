import React, { useState, useRef } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Phone,
  Eye,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { Student } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { formatDateVN, getGenderLabel } from '../../utils/formatters';
import { ExcelService } from '../../core/export/excelExport';
import { StudentDetailModal } from './StudentDetailModal';

export const StudentRegistry: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(localStore.getStudents());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedAttention, setSelectedAttention] = useState<string>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Import Excel state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedPreview, setImportedPreview] = useState<Partial<Student>[]>([]);
  const [generateStudentCode, setGenerateStudentCode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Add Student State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentCode, setNewStudentCode] = useState('');
  const [newStudentDob, setNewStudentDob] = useState('2012-05-15');
  const [newStudentGender, setNewStudentGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [newStudentGroup, setNewStudentGroup] = useState('Tổ 1');
  const [newStudentAddress, setNewStudentAddress] = useState('Hà Nội');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');
  const [newNeedsVision, setNewNeedsVision] = useState(false);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    let code = newStudentCode.trim();
    if (!code) {
      code = `HS08${String(students.length + 1).padStart(3, '0')}`;
    }

    const sId = `student-${Date.now()}`;
    const newStudent: Student = {
      id: sId,
      studentCode: code,
      fullName: newStudentName.trim(),
      dateOfBirth: newStudentDob,
      gender: newStudentGender,
      ethnicity: 'Kinh',
      birthPlace: 'Hà Nội',
      currentAddress: newStudentAddress.trim() || 'Hà Nội',
      status: 'ACTIVE',
      classId: 'class-8a1',
      className: '8A1',
      enrollmentDate: new Date().toISOString().split('T')[0],
      seatRow: 1,
      seatCol: 1,
      groupName: newStudentGroup,
      health: {
        emergencyContactName: newGuardianName.trim() || 'Phụ huynh',
        emergencyContactPhone: newGuardianPhone.trim() || '',
        needsFrontRowSeat: newNeedsVision,
        needsNearBoardSeat: newNeedsVision,
        visionImpairment: newNeedsVision
      },
      guardians: [
        {
          id: `g-${Date.now()}`,
          studentId: sId,
          fullName: newGuardianName.trim() || 'Phụ huynh học sinh',
          relationship: 'FATHER',
          phone: newGuardianPhone.trim() || '',
          address: newStudentAddress.trim() || 'Hà Nội',
          isPrimaryContact: true,
          isVerified: true,
          hasPortalAccess: true
        }
      ]
    };

    localStore.saveStudent(newStudent);
    setStudents(localStore.getStudents());
    setIsAddModalOpen(false);
    setNewStudentName('');
    setNewStudentCode('');
    setNewGuardianName('');
    setNewGuardianPhone('');
    setNewNeedsVision(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredStudents = students.filter(st => {
    const matchesSearch =
      st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.guardians[0]?.phone.includes(searchTerm);

    const matchesGroup = selectedGroup === 'ALL' || st.groupName === selectedGroup;
    const matchesAttention =
      selectedAttention === 'ALL' ||
      (selectedAttention === 'NEEDS_ATTENTION' && !!st.needsAttentionTag) ||
      (selectedAttention === 'VISION' && !!st.health.visionImpairment);

    return matchesSearch && matchesGroup && matchesAttention;
  });

  const handleExportExcel = () => {
    ExcelService.exportStudentRoster(students, '8A1');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const buffer = evt.target?.result as ArrayBuffer;
      if (buffer) {
        const parsed = ExcelService.parseStudentExcel(buffer);
        setImportedPreview(parsed);
        setIsImportModalOpen(true);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCommitImport = () => {
    // Chỉ bắt buộc có tên học sinh
    const validStudents = importedPreview.filter(item => item.fullName && item.fullName.trim() !== '');

    validStudents.forEach((item, i) => {
      let code = item.studentCode || '';
      if (generateStudentCode && code === '') {
        code = `HS${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      }

      const newStudent: Student = {
        id: `student-imp-${Date.now()}-${i}`,
        studentCode: code,
        fullName: item.fullName!.trim(),
        dateOfBirth: item.dateOfBirth || '',
        gender: item.gender || 'MALE',
        ethnicity: item.ethnicity || 'Kinh',
        birthPlace: item.birthPlace || '',
        currentAddress: item.currentAddress || '',
        status: 'ACTIVE',
        classId: 'class-8a1',
        className: '8A1',
        enrollmentDate: '2026-08-26',
        seatRow: item.seatRow || 1,
        seatCol: item.seatCol || 1,
        groupName: item.groupName || 'Tổ 1',
        health: {
          emergencyContactName: item.guardians?.[0]?.fullName || item.health?.emergencyContactName || '',
          emergencyContactPhone: item.guardians?.[0]?.phone || item.health?.emergencyContactPhone || '',
          needsFrontRowSeat: false,
          needsNearBoardSeat: false
        },
        guardians: item.guardians as any || []
      };
      localStore.saveStudent(newStudent);
    });

    setStudents(localStore.getStudents());
    setIsImportModalOpen(false);
    setImportedPreview([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-brand-600" />
            Hồ sơ Học sinh 360° — Lớp 8A1
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Quản lý toàn diện nhân thân, thông tin phụ huynh, sức khỏe và tiến trình học tập ({students.length} học sinh)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls"
            className="hidden"
          />
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-700"
          >
            Thêm học sinh
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={<Upload className="w-4 h-4" />}
            onClick={() => fileInputRef.current?.click()}
            className="text-xs sm:text-sm font-bold"
          >
            Nhập Excel
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={<Download className="w-4 h-4 text-emerald-600" />}
            onClick={handleExportExcel}
            className="text-xs sm:text-sm font-bold"
          >
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Tìm theo tên học sinh, mã HS, SĐT phụ huynh..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-medium"
          >
            <option value="ALL">Tất cả các Tổ</option>
            <option value="Tổ 1">Tổ 1</option>
            <option value="Tổ 2">Tổ 2</option>
            <option value="Tổ 3">Tổ 3</option>
            <option value="Tổ 4">Tổ 4</option>
          </select>

          <select
            value={selectedAttention}
            onChange={e => setSelectedAttention(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-medium"
          >
            <option value="ALL">Tất cả đối tượng</option>
            <option value="NEEDS_ATTENTION">Cần theo dõi</option>
            <option value="VISION">Cận thị (bàn đầu)</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left min-w-[800px]">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3.5 text-center w-12">STT</th>
                <th className="p-3.5">Mã HS</th>
                <th className="p-3.5">Họ và tên học sinh</th>
                <th className="p-3.5">Ngày sinh</th>
                <th className="p-3.5">Giới tính</th>
                <th className="p-3.5">Tổ / Chỗ ngồi</th>
                <th className="p-3.5">Phụ huynh & SĐT</th>
                <th className="p-3.5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                    Không tìm thấy học sinh phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, i) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 text-center font-bold text-slate-400">{i + 1}</td>
                    <td className="p-3.5 font-mono font-bold text-brand-700">{st.studentCode}</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span>{st.fullName}</span>
                        {st.needsAttentionTag && <Badge variant="warning" size="sm">Theo dõi</Badge>}
                        {st.health.visionImpairment && <Badge variant="info" size="sm">Cận thị</Badge>}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600">{formatDateVN(st.dateOfBirth)}</td>
                    <td className="p-3.5 text-slate-600">{getGenderLabel(st.gender)}</td>
                    <td className="p-3.5 text-slate-700">
                      <span className="font-semibold">{st.groupName || 'Tổ 1'}</span>
                      <span className="text-slate-400 text-xs block">Bàn {st.seatRow || 1}, Ghế {st.seatCol || 1}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-slate-800 text-xs">{st.guardians[0]?.fullName || '-'}</p>
                          <p className="text-xs text-slate-500 font-mono">{st.guardians[0]?.phone || '-'}</p>
                        </div>
                        {st.guardians[0]?.phone && (
                          <a
                            href={`tel:${st.guardians[0].phone}`}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="Gọi điện thoại"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Eye className="w-4 h-4 text-brand-600" />}
                        onClick={() => {
                          setSelectedStudent(st);
                          setIsDetailModalOpen(true);
                        }}
                        className="text-brand-600 font-bold"
                      >
                        Hồ sơ 360°
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student 360 Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStudent(null);
        }}
      />

      {/* Excel Import Preview Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <span>Xem trước Danh sách Nhập từ Excel ({importedPreview.length} học sinh)</span>
          </div>
        }
        maxWidth="4xl"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(false)}>
              Hủy bỏ
            </Button>
            <Button variant="success" size="sm" onClick={handleCommitImport} icon={<CheckCircle2 className="w-4 h-4" />}>
              Xác nhận Nhập dữ liệu
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-600">
              Chỉ bắt buộc có <strong>Tên học sinh</strong>. Các trường khác có thể để trống và cập nhật sau. Hệ thống đã tự động nhận diện các cột theo tiêu chuẩn.
            </p>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={generateStudentCode}
                onChange={e => setGenerateStudentCode(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Tự động tạo Mã Học sinh nếu trống (Tạo tự động / Dùng mã có sẵn)
            </label>
          </div>

          <div className="border border-slate-200 rounded-xl max-h-80 overflow-y-auto overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[600px]">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2">Mã HS</th>
                  <th className="p-2">Họ và tên</th>
                  <th className="p-2">Ngày sinh</th>
                  <th className="p-2">Giới tính</th>
                  <th className="p-2">Phụ huynh</th>
                  <th className="p-2">SĐT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {importedPreview.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-mono">{item.studentCode}</td>
                    <td className="p-2 font-bold">{item.fullName}</td>
                    <td className="p-2">{item.dateOfBirth}</td>
                    <td className="p-2">{item.gender === 'MALE' ? 'Nam' : 'Nữ'}</td>
                    <td className="p-2">{item.guardians?.[0]?.fullName}</td>
                    <td className="p-2 font-mono">{item.guardians?.[0]?.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
      {/* Manual Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-brand-600" />
            <span>Thêm Học Sinh Mới vào Lớp 8A1</span>
          </div>
        }
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên học sinh *</label>
              <input
                type="text"
                required
                value={newStudentName}
                onChange={e => setNewStudentName(e.target.value)}
                placeholder="VD: Hoàng Minh Châu"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mã học sinh (Để trống tự sinh)</label>
              <input
                type="text"
                value={newStudentCode}
                onChange={e => setNewStudentCode(e.target.value)}
                placeholder="VD: HS08031"
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ngày sinh</label>
              <input
                type="date"
                value={newStudentDob}
                onChange={e => setNewStudentDob(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giới tính</label>
              <select
                value={newStudentGender}
                onChange={e => setNewStudentGender(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phân tổ</label>
              <select
                value={newStudentGroup}
                onChange={e => setNewStudentGroup(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              >
                <option value="Tổ 1">Tổ 1</option>
                <option value="Tổ 2">Tổ 2</option>
                <option value="Tổ 3">Tổ 3</option>
                <option value="Tổ 4">Tổ 4</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Họ tên Phụ huynh</label>
              <input
                type="text"
                value={newGuardianName}
                onChange={e => setNewGuardianName(e.target.value)}
                placeholder="VD: Hoàng Văn Minh"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại Phụ huynh</label>
              <input
                type="text"
                value={newGuardianPhone}
                onChange={e => setNewGuardianPhone(e.target.value)}
                placeholder="VD: 0912 888 999"
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ cư trú</label>
            <input
              type="text"
              value={newStudentAddress}
              onChange={e => setNewStudentAddress(e.target.value)}
              placeholder="VD: Phố Trích Sài, Tây Hồ, Hà Nội"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={newNeedsVision}
              onChange={e => setNewNeedsVision(e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
            <span>Học sinh có tật khúc xạ (Cận thị - cần ưu tiên bàn đầu gần bảng)</span>
          </label>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-brand-600 hover:bg-brand-700">
              Lưu Học Sinh
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
