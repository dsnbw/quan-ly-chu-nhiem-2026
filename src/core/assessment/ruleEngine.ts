// ============================================================================
// ASSESSMENT RULE ENGINE (ASM-001, ASM-002, ASM-003)
// Implements TT22/2021/TT-BGDĐT (THCS/THPT) & TT27/2020/TT-BGDĐT (Tiểu học)
// ============================================================================

import { GradeEntry, StudentTermSummary } from '../../types';

export class AssessmentRuleEngine {
  /**
   * Tính điểm trung bình môn học theo TT22/2021:
   * ĐTBmhk = (Tổng điểm ĐDGtx + 2 * ĐDGgk + 3 * ĐDGck) / (Số điểm ĐDGtx + 5)
   */
  public static calculateSubjectAverage(entry: Partial<GradeEntry>): number | undefined {
    const txScores: number[] = [];
    if (typeof entry.tx1 === 'number') txScores.push(entry.tx1);
    if (typeof entry.tx2 === 'number') txScores.push(entry.tx2);
    if (typeof entry.tx3 === 'number') txScores.push(entry.tx3);
    if (typeof entry.tx4 === 'number') txScores.push(entry.tx4);

    if (txScores.length === 0) return undefined;

    const sumTx = txScores.reduce((a, b) => a + b, 0);
    const countTx = txScores.length;

    // Giữa kỳ có trọng số 2
    const gk = typeof entry.gk === 'number' ? entry.gk : 0;
    const gkWeight = typeof entry.gk === 'number' ? 2 : 0;

    // Cuối kỳ có trọng số 3
    const ck = typeof entry.ck === 'number' ? entry.ck : 0;
    const ckWeight = typeof entry.ck === 'number' ? 3 : 0;

    const totalWeight = countTx + gkWeight + ckWeight;
    if (totalWeight === 0) return undefined;

    const totalWeightedScore = sumTx + (gk * gkWeight) + (ck * ckWeight);
    return Number((totalWeightedScore / totalWeight).toFixed(1));
  }

  /**
   * Xếp loại Học lực theo TT22/2021:
   * - Tốt (EXCELLENT): Tất cả các môn ĐTB >= 6.5, trong đó có ít nhất 6 môn >= 8.0, các môn nhận xét Đạt.
   * - Khá (GOOD): Tất cả các môn ĐTB >= 5.0, trong đó có ít nhất 6 môn >= 6.5, các môn nhận xét Đạt.
   * - Đạt (PASS): Có nhiều nhất 01 môn ĐTB < 5.0 nhưng >= 3.5, các môn nhận xét Đạt.
   * - Chưa đạt (NOT_PASS): Các trường hợp còn lại.
   */
  public static evaluateTermPerformance(
    studentId: string,
    studentName: string,
    grades: GradeEntry[],
    term: 1 | 2,
    academicYearId: string
  ): StudentTermSummary {
    const numericGrades = grades.filter(g => typeof g.averageScore === 'number');
    const qualitativeGrades = grades.filter(g => typeof g.averageScore !== 'number');

    const totalGpaSum = numericGrades.reduce((sum, g) => sum + (g.averageScore || 0), 0);
    const gpa = numericGrades.length > 0 ? Number((totalGpaSum / numericGrades.length).toFixed(1)) : 0;

    const scores = numericGrades.map(g => g.averageScore || 0);
    const countGte8 = scores.filter(s => s >= 8.0).length;
    const countGte65 = scores.filter(s => s >= 6.5).length;
    const countGte50 = scores.filter(s => s >= 5.0).length;
    const countLt35 = scores.filter(s => s < 3.5).length;
    const allQualitativePassed = qualitativeGrades.every(g => g.evaluationResult === 'PASSED');

    let academicPerformance: StudentTermSummary['academicPerformance'] = 'NOT_PASS';

    if (allQualitativePassed && countGte65 === scores.length && countGte8 >= 6 && scores.every(s => s >= 6.5)) {
      academicPerformance = 'EXCELLENT';
    } else if (allQualitativePassed && countGte50 === scores.length && countGte65 >= 6 && scores.every(s => s >= 5.0)) {
      academicPerformance = 'GOOD';
    } else if (allQualitativePassed && countLt35 === 0 && scores.filter(s => s < 5.0).length <= 1) {
      academicPerformance = 'PASS';
    }

    // Kết quả rèn luyện mặc định là Tốt (có thể được GVCN điều chỉnh)
    const conductEvaluation: StudentTermSummary['conductEvaluation'] = 'EXCELLENT';

    // Danh hiệu học sinh
    let titleAward: StudentTermSummary['titleAward'] = 'NONE';
    if (academicPerformance === 'EXCELLENT' && conductEvaluation === 'EXCELLENT') {
      titleAward = gpa >= 9.0 ? 'EXCELLENT_STUDENT' : 'MERIT_STUDENT';
    } else if (academicPerformance === 'GOOD' && (conductEvaluation === 'EXCELLENT' || conductEvaluation === 'GOOD')) {
      titleAward = 'ADVANCED_STUDENT';
    }

    // Xét lên lớp (cho cuối năm)
    let promotionStatus: StudentTermSummary['promotionStatus'] = 'PROMOTED';
    if (academicPerformance === 'NOT_PASS') {
      promotionStatus = 'SUMMER_REMEDIAL';
    }

    return {
      studentId,
      studentName,
      term,
      academicYearId,
      gpa,
      academicPerformance,
      conductEvaluation,
      titleAward,
      promotionStatus,
      homeroomTeacherComment: academicPerformance === 'EXCELLENT'
        ? 'Chăm ngoan, gương mẫu, đạt thành tích học tập xuất sắc.'
        : academicPerformance === 'GOOD'
        ? 'Có ý thức học tập tốt, rèn luyện chăm chỉ.'
        : 'Cần cố gắng rèn luyện thêm trong học tập và tích cực tham gia phát biểu.',
      isConfirmed: true
    };
  }
}
