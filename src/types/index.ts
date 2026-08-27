// ============================================================================
// NỀN TẢNG QUẢN LÝ CHỦ NHIỆM & PHỐI HỢP GIÁO DỤC TOÀN TRƯỜNG (2026)
// Core Domain Types & Enumerations (Baseline Master Plan v1.1)
// ============================================================================

export type RoleType =
  | 'SUPER_ADMIN_TECH'
  | 'SCHOOL_ADMIN'
  | 'PRINCIPAL'
  | 'VICE_PRINCIPAL'
  | 'ACADEMIC_LEAD'
  | 'HOMEROOM_TEACHER'
  | 'SUBJECT_TEACHER'
  | 'TEAM_YOUTH_OFFICER'
  | 'COUNSELOR_SOCIAL_WORK'
  | 'SCHOOL_HEALTH'
  | 'OFFICE_RECORDS'
  | 'DATA_OPERATOR'
  | 'PARENT_GUARDIAN'
  | 'STUDENT'
  | 'AUDITOR_READONLY'
  | 'API_SERVICE_ACCOUNT';

export type DataClassification =
  | 'PUBLIC_INTERNAL'
  | 'EDUCATION_STANDARD'
  | 'PERSONAL'
  | 'SENSITIVE'
  | 'SEALED_CASE';

export type ScopeType =
  | 'SELF'
  | 'OWN_CHILD'
  | 'ASSIGNED_STUDENT'
  | 'OWN_HOMEROOM_CLASS'
  | 'OWN_SUBJECT_CLASSES'
  | 'OWN_GRADE'
  | 'OWN_DEPARTMENT'
  | 'ASSIGNED_CLASSES'
  | 'SCHOOL'
  | 'EXPLICIT_LIST';

export type ActionType =
  | 'VIEW_LIST'
  | 'VIEW_DETAIL'
  | 'CREATE'
  | 'EDIT'
  | 'DELETE_DRAFT'
  | 'SUBMIT'
  | 'REVIEW'
  | 'APPROVE'
  | 'REJECT'
  | 'SIGN'
  | 'PUBLISH'
  | 'REVOKE'
  | 'EXPORT'
  | 'PRINT'
  | 'SHARE'
  | 'DOWNLOAD_ATTACHMENT'
  | 'UPLOAD_ATTACHMENT'
  | 'COMMENT'
  | 'ASSIGN'
  | 'ARCHIVE'
  | 'RESTORE'
  | 'CONFIGURE'
  | 'IMPERSONATE_SUPPORT'
  | 'VIEW_AUDIT';

export interface UserSession {
  userId: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  activeRole: RoleType;
  availableRoles: RoleType[];
  schoolId: string;
  currentAcademicYearId: string;
  homeroomClassId?: string;
  teachingSubjectIds?: string[];
  teachingClassIds?: string[];
  childStudentIds?: string[];
  studentId?: string;
  isBreakGlassActive?: boolean;
  breakGlassExpiresAt?: string;
}

