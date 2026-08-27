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
  id: 'school-cva-01',
  code: 'CVA-HN-2026',
  name: 'Trường THCS Chu Văn An',
  level: 'LOWER_SECONDARY',
  address: 'Số 10 phố Thụy Khuê, Phường Thụy Khuê, Quận Tây Hồ, Hà Nội',
  phone: '024 3823 4567',
  email: 'thcschuvanan@edu.hanoi.gov.vn',
  principalName: 'TS. Lê Thị Mai Hoa',
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
  },
  {
    id: 'ay-2025-2026',
    code: '2025-2026',
    name: 'Năm học 2025 - 2026',
    startDate: '2025-09-01',
    endDate: '2026-05-31',
    term1Start: '2025-09-01',
    term1End: '2026-01-16',
    term2Start: '2026-01-17',
    term2End: '2026-05-31',
    currentTerm: 2,
    currentWeek: 35,
    status: 'CLOSED'
  }
];

export const initialClasses: ClassRoom[] = [
  {
    id: 'class-8a1',
    code: '8A1',
    name: 'Lớp 8A1',
    grade: 8,
    academicYearId: 'ay-2026-2027',
    homeroomTeacherId: 'teacher-nguyen-van-an',
    homeroomTeacherName: 'Thầy Nguyễn Văn An',
    homeroomTeacherPhone: '0912 345 678',
    roomName: 'Phòng 204 - Tầng 2 Nhà A',
    studentCount: 30,
    maxStudents: 35,
    classGroupIds: ['group-1', 'group-2', 'group-3', 'group-4']
  },
  {
    id: 'class-8a2',
    code: '8A2',
    name: 'Lớp 8A2',
    grade: 8,
    academicYearId: 'ay-2026-2027',
    homeroomTeacherId: 'teacher-tran-thi-bich',
    homeroomTeacherName: 'Cô Trần Thị Bích',
    homeroomTeacherPhone: '0987 654 321',
    roomName: 'Phòng 205 - Tầng 2 Nhà A',
    studentCount: 32,
    maxStudents: 35,
    classGroupIds: ['group-8a2-1', 'group-8a2-2', 'group-8a2-3', 'group-8a2-4']
  },
  {
    id: 'class-9a1',
    code: '9A1',
    name: 'Lớp 9A1',
    grade: 9,
    academicYearId: 'ay-2026-2027',
    homeroomTeacherId: 'teacher-pham-quoc-tuan',
    homeroomTeacherName: 'Thầy Phạm Quốc Tuấn',
    homeroomTeacherPhone: '0903 112 233',
    roomName: 'Phòng 301 - Tầng 3 Nhà A',
    studentCount: 34,
    maxStudents: 35,
    classGroupIds: []
  }
];

export const initialSubjects: Subject[] = [
  { id: 'sub-math', code: 'TOAN', name: 'Toán học', level: 'LOWER_SECONDARY', hasNumericScore: true, teacherName: 'Thầy Nguyễn Văn An' },
  { id: 'sub-lit', code: 'VAN', name: 'Ngữ văn', level: 'LOWER_SECONDARY', hasNumericScore: true, teacherName: 'Cô Đỗ Thu Trang' },
  { id: 'sub-eng', code: 'ANH', name: 'Tiếng Anh', level: 'LOWER_SECONDARY', hasNumericScore: true, teacherName: 'Cô Hoàng Minh Thảo' },
  { id: 'sub-sci', code: 'KHTN', name: 'Khoa học tự nhiên', level: 'LOWER_SECONDARY', hasNumericScore: true, teacherName: 'Thầy Trần Đình Trọng' },
  { id: 'sub-his-geo', code: 'LS_DL', name: 'Lịch sử và Địa lí', level: 'LOWER_SECONDARY', hasNumericScore: true, teacherName: 'Cô Vũ Thị Hà' },
  { id: 'sub-civ', code: 'GDCD', name: 'Giáo dục công dân', level: 'LOWER_SECONDARY', hasNumericScore: true, teacherName: 'Thầy Lê Hải Long' },
  { id: 'sub-it', code: 'TIN', name: 'Tin học', level: 'LOWER_SECONDARY', hasNumericScore: true, teacherName: 'Thầy Nguyễn Thành Trung' },
  { id: 'sub-tech', code: 'CN', name: 'Công nghệ', level: 'LOWER_SECONDARY', hasNumericScore: true, teacherName: 'Cô Phan Thị Mai' },
  { id: 'sub-pe', code: 'GDTC', name: 'Giáo dục thể chất', level: 'LOWER_SECONDARY', hasNumericScore: false, teacherName: 'Thầy Bùi Quang Huy' },
  { id: 'sub-art', code: 'MT', name: 'Mĩ thuật', level: 'LOWER_SECONDARY', hasNumericScore: false, teacherName: 'Cô Lê Thu Thủy' },
  { id: 'sub-exp', code: 'HDTN', name: 'Hoạt động trải nghiệm, hướng nghiệp', level: 'LOWER_SECONDARY', hasNumericScore: false, teacherName: 'Thầy Nguyễn Văn An' }
];

