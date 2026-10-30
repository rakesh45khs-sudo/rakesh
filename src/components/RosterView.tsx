import React, { useState, useMemo } from 'react';
import { Student, ClassSection } from '../types/attendance';
import { Search, UserPlus, Flame, AlertCircle, Phone, Mail, MoreHorizontal, ChevronRight } from 'lucide-react';

interface RosterViewProps {
  students: Student[];
  classes: ClassSection[];
  onOpenStudentDetails: (student: Student) => void;
  onOpenAddStudent: () => void;
}

export const RosterView: React.FC<RosterViewProps> = ({
  students,
  classes,
  onOpenStudentDetails,
  onOpenAddStudent,
}) => {
  const [search, setSearch] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchId = s.studentId.toLowerCase().includes(q);
        const matchDesk = s.desk.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchDesk) return false;
      }

      if (selectedClassFilter !== 'all') {
        const targetClass = classes.find((c) => c.id === selectedClassFilter);
        if (targetClass && !targetClass.studentIds.includes(s.id)) return false;
      }

      return true;
    });
  }, [students, search, selectedClassFilter, classes]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4338CA] bg-indigo-50 px-2.5 py-0.5 rounded-full">
            Student Information System
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Class Roster & Student Profiles</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student records, desk assignments, guardian contacts, and cumulative attendance.
          </p>
        </div>
        <button
          onClick={onOpenAddStudent}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#4338CA] hover:bg-[#372abf] rounded-lg shadow-xs transition-colors whitespace-nowrap min-h-[44px]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roster by student name, ID, or desk..."
            className="w-full h-[44px] pl-10 pr-4 rounded-lg bg-[#F1F5F9] text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 border-0 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="h-[44px] px-3.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4338CA] cursor-pointer"
          >
            <option value="all">All Course Sections ({students.length})</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.period})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const isChronic = student.attendanceRate < 85;
          const initials = student.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2);

          return (
            <div
              key={student.id}
              onClick={() => onOpenStudentDetails(student)}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm tracking-tight shrink-0">
                      {initials}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#4338CA] transition-colors">
                        {student.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">{student.studentId} · {student.desk}</p>
                    </div>
                  </div>

                  {student.streakDays >= 10 && (
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Flame className="w-3 h-3 fill-amber-500" />
                      <span>{student.streakDays}d</span>
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center p-2.5 bg-slate-50 rounded-lg mt-3 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Rate</span>
                    <span
                      className={`font-bold tabular-nums ${
                        isChronic ? 'text-rose-600' : 'text-slate-800'
                      }`}
                    >
                      {student.attendanceRate.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Present</span>
                    <span className="font-bold text-[#059669] tabular-nums">{student.totalPresent}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Absent</span>
                    <span className="font-bold text-[#E11D48] tabular-nums">{student.totalAbsent}</span>
                  </div>
                </div>

                {/* Guardian snippet */}
                <div className="mt-3 text-[11px] text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-700 truncate">Guardian: {student.guardianName}</p>
                  <p className="text-slate-500 truncate flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{student.guardianPhone}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#4338CA]">
                <span>View Full Record</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
