import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Download, RefreshCw } from 'lucide-react';

const CURRENT_VERSION = '1.1.0';
const GITHUB_REPO = 'dsnbw/quan-ly-chu-nhiem-2026';

export const Updater: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    setIsChecking(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
      if (!res.ok) throw new Error('Không thể kiểm tra bản cập nhật');
      const data = await res.json();
      
      const latestVersion = data.tag_name.replace('v', '');
      if (compareVersions(latestVersion, CURRENT_VERSION) > 0) {
        setUpdateAvailable(data);
      }
    } catch (e) {
      console.warn('Update check failed:', e);
    } finally {
      setIsChecking(false);
    }
  };

  // Trả về 1 nếu v1 > v2
  const compareVersions = (v1: string, v2: string) => {
    const p1 = v1.split('.').map(Number);
    const p2 = v2.split('.').map(Number);
    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
      const n1 = p1[i] || 0;
      const n2 = p2[i] || 0;
      if (n1 > n2) return 1;
      if (n1 < n2) return -1;
    }
    return 0;
  };

  if (!updateAvailable) return null;

  return (
    <Modal
      isOpen={true}
      onClose={() => setUpdateAvailable(null)}
      title="🚀 Có Phiên Bản Mới!"
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-700">
          Phiên bản <strong>{updateAvailable.tag_name}</strong> đã có sẵn (Bạn đang dùng v{CURRENT_VERSION}).
        </p>
        
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <h4 className="text-xs font-bold mb-2">Chi tiết bản cập nhật:</h4>
          <pre className="text-xs whitespace-pre-wrap font-sans text-slate-600">
            {updateAvailable.body || 'Không có mô tả chi tiết.'}
          </pre>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          {updateAvailable.assets?.map((asset: any) => (
            <a key={asset.id} href={asset.browser_download_url} target="_blank" rel="noreferrer" className="w-full">
              <Button variant="primary" className="w-full justify-center bg-brand-600 hover:bg-brand-700" icon={<Download className="w-4 h-4" />}>
                Tải xuống ({asset.name})
              </Button>
            </a>
          ))}
          <a href={updateAvailable.html_url} target="_blank" rel="noreferrer" className="w-full">
            <Button variant="outline" className="w-full justify-center text-xs">
              Xem trên GitHub
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  );
};
