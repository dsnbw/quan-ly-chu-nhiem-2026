// ============================================================================
// AI HOMEROOM ASSISTANT (AI-*, CORE-009 - Human in the loop)
// Safe, rule-compliant AI drafting assistant. Draft-only, no official decisions.
// ============================================================================

import { Student, GradeEntry } from '../../types';

export class AiHomeroomAssistant {
  /**
   * Gợi ý nhận xét học tập và rèn luyện tích cực, cá nhân hóa
   */
  public static generateStudentComment(
    student: Student,
    grades: GradeEntry[],
    behaviorScore: number
  ): string {
    const avgScores = grades.filter(g => typeof g.averageScore === 'number').map(g => g.averageScore || 0);
    const overallGpa = avgScores.length > 0 ? avgScores.reduce((a, b) => a + b, 0) / avgScores.length : 0;
    
    let comment = '';
    const pronoun = student.gender === 'FEMALE' ? 'Nữ sinh' : 'Nam sinh';

    if (overallGpa >= 9.0) {
      comment = `Em ${student.fullName} có thành tích học tập vô cùng xuất sắc. Em luôn thể hiện sự chủ động, tư duy sắc bén và khả năng tiếp thu bài vượt trội. ${pronoun} này là tấm gương sáng cho các bạn trong lớp noi theo.`;
    } else if (overallGpa >= 8.0) {
      comment = `Em ${student.fullName} có học lực Giỏi, thái độ học tập nghiêm túc và có ý thức tự giác cao. Nắm vững kiến thức trọng tâm và biết vận dụng linh hoạt. Em cần tiếp tục duy trì phong độ hiện tại.`;
    } else if (overallGpa >= 6.5) {
      comment = `Em ${student.fullName} có lực học Khá, đã có nhiều cố gắng trong việc hoàn thành các bài tập trên lớp. Tuy nhiên, đôi lúc em còn thiếu tập trung. Em cần rèn luyện thêm tính cẩn thận và mạnh dạn giơ tay phát biểu.`;
    } else if (overallGpa >= 5.0) {
      comment = `Em ${student.fullName} đạt mức học Trung bình. Dù có tinh thần hợp tác, nhưng nền tảng kiến thức của em ở một số môn tự nhiên còn chưa vững. Em cần dành nhiều thời gian hơn cho việc tự học và không ngại hỏi thầy cô khi chưa hiểu bài.`;
    } else if (overallGpa > 0) {
      comment = `Em ${student.fullName} hiện đang gặp khó khăn trong học tập. Lực học còn yếu, sự tập trung trên lớp chưa cao. Gia đình cần phối hợp chặt chẽ hơn với giáo viên chủ nhiệm và giáo viên bộ môn để đôn đốc, kèm cặp em học bài ở nhà hằng ngày.`;
    } else {
      comment = `Em ${student.fullName} là một thành viên hòa đồng của lớp. Khả năng giao tiếp tốt và có tiềm năng phát triển nếu được định hướng đúng đắn.`;
    }

    // Behavior integration
    if (behaviorScore >= 9) {
      comment += ` Về mặt nề nếp, em luôn chấp hành xuất sắc nội quy, thái độ lễ phép, chan hòa và cực kỳ nhiệt tình trong các hoạt động phong trào của trường, lớp.`;
    } else if (behaviorScore >= 7) {
      comment += ` Đạo đức tốt, ngoan ngoãn và lễ phép với thầy cô. Việc thực hiện nội quy cơ bản ổn định, thỉnh thoảng mới có vi phạm nhỏ gọn nhẹ.`;
    } else if (behaviorScore >= 5) {
      comment += ` Về nề nếp, em đôi khi còn lơ đãng, vi phạm một vài nội quy như đi học muộn hoặc làm việc riêng. Em cần tự chấn chỉnh lại tác phong học sinh của mình chặt chẽ hơn.`;
    } else {
      comment += ` Đặc biệt cần lưu ý về mặt kỷ luật: em còn vi phạm nhiều nội quy của nhà trường, cần sự phối hợp theo dõi sát sao từ phía gia đình để rèn luyện lại đạo đức, lối sống.`;
    }

    if (student.needsAttentionTag) {
      comment += ` Nhận thấy em đang trong giai đoạn cần sự quan tâm đặc biệt về mặt tâm lý học đường, thầy/cô luôn sẵn sàng đồng hành để em vượt qua khó khăn hiện tại.`;
    }

    return comment;
  }

