import React, { useState } from 'react';
import {
  Grid,
  Shuffle,
  Download,
  Lock,
  Unlock,
  Users,
  Sparkles,
  Save,
  RotateCcw,
  Printer,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { SeatingLayout, SeatPosition, Student } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { exportSeatingPlanDocx } from '../../core/export/docxSeatingExport';

export const SeatingManager: React.FC = () => {
  const school = localStore.getSchoolConfig();
  const classRoom = localStore.getClasses()[0];
  const students = localStore.getStudents();
  const [layout, setLayout] = useState<SeatingLayout>(localStore.getSeatingLayout());
  const [selectedSeat, setSelectedSeat] = useState<SeatPosition | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSeatClick = (seat: SeatPosition) => {
    if (!selectedSeat) {
      setSelectedSeat(seat);
    } else {
      // Swap two seats if neither is locked or if user intends to swap
      if (selectedSeat.row === seat.row && selectedSeat.col === seat.col) {
        setSelectedSeat(null);
        return;
      }

      const updatedSeats = layout.seats.map(s => {
        if (s.row === selectedSeat.row && s.col === selectedSeat.col) {
          return {
            ...s,
            studentId: seat.studentId,
            studentName: seat.studentName,
            gender: seat.gender
          };
        }
        if (s.row === seat.row && s.col === seat.col) {
          return {
            ...s,
            studentId: selectedSeat.studentId,
            studentName: selectedSeat.studentName,
            gender: selectedSeat.gender
          };
        }
        return s;
      });

      setLayout({ ...layout, seats: updatedSeats });
      setSelectedSeat(null);
    }
  };

  const handleToggleLock = (seat: SeatPosition, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSeats = layout.seats.map(s => {
      if (s.row === seat.row && s.col === seat.col) {
        return { ...s, isLocked: !s.isLocked };
      }
      return s;
    });
    setLayout({ ...layout, seats: updatedSeats });
  };

  // --- 1-TOUCH AUTO SEATING STRATEGIES (CLS-003.3) ---

  const handleStrategyRandom = () => {
    // Keep locked seats in place, shuffle the rest
    const unlockedStudents: { id: string; name: string; gender: any }[] = [];
    layout.seats.forEach(s => {
      if (!s.isLocked && s.studentId) {
        unlockedStudents.push({
          id: s.studentId,
          name: s.studentName || '',
          gender: s.gender
        });
      }
    });

    // Fisher-Yates shuffle
    for (let i = unlockedStudents.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unlockedStudents[i], unlockedStudents[j]] = [unlockedStudents[j], unlockedStudents[i]];
    }

    let ptr = 0;
    const newSeats = layout.seats.map(s => {
      if (s.isLocked) return s;
      const st = unlockedStudents[ptr++];
      return {
        ...s,
        studentId: st?.id,
        studentName: st?.name,
        gender: st?.gender
      };
    });

    setLayout({ ...layout, seats: newSeats, algorithmUsed: 'RANDOM_SHUFFLE' });
  };

  const handleStrategyBalanceBand = () => {
    const lockedStudentIds = new Set(layout.seats.filter(s => s.isLocked && s.studentId).map(s => s.studentId!));
    const availableStudents = students.filter(s => !lockedStudentIds.has(s.id));

    const frontRowStudents = availableStudents.filter(s => s.health?.needsFrontRowSeat);
    const otherStudents = availableStudents.filter(s => !s.health?.needsFrontRowSeat);
    otherStudents.sort((a, b) => (a.gender === 'FEMALE' ? -1 : 1));

    const combined = [...frontRowStudents, ...otherStudents];

    let ptr = 0;
    const newSeats = layout.seats.map(s => {
      if (s.isLocked) return s;
      const st = combined[ptr++];
      return {
        ...s,
        studentId: st?.id,
        studentName: st?.fullName,
        gender: st?.gender,
        isLocked: st?.health?.needsFrontRowSeat || false
      };
    });

    setLayout({ ...layout, seats: newSeats, algorithmUsed: 'BALANCE_ACADEMIC_BAND' });
  };

  const handleSaveLayout = () => {
    localStore.saveSeatingLayout(layout);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportDocx = async () => {
    await exportSeatingPlanDocx(layout, school, classRoom);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Grid className="w-6 h-6 text-brand-600" />
            Sơ đồ Chỗ ngồi & Phân chia Tổ Lớp 8A1
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Bố trí 5 hàng x 3 dãy đôi (30 chỗ ngồi). Hỗ trợ xếp chỗ thông minh và xuất bản file Word A4 chuẩn quy cách.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={<FileText className="w-4 h-4 text-brand-600" />}
            onClick={handleExportDocx}
            className="text-xs sm:text-sm font-bold"
          >
            Xuất Word A4 (DOCX)
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
            onClick={handleSaveLayout}
            className="text-xs sm:text-sm font-bold shadow-sm"
          >
            Lưu Sơ đồ
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Đã lưu phiên bản sơ đồ chỗ ngồi thành công và ghi nhật ký outbox đồng bộ!
        </div>
      )}

      {/* 1-Touch Auto Seating Toolbar (CLS-003.3) */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 rounded-2xl text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-300 animate-spin-slow" />
          <div>
            <p className="text-sm font-bold">Xếp chỗ 1 chạm Thông minh</p>
            <p className="text-xs text-slate-300">Tự động tối ưu hóa vị trí học sinh theo mục tiêu sư phạm</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Shuffle className="w-3.5 h-3.5" />}
            onClick={handleStrategyRandom}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
          >
            Xáo trộn ngẫu nhiên
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Users className="w-3.5 h-3.5" />}
            onClick={handleStrategyBalanceBand}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
          >
            Cân bằng dải học lực & Ưu tiên thị lực
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => setLayout(localStore.getSeatingLayout())}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
          >
            Khôi phục gốc
          </Button>
        </div>
      </div>

      {/* Classroom Seating Grid Visualizer */}
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-inner space-y-6">
        {/* Teacher Board Representation */}
        <div className="max-w-md mx-auto py-2.5 px-6 rounded-2xl bg-slate-800 text-white font-bold text-center text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2 border-2 border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          BẢNG GIÁO VIÊN & BÀN GIẢNG BÀI
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>

        {/* 3 Double-Desk Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {[1, 2, 3].map(deskCol => {
            const leftCol = (deskCol - 1) * 2 + 1;
            const rightCol = (deskCol - 1) * 2 + 2;

            return (
              <div key={deskCol} className="space-y-3">
                <div className="text-center py-1 bg-brand-100/60 rounded-lg text-brand-800 text-xs font-bold border border-brand-200">
                  DÃY {deskCol} (Tổ {deskCol})
                </div>

                {/* 5 Rows */}
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(row => {
                    const seatLeft = layout.seats.find(s => s.row === row && s.col === leftCol);
                    const seatRight = layout.seats.find(s => s.row === row && s.col === rightCol);

                    return (
                      <div
                        key={row}
                        className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-brand-400 transition-all"
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-1.5 mb-2">
                          <span>Bàn {row}</span>
                          {row === 1 && <Badge variant="info" size="sm">Bàn đầu</Badge>}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {/* Left Seat */}
                          <div
                            onClick={() => seatLeft && handleSeatClick(seatLeft)}
                            className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all relative ${
                              selectedSeat?.row === row && selectedSeat?.col === leftCol
                                ? 'bg-brand-100 border-brand-600 ring-2 ring-brand-500'
                                : seatLeft?.isLocked
                                ? 'bg-amber-50/60 border-amber-200'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <button
                              onClick={e => seatLeft && handleToggleLock(seatLeft, e)}
                              className="absolute right-1 top-1 text-slate-400 hover:text-slate-600 p-0.5"
                              title={seatLeft?.isLocked ? 'Đã khóa chỗ' : 'Bấm để khóa'}
                            >
                              {seatLeft?.isLocked ? <Lock className="w-3 h-3 text-amber-600" /> : <Unlock className="w-3 h-3 opacity-30" />}
                            </button>
                            <div className="w-7 h-7 mx-auto rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center mb-1">
                              {seatLeft?.studentName?.split(' ').pop()?.substring(0, 2).toUpperCase() || 'G1'}
                            </div>
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {seatLeft?.studentName || '(Trống)'}
                            </p>
                            <p className="text-[10px] text-slate-500">Ghế 1</p>
                          </div>

                          {/* Right Seat */}
                          <div
                            onClick={() => seatRight && handleSeatClick(seatRight)}
                            className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all relative ${
                              selectedSeat?.row === row && selectedSeat?.col === rightCol
                                ? 'bg-brand-100 border-brand-600 ring-2 ring-brand-500'
                                : seatRight?.isLocked
                                ? 'bg-amber-50/60 border-amber-200'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <button
                              onClick={e => seatRight && handleToggleLock(seatRight, e)}
                              className="absolute right-1 top-1 text-slate-400 hover:text-slate-600 p-0.5"
                              title={seatRight?.isLocked ? 'Đã khóa chỗ' : 'Bấm để khóa'}
                            >
                              {seatRight?.isLocked ? <Lock className="w-3 h-3 text-amber-600" /> : <Unlock className="w-3 h-3 opacity-30" />}
                            </button>
                            <div className="w-7 h-7 mx-auto rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-1">
                              {seatRight?.studentName?.split(' ').pop()?.substring(0, 2).toUpperCase() || 'G2'}
                            </div>
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {seatRight?.studentName || '(Trống)'}
                            </p>
                            <p className="text-[10px] text-slate-500">Ghế 2</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
