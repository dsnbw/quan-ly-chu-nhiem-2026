import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Clock,
  FileCode,
  ShieldAlert,
  Save,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { SchoolConfig, RetentionPolicy, AuditEvent } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDateTimeVN } from '../../utils/formatters';

export const SettingsCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'school' | 'retention' | 'audit' | 'breakglass' | 'data'>('school');
  const [school, setSchool] = useState<SchoolConfig>(localStore.getSchoolConfig());
  const [retentionPolicies, setRetentionPolicies] = useState<RetentionPolicy[]>(localStore.getRetentionPolicies());
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(localStore.getAuditLogs());

  // Break glass state
  const session = localStore.getUserSession();
  const [isBreakGlassActive, setIsBreakGlassActive] = useState<boolean>(session.isBreakGlassActive || false);
  const [breakGlassReason, setBreakGlassReason] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    localStore.saveSchoolConfig(school);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleToggleBreakGlass = () => {
    if (!isBreakGlassActive) {
      if (!breakGlassReason.trim()) {
        alert('Vui lòng nhập lý do truy cập khẩn cấp theo quy định!');
        return;
      }

      session.isBreakGlassActive = true;
      session.breakGlassExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 mins TTL
      setIsBreakGlassActive(true);

      localStore.recordAudit({
        id: 'aud-bg-' + Date.now(),
        timestamp: new Date().toISOString(),
        actorId: session.userId,
        actorName: session.fullName,
        actorRole: session.activeRole,
        action: 'ACTIVATE_BREAK_GLASS',
        resourceType: 'SECURITY',
        resourceId: 'break_glass',
        schoolId: session.schoolId,
        details: `Kích hoạt chế độ truy cập khẩn cấp Break-Glass (TTL: 30 phút). Lý do: ${breakGlassReason}`,
        classification: 'SEALED_CASE'
      });
      setAuditLogs(localStore.getAuditLogs());
    } else {
      session.isBreakGlassActive = false;
      session.breakGlassExpiresAt = undefined;
      setIsBreakGlassActive(false);
      setBreakGlassReason('');

      localStore.recordAudit({
        id: 'aud-bg-off-' + Date.now(),
        timestamp: new Date().toISOString(),
        actorId: session.userId,
        actorName: session.fullName,
        actorRole: session.activeRole,
        action: 'DEACTIVATE_BREAK_GLASS',
        resourceType: 'SECURITY',
        resourceId: 'break_glass',
        schoolId: session.schoolId,
        details: 'Tắt chế độ truy cập khẩn cấp Break-Glass.',
        classification: 'PUBLIC_INTERNAL'
      });
      setAuditLogs(localStore.getAuditLogs());
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-slate-700" />
            Cấu Hình Hệ Thống, Lưu Trữ (TT 08/2025) & An Toàn Thông Tin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Quản trị tham số trường học, phân quyền ABAC, chính sách lưu trữ tài liệu và nhật ký truy vết
          </p>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Đã lưu cấu hình trường học thành công!
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('school')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] whitespace-nowrap ${
            activeTab === 'school' ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Thông tin Trường học & Cấu hình
        </button>
        <button
          onClick={() => setActiveTab('retention')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] whitespace-nowrap ${
            activeTab === 'retention' ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Thời hạn Lưu trữ Hồ sơ (TT 08/2025)
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] whitespace-nowrap ${
            activeTab === 'audit' ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Nhật ký Kiểm toán (Audit Trail: {auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('breakglass')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] whitespace-nowrap ${
            activeTab === 'breakglass' ? 'bg-rose-600 text-white shadow-xs' : 'bg-white text-rose-700 hover:bg-rose-50'
          }`}
        >
          Truy cập Khẩn cấp (Break-Glass)
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] whitespace-nowrap ${
            activeTab === 'data' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-purple-700 hover:bg-purple-50'
          }`}
        >
          Quản lý Dữ liệu Mẫu
        </button>
      </div>

      {/* View: School Config */}
      {activeTab === 'school' && (
        <form onSubmit={handleSaveSchool} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
            Danh tính Cơ sở Giáo dục
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên trường *</label>
              <input
                type="text"
                required
                value={school.name}
                onChange={e => setSchool({ ...school, name: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mã cơ sở giáo dục *</label>
              <input
                type="text"
                required
                value={school.code}
                onChange={e => setSchool({ ...school, code: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hiệu trưởng *</label>
              <input
                type="text"
                required
                value={school.principalName}
                onChange={e => setSchool({ ...school, principalName: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sĩ số chuẩn/lớp (Tối đa) *</label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={school.maxClassSize || 35}
                onChange={e => setSchool({ ...school, maxClassSize: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ trường</label>
              <input
                type="text"
                value={school.address}
                onChange={e => setSchool({ ...school, address: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="md" type="submit" icon={<Save className="w-4 h-4" />}>
              Lưu Cấu hình Trường
            </Button>
          </div>
        </form>
      )}

      {/* View: Retention Policies (TT 08/2025) */}
      {activeTab === 'retention' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 space-y-4">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900">
            <strong>Căn cứ Pháp lý: Thông tư 08/2025/TT-BGDĐT</strong> — Quy định thời hạn lưu trữ hồ sơ, tài liệu giáo dục và đào tạo. Hệ thống quản lý vòng đời hồ sơ, ngăn chặn tiêu hủy tùy tiện và hỗ trợ quy trình Legal Hold khi có thanh tra, kiểm toán.
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Mã hồ sơ</th>
                  <th className="p-3">Tên loại hồ sơ / Sổ</th>
                  <th className="p-3">Thời hạn lưu trữ (TT 08/2025)</th>
                  <th className="p-3">Biện pháp xử lý hết hạn</th>
                  <th className="p-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {retentionPolicies.map(pol => (
                  <tr key={pol.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-700">{pol.id}</td>
                    <td className="p-3 font-bold text-slate-900">{pol.name}</td>
                    <td className="p-3">
                      <Badge variant={pol.durationString === 'PERMANENT' ? 'purple' : 'info'} size="sm">
                        {pol.durationString === 'PERMANENT' ? 'Vĩnh viễn' : (pol.durationString === 'UNTIL_COURSE_END' ? 'Hết khóa học' : pol.durationString)}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-600">{pol.dispositionAction}</td>
                    <td className="p-3 text-center">
                      <Badge variant="success" size="sm">Đang áp dụng</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Immutable Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Shield className="w-4 h-4 text-brand-600" />
            Nhật Ký Kiểm Toán Bất Biến (Immutable Audit Trail)
          </h3>

          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Thời điểm</th>
                  <th className="p-2.5">Người thực hiện</th>
                  <th className="p-2.5">Hành động</th>
                  <th className="p-2.5">Đối tượng</th>
                  <th className="p-2.5">Chi tiết ghi nhận</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-2.5 text-slate-500">{formatDateTimeVN(log.timestamp)}</td>
                    <td className="p-2.5 font-bold text-slate-800">{log.actorName}</td>
                    <td className="p-2.5">
                      <Badge variant="primary" size="sm">{log.action}</Badge>
                    </td>
                    <td className="p-2.5 text-slate-600">{log.resourceType}</td>
                    <td className="p-2.5 text-slate-700 font-sans">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Break-Glass Protocol (PERM-006) */}
      {activeTab === 'breakglass' && (
        <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-rose-100 pb-3">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <div>
              <h3 className="font-bold text-rose-900 text-base">
                Quy Trình Truy Cập Khẩn Cấp (Break-Glass Emergency Protocol — PERM-006)
              </h3>
              <p className="text-xs text-rose-700">
                Cho phép truy cập tạm thời vào dữ liệu bảo mật (Sức khỏe, Hồ sơ tư vấn niêm phong) trong trường hợp khẩn cấp
              </p>
            </div>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3 text-xs text-rose-900">
            <p className="font-bold">Quy tắc bắt buộc khi kích hoạt Break-Glass:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Phải nhập lý do khẩn cấp rõ ràng và có căn cứ pháp lý/y tế.</li>
              <li>Quyền chỉ có hiệu lực tạm thời (TTL 30 phút) và tự động hết hạn.</li>
              <li>100% các thao tác xem/sửa dữ liệu nhạy cảm đều được ghi log kiểm toán đặc biệt.</li>
            </ul>
          </div>

          {!isBreakGlassActive ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lý do truy cập khẩn cấp *</label>
                <textarea
                  rows={3}
                  value={breakGlassReason}
                  onChange={e => setBreakGlassReason(e.target.value)}
                  placeholder="VD: Cấp cứu y tế học sinh khẩn cấp, cần tra cứu tiền sử bệnh lý và thông tin liên hệ của phụ huynh..."
                  className="w-full p-3 text-xs border border-rose-300 rounded-xl outline-none focus:border-rose-500 bg-white"
                />
              </div>

              <Button
                variant="danger"
                size="md"
                onClick={handleToggleBreakGlass}
                icon={<Unlock className="w-4 h-4" />}
                className="font-bold"
              >
                Kích hoạt Break-Glass (30 phút)
              </Button>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-bold text-amber-900 text-sm">Chế độ Break-Glass đang BẬT</p>
                <p className="text-xs text-amber-700">Hết hạn sau: {session.breakGlassExpiresAt}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleBreakGlass}
                icon={<Lock className="w-4 h-4" />}
                className="bg-white text-rose-700 font-bold border-rose-300"
              >
                Tắt Break-Glass Ngay
              </Button>
            </div>
          )}
        </div>
      )}

      {/* View: Data Management */}
      {activeTab === 'data' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
            Quản lý Dữ liệu Hệ thống
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Tính năng này giúp bạn thiết lập lại dữ liệu hoặc nạp dữ liệu mẫu để trải nghiệm thử.
          </p>
          <div className="flex flex-col gap-4 max-w-sm">
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => {
                if(confirm('Bạn có CHẮC CHẮN muốn XÓA TOÀN BỘ dữ liệu hiện tại không? Hành động này không thể hoàn tác!')) {
                  localStorage.clear();
                  alert('Đã xóa toàn bộ dữ liệu! Ứng dụng sẽ tải lại.');
                  window.location.reload();
                }
              }}
            >
              Làm sạch hệ thống (Xóa trắng)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