const studentNamesData = [
  { code: 'HS08001', name: 'Nguyễn Tuấn Anh', gender: 'MALE' as const, dob: '2012-03-15', parent: 'Nguyễn Văn Hùng', phone: '0912345111', band: 'EXCELLENT' as const, front: false, near: false },
  { code: 'HS08002', name: 'Trần Bảo Châu', gender: 'FEMALE' as const, dob: '2012-07-22', parent: 'Trần Văn Long', phone: '0912345112', band: 'EXCELLENT' as const, front: false, near: false },
  { code: 'HS08003', name: 'Lê Minh Cường', gender: 'MALE' as const, dob: '2012-01-10', parent: 'Lê Đình Chiến', phone: '0912345113', band: 'GOOD' as const, front: true, near: false }, // Cận thị nhẹ
  { code: 'HS08004', name: 'Phạm Thùy Dung', gender: 'FEMALE' as const, dob: '2012-11-05', parent: 'Phạm Quốc Hưng', phone: '0912345114', band: 'EXCELLENT' as const, front: false, near: false },
  { code: 'HS08005', name: 'Hoàng Quốc Đạt', gender: 'MALE' as const, dob: '2012-05-18', parent: 'Hoàng Minh Tuấn', phone: '0912345115', band: 'AVERAGE' as const, front: false, near: false },
  { code: 'HS08006', name: 'Vũ Hải Đăng', gender: 'MALE' as const, dob: '2012-09-30', parent: 'Vũ Văn Nam', phone: '0912345116', band: 'GOOD' as const, front: false, near: false },
  { code: 'HS08007', name: 'Đỗ Thảo Hương', gender: 'FEMALE' as const, dob: '2012-04-12', parent: 'Đỗ Đức Hòa', phone: '0912345117', band: 'EXCELLENT' as const, front: false, near: false },
  { code: 'HS08008', name: 'Bùi Gia Huy', gender: 'MALE' as const, dob: '2012-08-25', parent: 'Bùi Quang Vinh', phone: '0912345118', band: 'NEEDS_SUPPORT' as const, front: true, near: true }, // Cần hỗ trợ
  { code: 'HS08009', name: 'Ngô Khánh Huyền', gender: 'FEMALE' as const, dob: '2012-02-14', parent: 'Ngô Trọng Quân', phone: '0912345119', band: 'GOOD' as const, front: false, near: false },
  { code: 'HS08010', name: 'Dương Đăng Khoa', gender: 'MALE' as const, dob: '2012-06-08', parent: 'Dương Thành Công', phone: '0912345120', band: 'EXCELLENT' as const, front: false, near: false },
  { code: 'HS08011', name: 'Lý Mai Linh', gender: 'FEMALE' as const, dob: '2012-10-19', parent: 'Lý Quốc Bảo', phone: '0912345121', band: 'GOOD' as const, front: false, near: false },
  { code: 'HS08012', name: 'Đinh Nhật Minh', gender: 'MALE' as const, dob: '2012-12-03', parent: 'Đinh Văn Thắng', phone: '0912345122', band: 'AVERAGE' as const, front: false, near: false },
  { code: 'HS08013', name: 'Phan Thảo My', gender: 'FEMALE' as const, dob: '2012-04-27', parent: 'Phan Văn Hậu', phone: '0912345123', band: 'EXCELLENT' as const, front: false, near: false },
  { code: 'HS08014', name: 'Tạ Minh Nam', gender: 'MALE' as const, dob: '2012-07-09', parent: 'Tạ Quang Khải', phone: '0912345124', band: 'GOOD' as const, front: false, near: false },
  { code: 'HS08015', name: 'Đoàn Yến Nhi', gender: 'FEMALE' as const, dob: '2012-09-15', parent: 'Đoàn Trọng Phước', phone: '0912345125', band: 'EXCELLENT' as const, front: false, near: false },
  { code: 'HS08016', name: 'Cao Hoàng Phúc', gender: 'MALE' as const, dob: '2012-03-01', parent: 'Cao Bá Quát', phone: '0912345126', band: 'AVERAGE' as const, front: false, near: false },
  { code: 'HS08017', name: 'Lâm Như Quỳnh', gender: 'FEMALE' as const, dob: '2012-08-11', parent: 'Lâm Văn Phát', phone: '0912345127', band: 'GOOD' as const, front: false, near: false },
  { code: 'HS08018', name: 'Mai Thái Sơn', gender: 'MALE' as const, dob: '2012-05-29', parent: 'Mai Đức Chung', phone: '0912345128', band: 'NEEDS_SUPPORT' as const, front: true, near: false },
  { code: 'HS08019', name: 'Hồ Phương Thảo', gender: 'FEMALE' as const, dob: '2012-01-23', parent: 'Hồ Hoài Anh', phone: '0912345129', band: 'EXCELLENT' as const, front: false, near: false },
  { code: 'HS08020', name: 'Trịnh Đức Thắng', gender: 'MALE' as const, dob: '2012-10-04', parent: 'Trịnh Xuân Thanh', phone: '0912345130', band: 'GOOD' as const, front: false, near: false },
  { code: 'HS08021', name: 'Nghiêm Minh Trang', gender: 'FEMALE' as const, dob: '2012-06-17', parent: 'Nghiêm Đình Khang', phone: '0912345131', band: 'EXCELLENT' as const, front: false, near: false },
  { code: 'HS08022', name: 'Lương Anh Tuấn', gender: 'MALE' as const, dob: '2012-11-28', parent: 'Lương Thế Vinh', phone: '0912345132', band: 'GOOD' as const, front: false, near: false },
  { code: 'HS08023', name: 'Vương Thu Uyên', gender: 'FEMALE' as const, dob: '2012-02-09', parent: 'Vương Đình Huệ', phone: '0912345133', band: 'EXCELLENT' as const, front: false, near: false },
  { code: 'HS08024', name: 'Hà Quang Vinh', gender: 'MALE' as const, dob: '2012-07-31', parent: 'Hà Văn Thao', phone: '0912345134', band: 'AVERAGE' as const, front: false, near: false },
  { code: 'HS08025', name: 'Tô Ánh Tuyết', gender: 'FEMALE' as const, dob: '2012-12-14', parent: 'Tô Hoài Nam', phone: '0912345135', band: 'GOOD' as const, front: false, near: false },
  { code: 'HS08026', name: 'Chu Đức Anh', gender: 'MALE' as const, dob: '2012-04-05', parent: 'Chu Văn An', phone: '0912345136', band: 'EXCELLENT' as const, front: false, near: false },
  { code: 'HS08027', name: 'Lê Thanh Bình', gender: 'MALE' as const, dob: '2012-08-19', parent: 'Lê Văn Tám', phone: '0912345137', band: 'GOOD' as const, front: false, near: false },
  { code: 'HS08028', name: 'Phạm Ngọc Diệp', gender: 'FEMALE' as const, dob: '2012-09-02', parent: 'Phạm Gia Khiêm', phone: '0912345138', band: 'EXCELLENT' as const, front: false, near: false },
  { code: 'HS08029', name: 'Vũ Đức Hải', gender: 'MALE' as const, dob: '2012-03-26', parent: 'Vũ Trọng Phụng', phone: '0912345139', band: 'AVERAGE' as const, front: false, near: false },
  { code: 'HS08030', name: 'Nguyễn Tường Vy', gender: 'FEMALE' as const, dob: '2012-05-11', parent: 'Nguyễn Bính', phone: '0912345140', band: 'EXCELLENT' as const, front: false, near: false }
];

