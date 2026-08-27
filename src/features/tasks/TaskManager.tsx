import React, { useState } from 'react';
import {
  CheckSquare,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  Users
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { UnifiedTask, CalendarEvent } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDateVN } from '../../utils/formatters';

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<UnifiedTask[]>(localStore.getTasks());
  const [events, setEvents] = useState<CalendarEvent[]>(localStore.getCalendarEvents());
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState('2026-08-30');
  const [priority, setPriority] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [category, setCategory] = useState<UnifiedTask['category']>('HOMEROOM');

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          isCompleted: !t.isCompleted,
          completedAt: !t.isCompleted ? new Date().toISOString() : undefined
        };
      }
      return t;
    });
    setTasks(updated);
    const task = updated.find(t => t.id === id);
    if (task) localStore.saveTask(task);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newTask: UnifiedTask = {
      id: 'task-' + Math.random().toString(36).substring(2, 9),
      title,
      description: desc,
      assignedRole: 'HOMEROOM_TEACHER',
      assignedTeacherName: localStore.getUserSession().fullName,
      dueDate,
      priority,
      category,
      isCompleted: false
    };

    localStore.saveTask(newTask);
    setTasks(localStore.getTasks());
    setIsNewTaskModalOpen(false);
    setTitle('');
    setDesc('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-brand-600" />
            Nhiệm Vụ Chủ Nhiệm & Lịch Biểu Trường Học
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Hợp nhất nhắc việc, mốc khóa điểm, kế hoạch sinh hoạt và lịch họp phụ huynh
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsNewTaskModalOpen(true)}
          className="text-xs sm:text-sm font-bold shadow-xs"
        >
          Tạo Nhiệm vụ mới
        </Button>
      </div>

      {/* Main Grid: Tasks Queue & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Task List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-brand-600" />
                Danh sách Nhiệm vụ Cần xử lý ({tasks.filter(t => !t.isCompleted).length} việc chưa hoàn thành)
              </h3>
            </div>

            <div className="space-y-2.5">
              {tasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => handleToggleTask(t.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    t.isCompleted ? 'bg-slate-50/70 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-brand-300 shadow-xs'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={t.isCompleted}
                    onChange={() => handleToggleTask(t.id)}
                    className="mt-1 rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-bold text-sm ${t.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {t.title}
                      </p>
                      <Badge variant={t.priority === 'HIGH' || t.priority === 'URGENT' ? 'danger' : 'neutral'} size="sm">
                        {t.priority === 'HIGH' ? 'Gấp' : 'Bình thường'}
                      </Badge>
                    </div>
                    {t.description && (
                      <p className="text-xs text-slate-600">{t.description}</p>
                    )}
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Hạn chót: {formatDateVN(t.dueDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" /> {t.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Calendar Events */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <CalendarIcon className="w-4 h-4 text-emerald-600" />
              Sự kiện & Lịch Tuần
            </h3>

            <div className="space-y-3">
              {events.map(ev => (
                <div key={ev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{ev.title}</span>
                    <Badge variant="info" size="sm">{formatDateVN(ev.startDate)}</Badge>
                  </div>
                  {ev.timeString && (
                    <p className="text-[11px] text-emerald-700 font-semibold">{ev.timeString}</p>
                  )}
                  {ev.description && (
                    <p className="text-[11px] text-slate-600">{ev.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-brand-600" />
            <span>Thêm Nhiệm Vụ Chủ Nhiệm Mới</span>
          </div>
        }
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên nhiệm vụ *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="VD: Thu nhận phiếu đăng ký xe tuyến và bán trú..."
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hạn hoàn thành *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mức độ ưu tiên</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              >
                <option value="NORMAL">Bình thường</option>
                <option value="HIGH">Ưu tiên cao / Gấp</option>
                <option value="LOW">Không khẩn</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả chi tiết</label>
            <textarea
              rows={3}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Nhập ghi chú hoặc các bước cần thực hiện..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsNewTaskModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Lưu Nhiệm vụ
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
