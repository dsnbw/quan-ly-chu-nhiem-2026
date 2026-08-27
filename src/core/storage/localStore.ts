// ============================================================================
// LOCAL STORAGE & REPOSITORY ABSTRACTION (OFFLINE-FIRST)
// Supports IndexedDB & LocalStorage with Mutation Outbox (SYNC-002, SYNC-003)
// ============================================================================

import {
  Student,
  ClassRoom,
  SeatingLayout,
  FinancialCampaign,
  FinancialTransaction,
  StudentFeeEntry,
  BehaviorObservation,
  AttendanceRecord,
  LeaveRequest,
  GradeEntry,
  HomeroomBook,
  ClassMeeting,
  EarlyWarningSignal,
  CounselingCase,
  IncidentRecord,
  RewardProposal,
  UnifiedTask,
  CalendarEvent,
  ContactLog,
  MutationEnvelope,
  SyncConflictRecord,
  SyncServerConfig,
  AuditEvent,
  UserSession,
  RoleType,
  SchoolConfig,
  AcademicYear,
  Subject,
  BehaviorEventType,
  RetentionPolicy
} from '../../types';

import * as sampleData from '../seed/sampleData';
import {
  initialSchoolConfig,
  initialAcademicYears,
  initialClasses,
  initialSubjects,
  initialStudents,
  initialContactLogs,
  initialSeatingLayout,
  initialBehaviorEventTypes,
  initialBehaviorObservations,
  initialFinancialCampaigns,
  initialFinancialTransactions,
  initialStudentFeeEntries,
  initialAttendanceRecords,
  initialLeaveRequests,
  initialGradeEntries,
  initialHomeroomBook,
  initialClassMeetings,
  initialEarlyWarnings,
  initialCounselingCases,
  initialIncidentRecords,
  initialRewardProposals,
  initialTasks,
  initialCalendarEvents,
  initialRetentionPolicies
} from '../seed/initialData';

const STORAGE_KEYS = {
  SCHOOL: 'cva_school_config',
  ACADEMIC_YEARS: 'cva_academic_years',
  CLASSES: 'cva_classes',
  SUBJECTS: 'cva_subjects',
  STUDENTS: 'cva_students',
  CONTACT_LOGS: 'cva_contact_logs',
  SEATING: 'cva_seating_layout',
  BEHAVIOR_TYPES: 'cva_behavior_types',
  BEHAVIOR_OBS: 'cva_behavior_obs',
  FIN_CAMPAIGNS: 'cva_fin_campaigns',
  FIN_TRANSACTIONS: 'cva_fin_transactions',
  FIN_FEES: 'cva_fin_fees',
  ATTENDANCE: 'cva_attendance',
  LEAVE_REQUESTS: 'cva_leave_requests',
  GRADES: 'cva_grades',
  HOMEROOM_BOOK: 'cva_homeroom_book',
  CLASS_MEETINGS: 'cva_class_meetings',
  EARLY_WARNINGS: 'cva_early_warnings',
  COUNSELING: 'cva_counseling',
  INCIDENTS: 'cva_incidents',
  REWARDS: 'cva_rewards',
  TASKS: 'cva_tasks',
  CALENDAR: 'cva_calendar',
  RETENTION: 'cva_retention',
  OUTBOX: 'cva_sync_outbox',
  CONFLICTS: 'cva_sync_conflicts',
  SYNC_CONFIG: 'cva_sync_config',
  AUDIT_LOGS: 'cva_audit_logs',
  USER_SESSION: 'cva_user_session'
};