export interface BreakGlassLog {
  id: string;
  userId: string;
  reason: string;
  requestedAt: string;
  expiresAt: string;
  approvedBy?: string;
  actionsPerformed: string[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: RoleType;
  action: string;
  resourceType: string;
  resourceId: string;
  schoolId: string;
  details: string;
  classification: DataClassification;
  ipAddress?: string;
  clientDeviceId?: string;
}

// ----------------------------------------------------------------------------
// ORGANIZATION & ACADEMIC YEAR
// ----------------------------------------------------------------------------

export type SchoolLevel = 'PRIMARY' | 'LOWER_SECONDARY' | 'UPPER_SECONDARY' | 'MULTI_LEVEL';

export interface SchoolConfig {
  id: string;
  code: string;
  name: string;
  level: SchoolLevel;
  address: string;
  phone: string;
  email: string;
  principalName: string;
  academicYear: string;
  timezone: string;
  locale: string;
  dateFormat: string;
  timeFormat: string;
  maxClassSize: number;
  serverUrl: string;
  activeFeatures: {
    seatingMap: boolean;
    classFund: boolean;
    behaviorLedger: boolean;
    offlineMode: boolean;
    serverSync: boolean;
    parentPortal: boolean;
    digitalReportCard: boolean;
    aiAssistant: boolean;
  };
}

export interface AcademicYear {
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  term1Start: string;
  term1End: string;
  term2Start: string;
  term2End: string;
  currentTerm: 1 | 2;
  currentWeek: number;
  status: 'PLANNING' | 'ACTIVE' | 'CLOSING' | 'CLOSED' | 'ARCHIVED';
}

export interface ClassRoom {
  id: string;
  code: string;
  name: string;
  grade: number;
  academicYearId: string;
  homeroomTeacherId: string;
  homeroomTeacherName: string;
  homeroomTeacherPhone: string;
  roomName: string;
  studentCount: number;
  maxStudents: number;
  classGroupIds: string[];
}

// ----------------------------------------------------------------------------
// STUDENT 360 & GUARDIAN
// ----------------------------------------------------------------------------

export type StudentStatus =
  | 'ACTIVE'
  | 'TRANSFERRED'
  | 'TEMPORARILY_INACTIVE'
  | 'WITHDRAWN'
  | 'COMPLETED'
  | 'GRADUATED';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface Guardian {
  id: string;
  studentId: string;
  fullName: string;
  relationship: 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'GRANDPARENT' | 'OTHER';
  phone: string;
  email?: string;
  address: string;
  job?: string;
  isPrimaryContact: boolean;
  isVerified: boolean;
  hasPortalAccess: boolean;
}

export interface HealthAlert {
  allergyNotice?: string;
  chronicConditionNotice?: string;
  visionImpairment?: boolean;
  hearingImpairment?: boolean;
  physicalLimitationNotice?: string;
  emergencyContactPhone: string;
  emergencyContactName: string;
  needsFrontRowSeat: boolean;
  needsNearBoardSeat: boolean;
}

export interface Student {
  id: string;
  studentCode: string;
  nationalEducationCode?: string;
  lifelongLearningRecordId?: string;
  fullName: string;
  shortName?: string;
  dateOfBirth: string;
  gender: Gender;
  ethnicity: string;
  birthPlace: string;
  nativePlace?: string;
  currentAddress: string;
  avatarUrl?: string;
  status: StudentStatus;
  classId: string;
  className: string;
  enrollmentDate: string;
  guardians: Guardian[];
  health: HealthAlert;
  hasSpecialEducationPlan?: boolean; // Hòa nhập
  needsAttentionTag?: 'Needs review' | 'Follow-up required' | 'Support plan active';
  seatRow?: number;
  seatCol?: number;
  groupId?: string;
  groupName?: string;
  academicBand?: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_SUPPORT'; // For auto seating balance (not exposed to parents/students)
}

export interface ContactLog {
  id: string;
  studentId: string;
  studentName: string;
  guardianId?: string;
  guardianName: string;
  guardianPhone: string;
  contactedByTeacherId: string;
  contactedByTeacherName: string;
  timestamp: string;
  channel: 'PHONE_CALL' | 'SMS' | 'ZALO' | 'IN_PERSON' | 'PORTAL_MESSAGE';
  purpose: string;
  summary: string;
  result: string;
  followUpDate?: string;
  isResolved: boolean;
  classification: DataClassification;
}

// ----------------------------------------------------------------------------
// SEATING MAP & GROUP DIVISION
// ----------------------------------------------------------------------------

export interface SeatPosition {
  row: number;
  col: number;
  deskNumber: number;
  studentId?: string;
  studentName?: string;
  gender?: Gender;
  isLocked?: boolean;
  isVacant?: boolean;
  isAccessibleArea?: boolean;
  groupName?: string;
}

export interface SeatingLayout {
  id: string;
  classId: string;
  layoutVersion: number;
  versionName: string;
  effectiveFrom: string;
  effectiveTo?: string;
  createdBy: string;
  rows: number;
  cols: number;
  desksPerRow: number;
  seatsPerDesk: number;
  boardPosition: 'TOP_CENTER' | 'TOP_LEFT' | 'TOP_RIGHT';
  seats: SeatPosition[];
  groups: {
    id: string;
    name: string;
    leaderStudentId?: string;
    leaderStudentName?: string;
    deputyStudentId?: string;
    deputyStudentName?: string;
    studentIds: string[];
  }[];
  algorithmUsed?: 'MANUAL' | 'RANDOM_SHUFFLE' | 'GROUP_BY_COLUMN' | 'BALANCE_GROUP_SIZE' | 'BALANCE_ACADEMIC_BAND' | 'CUSTOM_CONSTRAINT_OPTIMIZER';
  notes?: string;
}

// ----------------------------------------------------------------------------
// CLASS FINANCE LEDGER & MATRIX (TT55/2011 Guard)
// ----------------------------------------------------------------------------

export type FinancialItemType =
  | 'CLASS_FUND_CONTRIBUTION'
  | 'SCHOOL_AUTHORIZED_COLLECTION_TRACKING'
  | 'EXPENSE'
  | 'ADJUSTMENT'
  | 'REVERSAL'
  | 'OTHER_TRACKING';

export type StudentObligationStatus =
  | 'NOT_DUE'
  | 'UNPAID'
  | 'PARTIAL'
  | 'PAID'
  | 'EXEMPT'
  | 'NOT_APPLICABLE'
  | 'PENDING_RECONCILIATION'
  | 'REFUNDED';

export interface FinancialCampaign {
  id: string;
  code: string;
  classId: string;
  academicYearId: string;
  title: string;
  type: FinancialItemType;
  isVoluntary: boolean;
  legalPolicyBasis: string;
  suggestedAmount: number; // Mức gợi ý (với khoản tự nguyện) hoặc mức quy định (với khoản được duyệt)
  totalExpectedAmount: number;
  startDate: string;
  dueDate: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  description: string;
  prohibitedPurposeChecked: boolean;
  parentVisible: boolean;
}

export interface StudentFeeEntry {
  campaignId: string;
  studentId: string;
  studentName: string;
  requiredAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: StudentObligationStatus;
  lastPaidAt?: string;
  receiptNote?: string;
}

export interface FinancialTransaction {
  id: string;
  classId: string;
  campaignId?: string;
  studentId?: string;
  studentName?: string;
  type: 'INCOME' | 'EXPENSE' | 'ADJUSTMENT' | 'REVERSAL';
  category: string;
  title: string;
  amount: number;
  occurredAt: string;
  recordedAt: string;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'OTHER';
  payerOrPayee: string;
  referenceNo?: string;
  evidenceUrl?: string;
  receiptNumber?: string;
  recordedByTeacherName: string;
  approvedBy?: string;
  status: 'POSTED' | 'REVERSED';
  reversalReason?: string;
  reversalOfTransactionId?: string;
  notes?: string;
}

// ----------------------------------------------------------------------------
// BEHAVIOR LEDGER & INTERNAL POINTS (BHV)
// ----------------------------------------------------------------------------

export interface BehaviorEventType {
  id: string;
  code: string;
  title: string;
  category: 'STUDY' | 'DISCIPLINE' | 'HYGIENE_DUTY' | 'PEER_SUPPORT' | 'ACTIVITY' | 'VIOLATION';
  type: 'POSITIVE' | 'NEUTRAL' | 'IMPROVEMENT_NEEDED';
  defaultPoints: number;
  minPoints: number;
  maxPoints: number;
  requiresNote: boolean;
  requiresEvidence: boolean;
  visibility: 'TEACHER_INTERNAL' | 'HOMEROOM_TEAM' | 'STUDENT_VISIBLE' | 'PARENT_VISIBLE';
  enabled: boolean;
}

export interface BehaviorObservation {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  eventTypeId: string;
  eventTitle: string;
  eventType: 'POSITIVE' | 'NEUTRAL' | 'IMPROVEMENT_NEEDED';
  points: number;
  occurredDate: string;
  recordedAt: string;
  periodIndex?: number;
  note: string;
  evidenceUrl?: string;
  recordedByTeacherName: string;
  visibility: 'TEACHER_INTERNAL' | 'HOMEROOM_TEAM' | 'STUDENT_VISIBLE' | 'PARENT_VISIBLE';
  status: 'POSTED' | 'REVERSED';
}

// ----------------------------------------------------------------------------
// ATTENDANCE & LEAVE REQUESTS (ATT & TT15/2026)
// ----------------------------------------------------------------------------

export type AttendanceStatus =
  | 'PRESENT'
  | 'ABSENT_EXCUSED'
  | 'ABSENT_UNEXCUSED'
  | 'LATE'
  | 'EARLY_LEAVE'
  | 'SCHOOL_ACTIVITY'
  | 'MEDICAL'
  | 'PENDING_REASON';

export interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  date: string;
  session: 'MORNING' | 'AFTERNOON' | 'ALL_DAY' | 'PERIOD';
  periodIndex?: number;
  status: AttendanceStatus;
  reason?: string;
  recordedByTeacherId: string;
  recordedByTeacherName: string;
  recordedAt: string;
  isLocked: boolean;
  leaveRequestId?: string;
}