export const initialStudents: Student[] = studentNamesData.map((item, index) => {
  const row = Math.floor(index / 6) + 1;
  const col = (index % 6) + 1;
  const groupNum = ((index % 4) + 1);

  return {
    id: `student-${item.code.toLowerCase()}`,
    studentCode: item.code,
    nationalEducationCode: `MOET-2026-${item.code}`,
    lifelongLearningRecordId: `LLR-${item.code}-VN`,
    fullName: item.name,
    dateOfBirth: item.dob,
    gender: item.gender,
    ethnicity: 'Kinh',
    birthPlace: 'Hà Nội',
    nativePlace: 'Hà Nội',
    currentAddress: `Số ${index * 3 + 12}, Phường Thụy Khuê, Tây Hồ, Hà Nội`,
    status: 'ACTIVE',
    classId: 'class-8a1',
    className: '8A1',
    enrollmentDate: '2024-09-01',
    seatRow: row,
    seatCol: col,
    groupId: `group-${groupNum}`,
    groupName: `Tổ ${groupNum}`,
    academicBand: item.band,
    needsAttentionTag: item.band === 'NEEDS_SUPPORT' ? 'Needs review' : undefined,
    health: {
      emergencyContactName: item.parent,
      emergencyContactPhone: item.phone,
      needsFrontRowSeat: item.front,
      needsNearBoardSeat: item.near,
      allergyNotice: index === 3 ? 'Dị ứng phấn hoa nhẹ' : undefined,
      visionImpairment: item.front
    },
    guardians: [
      {
        id: `guardian-${index + 1}`,
        studentId: `student-${item.code.toLowerCase()}`,
        fullName: item.parent,
        relationship: 'FATHER',
        phone: item.phone,
        address: `Số ${index * 3 + 12}, Phường Thụy Khuê, Tây Hồ, Hà Nội`,
        isPrimaryContact: true,
        isVerified: true,
        hasPortalAccess: true
      }
    ]
  };
});

export const initialContactLogs: ContactLog[] = [
  {
    id: 'log-001',
    studentId: 'student-hs08008',
    studentName: 'Bùi Gia Huy',
    guardianName: 'Bùi Quang Vinh',
    guardianPhone: '0912345118',
    contactedByTeacherId: 'teacher-nguyen-van-an',
    contactedByTeacherName: 'Thầy Nguyễn Văn An',
    timestamp: '2026-08-25 15:30',
    channel: 'PHONE_CALL',
    purpose: 'Trao đổi về việc phân công chỗ ngồi và hỗ trợ môn Toán',
    summary: 'Phụ huynh xác nhận em Huy thị lực yếu cần ngồi bàn 1 gần bảng; gia đình sẽ hỗ trợ kèm thêm bài tập ở nhà.',
    result: 'Đã bố trí chỗ ngồi bàn 1 dãy giữa và gửi tài liệu ôn tập.',
    followUpDate: '2026-09-10',
    isResolved: true,
    classification: 'PERSONAL'
  },
  {
    id: 'log-002',
    studentId: 'student-hs08018',
    studentName: 'Mai Thái Sơn',
    guardianName: 'Mai Đức Chung',
    guardianPhone: '0912345128',
    contactedByTeacherId: 'teacher-nguyen-van-an',
    contactedByTeacherName: 'Thầy Nguyễn Văn An',
    timestamp: '2026-08-26 10:15',
    channel: 'ZALO',
    purpose: 'Nhắc nhở chuẩn bị đồng phục và đồ dùng học tập tuần mới',
    summary: 'Phụ huynh đã nhận thông tin và cảm ơn thầy giáo.',
    result: 'Hoàn thành trao đổi.',
    isResolved: true,
    classification: 'EDUCATION_STANDARD'
  }
];

