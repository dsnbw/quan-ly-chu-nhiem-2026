import {
  SchoolConfig,
  AcademicYear,
  ClassRoom,
  Student,
  Subject,
  BehaviorEventType,
  FinancialCampaign,
  FinancialTransaction,
  StudentFeeEntry,
  AttendanceRecord,
  LeaveRequest,
  GradeEntry,
  StudentTermSummary,
  DigitalReportCard,
  HomeroomBook,
  ClassMeeting,
  EarlyWarningSignal,
  CounselingCase,
  IncidentRecord,
  RewardProposal,
  UnifiedTask,
  CalendarEvent,
  RetentionPolicy,
  SeatingLayout,
  ContactLog
} from '../../types';

export const initialSchoolConfig: SchoolConfig = {
  id: 'school-default',
  code: 'TRUONG-THPT',
  name: 'Trường THPT',
  level: 'LOWER_SECONDARY',
  address: '',
  phone: '',
  email: '',
  principalName: '',
  academicYear: '2026-2027',
  timezone: 'Asia/Ho_Chi_Minh',
  locale: 'vi-VN',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: 'HH:mm',
  maxClassSize: 35,
  serverUrl: 'https://nd.quangngai.qzz.io/api/v1',
  activeFeatures: {
    seatingMap: true,
    classFund: true,
    behaviorLedger: true,
    offlineMode: true,
    serverSync: true,
    parentPortal: true,
    digitalReportCard: true,
    aiAssistant: true,
  }
};

export const initialAcademicYears: AcademicYear[] = [
  {
    id: 'ay-2026-2027',
    code: '2026-2027',
    name: 'Năm học 2026 - 2027',
    startDate: '2026-09-01',
    endDate: '2027-05-31',
    term1Start: '2026-09-01',
    term1End: '2027-01-15',
    term2Start: '2027-01-16',
    term2End: '2027-05-31',
    currentTerm: 1,
    currentWeek: 4,
    status: 'ACTIVE'
  }
];

export const initialClasses: ClassRoom[] = [
  {
    id: 'class-default',
    code: '10A1',
    name: 'Lớp 10A1',
    grade: 10,
    academicYearId: 'ay-2026-2027',
    homeroomTeacherId: 'teacher-1',
    homeroomTeacherName: 'Giáo viên',
    homeroomTeacherPhone: '',
    roomName: 'Phòng 1',
    studentCount: 0,
    maxStudents: 35,
    classGroupIds: []
  }
];

export const initialStudents: Student[] = [];
export const initialSubjects: Subject[] = [];
export const initialBehaviorEventTypes: BehaviorEventType[] = [];
export const initialBehaviorObservations: any[] = [];
export const initialFinancialCampaigns: FinancialCampaign[] = [];
export const initialFinancialTransactions: FinancialTransaction[] = [];
export const initialStudentFeeEntries: StudentFeeEntry[] = [];
export const initialAttendanceRecords: AttendanceRecord[] = [];
export const initialLeaveRequests: LeaveRequest[] = [];
export const initialGradeEntries: GradeEntry[] = [];
export const initialStudentTermSummaries: StudentTermSummary[] = [];
export const initialDigitalReportCards: DigitalReportCard[] = [];
export const initialHomeroomBook: HomeroomBook = {} as HomeroomBook;
export const initialClassMeetings: ClassMeeting[] = [];
export const initialEarlyWarnings: EarlyWarningSignal[] = [];
export const initialCounselingCases: CounselingCase[] = [];
export const initialIncidentRecords: IncidentRecord[] = [];
export const initialRewardProposals: RewardProposal[] = [];
export const initialTasks: UnifiedTask[] = [];
export const initialCalendarEvents: CalendarEvent[] = [];
export const initialRetentionPolicies: RetentionPolicy[] = [];
export const initialSeatingLayout: SeatingLayout = {
  id: 'sl-1',
  classId: 'class-default',
  layoutVersion: 1,
  versionName: 'Sơ đồ mặc định',
  effectiveFrom: '2026-09-01',
  createdBy: 'System',
  rows: 4,
  cols: 6,
  desksPerRow: 3,
  seatsPerDesk: 2,
  boardPosition: 'TOP_CENTER',
  seats: [],
  groups: []
};
export const initialContactLogs: ContactLog[] = [];