export interface LeaveRequest {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  submittedByGuardianId: string;
  guardianName: string;
  guardianPhone: string;
  fromDate: string;
  toDate: string;
  consecutiveDays: number;
  reason: string;
  medicalProofUrl?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'HOMEROOM_APPROVED' | 'PRINCIPAL_APPROVED' | 'REJECTED';
  reviewedByTeacherId?: string;
  reviewedByTeacherName?: string;
  reviewComment?: string;
  submittedAt: string;
  reviewedAt?: string;
}

// ----------------------------------------------------------------------------
// ASSESSMENT & GRADEBOOK (TT27/2020 & TT22/2021)
// ----------------------------------------------------------------------------

export interface Subject {
  id: string;
  code: string;
  name: string;
  level: SchoolLevel;
  hasNumericScore: boolean; // false cho môn chỉ đánh giá nhận xét (Đ/CĐ)
  teacherName?: string;
}

export interface GradeEntry {
  id: string;
  classId: string;
  subjectId: string;
  subjectName: string;
  studentId: string;
  studentName: string;
  term: 1 | 2;
  academicYearId: string;
  // Đánh giá thường xuyên (TX)
  tx1?: number;
  tx2?: number;
  tx3?: number;
  tx4?: number;
  // Đánh giá giữa kỳ (GK)
  gk?: number;
  // Đánh giá cuối kỳ (CK)
  ck?: number;
  // ĐTB môn học
  averageScore?: number;
  // Môn đánh giá bằng nhận xét
  evaluationResult?: 'PASSED' | 'NOT_PASSED' | 'T' | 'H' | 'C'; // T: Tốt, H: Hoàn thành, C: Chưa hoàn thành
  teacherComment?: string;
  commentVisibility: 'INTERNAL' | 'HOMEROOM' | 'PARENT_VISIBLE' | 'REPORT_CARD';
  isLocked: boolean;
  lastModifiedBy: string;
  lastModifiedAt: string;
}