export const initialSeatingLayout: SeatingLayout = {
  id: 'layout-8a1-v1',
  classId: 'class-8a1',
  layoutVersion: 1,
  versionName: 'Sơ đồ Chỗ ngồi Học kỳ 1 (Năm học 2026-2027)',
  effectiveFrom: '2026-09-01',
  createdBy: 'Thầy Nguyễn Văn An',
  rows: 5,
  cols: 6,
  desksPerRow: 3,
  seatsPerDesk: 2,
  boardPosition: 'TOP_CENTER',
  notes: 'Bố trí theo 3 dãy đôi, mỗi dãy 5 bàn (10 học sinh/dãy). Ưu tiên học sinh cận thị ngồi bàn đầu.',
  groups: [
    { id: 'group-1', name: 'Tổ 1 (Dãy 1)', leaderStudentId: 'student-hs08001', leaderStudentName: 'Nguyễn Tuấn Anh', studentIds: [] },
    { id: 'group-2', name: 'Tổ 2 (Dãy 2)', leaderStudentId: 'student-hs08002', leaderStudentName: 'Trần Bảo Châu', studentIds: [] },
    { id: 'group-3', name: 'Tổ 3 (Dãy 3)', leaderStudentId: 'student-hs08004', leaderStudentName: 'Phạm Thùy Dung', studentIds: [] },
    { id: 'group-4', name: 'Tổ 4', leaderStudentId: 'student-hs08010', leaderStudentName: 'Dương Đăng Khoa', studentIds: [] },
  ],
  seats: initialStudents.map((st, i) => ({
    row: Math.floor(i / 6) + 1,
    col: (i % 6) + 1,
    deskNumber: Math.floor((i % 6) / 2) + 1,
    studentId: st.id,
    studentName: st.fullName,
    gender: st.gender,
    isLocked: st.health?.needsFrontRowSeat || false,
    groupName: st.groupName
  }))
};

export const initialBehaviorEventTypes: BehaviorEventType[] = [
  { id: 'bhv-01', code: 'ON_TIME', title: 'Đi học đúng giờ và đủ quân tư trang', category: 'DISCIPLINE', type: 'POSITIVE', defaultPoints: 2, minPoints: 1, maxPoints: 5, requiresNote: false, requiresEvidence: false, visibility: 'TEACHER_INTERNAL', enabled: true },
  { id: 'bhv-02', code: 'GOOD_DEED', title: 'Giúp đỡ bạn học tập / Làm việc tốt', category: 'PEER_SUPPORT', type: 'POSITIVE', defaultPoints: 5, minPoints: 1, maxPoints: 10, requiresNote: true, requiresEvidence: false, visibility: 'STUDENT_VISIBLE', enabled: true },
  { id: 'bhv-03', code: 'DUTY_EXCELLENT', title: 'Trực nhật lớp sạch sẽ, đúng giờ', category: 'HYGIENE_DUTY', type: 'POSITIVE', defaultPoints: 3, minPoints: 1, maxPoints: 5, requiresNote: false, requiresEvidence: false, visibility: 'TEACHER_INTERNAL', enabled: true },
  { id: 'bhv-04', code: 'ACTIVE_STUDY', title: 'Hăng hái phát biểu xây dựng bài', category: 'STUDY', type: 'POSITIVE', defaultPoints: 2, minPoints: 1, maxPoints: 5, requiresNote: false, requiresEvidence: false, visibility: 'STUDENT_VISIBLE', enabled: true },
  { id: 'bhv-05', code: 'LATE_ARRIVE', title: 'Đi học muộn không có lý do chính đáng', category: 'DISCIPLINE', type: 'IMPROVEMENT_NEEDED', defaultPoints: -2, minPoints: -5, maxPoints: -1, requiresNote: true, requiresEvidence: false, visibility: 'TEACHER_INTERNAL', enabled: true },
  { id: 'bhv-06', code: 'MISSING_HOMEWORK', title: 'Chưa hoàn thành bài tập về nhà', category: 'STUDY', type: 'IMPROVEMENT_NEEDED', defaultPoints: -2, minPoints: -5, maxPoints: -1, requiresNote: true, requiresEvidence: false, visibility: 'TEACHER_INTERNAL', enabled: true },
  { id: 'bhv-07', code: 'UNIFORM_VIOLATION', title: 'Sai quy định đồng phục / Khăn quàng', category: 'DISCIPLINE', type: 'IMPROVEMENT_NEEDED', defaultPoints: -1, minPoints: -3, maxPoints: -1, requiresNote: false, requiresEvidence: false, visibility: 'TEACHER_INTERNAL', enabled: true },
];