class LocalRepository {
  private memoryCache: Map<string, any> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  private init() {
    // Check if initial data exists, if not seed it
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      this.resetToSeedData();
    }
  }

  public resetToSeedData() {
    this.setItem(STORAGE_KEYS.SCHOOL, initialSchoolConfig);
    this.setItem(STORAGE_KEYS.ACADEMIC_YEARS, initialAcademicYears);
    this.setItem(STORAGE_KEYS.CLASSES, initialClasses);
    this.setItem(STORAGE_KEYS.SUBJECTS, initialSubjects);
    this.setItem(STORAGE_KEYS.STUDENTS, initialStudents);
    this.setItem(STORAGE_KEYS.CONTACT_LOGS, initialContactLogs);
    this.setItem(STORAGE_KEYS.SEATING, initialSeatingLayout);
    this.setItem(STORAGE_KEYS.BEHAVIOR_TYPES, initialBehaviorEventTypes);
    this.setItem(STORAGE_KEYS.BEHAVIOR_OBS, initialBehaviorObservations);
    this.setItem(STORAGE_KEYS.FIN_CAMPAIGNS, initialFinancialCampaigns);
    this.setItem(STORAGE_KEYS.FIN_TRANSACTIONS, initialFinancialTransactions);
    this.setItem(STORAGE_KEYS.FIN_FEES, initialStudentFeeEntries);
    this.setItem(STORAGE_KEYS.ATTENDANCE, initialAttendanceRecords);
    this.setItem(STORAGE_KEYS.LEAVE_REQUESTS, initialLeaveRequests);
    this.setItem(STORAGE_KEYS.GRADES, initialGradeEntries);
    this.setItem(STORAGE_KEYS.HOMEROOM_BOOK, initialHomeroomBook);
    this.setItem(STORAGE_KEYS.CLASS_MEETINGS, initialClassMeetings);
    this.setItem(STORAGE_KEYS.EARLY_WARNINGS, initialEarlyWarnings);
    this.setItem(STORAGE_KEYS.COUNSELING, initialCounselingCases);
    this.setItem(STORAGE_KEYS.INCIDENTS, initialIncidentRecords);
    this.setItem(STORAGE_KEYS.REWARDS, initialRewardProposals);
    this.setItem(STORAGE_KEYS.TASKS, initialTasks);
    this.setItem(STORAGE_KEYS.CALENDAR, initialCalendarEvents);
    this.setItem(STORAGE_KEYS.RETENTION, initialRetentionPolicies);
    this.setItem(STORAGE_KEYS.OUTBOX, []);
    this.setItem(STORAGE_KEYS.CONFLICTS, []);
    this.setItem(STORAGE_KEYS.SYNC_CONFIG, {
      mode: 'LOCAL_ONLY',
      serverBaseUrl: 'https://sync.chuvanan.edu.vn/api/v1',
      schoolTenantId: 'cva-hn-2026',
      autoSync: true,
      syncIntervalMinutes: 5,
      syncOnNetworkRegained: true,
      deviceId: 'device-win-' + Math.random().toString(36).substring(2, 9),
      deviceName: 'Máy tính GVCN (Windows Desktop)'
    } as SyncServerConfig);
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'audit-001',
        timestamp: new Date().toISOString(),
        actorId: 'user-default',
        actorName: 'Giáo viên',
        actorRole: 'HOMEROOM_TEACHER',
        action: 'INITIALIZE_SYSTEM',
        resourceType: 'SYSTEM',
        resourceId: 'sys-001',
        schoolId: 'school-default',
        details: 'Khởi tạo dữ liệu hệ thống.',
        classification: 'PUBLIC_INTERNAL'
      }
    ]);
    this.setItem(STORAGE_KEYS.USER_SESSION, {
      userId: 'user-default',
      username: 'teacher',
      fullName: 'Giáo viên',
      email: '',
      phone: '',
      activeRole: 'HOMEROOM_TEACHER',
      availableRoles: ['HOMEROOM_TEACHER', 'SUBJECT_TEACHER', 'PRINCIPAL', 'SCHOOL_ADMIN', 'PARENT_GUARDIAN', 'STUDENT'],
      schoolId: 'school-default',
      currentAcademicYearId: 'ay-2026-2027',
      homeroomClassId: 'class-default',
      teachingSubjectIds: [],
      teachingClassIds: ['class-default']
    } as UserSession);
    this.notify();
  }

  public loadSampleData() {
    this.setItem(STORAGE_KEYS.SCHOOL, sampleData.initialSchoolConfig);
    this.setItem(STORAGE_KEYS.ACADEMIC_YEARS, sampleData.initialAcademicYears);
    this.setItem(STORAGE_KEYS.CLASSES, sampleData.initialClasses);
    this.setItem(STORAGE_KEYS.SUBJECTS, sampleData.initialSubjects);
    this.setItem(STORAGE_KEYS.STUDENTS, sampleData.initialStudents);
    this.setItem(STORAGE_KEYS.CONTACT_LOGS, sampleData.initialContactLogs);
    this.setItem(STORAGE_KEYS.SEATING, sampleData.initialSeatingLayout);
    this.setItem(STORAGE_KEYS.BEHAVIOR_TYPES, sampleData.initialBehaviorEventTypes);
    this.setItem(STORAGE_KEYS.BEHAVIOR_OBS, sampleData.initialBehaviorObservations);
    this.setItem(STORAGE_KEYS.FIN_CAMPAIGNS, sampleData.initialFinancialCampaigns);
    this.setItem(STORAGE_KEYS.FIN_TRANSACTIONS, sampleData.initialFinancialTransactions);
    this.setItem(STORAGE_KEYS.FIN_FEES, sampleData.initialStudentFeeEntries);
    this.setItem(STORAGE_KEYS.ATTENDANCE, sampleData.initialAttendanceRecords);
    this.setItem(STORAGE_KEYS.LEAVE_REQUESTS, sampleData.initialLeaveRequests);
    this.setItem(STORAGE_KEYS.GRADES, sampleData.initialGradeEntries);
    this.setItem(STORAGE_KEYS.HOMEROOM_BOOK, sampleData.initialHomeroomBook);
    this.setItem(STORAGE_KEYS.CLASS_MEETINGS, sampleData.initialClassMeetings);
    this.setItem(STORAGE_KEYS.EARLY_WARNINGS, sampleData.initialEarlyWarnings);
    this.setItem(STORAGE_KEYS.COUNSELING, sampleData.initialCounselingCases);
    this.setItem(STORAGE_KEYS.INCIDENTS, sampleData.initialIncidentRecords);
    this.setItem(STORAGE_KEYS.REWARDS, sampleData.initialRewardProposals);
    this.setItem(STORAGE_KEYS.TASKS, sampleData.initialTasks);
    this.setItem(STORAGE_KEYS.CALENDAR, sampleData.initialCalendarEvents);
    this.setItem(STORAGE_KEYS.RETENTION, sampleData.initialRetentionPolicies);
    this.setItem(STORAGE_KEYS.USER_SESSION, {
      userId: 'teacher-nguyen-van-an',
      username: 'an.nguyenvan',
      fullName: 'Thầy Nguyễn Văn An',
      email: 'an.nguyenvan@chuvanan.edu.vn',
      phone: '0912 345 678',
      activeRole: 'HOMEROOM_TEACHER',
      availableRoles: ['HOMEROOM_TEACHER', 'SUBJECT_TEACHER', 'PRINCIPAL', 'SCHOOL_ADMIN', 'PARENT_GUARDIAN', 'STUDENT'],
      schoolId: 'school-cva-01',
      currentAcademicYearId: 'ay-2026-2027',
      homeroomClassId: 'class-8a1',
      teachingSubjectIds: ['sub-math', 'sub-exp'],
      teachingClassIds: ['class-8a1', 'class-8a2']
    } as UserSession);
    this.notify();
  }


  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const cached = this.memoryCache.get(key);
      if (cached !== undefined) return cached;
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;
      const parsed = JSON.parse(raw);
      this.memoryCache.set(key, parsed);
      return parsed;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T) {
    try {
      this.memoryCache.set(key, value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }

  // --- Record a mutation in the Outbox (SYNC-004) ---
  public recordMutation(entityType: string, entityId: string, opType: MutationEnvelope['operationType'], patch: Record<string, any>) {
    const session = this.getUserSession();
    const outbox = this.getOutbox();
    const envelope: MutationEnvelope = {
      operationId: 'op-' + Math.random().toString(36).substring(2, 11),
      entityType,
      entityId,
      operationType: opType,
      baseVersion: 1,
      fieldPatch: patch,
      clientCreatedAt: new Date().toISOString(),
      deviceId: this.getSyncConfig().deviceId,
      actorId: session.userId,
      actorName: session.fullName,
      schoolId: session.schoolId,
      isSynced: false
    };

    outbox.unshift(envelope);
    this.setItem(STORAGE_KEYS.OUTBOX, outbox);

    // Also record audit log
    this.recordAudit({
      id: 'aud-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      actorId: session.userId,
      actorName: session.fullName,
      actorRole: session.activeRole,
      action: `${opType}_${entityType.toUpperCase()}`,
      resourceType: entityType,
      resourceId: entityId,
      schoolId: session.schoolId,
      details: `Thực hiện ${opType} trên ${entityType} (${entityId}): ${JSON.stringify(patch).slice(0, 100)}`,
      classification: 'EDUCATION_STANDARD'
    });

    this.notify();
  }

  // --- Entity Getters & Setters ---

  public getSchoolConfig(): SchoolConfig { 
    const saved = this.getItem(STORAGE_KEYS.SCHOOL, initialSchoolConfig);
    return { ...initialSchoolConfig, ...saved };
  }
  public saveSchoolConfig(config: SchoolConfig) {
    this.setItem(STORAGE_KEYS.SCHOOL, config);
    this.recordMutation('school_config', config.id, 'PATCH', config);
  }

  public getAcademicYears(): AcademicYear[] { return this.getItem(STORAGE_KEYS.ACADEMIC_YEARS, initialAcademicYears); }
  public getClasses(): ClassRoom[] { return this.getItem(STORAGE_KEYS.CLASSES, initialClasses); }
  public getSubjects(): Subject[] { return this.getItem(STORAGE_KEYS.SUBJECTS, initialSubjects); }

  public getStudents(): Student[] { return this.getItem(STORAGE_KEYS.STUDENTS, initialStudents); }
  public saveStudent(student: Student) {
    const list = this.getStudents();
    const idx = list.findIndex(s => s.id === student.id);
    if (idx >= 0) {
      list[idx] = student;
      this.recordMutation('student', student.id, 'PATCH', student);
    } else {
      list.push(student);
      this.recordMutation('student', student.id, 'CREATE', student);
    }
    this.setItem(STORAGE_KEYS.STUDENTS, list);
    this.notify();
  }

  public getContactLogs(): ContactLog[] { return this.getItem(STORAGE_KEYS.CONTACT_LOGS, initialContactLogs); }
  public addContactLog(log: ContactLog) {
    const list = this.getContactLogs();
    list.unshift(log);
    this.setItem(STORAGE_KEYS.CONTACT_LOGS, list);
    this.recordMutation('contact_log', log.id, 'CREATE', log);
    this.notify();
  }

  public getSeatingLayout(): SeatingLayout { return this.getItem(STORAGE_KEYS.SEATING, initialSeatingLayout); }
  public saveSeatingLayout(layout: SeatingLayout) {
    this.setItem(STORAGE_KEYS.SEATING, layout);
    this.recordMutation('seating_layout', layout.id, 'PATCH', layout);
    this.notify();
  }

  public getBehaviorTypes(): BehaviorEventType[] { return this.getItem(STORAGE_KEYS.BEHAVIOR_TYPES, initialBehaviorEventTypes); }
  public getBehaviorObservations(): BehaviorObservation[] { return this.getItem(STORAGE_KEYS.BEHAVIOR_OBS, initialBehaviorObservations); }
  public addBehaviorObservation(obs: BehaviorObservation) {
    const list = this.getBehaviorObservations();
    list.unshift(obs);
    this.setItem(STORAGE_KEYS.BEHAVIOR_OBS, list);
    this.recordMutation('behavior_observation', obs.id, 'CREATE', obs);
    this.notify();
  }

  public getFinancialCampaigns(): FinancialCampaign[] { return this.getItem(STORAGE_KEYS.FIN_CAMPAIGNS, initialFinancialCampaigns); }
  public saveFinancialCampaign(camp: FinancialCampaign) {
    const list = this.getFinancialCampaigns();
    const idx = list.findIndex(c => c.id === camp.id);
    if (idx >= 0) {
      list[idx] = camp;
      this.recordMutation('financial_campaign', camp.id, 'PATCH', camp);
    } else {
      list.unshift(camp);
      this.recordMutation('financial_campaign', camp.id, 'CREATE', camp);
    }
    this.setItem(STORAGE_KEYS.FIN_CAMPAIGNS, list);
    this.notify();
  }

  public getFinancialTransactions(): FinancialTransaction[] { return this.getItem(STORAGE_KEYS.FIN_TRANSACTIONS, initialFinancialTransactions); }
  public addFinancialTransaction(tx: FinancialTransaction) {
    const list = this.getFinancialTransactions();
    list.unshift(tx);
    this.setItem(STORAGE_KEYS.FIN_TRANSACTIONS, list);
    this.recordMutation('financial_transaction', tx.id, 'CREATE', tx);

    // If related to a student obligation, update fee status
    if (tx.campaignId && tx.studentId && tx.type === 'INCOME') {
      const fees = this.getStudentFees();
      const fee = fees.find(f => f.campaignId === tx.campaignId && f.studentId === tx.studentId);
      if (fee) {
        fee.paidAmount += tx.amount;
        fee.remainingAmount = Math.max(0, fee.requiredAmount - fee.paidAmount);
        fee.status = fee.remainingAmount === 0 ? 'PAID' : 'PARTIAL';
        fee.lastPaidAt = tx.occurredAt;
        this.setItem(STORAGE_KEYS.FIN_FEES, fees);
      }
    }
    this.notify();
  }

  public getStudentFees(): StudentFeeEntry[] { return this.getItem(STORAGE_KEYS.FIN_FEES, initialStudentFeeEntries); }
  public saveStudentFees(fees: StudentFeeEntry[]) {
    this.setItem(STORAGE_KEYS.FIN_FEES, fees);
    this.notify();
  }

  public getAttendance(): AttendanceRecord[] { return this.getItem(STORAGE_KEYS.ATTENDANCE, initialAttendanceRecords); }
  public saveAttendanceBatch(records: AttendanceRecord[]) {
    const existing = this.getAttendance();
    const map = new Map(existing.map(r => [`${r.date}_${r.studentId}`, r]));
    records.forEach(r => map.set(`${r.date}_${r.studentId}`, r));
    const merged = Array.from(map.values());
    this.setItem(STORAGE_KEYS.ATTENDANCE, merged);
    this.recordMutation('attendance', records[0]?.date || 'batch', 'PATCH', { count: records.length });
    this.notify();
  }

  public getLeaveRequests(): LeaveRequest[] { return this.getItem(STORAGE_KEYS.LEAVE_REQUESTS, initialLeaveRequests); }
  public saveLeaveRequest(req: LeaveRequest) {
    const list = this.getLeaveRequests();
    const idx = list.findIndex(r => r.id === req.id);
    if (idx >= 0) {
      list[idx] = req;
      this.recordMutation('leave_request', req.id, 'PATCH', req);
    } else {
      list.unshift(req);
      this.recordMutation('leave_request', req.id, 'CREATE', req);
    }
    this.setItem(STORAGE_KEYS.LEAVE_REQUESTS, list);
    this.notify();
  }

  public getGrades(): GradeEntry[] { return this.getItem(STORAGE_KEYS.GRADES, initialGradeEntries); }
  public saveGradeEntry(grade: GradeEntry) {
    const list = this.getGrades();
    const idx = list.findIndex(g => g.id === grade.id);
    if (idx >= 0) {
      list[idx] = grade;
      this.recordMutation('grade_entry', grade.id, 'PATCH', grade);
    } else {
      list.push(grade);
      this.recordMutation('grade_entry', grade.id, 'CREATE', grade);
    }
    this.setItem(STORAGE_KEYS.GRADES, list);
    this.notify();
  }

  public getHomeroomBook(): HomeroomBook { return this.getItem(STORAGE_KEYS.HOMEROOM_BOOK, initialHomeroomBook); }
  public saveHomeroomBook(book: HomeroomBook) {
    this.setItem(STORAGE_KEYS.HOMEROOM_BOOK, book);
    this.recordMutation('homeroom_book', book.id, 'PATCH', book);
    this.notify();
  }

  public getClassMeetings(): ClassMeeting[] { return this.getItem(STORAGE_KEYS.CLASS_MEETINGS, initialClassMeetings); }
  public saveClassMeeting(meeting: ClassMeeting) {
    const list = this.getClassMeetings();
    const idx = list.findIndex(m => m.id === meeting.id);
    if (idx >= 0) {
      list[idx] = meeting;
      this.recordMutation('class_meeting', meeting.id, 'PATCH', meeting);
    } else {
      list.unshift(meeting);
      this.recordMutation('class_meeting', meeting.id, 'CREATE', meeting);
    }
    this.setItem(STORAGE_KEYS.CLASS_MEETINGS, list);
    this.notify();
  }

  public getEarlyWarnings(): EarlyWarningSignal[] { return this.getItem(STORAGE_KEYS.EARLY_WARNINGS, initialEarlyWarnings); }
  public saveEarlyWarning(warn: EarlyWarningSignal) {
    const list = this.getEarlyWarnings();
    const idx = list.findIndex(w => w.id === warn.id);
    if (idx >= 0) {
      list[idx] = warn;
    } else {
      list.unshift(warn);
    }
    this.setItem(STORAGE_KEYS.EARLY_WARNINGS, list);
    this.notify();
  }

  public getCounselingCases(): CounselingCase[] { return this.getItem(STORAGE_KEYS.COUNSELING, initialCounselingCases); }
  public saveCounselingCase(c: CounselingCase) {
    const list = this.getCounselingCases();
    const idx = list.findIndex(item => item.id === c.id);
    if (idx >= 0) {
      list[idx] = c;
    } else {
      list.unshift(c);
    }
    this.setItem(STORAGE_KEYS.COUNSELING, list);
    this.recordMutation('counseling_case', c.id, 'PATCH', c);
    this.notify();
  }

  public getIncidentRecords(): IncidentRecord[] { return this.getItem(STORAGE_KEYS.INCIDENTS, initialIncidentRecords); }
  public saveIncidentRecord(inc: IncidentRecord) {
    const list = this.getIncidentRecords();
    const idx = list.findIndex(item => item.id === inc.id);
    if (idx >= 0) {
      list[idx] = inc;
    } else {
      list.unshift(inc);
    }
    this.setItem(STORAGE_KEYS.INCIDENTS, list);
    this.recordMutation('incident_record', inc.id, 'PATCH', inc);
    this.notify();
  }

  public getRewardProposals(): RewardProposal[] { return this.getItem(STORAGE_KEYS.REWARDS, initialRewardProposals); }
  public saveRewardProposal(rew: RewardProposal) {
    const list = this.getRewardProposals();
    const idx = list.findIndex(item => item.id === rew.id);
    if (idx >= 0) {
      list[idx] = rew;
    } else {
      list.unshift(rew);
    }
    this.setItem(STORAGE_KEYS.REWARDS, list);
    this.recordMutation('reward_proposal', rew.id, 'PATCH', rew);
    this.notify();
  }

  public getTasks(): UnifiedTask[] { return this.getItem(STORAGE_KEYS.TASKS, initialTasks); }
  public saveTask(task: UnifiedTask) {
    const list = this.getTasks();
    const idx = list.findIndex(t => t.id === task.id);
    if (idx >= 0) {
      list[idx] = task;
    } else {
      list.unshift(task);
    }
    this.setItem(STORAGE_KEYS.TASKS, list);
    this.notify();
  }

  public getCalendarEvents(): CalendarEvent[] { return this.getItem(STORAGE_KEYS.CALENDAR, initialCalendarEvents); }
  public getRetentionPolicies(): RetentionPolicy[] { return this.getItem(STORAGE_KEYS.RETENTION, initialRetentionPolicies); }

  public getOutbox(): MutationEnvelope[] { return this.getItem(STORAGE_KEYS.OUTBOX, []); }
  public clearOutbox() { this.setItem(STORAGE_KEYS.OUTBOX, []); this.notify(); }

  public getConflicts(): SyncConflictRecord[] { return this.getItem(STORAGE_KEYS.CONFLICTS, []); }
  public saveConflicts(conflicts: SyncConflictRecord[]) { this.setItem(STORAGE_KEYS.CONFLICTS, conflicts); this.notify(); }

  public getSyncConfig(): SyncServerConfig {
    const saved = this.getItem(STORAGE_KEYS.SYNC_CONFIG, null);
    const defaultCfg: SyncServerConfig = {
      mode: 'SUPABASE',
      serverBaseUrl: 'https://xejaewpqbhbtmhjwdnls.supabase.co',
      apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlamFld3BxYmhidG1oandkbmxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4Mzc3OTQsImV4cCI6MjEwMzQxMzc5NH0.B8yS3oWTLN2AAQMoeA08viNv7578bXlxpJmHTz_7iNw',
      schoolTenantId: 'cva-hn-2026',
      autoSync: true,
      syncIntervalMinutes: 5,
      syncOnNetworkRegained: true,
      deviceId: 'device-local-001',
      deviceName: 'Thiết bị làm việc cục bộ'
    };
    
    if (!saved) return defaultCfg;
    
    // Auto-migrate old default configs to new Supabase default
    if (!saved.apiKey || saved.serverBaseUrl === 'https://sync.chuvanan.edu.vn/api/v1' || saved.serverBaseUrl === 'https://nd.quangngai.qzz.io/api/v1') {
      return { 
        ...saved, 
        mode: 'SUPABASE', 
        serverBaseUrl: defaultCfg.serverBaseUrl, 
        apiKey: defaultCfg.apiKey 
      };
    }
    
    return saved;
  }
  public saveSyncConfig(cfg: SyncServerConfig) { this.setItem(STORAGE_KEYS.SYNC_CONFIG, cfg); this.notify(); }

  public getAuditLogs(): AuditEvent[] { return this.getItem(STORAGE_KEYS.AUDIT_LOGS, []); }
  public recordAudit(event: AuditEvent) {
    const logs = this.getAuditLogs();
    logs.unshift(event);
    if (logs.length > 500) logs.pop();
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
    this.notify();
  }

  public getUserSession(): UserSession {
    return this.getItem(STORAGE_KEYS.USER_SESSION, {
      userId: 'user-default',
      username: 'teacher',
      fullName: 'Giáo viên',
      email: '',
      phone: '',
      activeRole: 'HOMEROOM_TEACHER',
      availableRoles: ['HOMEROOM_TEACHER', 'SUBJECT_TEACHER', 'PRINCIPAL', 'SCHOOL_ADMIN', 'PARENT_GUARDIAN', 'STUDENT'],
      schoolId: 'school-default',
      currentAcademicYearId: 'ay-2026-2027',
      homeroomClassId: 'class-default',
      teachingSubjectIds: [],
      teachingClassIds: ['class-default']
    });
  }

  public switchUserRole(newRole: RoleType) {
    const session = this.getUserSession();
    session.activeRole = newRole;
    if (newRole === 'PARENT_GUARDIAN') {
      session.childStudentIds = ['student-hs08001'];
      session.fullName = 'Bác Nguyễn Văn Hùng (PHHS Nguyễn Tuấn Anh)';
    } else if (newRole === 'STUDENT') {
      session.studentId = 'student-hs08001';
      session.fullName = 'Em Nguyễn Tuấn Anh (Lớp trưởng 8A1)';
    } else if (newRole === 'PRINCIPAL') {
      session.fullName = 'TS. Lê Thị Mai Hoa (Hiệu trưởng)';
    } else if (newRole === 'COUNSELOR_SOCIAL_WORK') {
      session.fullName = 'Cô Vũ Thị Hà (Tư vấn học đường)';
    } else {
      session.fullName = 'Thầy Nguyễn Văn An (GVCN 8A1 / GV Toán)';
    }
    this.setItem(STORAGE_KEYS.USER_SESSION, session);
    this.recordAudit({
      id: 'aud-switch-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      actorId: session.userId,
      actorName: session.fullName,
      actorRole: newRole,
      action: 'SWITCH_ROLE',
      resourceType: 'SESSION',
      resourceId: session.userId,
      schoolId: session.schoolId,
      details: `Chuyển đổi vai trò làm việc sang ${newRole}`,
      classification: 'PUBLIC_INTERNAL'
    });
    this.notify();
  }
}

export const localStore = new LocalRepository();