export interface StudentTermSummary {
  studentId: string;
  studentName: string;
  term: 1 | 2;
  academicYearId: string;
  gpa: number; // Điểm trung bình tất cả các môn
  academicPerformance: 'EXCELLENT' | 'GOOD' | 'PASS' | 'NOT_PASS'; // Học lực (Tốt, Khá, Đạt, Chưa đạt)
  conductEvaluation: 'EXCELLENT' | 'GOOD' | 'PASS' | 'NOT_PASS'; // Kết quả rèn luyện
  titleAward?: 'EXCELLENT_STUDENT' | 'MERIT_STUDENT' | 'ADVANCED_STUDENT' | 'NONE'; // Danh hiệu học sinh Xuất sắc / Giỏi
  promotionStatus?: 'PROMOTED' | 'SUMMER_REMEDIAL' | 'RETAINED' | 'PENDING'; // Lên lớp / Rèn luyện hè / Ở lại lớp
  homeroomTeacherComment: string;
  isConfirmed: boolean;
}

// ----------------------------------------------------------------------------
// DIGITAL REPORT CARD (HBS & TT70/2026)
// ----------------------------------------------------------------------------

export type ReportCardLifecycle =
  | 'DRAFT'
  | 'DATA_VALIDATED'
  | 'TEACHER_CONFIRMED'
  | 'HOMEROOM_CONFIRMED'
  | 'SCHOOL_REVIEWED'
  | 'SIGNING'
  | 'SIGNED'
  | 'PUBLISHED'
  | 'REVOKED'
  | 'ARCHIVED';