export const initialBehaviorObservations = [
  {
    id: 'obs-01',
    classId: 'class-8a1',
    studentId: 'student-hs08001',
    studentName: 'Nguyễn Tuấn Anh',
    eventTypeId: 'bhv-02',
    eventTitle: 'Giúp đỡ bạn học tập / Làm việc tốt',
    eventType: 'POSITIVE' as const,
    points: 5,
    occurredDate: '2026-08-25',
    recordedAt: '2026-08-25 11:30',
    periodIndex: 4,
    note: 'Hướng dẫn bạn Huy giải bài tập Toán hình học.',
    recordedByTeacherName: 'Thầy Nguyễn Văn An',
    visibility: 'STUDENT_VISIBLE' as const,
    status: 'POSTED' as const
  },
  {
    id: 'obs-02',
    classId: 'class-8a1',
    studentId: 'student-hs08005',
    studentName: 'Hoàng Quốc Đạt',
    eventTypeId: 'bhv-05',
    eventTitle: 'Đi học muộn không có lý do chính đáng',
    eventType: 'IMPROVEMENT_NEEDED' as const,
    points: -2,
    occurredDate: '2026-08-26',
    recordedAt: '2026-08-26 07:20',
    periodIndex: 1,
    note: 'Đến lớp lúc 07h15 (muộn 15 phút do hỏng xe đạp điện).',
    recordedByTeacherName: 'Thầy Nguyễn Văn An',
    visibility: 'TEACHER_INTERNAL' as const,
    status: 'POSTED' as const
  }
];

export const initialFinancialCampaigns: FinancialCampaign[] = [
  {
    id: 'camp-01',
    code: 'QTT-2026-01',
    classId: 'class-8a1',
    academicYearId: 'ay-2026-2027',
    title: 'Quỹ Hoạt động Ngoại khóa & Trải nghiệm Lớp 8A1 (Tự nguyện)',
    type: 'CLASS_FUND_CONTRIBUTION',
    isVoluntary: true,
    legalPolicyBasis: 'TT55/2011/TT-BGDĐT & Nghị quyết Hội nghị Cha mẹ học sinh đầu năm',
    suggestedAmount: 200000,
    totalExpectedAmount: 6000000,
    startDate: '2026-09-01',
    dueDate: '2026-10-15',
    status: 'ACTIVE',
    description: 'Kinh phí phục vụ nước uống, liên hoan trung thu, khen thưởng phong trào và hoạt động trải nghiệm thực tế.',
    prohibitedPurposeChecked: true,
    parentVisible: true
  },
  {
    id: 'camp-02',
    code: 'BHYT-2026',
    classId: 'class-8a1',
    academicYearId: 'ay-2026-2027',
    title: 'Bảo hiểm Y tế Học sinh năm học 2026 - 2027 (Theo quy định Nhà nước)',
    type: 'SCHOOL_AUTHORIZED_COLLECTION_TRACKING',
    isVoluntary: false,
    legalPolicyBasis: 'Luật Bảo hiểm Y tế và hướng dẫn liên ngành BHXH - Sở GD&ĐT',
    suggestedAmount: 680400,
    totalExpectedAmount: 20412000,
    startDate: '2026-09-01',
    dueDate: '2026-10-31',
    status: 'ACTIVE',
    description: 'Thu và nộp trực tiếp về Bảo hiểm Xã hội Quận Tây Hồ để gia hạn thẻ BHYT học sinh.',
    prohibitedPurposeChecked: true,
    parentVisible: true
  }
];

export const initialFinancialTransactions: FinancialTransaction[] = [
  {
    id: 'tx-01',
    classId: 'class-8a1',
    campaignId: 'camp-01',
    studentId: 'student-hs08001',
    studentName: 'Nguyễn Tuấn Anh',
    type: 'INCOME',
    category: 'Đóng góp Quỹ lớp',
    title: 'Đóng góp Quỹ hoạt động lớp HK1',
    amount: 200000,
    occurredAt: '2026-08-25 09:00',
    recordedAt: '2026-08-25 09:05',
    paymentMethod: 'BANK_TRANSFER',
    payerOrPayee: 'Phụ huynh Nguyễn Văn Hùng',
    referenceNo: 'FT26082500123',
    recordedByTeacherName: 'Thầy Nguyễn Văn An',
    status: 'POSTED'
  },
  {
    id: 'tx-02',
    classId: 'class-8a1',
    campaignId: 'camp-01',
    studentId: 'student-hs08002',
    studentName: 'Trần Bảo Châu',
    type: 'INCOME',
    category: 'Đóng góp Quỹ lớp',
    title: 'Đóng góp Quỹ hoạt động lớp HK1',
    amount: 200000,
    occurredAt: '2026-08-25 10:15',
    recordedAt: '2026-08-25 10:20',
    paymentMethod: 'CASH',
    payerOrPayee: 'Phụ huynh Trần Văn Long',
    referenceNo: 'PT-01',
    recordedByTeacherName: 'Thầy Nguyễn Văn An',
    status: 'POSTED'
  },
  {
    id: 'tx-03',
    classId: 'class-8a1',
    campaignId: 'camp-01',
    type: 'EXPENSE',
    category: 'Văn phòng phẩm & Trang trí lớp',
    title: 'Mua khăn trải bàn giáo viên, bảng phấn trang trí và nước uống đóng bình',
    amount: 150000,
    occurredAt: '2026-08-26 08:30',
    recordedAt: '2026-08-26 08:45',
    paymentMethod: 'CASH',
    payerOrPayee: 'Cửa hàng VPP Tuổi Trẻ (Số HĐ: 00482)',
    recordedByTeacherName: 'Thầy Nguyễn Văn An',
    status: 'POSTED'
  }
];