  /**
   * Gợi ý chương trình Sinh hoạt Lớp theo chủ đề tháng
   */
  public static generateMeetingAgenda(weekNumber: number, month: number): {
    theme: string;
    agenda: string[];
    suggestedActivities: string[];
  } {
    const monthlyThemes: Record<number, any> = {
      8: {
        theme: 'Chào năm học mới & Xây dựng Nội quy Lớp học Hạnh phúc',
        agenda: [
          'Giáo viên chủ nhiệm phổ biến nội quy nhà trường và các quy định thi đua.',
          'Bầu cử Ban Cán sự lớp (Lớp trưởng, Lớp phó, Tổ trưởng).',
          'Phân công sơ đồ chỗ ngồi và lịch trực nhật vệ sinh.',
          'Thống nhất các mục tiêu phấn đấu của tập thể lớp trong học kỳ 1.'
        ],
        activities: ['Trò chơi phá băng (Icebreaker): Đi tìm người giống tôi.', 'Viết "Thư gửi chính mình của 1 năm sau" và cất vào hộp thời gian.']
      },
      9: {
        theme: 'Tháng An toàn Giao thông & Hưởng ứng Thi đua Học Tốt',
        agenda: [
          'Đánh giá nề nếp tháng đầu năm: Tỷ lệ chuyên cần, đồng phục, truy bài.',
          'Lớp phó học tập chia sẻ phương pháp học tập hiệu quả cấp THCS/THPT.',
          'Tuyên truyền và ký cam kết An toàn Giao thông theo chỉ đạo của Đoàn trường.',
          'Biểu dương các cá nhân có điểm tốt trong tuần.'
        ],
        activities: ['Tổ chức đố vui biển báo giao thông nhanh.', 'Thi đua hoa điểm 10 giữa các tổ.']
      },
      10: {
        theme: 'Chào mừng ngày Phụ nữ Việt Nam 20/10 & Tình bạn đẹp',
        agenda: [
          'Sơ kết tình hình học tập và kỷ luật giữa học kỳ 1.',
          'Nhắc nhở công tác chuẩn bị cho kỳ thi Giữa Kỳ sắp tới.',
          'Tổ chức chuyên đề: "Xây dựng tình bạn đẹp - Nói không với bạo lực học đường".',
          'Lên kế hoạch tổ chức hoạt động chúc mừng các bạn nữ và cô giáo nhân ngày 20/10.'
        ],
        activities: ['Làm thiệp chúc mừng 20/10 handmade.', 'Sinh hoạt văn nghệ chủ đề Mẹ và Cô.']
      },
      11: {
        theme: 'Tri ân Thầy Cô 20/11 - Tôn sư trọng đạo',
        agenda: [
          'Tổng kết đợt thi đua chào mừng ngày Nhà giáo Việt Nam.',
          'Rút kinh nghiệm về ý thức học tập các môn chuyên đề.',
          'Chuẩn bị tiết mục văn nghệ / báo tường / tập san cấp trường.',
          'Giao lưu chia sẻ kỷ niệm đẹp về thầy cô.'
        ],
        activities: ['Cuộc thi kể chuyện "Người thầy trong ký ức của em".', 'Tập hát tốp ca bài "Bụi Phấn".']
      },
      12: {
        theme: 'Ôn tập cao điểm & Tự hào truyền thống Quân đội',
        agenda: [
          'Quán triệt quy chế thi và lịch kiểm tra học kỳ 1.',
          'Lớp phó học tập lên kế hoạch học nhóm, đôi bạn cùng tiến.',
          'Sinh hoạt truyền thống ngày 22/12.',
          'Đánh giá xếp loại Hạnh kiểm dự kiến cuối HKI.'
        ],
        activities: ['Hỏi đáp nhanh kiến thức lịch sử 22/12.', 'Trao đổi sơ đồ tư duy (Mindmap) các môn ôn thi.']
      },
      1: {
        theme: 'Sơ kết Học kỳ 1 & Chào Xuân Mới',
        agenda: [
          'Giáo viên công bố kết quả học tập và rèn luyện Học kỳ 1.',
          'Tuyên dương khen thưởng các cá nhân, tập thể tổ xuất sắc.',
          'Phổ biến quy định đảm bảo an toàn, phòng chống pháo nổ dịp Tết Nguyên Đán.',
          'Đề ra phương hướng, mục tiêu cho Học kỳ 2.'
        ],
        activities: ['Trang trí lớp học đón Tết.', 'Viết thiệp chúc Tết gửi gia đình.']
      }
    };

    const defaultTheme = {
      theme: `Sinh hoạt lớp Tuần ${weekNumber} - Rèn luyện Đạo đức & Học tập`,
      agenda: [
        'Lớp trưởng và các tổ trưởng báo cáo sơ kết thi đua trong tuần.',
        'Lớp phó học tập nhận xét tình hình chuẩn bị bài và làm bài tập về nhà.',
        'Cán sự phụ trách nề nếp báo cáo tình hình vệ sinh, đồng phục.',
        'Giáo viên chủ nhiệm tổng kết, nhắc nhở các mặt còn hạn chế.',
        'Định hướng các hoạt động trọng tâm của tuần tiếp theo.'
      ],
      suggestedActivities: [
        'Sinh hoạt văn nghệ tự do (10 phút).',
        'Bình chọn "Ngôi sao của tuần".'
      ]
    };

    const monthData = monthlyThemes[month];
    if (monthData) {
      return {
        theme: monthData.theme,
        agenda: monthData.agenda,
        suggestedActivities: monthData.activities
      };
    }

    return defaultTheme;
  }

