// ============================================================================
// PERMISSION ENGINE (RBAC + ABAC) (PERM-001, PERM-002, PERM-003, Section 50-51)
// Permission = Role + Action + Resource + Scope + DataClassification
// ============================================================================

import { RoleType, ActionType, DataClassification, ScopeType, UserSession } from '../../types';

export interface PermissionCheckContext {
  resourceType: string;
  resourceOwnerId?: string;
  classId?: string;
  studentId?: string;
  classification?: DataClassification;
  isLocked?: boolean;
}

export class PermissionEngine {
  public static canAccess(
    session: UserSession,
    action: ActionType,
    context: PermissionCheckContext
  ): { allowed: boolean; reason?: string } {
    const role = session.activeRole;
    const { resourceType, classification = 'EDUCATION_STANDARD', isLocked = false } = context;

    // 1. Break-glass override
    if (session.isBreakGlassActive) {
      return { allowed: true };
    }

    // 2. Sensitive / Sealed case rules
    if (classification === 'SEALED_CASE') {
      if (role !== 'COUNSELOR_SOCIAL_WORK' && role !== 'PRINCIPAL') {
        return { allowed: false, reason: 'Hồ sơ niêm phong bảo mật, chỉ Ban Giám hiệu hoặc Cán bộ tư vấn được phân công mới có quyền truy cập.' };
      }
    }

    if (classification === 'SENSITIVE' && role === 'PARENT_GUARDIAN') {
      return { allowed: false, reason: 'Thông tin nội bộ hạn chế tiếp cận phụ huynh.' };
    }

    // 3. Locked resource modification
    if (isLocked && (action === 'EDIT' || action === 'DELETE_DRAFT')) {
      return { allowed: false, reason: 'Dữ liệu đã khóa hoặc đã ký số. Cần tạo yêu cầu điều chỉnh thay vì sửa trực tiếp.' };
    }

    // 4. Role-based Scope checks
    switch (role) {
      case 'SUPER_ADMIN_TECH':
      case 'SCHOOL_ADMIN':
        return { allowed: true };

      case 'PRINCIPAL':
      case 'VICE_PRINCIPAL':
        if (action === 'DELETE_DRAFT' && context.resourceOwnerId && context.resourceOwnerId !== session.userId) {
          return { allowed: false, reason: 'Không thể xóa bản nháp của người khác.' };
        }
        return { allowed: true };

      case 'HOMEROOM_TEACHER':
        if (context.classId && context.classId !== session.homeroomClassId) {
          // If accessing another class
          if (action === 'EDIT' || action === 'CREATE' || action === 'APPROVE') {
            return { allowed: false, reason: 'Chỉ có quyền thao tác trên lớp chủ nhiệm của mình.' };
          }
        }
        return { allowed: true };

      case 'SUBJECT_TEACHER':
        if (resourceType === 'grades' || resourceType === 'student_observation') {
          return { allowed: true };
        }
        if (resourceType === 'seating_layout' || resourceType === 'homeroom_book' || resourceType === 'class_finance') {
          if (action === 'EDIT' || action === 'CREATE') {
            return { allowed: false, reason: 'Chức năng chỉ dành cho Giáo viên chủ nhiệm.' };
          }
        }
        return { allowed: action === 'VIEW_LIST' || action === 'VIEW_DETAIL' };

      case 'COUNSELOR_SOCIAL_WORK':
        if (resourceType === 'counseling' || resourceType === 'early_warnings' || resourceType === 'support') {
          return { allowed: true };
        }
        if (resourceType === 'students' && (action === 'VIEW_LIST' || action === 'VIEW_DETAIL')) {
          return { allowed: true };
        }
        return { allowed: action === 'VIEW_LIST' || action === 'VIEW_DETAIL' };

      case 'PARENT_GUARDIAN':
        if (resourceType === 'students' && context.studentId && !session.childStudentIds?.includes(context.studentId)) {
          return { allowed: false, reason: 'Phụ huynh chỉ có quyền xem thông tin của con mình.' };
        }
        if (resourceType === 'leave_requests') {
          return { allowed: action === 'CREATE' || action === 'VIEW_LIST' || action === 'VIEW_DETAIL' };
        }
        if (['grades', 'attendance', 'finance_matrix', 'report_card', 'notices'].includes(resourceType)) {
          return { allowed: action === 'VIEW_LIST' || action === 'VIEW_DETAIL' };
        }
        return { allowed: false, reason: 'Chức năng không thuộc phạm vi Cổng phụ huynh.' };

      case 'STUDENT':
        if (['grades', 'attendance', 'activities', 'notices', 'seating_layout'].includes(resourceType)) {
          return { allowed: action === 'VIEW_LIST' || action === 'VIEW_DETAIL' };
        }
        return { allowed: false, reason: 'Chức năng không thuộc phạm vi Học sinh.' };

      default:
        return { allowed: action === 'VIEW_LIST' || action === 'VIEW_DETAIL' };
    }
  }

  public static getRoleDisplayName(role: RoleType): string {
    const names: Record<RoleType, string> = {
      SUPER_ADMIN_TECH: 'Quản trị Kỹ thuật Nền tảng',
      SCHOOL_ADMIN: 'Quản trị Cấu hình Trường',
      PRINCIPAL: 'Hiệu trưởng',
      VICE_PRINCIPAL: 'Phó Hiệu trưởng',
      ACADEMIC_LEAD: 'Tổ trưởng Chuyên môn',
      HOMEROOM_TEACHER: 'Giáo viên Chủ nhiệm (GVCN)',
      SUBJECT_TEACHER: 'Giáo viên Bộ môn (GVBM)',
      TEAM_YOUTH_OFFICER: 'Tổng phụ trách Đội / Bí thư Đoàn',
      COUNSELOR_SOCIAL_WORK: 'Cán bộ Tư vấn học đường',
      SCHOOL_HEALTH: 'Cán bộ Y tế trường học',
      OFFICE_RECORDS: 'Văn thư / Lưu trữ',
      DATA_OPERATOR: 'Cán bộ Quản trị Dữ liệu',
      PARENT_GUARDIAN: 'Cha mẹ / Người giám hộ',
      STUDENT: 'Học sinh',
      AUDITOR_READONLY: 'Thanh tra / Kiểm toán',
      API_SERVICE_ACCOUNT: 'Tài khoản Tích hợp API'
    };
    return names[role] || role;
  }
}
