import React from 'react';
import { AttendanceStatus } from '../types/attendance';

interface SegmentedAttendanceControlProps {
  currentStatus: AttendanceStatus;
  onChangeStatus: (status: AttendanceStatus) => void;
  disabled?: boolean;
}

export const SegmentedAttendanceControl: React.FC<SegmentedAttendanceControlProps> = ({
  currentStatus,
  onChangeStatus,
  disabled = false,
}) => {
  const isPresent = currentStatus === 'present';
  const isLate = currentStatus === 'late';
  const isAbsent = currentStatus === 'absent';

  return (
    <div
      className="inline-grid grid-cols-3 w-[150px] sm:w-[168px] h-[46px] p-1 bg-slate-100/90 rounded-lg border border-slate-200/80 select-none"
      role="group"
      aria-label="Attendance Status Control"
    >
      {/* Present Button (P) */}
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          onChangeStatus(isPresent ? 'unmarked' : 'present');
        }}
        aria-pressed={isPresent}
        className={`relative flex items-center justify-center text-xs font-semibold rounded-md transition-all duration-150 min-h-[38px] active:scale-[0.96] ${
          isPresent
            ? 'bg-[#ECFDF5] text-[#059669] ring-1 ring-[#059669] shadow-xs font-bold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
        }`}
      >
        <span className="flex items-center gap-1">
          <span className="text-[13px]">P</span>
          <span className="text-[10px] hidden xs:inline opacity-80">resent</span>
        </span>
      </button>

      {/* Late Button (L) */}
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          onChangeStatus(isLate ? 'unmarked' : 'late');
        }}
        aria-pressed={isLate}
        className={`relative flex items-center justify-center text-xs font-semibold rounded-md transition-all duration-150 min-h-[38px] active:scale-[0.96] ${
          isLate
            ? 'bg-[#FFFBEB] text-[#D97706] ring-1 ring-[#D97706] shadow-xs font-bold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
        }`}
      >
        <span className="flex items-center gap-1">
          <span className="text-[13px]">L</span>
          <span className="text-[10px] hidden xs:inline opacity-80">ate</span>
        </span>
      </button>

      {/* Absent Button (A) */}
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          onChangeStatus(isAbsent ? 'unmarked' : 'absent');
        }}
        aria-pressed={isAbsent}
        className={`relative flex items-center justify-center text-xs font-semibold rounded-md transition-all duration-150 min-h-[38px] active:scale-[0.96] ${
          isAbsent
            ? 'bg-[#FFF1F2] text-[#E11D48] ring-1 ring-[#E11D48] shadow-xs font-bold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
        }`}
      >
        <span className="flex items-center gap-1">
          <span className="text-[13px]">A</span>
          <span className="text-[10px] hidden xs:inline opacity-80">bsent</span>
        </span>
      </button>
    </div>
  );
};
