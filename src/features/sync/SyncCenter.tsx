import React, { useState } from 'react';
import {
  RefreshCw,
  Wifi,
  WifiOff,
  AlertTriangle,
  Download,
  Upload,
  CheckCircle2,
  Server,
  Smartphone,
  Laptop,
  Check,
  X,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { SyncServerConfig, MutationEnvelope, SyncConflictRecord } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDateTimeVN } from '../../utils/formatters';

export const SyncCenter: React.FC = () => {
  const [syncConfig, setSyncConfig] = useState<SyncServerConfig>(localStore.getSyncConfig());
  const [outbox, setOutbox] = useState<MutationEnvelope[]>(localStore.getOutbox());
  const [conflicts, setConflicts] = useState<SyncConflictRecord[]>(localStore.getConflicts());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState(false);

  // Manual Conflict Resolution State
  const [selectedConflict, setSelectedConflict] = useState<SyncConflictRecord | null>(null);
  const [mergedValueInput, setMergedValueInput] = useState('');
  
  const [isSshModalOpen, setIsSshModalOpen] = useState(false);
  const [sshConfig, setSshConfig] = useState({ ip: '', port: '22', user: 'root', pass: '', path: '/opt/cva-sync' });
  const [sshLogs, setSshLogs] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const restoreFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      if (syncConfig.mode === 'SUPABASE' || syncConfig.mode === 'FIREBASE') {
        const { CloudSyncClient } = await import('../../core/sync/cloudClient');
        const client = new CloudSyncClient(syncConfig.mode, syncConfig.serverBaseUrl, syncConfig.apiKey || '');
        await client.testConnection();
        alert('✅ Kết nối Đám mây thành công!');
      } else if (syncConfig.mode === 'CONNECTED_SCHOOL') {
        const url = syncConfig.serverBaseUrl.replace(/\/+$/, '');
        let ok = false;
        try {
          const res = await fetch(`${url}/ping`);
          if (res.ok) ok = true;
        } catch {}
        if (!ok) {
          try {
            const res2 = await fetch(`${url}/health`);
            if (res2.ok) ok = true;
          } catch {}
        }
        if (!ok) {
          try {
            const res3 = await fetch(`${url}/api/v1/health`);
            if (res3.ok) ok = true;
          } catch {}
        }
        if (!ok) throw new Error('Máy chủ không phản hồi tại ' + url);
        alert('✅ Kết nối Máy chủ thành công!');
      }
    } catch (error: any) {
      alert('❌ Lỗi kết nối: ' + error.message);
    } finally {
      setIsTesting(false);
    }
  };

  const handleDeploySSH = async () => {
    setIsDeploying(true);
    setSshLogs(['[*] Bắt đầu triển khai tự động qua SSH...']);
    try {
      // @ts-ignore
      const result = await window.electronAPI?.deploySSH(sshConfig);
      if (result) {
        setSshLogs(prev => [...prev, `[SUCCESS] ${result.message}`]);
        if (result.backendPath) {
          setSshLogs(prev => [...prev, `=> File script đã được tạo tại: ${result.backendPath}/auto_deploy.sh`]);
        }
      } else {
        setSshLogs(prev => [...prev, '[!] Không có phản hồi từ hệ thống.']);
      }
    } catch (error: any) {
      setSshLogs(prev => [...prev, `[ERROR] ${error.message}`]);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleToggleMode = (newMode: 'LOCAL_ONLY' | 'CONNECTED_SCHOOL' | 'SUPABASE' | 'FIREBASE') => {
    const updated = { ...syncConfig, mode: newMode };
    setSyncConfig(updated);
    localStore.saveSyncConfig(updated);
  };

  const handleExecuteSync = async () => {
    setIsSyncing(true);
    try {
      const fullState = localStore.exportFullBackup();

      if (syncConfig.mode === 'SUPABASE' || syncConfig.mode === 'FIREBASE') {
        const { CloudSyncClient } = await import('../../core/sync/cloudClient');
        const client = new CloudSyncClient(syncConfig.mode, syncConfig.serverBaseUrl, syncConfig.apiKey || '');
        await client.pushState(fullState);
      } else if (syncConfig.mode === 'CONNECTED_SCHOOL') {
        const url = syncConfig.serverBaseUrl.replace(/\/+$/, '');
        let pushSuccess = false;
        try {
          const res = await fetch(`${url}/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fullState)
          });
          if (res.ok) pushSuccess = true;
        } catch {}

        if (!pushSuccess) {
          const res2 = await fetch(`${url}/api/v1/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fullState)
          });
          if (!res2.ok) throw new Error('Máy chủ từ chối đồng bộ (HTTP ' + res2.status + ')');
        }
      }

      // Mark outbox cleared
      localStore.clearOutbox();
      setOutbox([]);

      // Update sync config
      const updated = {
        ...syncConfig,
        lastSuccessfulSync: new Date().toISOString()
      };
      setSyncConfig(updated);
      localStore.saveSyncConfig(updated);

      setSyncSuccessToast(true);
      setTimeout(() => setSyncSuccessToast(false), 3500);
    } catch (error: any) {
      alert('❌ Quá trình đồng bộ thất bại: ' + (error.message || 'Lỗi kết nối'));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportBackupJson = () => {
    const data = localStore.exportFullBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_cva_2026_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportBackupJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        if (confirm('Khôi phục dữ liệu từ file sao lưu này? Dữ liệu hiện tại sẽ được thay thế.')) {
          localStore.importFullBackup(parsed);
          alert('✅ Khôi phục dữ liệu thành công! Ứng dụng sẽ tải lại.');
          window.location.reload();
        }
      } catch (err: any) {
        alert('❌ Tệp sao lưu không hợp lệ: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleResolveConflict = (conflictId: string, resolution: 'RESOLVED_USE_LOCAL' | 'RESOLVED_USE_SERVER' | 'RESOLVED_MANUAL_MERGE', val?: any) => {
    const updated = conflicts.map(c => {
      if (c.id === conflictId) {
        return {
          ...c,
          resolvedStatus: resolution,
          resolvedValue: val !== undefined ? val : (resolution === 'RESOLVED_USE_LOCAL' ? c.localValue : c.serverValue),
          resolvedAt: new Date().toISOString(),
          resolvedBy: localStore.getUserSession().fullName
        };
      }
      return c;
    });

    localStore.saveConflicts(updated);
    setConflicts(localStore.getConflicts());
    setSelectedConflict(null);
  };

  const handleCreateMockConflict = () => {
    const mockConflict: SyncConflictRecord = {
      id: 'conf-' + Math.random().toString(36).substring(2, 7),
      operationId: 'op-conf-01',
      entityType: 'student',
      entityId: 'student-hs08001',
      fieldName: 'guardian_phone (SĐT Phụ huynh Nguyễn Tuấn Anh)',
      localValue: '0912 345 999 (Sửa trên Máy tính Windows)',
      serverValue: '0912 345 888 (Sửa trên Điện thoại Android)',
      baseValue: '0912 345 111 (Giá trị gốc ban đầu)',
      detectedAt: new Date().toISOString(),
      resolvedStatus: 'UNRESOLVED'
    };

    const updated = [mockConflict, ...conflicts];
    localStore.saveConflicts(updated);
    setConflicts(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <RefreshCw className={`w-6 h-6 text-brand-600 ${isSyncing ? 'animate-spin' : ''}`} />
            Trung Tâm Đồng Bộ & Xử Lý Xung Đột (SYNC-*)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kiến trúc Offline-first: làm việc mượt mà khi mất mạng, tự động ghi outbox journal và merge dữ liệu hai chiều
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="file"
            ref={restoreFileInputRef}
            onChange={handleImportBackupJson}
            accept=".json"
            className="hidden"
          />
          <Button
            variant="outline"
            size="md"
            icon={<Upload className="w-4 h-4 text-brand-600" />}
            onClick={() => restoreFileInputRef.current?.click()}
            className="text-xs sm:text-sm font-bold"
          >
            Khôi phục (JSON)
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportBackupJson}
            className="text-xs sm:text-sm font-bold"
          >
            Sao lưu Cục bộ (JSON)
          </Button>

          <Button
            variant="primary"
            size="md"
            isLoading={isSyncing}
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={handleExecuteSync}
            className="text-xs sm:text-sm font-bold shadow-md"
          >
            Đồng bộ Ngay với Máy chủ
          </Button>
        </div>
      </div>

      {syncSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Đã đẩy toàn bộ Outbox lên máy chủ và kéo dữ liệu mới nhất về thiết bị thành công!</span>
        </div>
      )}

      {/* Mode Switcher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mode A: Local Only */}
        <div
          onClick={() => handleToggleMode('LOCAL_ONLY')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            syncConfig.mode === 'LOCAL_ONLY'
              ? 'bg-brand-50/60 border-brand-600 shadow-md ring-2 ring-brand-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Chế độ A: Local</h3>
            </div>
          </div>
          <p className="text-[11px] text-slate-600">
            Dữ liệu lưu trên thiết bị. Không cần Internet.
          </p>
        </div>

        {/* Mode B: Connected School */}
        <div
          onClick={() => handleToggleMode('CONNECTED_SCHOOL')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            syncConfig.mode === 'CONNECTED_SCHOOL'
              ? 'bg-emerald-50/60 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Chế độ B: Server</h3>
            </div>
          </div>
          <p className="text-[11px] text-slate-600">
            Đồng bộ Server (Node.js API).
          </p>
        </div>

        {/* Mode C: Supabase */}
        <div
          onClick={() => handleToggleMode('SUPABASE')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            syncConfig.mode === 'SUPABASE'
              ? 'bg-amber-50/60 border-amber-600 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Chế độ C: Supabase</h3>
            </div>
          </div>
          <p className="text-[11px] text-slate-600">
            Đồng bộ Cloud đa thiết bị (REST).
          </p>
        </div>

        {/* Mode D: Firebase */}
        <div
          onClick={() => handleToggleMode('FIREBASE')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            syncConfig.mode === 'FIREBASE'
              ? 'bg-orange-50/60 border-orange-600 shadow-md ring-2 ring-orange-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Chế độ D: Firebase</h3>
            </div>
          </div>
          <p className="text-[11px] text-slate-600">
            Đồng bộ Firebase Realtime DB.
          </p>
        </div>
      </div>

      {syncConfig.mode === 'CONNECTED_SCHOOL' && (
        <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center justify-between">
            <span>Cấu hình Kết nối Máy chủ (API)</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSshModalOpen(true)}
              className="text-xs"
            >
              Triển khai Tự động (SSH)
            </Button>
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">URL Máy chủ Đồng bộ (Server API)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={syncConfig.serverBaseUrl}
                onChange={e => {
                  const updated = { ...syncConfig, serverBaseUrl: e.target.value };
                  setSyncConfig(updated);
                  localStore.saveSyncConfig(updated);
                }}
                placeholder="VD: https://nd.quangngai.qzz.io/api/v1"
                className="flex-1 px-3 py-2 text-xs sm:text-sm font-mono border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleTestConnection}
                isLoading={isTesting}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold"
              >
                Kiểm tra Kết nối
              </Button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">Mặc định: https://nd.quangngai.qzz.io/api/v1</p>
          </div>
        </div>
      )}

      {(syncConfig.mode === 'SUPABASE' || syncConfig.mode === 'FIREBASE') && (
        <div className={`rounded-2xl p-5 border shadow-xs space-y-4 ${syncConfig.mode === 'SUPABASE' ? 'bg-amber-50/50 border-amber-200' : 'bg-orange-50/50 border-orange-200'}`}>
          <h3 className="font-bold text-slate-800 text-sm">Cấu hình Đám mây {syncConfig.mode === 'SUPABASE' ? 'Supabase' : 'Firebase'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{syncConfig.mode === 'SUPABASE' ? 'Project URL' : 'Database URL'}</label>
              <input
                type="text"
                value={syncConfig.serverBaseUrl === 'https://nd.quangngai.qzz.io/api/v1' ? '' : syncConfig.serverBaseUrl}
                onChange={e => {
                  const updated = { ...syncConfig, serverBaseUrl: e.target.value };
                  setSyncConfig(updated);
                  localStore.saveSyncConfig(updated);
                }}
                placeholder={syncConfig.mode === 'SUPABASE' ? "https://xxx.supabase.co" : "https://xxx.firebaseio.com"}
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{syncConfig.mode === 'SUPABASE' ? 'Anon Key / API Key' : 'Database Secret (Auth)'}</label>
              <input
                type="password"
                value={syncConfig.apiKey || ''}
                onChange={e => {
                  const updated = { ...syncConfig, apiKey: e.target.value };
                  setSyncConfig(updated);
                  localStore.saveSyncConfig(updated);
                }}
                placeholder="eyJhbGciOiJIUzI1NiIsInR..."
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleTestConnection}
              isLoading={isTesting}
              className={syncConfig.mode === 'SUPABASE' ? 'bg-amber-600 hover:bg-amber-700 font-bold' : 'bg-orange-600 hover:bg-orange-700 font-bold'}
            >
              Kiểm tra Kết nối {syncConfig.mode === 'SUPABASE' ? 'Supabase' : 'Firebase'}
            </Button>
          </div>
        </div>
      )}

      {/* Conflict Resolution Center (SYNC-007, SYNC-009) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Trung tâm Xử lý Xung đột Đồng bộ (Conflict Resolution Center)
            </h3>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateMockConflict}
            className="text-xs"
          >
            Mô phỏng phát sinh Xung đột
          </Button>
        </div>

        {conflicts.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl">
            Không có xung đột đồng bộ nào. Tất cả dữ liệu đa thiết bị đều nhất quán!
          </div>
        ) : (
          <div className="space-y-3">
            {conflicts.map(conf => (
              <div key={conf.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{conf.fieldName}</span>
                  <Badge variant={conf.resolvedStatus === 'UNRESOLVED' ? 'warning' : 'success'} size="sm">
                    {conf.resolvedStatus === 'UNRESOLVED' ? 'Cần giải quyết' : 'Đã giải quyết'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <p className="text-slate-400 font-bold mb-1">Giá trị Cục bộ (Thiết bị này):</p>
                    <p className="font-bold text-brand-700">{conf.localValue}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <p className="text-slate-400 font-bold mb-1">Giá trị Máy chủ (Server Canonical):</p>
                    <p className="font-bold text-emerald-700">{conf.serverValue}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <p className="text-slate-400 font-bold mb-1">Giá trị Gốc ban đầu (Base):</p>
                    <p className="text-slate-600">{conf.baseValue}</p>
                  </div>
                </div>

                {conf.resolvedStatus === 'UNRESOLVED' && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolveConflict(conf.id, 'RESOLVED_USE_LOCAL')}
                      className="text-xs bg-white"
                    >
                      Giữ giá trị cục bộ
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolveConflict(conf.id, 'RESOLVED_USE_SERVER')}
                      className="text-xs bg-white"
                    >
                      Dùng giá trị máy chủ
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Outbox Journal Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Nhật ký Hàng đợi Thay đổi Cục bộ (Outbox Journal: {outbox.length} thao tác chờ đẩy)
            </h3>
          </div>
        </div>

        {outbox.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-4">
            Hàng đợi Outbox trống. Không có thao tác ghi nào chưa được xử lý.
          </p>
        ) : (
          <div className="overflow-x-auto max-h-60 overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2">Mã Operation</th>
                  <th className="p-2">Đối tượng (Entity)</th>
                  <th className="p-2">Thao tác</th>
                  <th className="p-2">Thời điểm ghi</th>
                  <th className="p-2">Chi tiết thay đổi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {outbox.map(op => (
                  <tr key={op.operationId}>
                    <td className="p-2 font-bold text-brand-700">{op.operationId}</td>
                    <td className="p-2 text-slate-800">{op.entityType}</td>
                    <td className="p-2">
                      <Badge variant="info" size="sm">{op.operationType}</Badge>
                    </td>
                    <td className="p-2 text-slate-500">{formatDateTimeVN(op.clientCreatedAt)}</td>
                    <td className="p-2 text-slate-600 truncate max-w-xs">{JSON.stringify(op.fieldPatch)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isSshModalOpen}
        onClose={() => setIsSshModalOpen(false)}
        title="Triển khai Server Đồng bộ (SSH)"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Hệ thống sẽ tự động cấu hình Node.js, cài đặt thư viện và khởi chạy Server Đồng bộ bằng PM2 trên máy chủ Linux của bạn.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">IP Máy chủ *</label>
              <input type="text" value={sshConfig.ip} onChange={e => setSshConfig({...sshConfig, ip: e.target.value})} className="w-full px-3 py-2 text-xs border rounded-xl" placeholder="Ví dụ: 192.168.1.100" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Port</label>
              <input type="text" value={sshConfig.port} onChange={e => setSshConfig({...sshConfig, port: e.target.value})} className="w-full px-3 py-2 text-xs border rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Tài khoản (User) *</label>
              <input type="text" value={sshConfig.user} onChange={e => setSshConfig({...sshConfig, user: e.target.value})} className="w-full px-3 py-2 text-xs border rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Mật khẩu (hoặc để trống nếu dùng Key)</label>
              <input type="password" value={sshConfig.pass} onChange={e => setSshConfig({...sshConfig, pass: e.target.value})} className="w-full px-3 py-2 text-xs border rounded-xl" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Đường dẫn cài đặt (Path)</label>
            <input type="text" value={sshConfig.path} onChange={e => setSshConfig({...sshConfig, path: e.target.value})} className="w-full px-3 py-2 text-xs border rounded-xl" />
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" isLoading={isDeploying} onClick={handleDeploySSH}>
              Bắt đầu Triển khai
            </Button>
          </div>

          {sshLogs.length > 0 && (
            <div className="mt-4 p-3 bg-slate-900 text-green-400 font-mono text-[10px] rounded-xl overflow-y-auto max-h-40 whitespace-pre-wrap">
              {sshLogs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