export const initialStudentFeeEntries: StudentFeeEntry[] = initialStudents.map((st, i) => {
  const isPaid = i < 15;
  return {
    campaignId: 'camp-01',
    studentId: st.id,
    studentName: st.fullName,
    requiredAmount: 200000,
    paidAmount: isPaid ? 200000 : 0,
    remainingAmount: isPaid ? 0 : 200000,
    status: isPaid ? 'PAID' : 'UNPAID',
    lastPaidAt: isPaid ? '2026-08-25' : undefined
  };
});

export const initialAttendanceRecords: AttendanceRecord[] = initialStudents.map((st, i) => {
  let status: AttendanceRecord['status'] = 'PRESENT';
  let reason: string | undefined = undefined;

  if (i === 4) {
    status = 'LATE';
    reason = 'Hỏng xe đạp điện, đến muộn 15p';
  } else if (i === 7) {
    status = 'ABSENT_EXCUSED';
    reason = 'Gia đình có việc hiếu, đã gửi đơn xin phép';
  }

  return {
    id: `att-20260826-${st.id}`,
    classId: 'class-8a1',
    studentId: st.id,
    studentName: st.fullName,
    date: '2026-08-26',
    session: 'ALL_DAY',
    status,
    reason,
    recordedByTeacherId: 'teacher-nguyen-van-an',
    recordedByTeacherName: 'Thầy Nguyễn Văn An',
    recordedAt: '2026-08-26 07:15',
    isLocked: false
  };
});

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-001',
    classId: 'class-8a1',
    studentId: 'student-hs08008',
    studentName: 'Bùi Gia Huy',
    submittedByGuardianId: 'guardian-8',
    guardianName: 'Bùi Quang Vinh',
    guardianPhone: '0912345118',
    fromDate: '2026-08-26',
    toDate: '2026-08-27',
    consecutiveDays: 2,
    reason: 'Cháu theo gia đình về quê có việc tang của cụ.',
    status: 'HOMEROOM_APPROVED',
    reviewedByTeacherId: 'teacher-nguyen-van-an',
    reviewedByTeacherName: 'Thầy Nguyễn Văn An',
    reviewComment: 'Thầy đồng ý cho em nghỉ phép 02 ngày. Chúc việc gia đình chu toàn.',
    submittedAt: '2026-08-25 18:30',
    reviewedAt: '2026-08-25 19:15'
  }
];

export const initialGradeEntries: GradeEntry[] = [];
initialStudents.forEach((st, idx) => {
  initialSubjects.forEach((sub) => {
    let tx1 = 8.5;
    let tx2 = 9.0;
    let tx3 = 8.0;
    let gk = 8.5;
    let ck = 9.0;

    if (idx === 7) { // Huy
      tx1 = 6.0; tx2 = 6.5; gk = 6.0;
    } else if (idx === 4) { // Đạt
      tx1 = 7.0; tx2 = 7.5; gk = 7.0;
    } else if (idx % 3 === 0) {
      tx1 = 9.5; tx2 = 10.0; gk = 9.5;
    }

    const avg = sub.hasNumericScore ? Number(((tx1 + tx2 + gk * 2) / 4).toFixed(1)) : undefined;

    initialGradeEntries.push({
      id: `grade-${st.id}-${sub.id}`,
      classId: 'class-8a1',
      subjectId: sub.id,
      subjectName: sub.name,
      studentId: st.id,
      studentName: st.fullName,
      term: 1,
      academicYearId: 'ay-2026-2027',
      tx1,
      tx2,
      tx3: idx % 2 === 0 ? tx3 : undefined,
      gk,
      averageScore: avg,
      evaluationResult: !sub.hasNumericScore ? 'PASSED' : undefined,
      teacherComment: idx % 4 === 0 ? 'Nắm vững kiến thức, tiếp thu bài nhanh' : undefined,
      commentVisibility: 'HOMEROOM',
      isLocked: false,
      lastModifiedBy: sub.teacherName || 'GVBM',
      lastModifiedAt: '2026-08-25 16:00'
    });
  });
});

