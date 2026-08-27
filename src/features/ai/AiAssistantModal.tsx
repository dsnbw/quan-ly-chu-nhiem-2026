import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Send,
  Users,
  Settings
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { Student } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { AiHomeroomAssistant } from '../../core/ai/aiAssistant';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose
}) => {
  const students = localStore.getStudents();
  const [activeTab, setActiveTab] = useState<'comment' | 'agenda' | 'audit' | 'config'>('comment');

  // AI Config State
  const [aiConfig, setAiConfig] = useState<{ provider: string, apiKey: string, model: string }>(() => {
    try {
      return JSON.parse(localStorage.getItem('ai_config') || '{"provider":"gemini","apiKey":"","model":""}');
    } catch {
      return { provider: 'gemini', apiKey: '', model: '' };
    }
  });
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [configMessage, setConfigMessage] = useState('');

  // Save config
  useEffect(() => {
    localStorage.setItem('ai_config', JSON.stringify(aiConfig));
  }, [aiConfig]);

  // Comment Generator State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [generatedComment, setGeneratedComment] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Agenda Generator State
  const [agendaWeek, setAgendaWeek] = useState<number>(4);
  const [agendaMonth, setAgendaMonth] = useState<number>(9);
  const [generatedAgenda, setGeneratedAgenda] = useState<{ theme: string; agenda: string[]; suggestedActivities: string[] } | null>(null);

  // Data Completeness Audit State
  const [auditResult, setAuditResult] = useState<{ scorePercent: number; warnings: string[]; recommendations: string[] } | null>(null);

  const fetchModelsList = async () => {
    if (!aiConfig.apiKey) {
      setConfigMessage('Vui lòng nhập API Key trước');
      return;
    }
    setIsLoadingModels(true);
    setConfigMessage('');
    try {
      const models = await AiHomeroomAssistant.fetchModels(aiConfig.provider, aiConfig.apiKey);
      setAvailableModels(models);
      if (models.length > 0 && !models.includes(aiConfig.model)) {
        setAiConfig(prev => ({ ...prev, model: models[0] }));
      }
      setConfigMessage(`Lấy thành công ${models.length} models.`);
    } catch (err: any) {
      setConfigMessage(`Lỗi: ${err.message}`);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleGenerateComment = async () => {
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const grades = localStore.getGrades().filter(g => g.studentId === student.id);
    const obs = localStore.getBehaviorObservations().filter(b => b.studentId === student.id);
    const totalPoints = obs.reduce((s, o) => s + o.points, 0);

    // Fallback if no real AI configured
    if (!aiConfig.apiKey || !aiConfig.model) {
      const comment = AiHomeroomAssistant.generateStudentComment(student, grades, totalPoints);
      setGeneratedComment(comment + ' (Gợi ý tự động, vui lòng cấu hình AI để nhận xét sắc sảo hơn)');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Bạn là giáo viên chủ nhiệm đóng vai trò tư vấn. Hãy viết 1 đoạn nhận xét ngắn (3-5 câu) cho học sinh: ${student.fullName}. Điểm trung bình học tập khoảng ${grades.length > 0 ? 'tốt' : 'khá'}, điểm nề nếp thi đua là ${totalPoints}. Nhận xét mang tính khích lệ, cá nhân hóa và nêu phương hướng phấn đấu.`;
      let result = '';
      if (aiConfig.provider === 'gemini') {
        result = await AiHomeroomAssistant.callGemini(aiConfig.apiKey, aiConfig.model, prompt);
      } else {
        result = await AiHomeroomAssistant.callOpenAI(aiConfig.apiKey, aiConfig.model, prompt);
      }
      setGeneratedComment(result);
    } catch (error: any) {
      setGeneratedComment(`Lỗi gọi AI: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAgenda = async () => {
    if (!aiConfig.apiKey || !aiConfig.model) {
      const res = AiHomeroomAssistant.generateMeetingAgenda(agendaWeek, agendaMonth);
      setGeneratedAgenda(res);
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Bạn là một giáo viên chủ nhiệm xuất sắc. Lập chương trình sinh hoạt lớp tuần ${agendaWeek}, tháng ${agendaMonth}. Trả về ĐÚNG định dạng JSON như sau, không kèm bất kỳ giải thích hay định dạng markdown nào: {"theme": "Tên chủ đề ngắn gọn", "agenda": ["Mục 1", "Mục 2", "Mục 3"], "suggestedActivities": ["Trò chơi 1", "Chia sẻ 2"]}`;
      let result = '';
      if (aiConfig.provider === 'gemini') {
        result = await AiHomeroomAssistant.callGemini(aiConfig.apiKey, aiConfig.model, prompt);
      } else {
        result = await AiHomeroomAssistant.callOpenAI(aiConfig.apiKey, aiConfig.model, prompt);
      }
      
      const cleaned = result.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      
      setGeneratedAgenda({
        theme: parsed.theme || 'Sinh hoạt lớp',
        agenda: Array.isArray(parsed.agenda) ? parsed.agenda : [],
        suggestedActivities: Array.isArray(parsed.suggestedActivities) ? parsed.suggestedActivities : []
      });
    } catch (error: any) {
      setGeneratedAgenda({
        theme: 'Lỗi khi gọi AI',
        agenda: [error.message],
        suggestedActivities: ['Vui lòng kiểm tra lại cấu hình hoặc xem API có quá tải không.']
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunAudit = async () => {
    const grades = localStore.getGrades();
    const staticRes = AiHomeroomAssistant.auditDataCompleteness(students, grades, 10, 10);
    
    if (!aiConfig.apiKey || !aiConfig.model) {
      setAuditResult(staticRes);
      return;
    }
    
    setIsGenerating(true);
    try {
      const warningText = staticRes.warnings.length > 0 ? staticRes.warnings.join(' ') : 'Không có cảnh báo nào, dữ liệu rất tốt.';
      const prompt = `Phân tích dữ liệu sổ chủ nhiệm. Tỷ lệ hoàn thiện: ${staticRes.scorePercent}%. Các vấn đề: ${warningText}. Hãy đóng vai một chuyên gia giáo dục, đưa ra 3 khuyến nghị ngắn gọn (dưới dạng danh sách gạch đầu dòng, bắt đầu bằng dấu -) mang tính sư phạm để giáo viên chủ nhiệm xử lý tình trạng này và trao đổi khéo léo với phụ huynh nếu cần. Chỉ trả về các dòng khuyến nghị, không có lời dạo đầu.`;
      
      let result = '';
      if (aiConfig.provider === 'gemini') {
        result = await AiHomeroomAssistant.callGemini(aiConfig.apiKey, aiConfig.model, prompt);
      } else {
        result = await AiHomeroomAssistant.callOpenAI(aiConfig.apiKey, aiConfig.model, prompt);
      }
      
      const recommendations = result.split('\n').map(r => r.trim()).filter(r => r.length > 0).map(r => r.replace(/^[-*•]\s*/, '').trim());
      
      setAuditResult({
        ...staticRes,
        recommendations: recommendations.length > 0 ? recommendations : staticRes.recommendations
      });
    } catch (error: any) {
      setAuditResult({
        ...staticRes,
        recommendations: [error.message, ...staticRes.recommendations]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600 animate-spin-slow" />
          <span>Trợ lý AI Hỗ trợ Công tác Chủ nhiệm (AI Assistant)</span>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-4 text-xs sm:text-sm">
        {/* Policy Guard Banner */}
        <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 text-xs">
          <strong>Nguyên tắc An toàn AI (CORE-009 — Human in the loop):</strong> AI chỉ hỗ trợ soạn thảo văn bản mẫu và kiểm tra định lượng. Toàn bộ nội dung là <strong>bản nháp (Draft)</strong> và do Giáo viên chủ nhiệm toàn quyền rà soát, chỉnh sửa và quyết định.
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('comment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'comment' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Nhận xét Học sinh
          </button>
          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'agenda' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Nghị sự Sinh hoạt
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'audit' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Kiểm tra Dữ liệu
          </button>
          <div className="flex-1"></div>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'config' ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Cấu hình AI
          </button>
        </div>

        {/* Tab 4: Config */}
        {activeTab === 'config' && (
          <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <h3 className="font-bold text-slate-800 mb-2">Cấu hình Mô hình Ngôn ngữ Lớn (LLM)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nhà cung cấp (Provider)</label>
                <select
                  value={aiConfig.provider}
                  onChange={e => setAiConfig({ ...aiConfig, provider: e.target.value, model: '' })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold"
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openai">OpenAI (ChatGPT)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">API Key</label>
                <input
                  type="password"
                  value={aiConfig.apiKey}
                  onChange={e => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                  placeholder="Nhập API Key..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                />
              </div>
              <div className="sm:col-span-2 flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Model sử dụng</label>
                  <select
                    value={aiConfig.model}
                    onChange={e => setAiConfig({ ...aiConfig, model: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold"
                  >
                    {availableModels.length === 0 && <option value={aiConfig.model}>{aiConfig.model || 'Chưa tải model...'}</option>}
                    {availableModels.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchModelsList}
                  disabled={isLoadingModels}
                  className="h-[34px] font-bold"
                >
                  {isLoadingModels ? 'Đang tải...' : 'Tải danh sách Model'}
                </Button>
              </div>
            </div>
            {configMessage && (
              <p className="text-xs text-purple-600 font-bold mt-2">{configMessage}</p>
            )}
          </div>
        )}

        {/* Tab 1: Comment Generator */}
        {activeTab === 'comment' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.studentCode} - {s.fullName}</option>
                ))}
              </select>

              <Button
                variant="primary"
                size="sm"
                icon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={handleGenerateComment}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700 font-bold whitespace-nowrap"
              >
                {isGenerating ? 'Đang xử lý...' : 'Tạo Nhận xét Gợi ý'}
              </Button>
            </div>

            {generatedComment && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Lời nhận xét gợi ý từ AI:</span>
                  <button
                    onClick={() => handleCopy(generatedComment)}
                    className="flex items-center gap-1 text-xs text-purple-700 font-bold hover:underline"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-800 italic bg-white p-3 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap">
                  {generatedComment}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Meeting Agenda Planner */}
        {activeTab === 'agenda' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Tuần học</label>
                <input
                  type="number"
                  min={1}
                  max={35}
                  value={agendaWeek}
                  onChange={e => setAgendaWeek(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Tháng trong năm</label>
                <select
                  value={agendaMonth}
                  onChange={e => setAgendaMonth(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
                >
                  <option value={9}>Tháng 9 (Đầu năm học)</option>
                  <option value={10}>Tháng 10 (20/10)</option>
                  <option value={11}>Tháng 11 (20/11)</option>
                  <option value={12}>Tháng 12 (Cuối HK1)</option>
                </select>
              </div>
              <div className="flex items-end col-span-2 sm:col-span-1">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGenerateAgenda}
                  disabled={isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-700 font-bold"
                >
                  {isGenerating ? 'Đang lập...' : 'Lập Kế hoạch'}
                </Button>
              </div>
            </div>

            {generatedAgenda && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                <p className="font-bold text-purple-900 text-sm">Chủ đề: {generatedAgenda.theme}</p>
                <div className="space-y-1">
                  <p className="font-bold text-slate-700">Chương trình nghị sự đề xuất:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    {generatedAgenda.agenda.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
                <div className="space-y-1 pt-1">
                  <p className="font-bold text-slate-700">Hoạt động trải nghiệm gợi ý:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    {generatedAgenda.suggestedActivities.map((act, i) => <li key={i}>{act}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Completeness Audit */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <Button
              variant="primary"
              size="md"
              onClick={handleRunAudit}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 font-bold w-full"
            >
              {isGenerating ? 'Đang phân tích...' : 'Chạy Kiểm tra Toàn diện Dữ liệu Lớp 8A1'}
            </Button>

            {auditResult && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">Mức độ hoàn thiện dữ liệu:</span>
                  <Badge variant="success" size="md" className="font-bold text-sm">
                    {auditResult.scorePercent}%
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-slate-700">Khuyến nghị của Trợ lý AI:</p>
                  <ul className="list-disc list-inside text-emerald-800 font-medium">
                    {auditResult.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