  /**
   * Kiểm tra độ đầy đủ của dữ liệu sổ chủ nhiệm & cuối kỳ (Checklist)
   */
  public static auditDataCompleteness(
    students: Student[],
    grades: GradeEntry[],
    attendanceCount: number,
    totalExpectedDays: number
  ): {
    scorePercent: number;
    warnings: string[];
    recommendations: string[];
  } {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // 1. Kiểm tra điểm số
    const missingTx = grades.filter(g => typeof g.tx1 === 'undefined').length;
    if (missingTx > 0) {
      warnings.push(`Còn ${missingTx} bản ghi điểm thường xuyên (TX1) chưa được cập nhật.`);
    }

    // 2. Kiểm tra thông tin phụ huynh
    const missingGuardians = students.filter(s => !s.guardians || s.guardians.length === 0 || !s.guardians[0].phone).length;
    if (missingGuardians > 0) {
      warnings.push(`Có ${missingGuardians} học sinh chưa có số điện thoại liên hệ của phụ huynh.`);
    }

    // 3. Kiểm tra chuyên cần
    if (attendanceCount < totalExpectedDays) {
      warnings.push(`Dữ liệu điểm danh mới cập nhật được ${attendanceCount}/${totalExpectedDays} ngày học.`);
    }

    if (warnings.length === 0) {
      recommendations.push('Dữ liệu lớp học đầy đủ và đạt chuẩn 100% để tổng kết định kỳ.');
    } else {
      recommendations.push('Đề nghị GVCN hoàn thành cập nhật các mục trên trước khi gửi BGH duyệt sổ chủ nhiệm.');
    }

    const scorePercent = Math.max(20, Math.round(100 - warnings.length * 20));

    return {
      scorePercent,
      warnings,
      recommendations
    };
  }

  /**
   * Gọi thực tế tới API Gemini
   */
  public static async callGemini(apiKey: string, model: string, prompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API Error: ${err}`);
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  /**
   * Gọi thực tế tới API OpenAI
   */
  public static async callOpenAI(apiKey: string, model: string, prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI API Error: ${err}`);
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Lấy danh sách model từ API
   */
  public static async fetchModels(provider: string, apiKey: string): Promise<string[]> {
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return (data.models || []).map((m: any) => m.name.replace('models/', '')).filter((m: string) => m.includes('gemini'));
    } else if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return (data.data || []).map((m: any) => m.id).filter((m: string) => m.includes('gpt'));
    }
    return [];
  }
}