export const initialHomeroomBook: HomeroomBook = {
  id: 'hmr-8a1-2026',
  classId: 'class-8a1',
  className: 'Lớp 8A1',
  academicYearId: 'ay-2026-2027',
  homeroomTeacherName: 'Thầy Nguyễn Văn An',
  retentionPolicyId: 'RET-SECONDARY-HOMEROOM',
  status: 'ACTIVE',
  lastGeneratedAt: '2026-08-26 14:00',
  semester1Plan: {
    strengths: 'Đa số học sinh chăm ngoan, có ý thức kỷ luật tốt; phụ huynh quan tâm và nhiệt tình phối hợp với nhà trường.',
    challenges: 'Một số em còn rụt rè trong thảo luận nhóm; có 02 học sinh cần theo dõi sát về năng lực môn Toán và Tiếng Anh.',
    targetHonorsCount: 18,
    targetGoodConductCount: 28,
    actionPlans: [
      'Xây dựng đôi bạn cùng tiến giữa học sinh khá/giỏi và học sinh cần kèm cặp.',
      'Duy trì 15 phút sinh hoạt đầu giờ kiểm tra bài cũ và nề nếp trang phục.',
      'Tổ chức 01 buổi sinh hoạt chuyên đề Kỹ năng an toàn trên không gian mạng vào tháng 10/2026.',
      'Ứng dụng sổ chủ nhiệm điện tử và kênh liên lạc số để phối hợp tức thời với phụ huynh.'
    ]
  },
  monthlyProgress: [
    {
      month: 9,
      summary: 'Ổn định nề nếp đầu năm, hoàn thiện sơ đồ lớp và bầu ban cán sự lớp.',
      achievements: '100% học sinh đi học đầy đủ tuần lễ đầu tiên; hoàn thành thu nhận hồ sơ phụ huynh.',
      pendingIssues: '01 trường hợp học sinh hay quên bảng con trong giờ học.',
      submittedAt: '2026-08-26 10:00',
      reviewedByPrincipal: true
    }
  ]
};

export const initialClassMeetings: ClassMeeting[] = [
  {
    id: 'meeting-w01',
    classId: 'class-8a1',
    weekNumber: 1,
    date: '2026-08-23',
    agenda: [
      'Ổn định tổ chức và phổ biến nội quy trường học 2026.',
      'Bầu ban cán sự lớp và chia 4 tổ học tập.',
      'Công bố sơ đồ chỗ ngồi tạm thời.',
      'Triển khai kế hoạch tham gia lễ Khai giảng năm học mới.'
    ],
    attendanceCount: 30,
    positiveHighlights: [
      'Các em đến lớp đầy đủ, đúng giờ, trang phục chỉnh tề.',
      'Em Nguyễn Tuấn Anh được tín nhiệm bầu làm Lớp trưởng 100% phiếu thuận.'
    ],
    issuesToImprove: [
      'Một số bạn còn nói chuyện riêng trong giờ sinh hoạt.',
      'Cần chú ý tắt điện và khóa cửa sổ sau khi tan học.'
    ],
    studentFeedback: [
      'Học sinh đề xuất được luân chuyển chỗ ngồi theo dãy sau mỗi tháng để đảm bảo công bằng tầm nhìn.'
    ],
    nextWeekTasks: [
      'Tập dượt nghi thức Đội cho lễ Khai giảng.',
      'Trực nhật tổ 1 chuẩn bị trang trí bảng tin lớp.'
    ],
    meetingMinutesSummary: 'Cuộc họp diễn ra nghiêm túc, sôi nổi và thống nhất cao các chỉ tiêu phấn đấu của lớp trong năm học mới.',
    recordedBy: 'Trần Bảo Châu (Thư ký lớp)',
    status: 'COMPLETED'
  }
];

export const initialEarlyWarnings: EarlyWarningSignal[] = [
  {
    id: 'warn-01',
    studentId: 'student-hs08008',
    studentName: 'Bùi Gia Huy',
    className: '8A1',
    signalType: 'ATTENDANCE_ANOMALY',
    title: 'Học sinh vắng phép liên tiếp 2 ngày',
    description: 'Vắng 2 buổi trong tuần 1 do việc gia đình; cần hỗ trợ gửi phiếu bài tập để theo kịp tiến độ môn KHTN và Toán.',
    quantitativeMetric: '2 buổi / 5 ngày học',
    severity: 'MEDIUM',
    detectedAt: '2026-08-26 08:00',
    status: 'NEW'
  }
];

export const initialCounselingCases: CounselingCase[] = [
  {
    id: 'cns-01',
    caseCode: 'CNS-2026-004',
    studentId: 'student-hs08018',
    studentName: 'Mai Thái Sơn',
    className: '8A1',
    referredByTeacherName: 'Thầy Nguyễn Văn An',
    referralReason: 'Học sinh có biểu hiện lo âu khi bước vào các bài kiểm tra định kỳ.',
    referralDate: '2026-08-24',
    assignedCounselorName: 'Cô Vũ Thị Hà (Cán bộ Tư vấn học đường)',
    triageLevel: 'ROUTINE',
    status: 'ACTIVE',
    supportGoal: 'Xây dựng phương pháp quản lý căng thẳng và kỹ thuật phân bổ thời gian làm bài.',
    generalHomeroomAdvice: 'Khuyến khích học sinh phát biểu, tạo không khí học tập nhẹ nhàng, không tạo áp lực điểm số.',
    isSealed: false,
    classification: 'SENSITIVE'
  }
];

export const initialIncidentRecords: IncidentRecord[] = [];

export const initialRewardProposals: RewardProposal[] = [
  {
    id: 'rwd-01',
    studentId: 'student-hs08001',
    studentName: 'Nguyễn Tuấn Anh',
    className: '8A1',
    achievementType: 'ETHICS_GOOD_DEED',
    title: 'Nhặt được của rơi trả lại người đánh mất',
    description: 'Nhặt được chiếc ví có 500.000đ và thẻ căn cước tại sân trường, kịp thời giao nộp cho Tổng phụ trách Đội để trả lại cho học sinh lớp 7.',
    proposedByTeacherName: 'Thầy Nguyễn Văn An',
    proposedLevel: 'SCHOOL_COMMENDATION',
    status: 'APPROVED',
    approvedAt: '2026-08-25'
  }
];