export interface SignatureBlock {
  role: 'SUBJECT_TEACHER' | 'HOMEROOM_TEACHER' | 'PRINCIPAL' | 'SCHOOL_ORGANIZATION';
  signerName: string;
  signedAt: string;
  certificateInfo: string;
  signatureHash: string;
  status: 'VALID' | 'PENDING' | 'INVALID';
}

export interface DigitalReportCard {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  dateOfBirth: string;
  gender: Gender;
  schoolId: string;
  schoolName: string;
  academicYearId: string;
  academicYearCode: string;
  classId: string;
  className: string;
  level: SchoolLevel;
  gpaTerm1?: number;
  gpaTerm2?: number;
  gpaFullYear?: number;
  academicPerformance: string;
  conductEvaluation: string;
  promotionResult: string;
  homeroomComment: string;
  subjectScores: {
    subjectName: string;
    term1Score?: number | string;
    term2Score?: number | string;
    yearScore?: number | string;
    teacherName: string;
  }[];
  signatures: SignatureBlock[];
  status: ReportCardLifecycle;
  documentHash: string;
  verificationCode: string;
  publishedAt?: string;
  version: number;
}

// ----------------------------------------------------------------------------
// HOMEROOM ELECTRONIC BOOK (HMR & TT08/2025)
// ----------------------------------------------------------------------------

export interface ClassMeeting {
  id: string;
  classId: string;
  weekNumber: number;
  date: string;
  agenda: string[];
  attendanceCount: number;
  positiveHighlights: string[];
  issuesToImprove: string[];
  studentFeedback: string[];
  nextWeekTasks: string[];
  meetingMinutesSummary: string;
  recordedBy: string;
  status: 'DRAFT' | 'COMPLETED' | 'SUBMITTED';
}

export interface HomeroomBook {
  id: string;
  classId: string;
  className: string;
  academicYearId: string;
  homeroomTeacherName: string;
  semester1Plan: {
    strengths: string;
    challenges: string;
    targetHonorsCount: number;
    targetGoodConductCount: number;
    actionPlans: string[];
  };
  semester2Plan?: {
    actionPlans: string[];
  };
  monthlyProgress: {
    month: number;
    summary: string;
    achievements: string;
    pendingIssues: string;
    submittedAt?: string;
    reviewedByPrincipal?: boolean;
  }[];
  endOfYearSummary?: {
    promotedCount: number;
    remedialCount: number;
    retainedCount: number;
    excellentCount: number;
    goodCount: number;
    generalComment: string;
  };
  retentionPolicyId: string;
  status: 'DRAFT' | 'ACTIVE' | 'SUBMITTED' | 'APPROVED' | 'ARCHIVED';
  lastGeneratedAt: string;
}

// ----------------------------------------------------------------------------
// SUPPORT, COUNSELING & DISCIPLINE (CNS, INC, DSC, RWD)
// ----------------------------------------------------------------------------

export interface EarlyWarningSignal {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  signalType: 'ATTENDANCE_ANOMALY' | 'GRADE_DROP' | 'BEHAVIOR_CONCERN' | 'OVERDUE_TASK';
  title: string;
  description: string; // VD: "Vắng không phép 3 buổi trong 10 ngày gần nhất"
  quantitativeMetric: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  detectedAt: string;
  status: 'NEW' | 'REVIEWED' | 'DISMISSED' | 'FOLLOW_UP_CREATED';
  dismissReason?: string;
}

export interface CounselingCase {
  id: string;
  caseCode: string;
  studentId: string;
  studentName: string;
  className: string;
  referredByTeacherName: string;
  referralReason: string;
  referralDate: string;
  assignedCounselorName: string;
  triageLevel: 'ROUTINE' | 'PRIORITY' | 'IMMEDIATE_SAFETY_CONCERN';
  status: 'NEW' | 'TRIAGED' | 'ACTIVE' | 'FOLLOW_UP' | 'CLOSED';
  supportGoal: string;
  generalHomeroomAdvice: string; // Phần được chia sẻ an toàn cho GVCN
  isSealed: boolean;
  classification: DataClassification;
}

