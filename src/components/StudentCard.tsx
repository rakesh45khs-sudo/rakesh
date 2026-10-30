import React from 'react';
import { Student, AttendanceStatus, ExcuseReason } from '../types/attendance';
import { SegmentedAttendanceControl } from './SegmentedAttendanceControl';
import { Flame, AlertCircle, FileText, ChevronRight } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  currentStatus: AttendanceStatus;
  excuseReason?: ExcuseReason;
  note?: string;
  onChangeStatus: (status: AttendanceStatus) => void;
  onOpenDetails: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  currentStatus,
  excuseReason,
  note,
  onChangeStatus,
  onOpenDetails,
}) => {
  // Border indicator strip based on status
  let borderClass = 'border-slate-200 hover:border-slate-300';
  if (currentStatus === 'present') {
    borderClass = 'border-slate-200 border-l-[4px] border-l-[#059669]';
  } else if (currentStatus === 'late') {
    borderClass = 'border-slate-200 border-l-[4px] border-l-[#D97706]';
  } else if (currentStatus === 'absent') {
    borderClass = 'border-slate-200 border-l-[4px] border-l-[#E11D48]';
  }

  // Generate consistent avatar color based on student name initials
  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const getAvatarBg = (name: string) => {
    const colors = [
      'bg-indigo-100 text-indigo-700',
      'bg-blue-100 text-blue-700',
      'bg-violet-100 text-violet-700',
      'bg-emerald-100 text-emerald-700',
      'bg-slate-100 text-slate-700',
      'bg-teal-100 text-teal-700',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const isChronic = student.attendanceRate < 85;

  return (
    <div
      onClick={() => onOpenDetails(student)}
      className={`group relative bg-white rounded-xl border ${borderClass} p-3.5 sm:p-4 shadow-xs transition-all duration-150 hover:shadow-sm cursor-pointer`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left Side: Avatar + Student Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm tracking-tight shrink-0 select-none ${getAvatarBg(
              student.name
            )}`}
          >
            {initials}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-slate-900 truncate tracking-tight group-hover:text-[#4338CA] transition-colors">
                {student.name}
              </h3>
              {student.streakDays >= 10 && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full" title={`${student.streakDays}-day streak`}>
                  <Flame className="w-3 h-3 fill-amber-500" />
                  <span>{student.streakDays}d</span>
                </span>
              )}
              {isChronic && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full" title="Chronic absence alert: below 85%">
                  <AlertCircle className="w-3 h-3" />
                  <span>At-Risk</span>
                </span>
              )}
            </div>

            {/* Unboxed metadata row with subtle typographic bullet separators */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="font-mono text-slate-600">{student.studentId}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{student.desk}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="tabular-nums font-medium text-slate-700">
                {student.attendanceRate.toFixed(1)}% Att.
              </span>
            </div>

            {/* Note or excuse reason preview if present */}
            {(note || excuseReason || student.note) && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate italic max-w-[200px] sm:max-w-xs text-slate-600">
                  {excuseReason ? `[${excuseReason}] ` : ''}
                  {note || student.note}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Tactile Attendance Switch + Details arrow */}
        <div className="flex items-center gap-2 shrink-0">
          <SegmentedAttendanceControl
            currentStatus={currentStatus}
            onChangeStatus={onChangeStatus}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(student);
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="View Student Attendance Record"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
