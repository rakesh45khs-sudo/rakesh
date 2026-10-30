import React from 'react';
import { Student, AttendanceStatus, AttendanceEntry, ClassSection } from '../types/attendance';
import { LayoutGrid, CheckCircle2, Clock, XCircle, UserCheck } from 'lucide-react';

interface SeatingChartViewProps {
  currentClass: ClassSection;
  students: Student[];
  attendanceState: Record<string, AttendanceEntry>;
  onChangeStudentStatus: (studentId: string, status: AttendanceStatus) => void;
  onOpenStudentDetails: (student: Student) => void;
}

export const SeatingChartView: React.FC<SeatingChartViewProps> = ({
  currentClass,
  students,
  attendanceState,
  onChangeStudentStatus,
  onOpenStudentDetails,
}) => {
  const classStudents = students.filter((s) => currentClass.studentIds.includes(s.id));

  // Cycle status on direct click
  const handleCycleStatus = (studentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = attendanceState[studentId]?.status || 'unmarked';
    let next: AttendanceStatus = 'present';
    if (current === 'present') next = 'late';
    else if (current === 'late') next = 'absent';
    else if (current === 'absent') next = 'unmarked';
    else next = 'present';
    onChangeStudentStatus(studentId, next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Title & Legend Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4338CA] bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Spatial Grid Mode
            </span>
            <span className="text-xs text-slate-500 font-medium">{currentClass.room}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {currentClass.name} — Interactive Classroom Seating Chart
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any desk node to quickly cycle status (Present → Late → Absent → Unmarked) or tap info for full records.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#059669]" />
            <span className="font-semibold text-slate-700">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#D97706]" />
            <span className="font-semibold text-slate-700">Late</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#E11D48]" />
            <span className="font-semibold text-slate-700">Absent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="font-semibold text-slate-500">Unmarked</span>
          </div>
        </div>
      </div>

      {/* Classroom Front / Whiteboard Visual Marker */}
      <div className="mb-6 max-w-2xl mx-auto">
        <div className="h-8 bg-slate-800 text-slate-200 text-xs font-semibold uppercase tracking-widest rounded-lg flex items-center justify-center shadow-xs">
          Front of Classroom · Whiteboard & Lectern
        </div>
      </div>

      {/* Seating Grid (4 Columns of desks, matching classroom aisles) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {classStudents.map((student) => {
          const entry = attendanceState[student.id];
          const status = entry?.status || 'unmarked';

          let statusBg = 'bg-white border-slate-200 hover:border-slate-300';
          let statusBadge = (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Unmarked
            </span>
          );

          if (status === 'present') {
            statusBg = 'bg-emerald-50/60 border-[#059669] shadow-xs';
            statusBadge = (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Present</span>
              </span>
            );
          } else if (status === 'late') {
            statusBg = 'bg-amber-50/60 border-[#D97706] shadow-xs';
            statusBadge = (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Late</span>
              </span>
            );
          } else if (status === 'absent') {
            statusBg = 'bg-rose-50/60 border-[#E11D48] shadow-xs';
            statusBadge = (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E11D48] bg-[#FFF1F2] px-2 py-0.5 rounded-full flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                <span>Absent</span>
              </span>
            );
          }

          return (
            <div
              key={student.id}
              onClick={(e) => handleCycleStatus(student.id, e)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative group active:scale-[0.98] select-none ${statusBg}`}
            >
              {/* Desk Tag */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-tight">
                  {student.desk}
                </span>
                {statusBadge}
              </div>

              {/* Student Name & ID */}
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#4338CA] transition-colors truncate">
                {student.name}
              </h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{student.studentId}</p>

              {/* Action hints */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="tabular-nums font-medium">{student.attendanceRate.toFixed(0)}% Rate</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenStudentDetails(student);
                  }}
                  className="text-[#4338CA] hover:underline font-semibold"
                >
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
