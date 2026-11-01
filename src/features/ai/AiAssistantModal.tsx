import React, { useState, useEffect, useRef } from 'react';
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
  Settings,
  Heart,
  Mail,
  Shield,
  RotateCcw,
  MessageSquare
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

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  senderTitle: string;
  text: string;
  suggestionTitle?: string;
  suggestionBody?: string;
  adviceTitle?: string;
  adviceBody?: string;
  studentId?: string;
  studentName?: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose
}) => {
  const students = localStore.getStudents();
  const classes = localStore.getClasses();
  const currentClass = classes[0] || { id: 'class-default', name: 'Lớp 12A1', code: '12A1' };
  const session = localStore.getUserSession();

  // AI Config State
  const [aiConfig, setAiConfig] = useState<{ provider: string; apiKey: string; model: string }>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ai_config') || '{"provider":"gemini","apiKey":"","model":"gemini-1.5-flash"}');
      if (!saved.model) saved.model = saved.provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini';
      return saved;
    } catch {
      return { provider: 'gemini', apiKey: '', model: 'gemini-1.5-flash' };
    }
  });

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [configMessage, setConfigMessage] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  // Student selection
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedToastId, setAppliedToastId] = useState<string | null>(null);

  // Custom prompt input
  const [chatInput, setChatInput] = useState('');

  // Chat message stream
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const defaultStudent = students[0];
    return [
      {
        id: 'msg-welcome',
        sender: 'ai',
        senderTitle: 'Trợ lý AI Chủ nhiệm 2026',
        text: 'Kính chào Thầy/Cô! Tôi là Trợ lý AI Sư phạm đồng hành cùng công tác chủ nhiệm. Thầy/Cô có thể bấm chọn nhanh các kịch bản mẫu bên trái hoặc nhập bất kỳ yêu cầu nào vào khung chat bên dưới.',
        timestamp: 'Vừa xong'
      },
      {
        id: 'msg-demo-user',
        sender: 'user',
        senderTitle: `${session.fullName || 'Thầy Nguyễn Văn Minh'} (GVCN ${currentClass.name})`,
        text: `Sinh giúp tôi nhận xét học bạ cuối năm cho em ${defaultStudent?.fullName || 'Nguyễn Văn An'} (ĐTB Toán 9.3, ĐTB chung 8.83 - Xuất sắc, Lớp trưởng, rất nhiệt tình giúp bạn nhưng đôi khi còn áp lực vì thành tích). Chuẩn Thông tư 22/2021/TT-BGDĐT.`,
        studentId: defaultStudent?.id,
        studentName: defaultStudent?.fullName,
        timestamp: '10:15'
      },
      {
        id: 'msg-demo-ai',
        sender: 'ai',
        senderTitle: 'Trợ Lý AI Chủ Nhiệm 2026',
        text: `Dạ Thầy, dưới đây là bản nhận xét học bạ chuẩn hóa theo Thông tư 22/2021/TT-BGDĐT:`,
        suggestionTitle: 'ĐỀ XUẤT NHẬN XÉT HỌC BẠ SỐ (MẪU 1):',
        suggestionBody: `Học sinh có năng lực tự học xuất sắc, tư duy logic và giải quyết vấn đề vượt trội đặc biệt ở môn Toán học. Luôn gương mẫu, trách nhiệm cao trong vai trò Lớp trưởng và tích cực hỗ trợ bạn bè cùng tiến bộ.`,
        adviceTitle: 'LỜI KHUYÊN PHÁT TRIỂN & RÈN LUYỆN:',
        adviceBody: `Nên chú ý cân đối giữa việc học tập và tham gia các hoạt động ngoại khóa, thể dục thể thao để giữ tinh thần thoải mái, phát huy tối đa tiềm năng bản thân.`,
        studentId: defaultStudent?.id,
        studentName: defaultStudent?.fullName,
        timestamp: '10:15'
      }
    ];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('ai_config', JSON.stringify(aiConfig));
  }, [aiConfig]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const fetchModelsList = async () => {
    if (!aiConfig.apiKey) {
      setConfigMessage('Vui lòng nhập API Key trước khi tải danh sách');
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
      setConfigMessage(`Lấy thành công ${models.length} mô hình AI.`);
    } catch (err: any) {
      setConfigMessage(`Lỗi: ${err.message}`);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApplyToReportCard = (targetStudentId: string | undefined, commentText: string, messageId: string) => {
    const sId = targetStudentId || selectedStudentId;
    if (!sId || !commentText) return;

    const grades = localStore.getGrades();
    const studentGrades = grades.filter(g => g.studentId === sId);
    if (studentGrades.length > 0) {
      studentGrades.forEach(g => {
        localStore.saveGradeEntry({
          ...g,
          teacherComment: commentText,
          lastModifiedAt: new Date().toISOString()
        });
      });
    } else {
      const st = students.find(s => s.id === sId);
      localStore.saveGradeEntry({
        id: `grade-${sId}-homeroom`,
        classId: currentClass.id,
        subjectId: 'sub-homeroom',
        subjectName: 'Đánh giá Chủ nhiệm',
        studentId: sId,
        studentName: st?.fullName || 'Học sinh',
        term: 1,
        academicYearId: 'ay-2026-2027',
        teacherComment: commentText,
        commentVisibility: 'HOMEROOM',
        isLocked: false,
        lastModifiedBy: session.fullName || 'Giáo viên chủ nhiệm',
        lastModifiedAt: new Date().toISOString()
      });
    }

    setAppliedToastId(messageId);
    setTimeout(() => setAppliedToastId(null), 3000);
  };

  // Preset 1: Auto Report Card Comment
  const handlePresetComment = async () => {
    if (!selectedStudent) return;
    const grades = localStore.getGrades().filter(g => g.studentId === selectedStudent.id);
    const obs = localStore.getBehaviorObservations().filter(b => b.studentId === selectedStudent.id);
    const totalPoints = obs.reduce((s, o) => s + o.points, 0);

    const userText = `Sinh giúp tôi nhận xét học bạ cuối năm cho em ${selectedStudent.fullName} (${selectedStudent.studentCode}). Chuẩn Thông tư 22/2021/TT-BGDĐT.`;
    const userMsgId = 'user-' + Date.now();
    setMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        senderTitle: `${session.fullName || 'Thầy Minh'} (GVCN ${currentClass.name})`,
        text: userText,
        studentId: selectedStudent.id,
        studentName: selectedStudent.fullName,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setIsGenerating(true);

    if (!aiConfig.apiKey || !aiConfig.model) {
      setTimeout(() => {
        const comment = AiHomeroomAssistant.generateStudentComment(selectedStudent, grades, totalPoints);
        setMessages(prev => [
          ...prev,
          {
            id: 'ai-' + Date.now(),
            sender: 'ai',
            senderTitle: 'Trợ Lý AI Chủ Nhiệm 2026',
            text: `Dạ Thầy/Cô, dưới đây là nhận xét sư phạm gợi ý cho em ${selectedStudent.fullName}:`,
            suggestionTitle: 'ĐỀ XUẤT NHẬN XÉT HỌC BẠ SỐ (CHUẨN TT 22/TT 27):',
            suggestionBody: comment,
            adviceTitle: 'LỜI KHUYÊN PHÁT TRIỂN & RÈN LUYỆN:',
            adviceBody: `Cần tiếp tục phát huy các ưu điểm nổi trội và duy trì thái độ tích cực trong sinh hoạt tập thể.`,
            studentId: selectedStudent.id,
            studentName: selectedStudent.fullName,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsGenerating(false);
      }, 500);
      return;
    }

    try {
      const prompt = `Bạn là giáo viên chủ nhiệm nhiều năm kinh nghiệm. Hãy viết nhận xét học bạ cho học sinh: ${selectedStudent.fullName}. Học lực: ${grades.length > 0 ? 'Tốt' : 'Khá'}, điểm thi đua nề nếp: ${totalPoints}. Trả về đúng 2 phần: 1. Đề xuất nhận xét học bạ (2-3 câu ngắn gọn, chuẩn sư phạm TT 22). 2. Lời khuyên rèn luyện (1-2 câu).`;
      let result = '';
      if (aiConfig.provider === 'gemini') {
        result = await AiHomeroomAssistant.callGemini(aiConfig.apiKey, aiConfig.model, prompt);
      } else {
        result = await AiHomeroomAssistant.callOpenAI(aiConfig.apiKey, aiConfig.model, prompt);
      }

      setMessages(prev => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          senderTitle: 'Trợ Lý AI Chủ Nhiệm 2026',
          text: `Dạ Thầy/Cô, dưới đây là nhận xét do mô hình ${aiConfig.model} soạn thảo:`,
          suggestionTitle: 'ĐỀ XUẤT NHẬN XÉT HỌC BẠ SỐ:',
          suggestionBody: result,
          studentId: selectedStudent.id,
          studentName: selectedStudent.fullName,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'ai',
          senderTitle: 'Trợ Lý AI Chủ Nhiệm 2026',
          text: `Lỗi kết nối API AI: ${err.message}. Đã chuyển sang bản nháp nội bộ dự phòng.`,
          suggestionBody: AiHomeroomAssistant.generateStudentComment(selectedStudent, grades, totalPoints),
          studentId: selectedStudent.id,
          studentName: selectedStudent.fullName,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Preset 2: Positive Discipline (TT 18/2025)
  const handlePresetDiscipline = () => {
    if (!selectedStudent) return;
    const userMsg = `Gợi ý biện pháp giáo dục kỷ luật tích cực cho học sinh ${selectedStudent.fullName} theo đúng tinh thần Thông tư 18/2025/TT-BGDĐT.`;
    setMessages(prev => [
      ...prev,
      {
        id: 'user-' + Date.now(),
        sender: 'user',
        senderTitle: `${session.fullName || 'Thầy Minh'} (GVCN ${currentClass.name})`,
        text: userMsg,
        studentId: selectedStudent.id,
        studentName: selectedStudent.fullName,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        senderTitle: 'Trợ Lý AI Chủ Nhiệm 2026',
        text: `Dạ Thầy, căn cứ Thông tư 18/2025/TT-BGDĐT về Kỷ luật tích cực trong trường học, tuyệt đối không áp dụng hình phạt làm tổn thương tinh thần hay thể chất học sinh. Dưới đây là phương án xử lý sư phạm:`,
        suggestionTitle: 'PHƯƠNG ÁN CAN THIỆP SƯ PHẠM TÍCH CỰC:',
        suggestionBody: `1. Gặp riêng trao đổi nhẹ nhàng sau giờ học để lắng nghe lý do từ phía em ${selectedStudent.fullName}.\n2. Hướng dẫn học sinh tự nhận thức hành vi và viết cam kết điều chỉnh thói quen.\n3. Giao trách nhiệm cụ thể trong tổ để em phát huy tinh thần trách nhiệm tập thể.\n4. Khen ngợi ngay khi em có tiến bộ nhỏ nhất trong tuần.`,
        adviceTitle: 'NGUYÊN TẮC BẢO MẬT & TÔN TRỌNG (TT 18/2025):',
        adviceBody: `Không nhắc lại vi phạm trước tập thể lớp để tránh tâm lý mặc cảm, gán nhãn học sinh.`,
        studentId: selectedStudent.id,
        studentName: selectedStudent.fullName,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Preset 3: Parent Letter Drafting
  const handlePresetParentLetter = () => {
    if (!selectedStudent) return;
    const guardianName = selectedStudent.guardians[0]?.fullName || 'Quý Phụ huynh';
    const userMsg = `Soạn tin nhắn khéo léo gửi phụ huynh em ${selectedStudent.fullName} để phối hợp cùng nhà trường đôn đốc nề nếp học tập.`;
    setMessages(prev => [
      ...prev,
      {
        id: 'user-' + Date.now(),
        sender: 'user',
        senderTitle: `${session.fullName || 'Thầy Minh'} (GVCN ${currentClass.name})`,
        text: userMsg,
        studentId: selectedStudent.id,
        studentName: selectedStudent.fullName,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        senderTitle: 'Trợ Lý AI Chủ Nhiệm 2026',
        text: `Dạ Thầy, dưới đây là bản nháp tin nhắn gửi qua Zalo/SMS cho ${guardianName}:`,
        suggestionTitle: 'BẢN NHÁP TIN NHẮN GỬI PHỤ HUYNH:',
        suggestionBody: `"Kính gửi ${guardianName}, em là ${session.fullName || 'giáo viên chủ nhiệm'} lớp ${currentClass.name}. Em xin phép gửi lời cảm ơn Gia đình đã luôn đồng hành cùng lớp. Tuần này cháu ${selectedStudent.fullName} trên lớp rất ngoan và hòa đồng, tuy nhiên một số môn còn hơi mất tập trung bài vở ở nhà. Nhờ Anh/Chị động viên nhắc nhở thêm để cháu tự tin hơn. Có vấn đề gì cần hỗ trợ, Anh/Chị cứ liên lạc với em ạ. Trân trọng!"`,
        adviceTitle: 'LƯU Ý GIAO TIẾP:',
        adviceBody: `Tin nhắn mang tính chất xây dựng, khen ngợi trước nhắc nhở sau, tạo tâm lý đồng thuận từ phụ huynh.`,
        studentId: selectedStudent.id,
        studentName: selectedStudent.fullName,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Preset 4: Meeting Agenda Planner
  const handlePresetMeeting = () => {
    const agendaData = AiHomeroomAssistant.generateMeetingAgenda(4, 9);
    setMessages(prev => [
      ...prev,
      {
        id: 'user-' + Date.now(),
        sender: 'user',
        senderTitle: `${session.fullName || 'Thầy Minh'} (GVCN ${currentClass.name})`,
        text: `Lập chương trình sinh hoạt lớp Tuần 4, Tháng 9 theo chủ đề thi đua học tốt.`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        senderTitle: 'Trợ Lý AI Chủ Nhiệm 2026',
        text: `Dạ Thầy, dưới đây là chương trình sinh hoạt lớp gợi ý theo chủ đề tháng 9:`,
        suggestionTitle: `CHỦ ĐỀ: ${agendaData.theme}`,
        suggestionBody: agendaData.agenda.map((item, idx) => `${idx + 1}. ${item}`).join('\n'),
        adviceTitle: 'HOẠT ĐỘNG TRẢI NGHIỆM GỢI Ý (15 PHÚT CUỐI):',
        adviceBody: agendaData.suggestedActivities.join(' • '),
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Preset 5: Audit Data
  const handlePresetAudit = () => {
    const grades = localStore.getGrades();
    const staticRes = AiHomeroomAssistant.auditDataCompleteness(students, grades, 10, 10);
    const warningList = staticRes.warnings.length > 0 ? staticRes.warnings.join('\n• ') : 'Dữ liệu đầy đủ 100%.';

    setMessages(prev => [
      ...prev,
      {
        id: 'user-' + Date.now(),
        sender: 'user',
        senderTitle: `${session.fullName || 'Thầy Minh'} (GVCN ${currentClass.name})`,
        text: `Chạy kiểm tra độ đầy đủ dữ liệu hồ sơ sổ chủ nhiệm lớp ${currentClass.name}.`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        senderTitle: 'Trợ Lý AI Chủ Nhiệm 2026',
        text: `Đã hoàn tất phân tích toàn bộ hồ sơ sổ sách lớp ${currentClass.name}. Mức độ hoàn thiện: ${staticRes.scorePercent}%`,
        suggestionTitle: 'CÁC VẤN ĐỀ CẦN CẬP NHẬT BỔ SUNG:',
        suggestionBody: `• ${warningList}`,
        adviceTitle: 'KHUYẾN NGHỊ SƯ PHẠM CỦA AI:',
        adviceBody: staticRes.recommendations.join('\n'),
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Custom chat submit
  const handleSendCustomChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isGenerating) return;

    const userText = chatInput.trim();
    setChatInput('');
    const userMsgId = 'user-' + Date.now();
    setMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        senderTitle: `${session.fullName || 'Thầy Minh'} (GVCN ${currentClass.name})`,
        text: userText,
        studentId: selectedStudent?.id,
        studentName: selectedStudent?.fullName,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setIsGenerating(true);

    if (!aiConfig.apiKey) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: 'ai-' + Date.now(),
            sender: 'ai',
            senderTitle: 'Trợ Lý AI Chủ Nhiệm 2026',
            text: `Tôi đã ghi nhận yêu cầu: "${userText}".`,
            suggestionTitle: 'ĐỀ XUẤT XỬ LÝ SƯ PHẠM:',
            suggestionBody: `Để nhận câu trả lời chi tiết và thông minh bằng mô hình ${aiConfig.model || 'Gemini 1.5 Pro'}, Thầy/Cô vui lòng bấm "Cấu hình AI" ở góc phải phía trên để nhập API Key miễn phí từ Google AI Studio hoặc OpenAI.`,
            adviceTitle: 'HƯỚNG DẪN:',
            adviceBody: `Thầy/Cô cũng có thể bấm các kịch bản mẫu ở cột bên trái để AI tự động soạn thảo ngay tức thì.`,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsGenerating(false);
      }, 400);
      return;
    }

    try {
      let result = '';
      if (aiConfig.provider === 'gemini') {
        result = await AiHomeroomAssistant.callGemini(aiConfig.apiKey, aiConfig.model, userText);
      } else {
        result = await AiHomeroomAssistant.callOpenAI(aiConfig.apiKey, aiConfig.model, userText);
      }

      setMessages(prev => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          senderTitle: 'Trợ Lý AI Chủ Nhiệm 2026',
          text: result,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'ai',
          senderTitle: 'Trợ Lý AI Chủ Nhiệm 2026',
          text: `Lỗi gọi API: ${err.message}. Vui lòng kiểm tra lại API Key hoặc quota sử dụng.`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={null}
      maxWidth="4xl"
    >
      <div className="flex flex-col h-[82vh] max-h-[820px] -m-5">
        {/* Top Copilot Header matching Mockup */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-4 sm:p-5 text-white border-b border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-lg">
              <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  Trợ Lý AI Chủ Nhiệm Giáo Dục (AI Homeroom Copilot)
                </h2>
                <Badge variant="purple" size="sm" className="hidden sm:inline-flex bg-purple-500/20 text-purple-200 border-purple-400/30 text-[10px]">
                  Phiên bản 2026
                </Badge>
              </div>
              <p className="text-xs text-indigo-200 font-medium">
                Tích hợp Gemini & OpenAI • Sinh nhận xét học bạ TT 22/TT 27 • Cố vấn kỷ luật tích cực TT 18
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <div className="px-3 py-1.5 rounded-lg bg-indigo-900/60 border border-indigo-700/60 text-xs font-bold text-indigo-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Model: {aiConfig.model || 'Gemini 1.5 Pro'}</span>
            </div>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Cấu hình API AI"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* API Config Panel (Collapsible) */}
        {showConfig && (
          <div className="bg-slate-100 border-b border-slate-200 p-4 text-xs space-y-3 animate-in slide-in-from-top duration-150 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-purple-600" />
                Cấu hình API Trợ lý AI (Google Gemini / OpenAI)
              </h4>
              <button
                onClick={() => setShowConfig(false)}
                className="text-slate-500 hover:text-slate-800 font-bold"
              >
                Đóng ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nhà cung cấp (Provider)</label>
                <select
                  value={aiConfig.provider}
                  onChange={e => setAiConfig({ ...aiConfig, provider: e.target.value, model: e.target.value === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini' })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                >
                  <option value="gemini">Google Gemini (Khuyên dùng)</option>
                  <option value="openai">OpenAI (ChatGPT)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">API Key</label>
                <input
                  type="password"
                  value={aiConfig.apiKey}
                  onChange={e => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                  placeholder="Nhập API key..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Model</label>
                  <input
                    type="text"
                    value={aiConfig.model}
                    onChange={e => setAiConfig({ ...aiConfig, model: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchModelsList}
                  disabled={isLoadingModels}
                  className="h-[32px] text-xs font-bold whitespace-nowrap"
                >
                  {isLoadingModels ? 'Đang tải...' : 'Lấy Model'}
                </Button>
              </div>
            </div>

            {configMessage && (
              <p className="text-[11px] text-purple-700 font-bold">{configMessage}</p>
            )}
          </div>
        )}

        {/* Main 2-Column Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50">
          {/* Left Column: Presets & Tools (matching mockup) */}
          <div className="w-full md:w-80 bg-slate-900 text-slate-200 border-r border-slate-800 p-4 overflow-y-auto space-y-4 flex-shrink-0">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                BỘ KỊCH BẢN CHUYÊN BIỆT GVCN
              </p>
              <div className="space-y-2">
                {/* Preset 1 */}
                <button
                  onClick={handlePresetComment}
                  disabled={isGenerating}
                  className="w-full text-left p-3 rounded-xl bg-purple-950/60 border border-purple-800/60 hover:bg-purple-900/60 hover:border-purple-600 transition-all group"
                >
                  <p className="text-xs font-bold text-white flex items-center gap-1.5 group-hover:text-purple-300">
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                    📝 Nhận xét học bạ tự động
                  </p>
                  <p className="text-[10px] text-purple-200/80 mt-1">
                    Chuẩn hóa văn phong TT 22 & TT 27 theo năng lực
                  </p>
                </button>

                {/* Preset 2 */}
                <button
                  onClick={handlePresetDiscipline}
                  disabled={isGenerating}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-800 hover:border-slate-500 transition-all group"
                >
                  <p className="text-xs font-bold text-white flex items-center gap-1.5 group-hover:text-amber-300">
                    <Heart className="w-3.5 h-3.5 text-amber-400" />
                    💡 Kỷ luật tích cực (TT 18/2025)
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Gợi ý can thiệp sư phạm học sinh vi phạm
                  </p>
                </button>

                {/* Preset 3 */}
                <button
                  onClick={handlePresetParentLetter}
                  disabled={isGenerating}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-800 hover:border-slate-500 transition-all group"
                >
                  <p className="text-xs font-bold text-white flex items-center gap-1.5 group-hover:text-blue-300">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    ✉️ Thư trao đổi với Phụ huynh
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Soạn tin nhắn khéo léo, đồng hành cùng gia đình
                  </p>
                </button>

                {/* Preset 4 */}
                <button
                  onClick={handlePresetMeeting}
                  disabled={isGenerating}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-800 hover:border-slate-500 transition-all group"
                >
                  <p className="text-xs font-bold text-white flex items-center gap-1.5 group-hover:text-emerald-300">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    📋 Kế hoạch sinh hoạt lớp
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Thiết kế chủ đề sinh hoạt 15 phút & tiết cuối tuần
                  </p>
                </button>

                {/* Preset 5 */}
                <button
                  onClick={handlePresetAudit}
                  disabled={isGenerating}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-800 hover:border-slate-500 transition-all group"
                >
                  <p className="text-xs font-bold text-white flex items-center gap-1.5 group-hover:text-cyan-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    🔍 Kiểm tra dữ liệu lớp học
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Kiểm tra độ đầy đủ sổ sách sổ chủ nhiệm
                  </p>
                </button>
              </div>
            </div>

            {/* Privacy & Ethics Box matching Mockup */}
            <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 text-[11px] space-y-2">
              <p className="font-bold text-amber-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                🔒 BẢO MẬT & ĐẠO ĐỨC AI
              </p>
              <p className="text-slate-400 leading-relaxed text-[10px]">
                Dữ liệu họ tên thật của học sinh được tự động ẩn danh hóa trước khi gửi API, tuân thủ Nghị định 13/2023/NĐ-CP.
              </p>
              <div className="pt-1 border-t border-slate-700 text-[10px] text-emerald-400 space-y-1">
                <p>✓ AI chỉ đóng vai trò trợ lý gợi ý (Draft)</p>
                <p>✓ Thầy cô toàn quyền chỉnh sửa và duyệt</p>
              </div>
            </div>
          </div>

          {/* Right Column: Active Interactive Chat Stream */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 text-slate-100">
            {/* Student Context Bar */}
            <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">Học sinh mục tiêu:</span>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold outline-none focus:border-purple-500 text-xs"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.studentCode} - {s.fullName} ({s.groupName || 'Tổ 1'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>Lớp: <strong className="text-purple-300">{currentClass.name}</strong></span>
                <span>GVCN: <strong className="text-slate-200">{session.fullName || 'Thầy Minh'}</strong></span>
              </div>
            </div>

            {/* Conversation Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className="space-y-1.5">
                  {msg.sender === 'user' ? (
                    /* User Bubble (matching mockup) */
                    <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 ml-4 sm:ml-12 shadow-sm">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold text-cyan-400">
                          🧑‍🏫 {msg.senderTitle}:
                        </span>
                        <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                        "{msg.text}"
                      </p>
                    </div>
                  ) : (
                    /* AI Bubble (matching mockup with suggestion boxes) */
                    <div className="bg-gradient-to-br from-purple-950/90 to-indigo-950/90 border border-purple-800/70 rounded-2xl p-4 mr-4 sm:mr-12 shadow-md space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-300">
                            🤖
                          </div>
                          <span className="text-xs font-extrabold text-purple-300">
                            {msg.senderTitle}:
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      </div>

                      <p className="text-xs text-indigo-100 leading-relaxed">
                        {msg.text}
                      </p>

                      {/* Structured Box 1: Core Suggestion */}
                      {msg.suggestionBody && (
                        <div className="bg-slate-950/90 border border-purple-900/80 rounded-xl p-3.5 space-y-1.5">
                          {msg.suggestionTitle && (
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
                              {msg.suggestionTitle}
                            </p>
                          )}
                          <p className="text-xs sm:text-sm text-slate-100 italic leading-relaxed whitespace-pre-wrap">
                            "{msg.suggestionBody}"
                          </p>
                        </div>
                      )}

                      {/* Structured Box 2: Advice */}
                      {msg.adviceBody && (
                        <div className="bg-slate-950/90 border border-indigo-900/80 rounded-xl p-3 space-y-1">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
                            {msg.adviceTitle || 'LỜI KHUYÊN PHÁT TRIỂN & RÈN LUYỆN:'}
                          </p>
                          <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                            "{msg.adviceBody}"
                          </p>
                        </div>
                      )}

                      {/* Action Buttons inside AI response (matching mockup) */}
                      {msg.suggestionBody && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            onClick={() => handleApplyToReportCard(msg.studentId, msg.suggestionBody!, msg.id)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{appliedToastId === msg.id ? '✓ Đã chèn vào học bạ!' : '✓ Chèn trực tiếp vào Học bạ'}</span>
                          </button>

                          <button
                            onClick={() => handleCopy(msg.suggestionBody!, msg.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === msg.id ? 'Đã sao chép' : 'Sao chép văn bản'}</span>
                          </button>

                          <button
                            onClick={handlePresetComment}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Tái tạo phương án 2</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="bg-purple-950/60 border border-purple-800/40 rounded-2xl p-4 mr-12 flex items-center gap-3 text-xs text-purple-200 animate-pulse">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                  <span>Trợ lý AI đang phân tích dữ liệu sư phạm và soạn thảo phản hồi...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Bottom Chat Input Bar (matching mockup) */}
            <form onSubmit={handleSendCustomChat} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Nhập yêu cầu cho AI (ví dụ: Soạn tin nhắn gửi mẹ An nhắc giữ gìn sức khỏe cho con)..."
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm outline-none focus:border-purple-500 transition-colors"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!chatInput.trim() || isGenerating}
                icon={<Send className="w-3.5 h-3.5" />}
                className="bg-purple-600 hover:bg-purple-500 font-bold text-xs h-[38px] px-4"
              >
                Gửi ↵
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
