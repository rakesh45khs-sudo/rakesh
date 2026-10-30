import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RollCallView } from './components/RollCallView';
import { SeatingChartView } from './components/SeatingChartView';
import { AnalyticsView } from './components/AnalyticsView';
import { RosterView } from './components/RosterView';
import { VerificationDrawer } from './components/VerificationDrawer';
import { StudentDetailModal } from './components/StudentDetailModal';
import { AddStudentModal } from './components/AddStudentModal';
import { Toast } from './components/Toast';
import { INITIAL_CLASSES, INITIAL_STUDENTS, INITIAL_HISTORICAL_SESSIONS } from './data/mockData';
import { Student, AttendanceStatus, AttendanceEntry, ClassSection, ExcuseReason, HistoricalSession } from './types/attendance';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'roll-call' | 'seating' | 'analytics' | 'roster'>('roll-call');
  const [classes, setClasses] = useState<ClassSection[]>(INITIAL_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState<string>('bio-301');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [historicalSessions, setHistoricalSessions] = useState<HistoricalSession[]>(INITIAL_HISTORICAL_SESSIONS);

  // Initialize attendance entries for today's session
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceEntry>>(() => {
    const initial: Record<string, AttendanceEntry> = {};
    // Pre-populate with realistic starting state for Period 3
    const initialMarks: Record<string, AttendanceStatus> = {
      's-1': 'present',
      's-2': 'present',
      's-3': 'present',
      's-4': 'absent',
      's-5': 'present',
      's-6': 'present',
      's-7': 'present',
      's-8': 'late',
      's-9': 'present',
      's-10': 'present',
      's-11': 'present',
      's-12': 'present',
      's-13': 'present',
      's-14': 'present',
      's-15': 'present',
      's-16': 'present',
      's-17': 'present',
      's-18': 'absent',
      's-19': 'present',
      's-20': 'present',
      's-21': 'present',
      's-22': 'present',
      // s-23 and s-24 left unmarked for realistic interactive initial state!
    };

    Object.entries(initialMarks).forEach(([id, status]) => {
      initial[id] = {
        studentId: id,
        status,
        timestamp: '10:16 AM',
        markedBy: 'Dr. Elena Vance',
        excuseReason: status === 'absent' ? (id === 's-18' ? 'Medical' : 'Unexcused') : undefined,
        note: status === 'late' ? 'Tardy 6 mins (transit)' : undefined,
      };
    });

    return initial;
  });

  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Handle single student attendance status change
  const handleChangeStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => {
      const existing = prev[studentId];
      return {
        ...prev,
        [studentId]: {
          studentId,
          status,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          markedBy: currentClass.instructor,
          excuseReason: status === 'absent' ? existing?.excuseReason || 'Pending' : undefined,
          note: existing?.note,
        },
      };
    });
  };

  // Bulk mark all enrolled students in current class as Present
  const handleBulkMarkPresent = () => {
    setAttendanceState((prev) => {
      const next = { ...prev };
      currentClass.studentIds.forEach((id) => {
        // Mark all unmarked or absent as present
        if (!next[id] || next[id].status === 'unmarked' || next[id].status === 'absent') {
          next[id] = {
            studentId: id,
            status: 'present',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            markedBy: currentClass.instructor,
          };
        }
      });
      return next;
    });
    showToast(`Marked all students in ${currentClass.period} as Present`);
  };

  // Reset roll call for current class
  const handleResetRollCall = () => {
    setAttendanceState((prev) => {
      const next = { ...prev };
      currentClass.studentIds.forEach((id) => {
        delete next[id];
      });
      return next;
    });
    showToast(`Cleared marks for ${currentClass.name}`);
  };

  // Update specific student record from modal
  const handleUpdateStudentRecord = (
    studentId: string,
    status: AttendanceStatus,
    excuseReason?: ExcuseReason,
    note?: string
  ) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        studentId,
        status,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        markedBy: currentClass.instructor,
        excuseReason: status === 'absent' || status === 'late' ? excuseReason : undefined,
        note,
      },
    }));

    // Also persist student note in student profile
    if (note !== undefined) {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, note } : s))
      );
    }

    showToast('Student attendance record updated');
  };

  // Add a newly enrolled student
  const handleAddStudent = (
    newStudentData: Omit<Student, 'id' | 'attendanceRate' | 'totalPresent' | 'totalLate' | 'totalAbsent' | 'streakDays'>
  ) => {
    const newId = `s-${Date.now()}`;
    const newStudent: Student = {
      ...newStudentData,
      id: newId,
      attendanceRate: 100.0,
      totalPresent: 1,
      totalLate: 0,
      totalAbsent: 0,
      streakDays: 1,
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Enroll in current class
    setClasses((prev) =>
      prev.map((c) =>
        c.id === selectedClassId ? { ...c, studentIds: [newId, ...c.studentIds] } : c
      )
    );

    // Default status: present
    handleChangeStudentStatus(newId, 'present');
    showToast(`Enrolled ${newStudent.name} into ${currentClass.name}`);
  };

  // Confirm and submit roll call to SIS
  const handleConfirmSubmit = () => {
    const classStudents = students.filter((s) => currentClass.studentIds.includes(s.id));
    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;

    const entries = classStudents.map((s) => {
      const st = attendanceState[s.id]?.status || 'unmarked';
      if (st === 'present') presentCount++;
      else if (st === 'late') lateCount++;
      else if (st === 'absent') absentCount++;

      return {
        studentId: s.id,
        studentName: s.name,
        status: st,
        excuseReason: attendanceState[s.id]?.excuseReason,
        note: attendanceState[s.id]?.note,
      };
    });

    const newSession: HistoricalSession = {
      id: `hist-${Date.now()}`,
      classId: currentClass.id,
      date: new Date().toISOString().split('T')[0],
      period: currentClass.period,
      totalStudents: classStudents.length,
      presentCount,
      lateCount,
      absentCount,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      submittedBy: currentClass.instructor,
      entries,
    };

    setHistoricalSessions((prev) => [newSession, ...prev]);
    setIsVerificationOpen(false);
    showToast(`✓ Attendance for ${currentClass.name} successfully submitted to SIS!`);
  };

  // Export current attendance as CSV
  const handleExportCSV = () => {
    const classStudents = students.filter((s) => currentClass.studentIds.includes(s.id));
    const headers = [
      'Class Code',
      'Period',
      'Date',
      'Student ID',
      'Student Name',
      'Desk',
      'Attendance Status',
      'Excuse Classification',
      'Notes',
      'Guardian Name',
      'Guardian Phone',
    ];

    const rows = classStudents.map((s) => {
      const entry = attendanceState[s.id];
      const status = entry?.status || 'unmarked';
      const excuse = entry?.excuseReason || 'None';
      const note = (entry?.note || s.note || '').replace(/"/g, '""');

      return [
        `"${currentClass.code}"`,
        `"${currentClass.period}"`,
        `"${new Date().toISOString().split('T')[0]}"`,
        `"${s.studentId}"`,
        `"${s.name}"`,
        `"${s.desk}"`,
        `"${status.toUpperCase()}"`,
        `"${excuse}"`,
        `"${note}"`,
        `"${s.guardianName}"`,
        `"${s.guardianPhone}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AcademicPulse_${currentClass.code}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported attendance roster for ${currentClass.name}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex flex-col">
      {/* Top Bar Header complying with Top Bar Contract */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onExport={handleExportCSV}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'roll-call' && (
          <RollCallView
            classes={classes}
            selectedClassId={selectedClassId}
            onSelectClass={setSelectedClassId}
            students={students}
            attendanceState={attendanceState}
            onChangeStudentStatus={handleChangeStudentStatus}
            onBulkMarkPresent={handleBulkMarkPresent}
            onResetRollCall={handleResetRollCall}
            onOpenStudentDetails={setSelectedStudentForModal}
            onRequestSubmit={() => setIsVerificationOpen(true)}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'seating' && (
          <SeatingChartView
            currentClass={currentClass}
            students={students}
            attendanceState={attendanceState}
            onChangeStudentStatus={handleChangeStudentStatus}
            onOpenStudentDetails={setSelectedStudentForModal}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            classes={classes}
            students={students}
            historicalSessions={historicalSessions}
            onExport={handleExportCSV}
            onOpenStudentDetails={setSelectedStudentForModal}
          />
        )}

        {currentTab === 'roster' && (
          <RosterView
            students={students}
            classes={classes}
            onOpenStudentDetails={setSelectedStudentForModal}
            onOpenAddStudent={() => setIsAddStudentOpen(true)}
          />
        )}
      </main>

      {/* Student Details & Notes Modal */}
      <StudentDetailModal
        student={selectedStudentForModal}
        currentStatus={
          selectedStudentForModal
            ? attendanceState[selectedStudentForModal.id]?.status || 'unmarked'
            : 'unmarked'
        }
        excuseReason={
          selectedStudentForModal
            ? attendanceState[selectedStudentForModal.id]?.excuseReason
            : undefined
        }
        note={
          selectedStudentForModal
            ? attendanceState[selectedStudentForModal.id]?.note
            : undefined
        }
        onClose={() => setSelectedStudentForModal(null)}
        onUpdateRecord={handleUpdateStudentRecord}
      />

      {/* Audit & Verification Pre-Submission Drawer */}
      <VerificationDrawer
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        currentClass={currentClass}
        students={students}
        attendanceState={attendanceState}
        onConfirmSubmit={handleConfirmSubmit}
      />

      {/* Add Student to Roster Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddStudent}
      />

      {/* Instant Feedback Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
