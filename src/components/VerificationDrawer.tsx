import React from 'react';
import { Student, AttendanceEntry, ClassSection } from '../types/attendance';
import { X, CheckCircle2, Clock, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VerificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentClass: ClassSection;
  students: Student[];
  attendanceState: Record<string, AttendanceEntry>;
  onConfirmSubmit: () => void;
}

export const VerificationDrawer: React.FC<VerificationDrawerProps> = ({
  isOpen,
  onClose,
  currentClass,
  students,
  attendanceState,
  onConfirmSubmit,
}) => {
  if (!isOpen) return null;

  // Compute breakdown
  const classStudents = students.filter((s) => currentClass.studentIds.includes(s.id));
  const total = classStudents.length;

  let presentCount = 0;
  let lateCount = 0;
  let absentCount = 0;
  let unmarkedCount = 0;

  const absentList: { student: Student; entry: AttendanceEntry }[] = [];
  const lateList: { student: Student; entry: AttendanceEntry }[] = [];
  const unmarkedList: Student[] = [];

  classStudents.forEach((s) => {
    const entry = attendanceState[s.id];
    const status = entry?.status || 'unmarked';
    if (status === 'present') presentCount++;
    else if (status === 'late') {
      lateCount++;
      lateList.push({ student: s, entry: entry || { studentId: s.id, status: 'late', timestamp: '', markedBy: '' } });
    } else if (status === 'absent') {
      absentCount++;
      absentList.push({ student: s, entry: entry || { studentId: s.id, status: 'absent', timestamp: '', markedBy: '' } });
    } else {
      unmarkedCount++;
      unmarkedList.push(s);
    }
  });

  const attendanceRate = total > 0 ? ((presentCount + lateCount) / total) * 100 : 0;

  const handleFinalSubmit = () => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#4338CA', '#059669', '#38BDF8', '#F59E0B'],
    });
    onConfirmSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-200">
        {/* Grab bar on mobile */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4338CA] bg-indigo-50 px-2 py-0.5 rounded-full">
                Audit & Verification
              </span>
              <span className="text-xs text-slate-500 font-medium">{currentClass.period}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{currentClass.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-2 text-center p-4 bg-slate-50/90 rounded-xl border border-slate-200/80">
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Present</p>
              <p className="text-xl font-bold text-[#059669] tabular-nums mt-0.5">{presentCount}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Late</p>
              <p className="text-xl font-bold text-[#D97706] tabular-nums mt-0.5">{lateCount}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Absent</p>
              <p className="text-xl font-bold text-[#E11D48] tabular-nums mt-0.5">{absentCount}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Rate</p>
              <p className="text-xl font-bold text-[#4338CA] tabular-nums mt-0.5">{attendanceRate.toFixed(0)}%</p>
            </div>
          </div>

          {/* Unmarked Warning if any */}
          {unmarkedCount > 0 && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-3 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{unmarkedCount} Students Unmarked</p>
                <p className="text-amber-700 mt-0.5">
                  The following students have not been recorded:{' '}
                  {unmarkedList.map((s) => s.name).join(', ')}. They will be recorded as Unmarked if submitted now.
                </p>
              </div>
            </div>
          )}

          {/* Absent Students Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-[#E11D48]" />
                <span>Absence List ({absentList.length})</span>
              </h3>
              {absentList.length === 0 && (
                <span className="text-xs text-[#059669] font-medium">No absences today!</span>
              )}
            </div>

            {absentList.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {absentList.map(({ student, entry }) => (
                  <div
                    key={student.id}
                    className="p-2.5 rounded-lg border border-rose-100 bg-rose-50/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{student.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {student.desk} · Parent: {student.guardianPhone}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
                      {entry.excuseReason || 'Unexcused'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                100% of students present or accounted for!
              </p>
            )}
          </div>

          {/* Late Students Section */}
          {lateList.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
                <Clock className="w-4 h-4 text-[#D97706]" />
                <span>Late Arrivals ({lateList.length})</span>
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {lateList.map(({ student, entry }) => (
                  <div
                    key={student.id}
                    className="p-2.5 rounded-lg border border-amber-100 bg-amber-50/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{student.name}</p>
                      <p className="text-[11px] text-slate-500">{entry.note || 'Tardy recorded at roll call'}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                      Late
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Institutional Compliance Notice */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-slate-600 text-[11px] border border-slate-200/60">
            <ShieldCheck className="w-4 h-4 text-[#4338CA] shrink-0" />
            <span>
              Submission will sync directly with registrar SIS and notify academic office. Digital signature:{' '}
              <strong className="text-slate-800">{currentClass.instructor}</strong>.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors min-h-[44px]"
          >
            Review Roster
          </button>
          <button
            type="button"
            onClick={handleFinalSubmit}
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#4338CA] hover:bg-[#372abf] rounded-lg transition-all shadow-md active:scale-[0.98] min-h-[44px] flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Transmit Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};