export interface IncidentRecord {
  id: string;
  incidentCode: string;
  classId: string;
  occurredAt: string;
  location: string;
  reportedByTeacherName: string;
  involvedStudentIds: string[];
  involvedStudentNames: string[];
  description: string;
  witnesses?: string;
  evidenceUrl?: string;
  studentStatement?: string;
  parentMeetingSummary?: string;
  educationalMeasure: string; // Biện pháp giáo dục tích cực
  formalDisciplineDecision?: string; // Quyết định kỷ luật (nếu có, theo TT19/2025)
  status: 'REPORTED' | 'INVESTIGATING' | 'STUDENT_MEETING' | 'PARENT_COORDINATION' | 'RESOLVED' | 'CLOSED';
  isSealed: boolean;
}

export interface RewardProposal {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  achievementType: 'ACADEMIC' | 'ETHICS_GOOD_DEED' | 'COMPETITION' | 'CLASS_CONTRIBUTION' | 'OTHER';
  title: string;
  description: string;
  proposedByTeacherName: string;
  proposedLevel: 'CLASS_COMMENDATION' | 'SCHOOL_COMMENDATION' | 'DISTRICT_ABOVE';
  evidenceUrl?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'ANNOUNCED' | 'REJECTED';
  approvedAt?: string;
}

// ----------------------------------------------------------------------------
// UNIFIED TASKS & CALENDAR (TASK)
// ----------------------------------------------------------------------------

export interface UnifiedTask {
  id: string;
  title: string;
  description: string;
  assignedRole: RoleType;
  assignedTeacherName?: string;
  dueDate: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  category: 'HOMEROOM' | 'ASSESSMENT' | 'ATTENDANCE' | 'MEETING' | 'ADMIN' | 'SUPPORT';
  linkedResource?: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  timeString?: string;
  scope: 'SCHOOL' | 'GRADE' | 'CLASS' | 'PERSONAL';
  classId?: string;
  type: 'ACADEMIC' | 'ACTIVITY' | 'EXAM' | 'MEETING' | 'HOLIDAY';
}

// ----------------------------------------------------------------------------
// OFFLINE-FIRST & 2-WAY SYNC (SYNC)
// ----------------------------------------------------------------------------

export type SyncStatusType =
  | 'LOCAL_ONLY'
  | 'PENDING_SYNC'
  | 'SYNCING'
  | 'SYNCED'
  | 'CONFLICT'
  | 'ERROR';

export interface MutationEnvelope {
  operationId: string;
  entityType: string;
  entityId: string;
  operationType: 'CREATE' | 'PATCH' | 'DELETE' | 'REVERSAL' | 'COMMAND';
  baseVersion: number | null;
  fieldPatch: Record<string, any>;
  clientCreatedAt: string;
  deviceId: string;
  actorId: string;
  actorName: string;
  schoolId: string;
  isSynced: boolean;
}

export interface SyncConflictRecord {
  id: string;
  operationId: string;
  entityType: string;
  entityId: string;
  fieldName: string;
  localValue: any;
  serverValue: any;
  baseValue: any;
  detectedAt: string;
  resolvedStatus: 'UNRESOLVED' | 'RESOLVED_USE_LOCAL' | 'RESOLVED_USE_SERVER' | 'RESOLVED_MANUAL_MERGE';
  resolvedValue?: any;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface SyncServerConfig {
  mode: 'LOCAL_ONLY' | 'CONNECTED_SCHOOL' | 'SUPABASE' | 'FIREBASE';
  serverBaseUrl: string;
  schoolTenantId: string;
  apiKey?: string;
  autoSync: boolean;
  syncIntervalMinutes: number;
  syncOnNetworkRegained: boolean;
  lastSuccessfulSync?: string;
  lastSyncError?: string;
  deviceId: string;
  deviceName: string;
}

// ----------------------------------------------------------------------------
// RETENTION ENGINE & ARCHIVE (ARC & TT08/2025)
// ----------------------------------------------------------------------------

export interface RetentionPolicy {
  id: string;
  name: string;
  legalBasis: string; // TT08/2025/TT-BGDĐT
  level: SchoolLevel;
  durationString: 'PERMANENT' | '10Y' | '5Y' | '20Y' | 'UNTIL_COURSE_END' | 'RETURN_TO_STUDENT_ON_EXIT_OR_TRANSFER';
  dispositionAction: 'ARCHIVE' | 'RETURN' | 'HANDOVER' | 'DESTROY_REVIEW';
  isLegalHoldActive: boolean;
}
