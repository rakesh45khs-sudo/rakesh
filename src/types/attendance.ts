export type AttendanceStatus = 'present' | 'late' | 'absent' | 'unmarked';

export type ExcuseReason = 'Medical' | 'Athletics' | 'Family Emergency' | 'School Field Trip' | 'Unexcused' | 'Pending';

export interface Student {
  id: string;
  name: string;
  studentId: string; // e.g., BIO-1042
  avatarUrl?: string;
  desk: string; // e.g., Desk A-04
  deskRow: number;
  deskCol: number;
  email: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  attendanceRate: number; // percentage, e.g., 94.5
  totalPresent: number;
  totalLate: number;
  totalAbsent: number;
  streakDays: number;
  note?: string;
  excuseReason?: ExcuseReason;
}

export interface AttendanceEntry {
  studentId: string;
  status: AttendanceStatus;
  timestamp: string;
  note?: string;
  excuseReason?: ExcuseReason;
  markedBy: string;
}

export interface ClassSection {
  id: string;
  name: string;
  code: string; // e.g. BIO-301
  period: string; // e.g. Period 3
  time: string; // e.g. 10:15 AM - 11:05 AM
  room: string; // e.g. Science Wing 204
  instructor: string;
  studentIds: string[];
}

export interface HistoricalSession {
  id: string;
  classId: string;
  date: string;
  period: string;
  totalStudents: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  submittedAt: string;
  submittedBy: string;
  entries: {
    studentId: string;
    studentName: string;
    status: AttendanceStatus;
    excuseReason?: ExcuseReason;
    note?: string;
  }[];
}