export const initialTasks: UnifiedTask[] = [
  {
    id: 'task-01',
    title: 'Hoàn thành cập nhật thông tin sơ đồ lớp 8A1',
    description: 'Kiểm tra lại vị trí chỗ ngồi của học sinh cận thị và xuất bản file Word A4 lưu hồ sơ lớp.',
    assignedRole: 'HOMEROOM_TEACHER',
    assignedTeacherName: 'Thầy Nguyễn Văn An',
    dueDate: '2026-08-28',
    priority: 'HIGH',
    category: 'HOMEROOM',
    isCompleted: false
  },
  {
    id: 'task-02',
    title: 'Kiểm tra và khóa điểm kiểm tra thường xuyên (TX1) môn Toán',
    description: 'Nhập điểm bài kiểm tra 15 phút tuần 2 vào hệ thống sổ điểm điện tử.',
    assignedRole: 'SUBJECT_TEACHER',
    assignedTeacherName: 'Thầy Nguyễn Văn An',
    dueDate: '2026-09-05',
    priority: 'NORMAL',
    category: 'ASSESSMENT',
    isCompleted: false
  },
  {
    id: 'task-03',
    title: 'Duyệt kế hoạch chủ nhiệm tháng 9 các lớp khối 8',
    description: 'Xem xét và phê duyệt sổ chủ nhiệm điện tử đầu năm của GVCN.',
    assignedRole: 'PRINCIPAL',
    dueDate: '2026-08-30',
    priority: 'NORMAL',
    category: 'ADMIN',
    isCompleted: false
  }
];

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'cal-01',
    title: 'Lễ Khai giảng Năm học mới 2026 - 2027',
    description: 'Toàn trường tập trung tại sân lễ lúc 07h00. Học sinh mặc lễ phục truyền thống.',
    startDate: '2026-09-05',
    timeString: '07:00 - 09:30',
    scope: 'SCHOOL',
    type: 'ACADEMIC'
  },
  {
    id: 'cal-02',
    title: 'Hội nghị Cha mẹ học sinh đầu năm học',
    description: 'Họp phụ huynh toàn trường và họp riêng theo từng lớp chủ nhiệm.',
    startDate: '2026-09-13',
    timeString: '08:00 - 11:00',
    scope: 'SCHOOL',
    type: 'MEETING'
  },
  {
    id: 'cal-03',
    title: 'Tiết Sinh hoạt Lớp tuần 4',
    description: 'Tổng kết thi đua tháng 8 và phân công tổ chức ngày hội trăng rằm.',
    startDate: '2026-08-29',
    timeString: '10:45 - 11:30',
    scope: 'CLASS',
    classId: 'class-8a1',
    type: 'ACTIVITY'
  }
];

export const initialRetentionPolicies: RetentionPolicy[] = [
  { id: 'RET-SECONDARY-REGISTER', name: 'Sổ đăng bộ - THCS/THPT', legalBasis: 'TT08/2025/TT-BGDĐT', level: 'LOWER_SECONDARY', durationString: 'PERMANENT', dispositionAction: 'ARCHIVE', isLegalHoldActive: false },
  { id: 'RET-SECONDARY-GRADEBOOK', name: 'Sổ gọi tên và ghi điểm điện tử', legalBasis: 'TT08/2025/TT-BGDĐT', level: 'LOWER_SECONDARY', durationString: 'PERMANENT', dispositionAction: 'ARCHIVE', isLegalHoldActive: false },
  { id: 'RET-SECONDARY-REWARD-DISCIPLINE', name: 'Hồ sơ khen thưởng, kỷ luật học sinh', legalBasis: 'TT08/2025/TT-BGDĐT', level: 'LOWER_SECONDARY', durationString: '10Y', dispositionAction: 'DESTROY_REVIEW', isLegalHoldActive: false },
  { id: 'RET-SECONDARY-HOMEROOM', name: 'Sổ chủ nhiệm lớp - THCS/THPT', legalBasis: 'TT08/2025/TT-BGDĐT', level: 'LOWER_SECONDARY', durationString: 'UNTIL_COURSE_END', dispositionAction: 'ARCHIVE', isLegalHoldActive: false },
  { id: 'RET-SECONDARY-HEADBOOK', name: 'Sổ ghi đầu bài điện tử', legalBasis: 'TT08/2025/TT-BGDĐT', level: 'LOWER_SECONDARY', durationString: 'UNTIL_COURSE_END', dispositionAction: 'ARCHIVE', isLegalHoldActive: false },
  { id: 'RET-SECONDARY-TRANSFER', name: 'Sổ theo dõi học sinh chuyển đi / chuyển đến', legalBasis: 'TT08/2025/TT-BGDĐT', level: 'LOWER_SECONDARY', durationString: '5Y', dispositionAction: 'DESTROY_REVIEW', isLegalHoldActive: false },
  { id: 'RET-SECONDARY-INCLUSIVE', name: 'Hồ sơ giáo dục học sinh khuyết tật / hòa nhập', legalBasis: 'TT08/2025/TT-BGDĐT', level: 'LOWER_SECONDARY', durationString: '10Y', dispositionAction: 'HANDOVER', isLegalHoldActive: false },
];
