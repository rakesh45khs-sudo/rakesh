import React, { useState, useMemo } from 'react';
import { Student, AttendanceStatus, AttendanceEntry, ClassSection } from '../types/attendance';
import { StudentCard } from './StudentCard';
import {
  Search,
  X,
  CheckCheck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface RollCallViewProps {
  classes: ClassSection[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
  students: Student[];
  attendanceState: Record<string, AttendanceEntry>;
  onChangeStudentStatus: (studentId: string, status: AttendanceStatus) => void;
  onBulkMarkPresent: () => void;
  onResetRollCall: () => void;
  onOpenStudentDetails: (student: Student) => void;
  onRequestSubmit: () => void;
  onShowToast: (msg: string) => void;
}

export const RollCallView: React.FC<RollCallViewProps> = ({
  classes,
  selectedClassId,
  onSelectClass,
  students,
  attendanceState,
  onChangeStudentStatus,
  onBulkMarkPresent,
  onResetRollCall,
  onOpenStudentDetails,
  onRequestSubmit,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'late' | 'absent' | 'unmarked'>('all');
  const [sortBy, setSortBy] = useState<'desk' | 'name' | 'attendance'>('desk');

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Filter students enrolled in current class
  const classStudents = useMemo(() => {
    return students.filter((s) => currentClass.studentIds.includes(s.id));
  }, [students, currentClass]);

  // Compute live statistics with strict tabular numerals
  const stats = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;
    let unmarked = 0;

    classStudents.forEach((s) => {
      const status = attendanceState[s.id]?.status || 'unmarked';
      if (status === 'present') present++;
      else if (status === 'late') late++;
      else if (status === 'absent') absent++;
      else unmarked++;
    });

    const total = classStudents.length;
    const marked = present + late + absent;
    const attendancePercentage = total > 0 ? ((present + late) / total) * 100 : 0;

    return {
      total,
      present,
      late,
      absent,
      unmarked,
      marked,
      attendancePercentage,
    };
  }, [classStudents, attendanceState]);

  // Filter and sort students for display
  const filteredStudents = useMemo(() => {
    return classStudents
      .filter((s) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = s.name.toLowerCase().includes(q);
          const matchId = s.studentId.toLowerCase().includes(q);
          const matchDesk = s.desk.toLowerCase().includes(q);
          if (!matchName && !matchId && !matchDesk) return false;
        }

        // Status filter
        if (statusFilter !== 'all') {
          const currentStatus = attendanceState[s.id]?.status || 'unmarked';
          if (currentStatus !== statusFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'attendance') return b.attendanceRate - a.attendanceRate;
        return a.desk.localeCompare(b.desk);
      });
  }, [classStudents, searchQuery, statusFilter, sortBy, attendanceState]);

  // Random student picker for cold-calling in class
  const handleRandomPick = () => {
    const presentStudents = classStudents.filter((s) => {
      const st = attendanceState[s.id]?.status;
      return st === 'present' || st === 'late';
    });
    const pool = presentStudents.length > 0 ? presentStudents : classStudents;
    if (pool.length === 0) return;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    onShowToast(`🎯 Selected student: ${picked.name} (${picked.desk})`);
  };

  return (
    <div className="pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      {/* Top Banner & Class Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4338CA] bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Active Session
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Today · Thursday, Oct 29</span>
              </span>
            </div>

            {/* Class Switcher Dropdown */}
            <div className="relative inline-block mt-1">
              <div className="flex items-center gap-2">
                <select
                  value={selectedClassId}
                  onChange={(e) => onSelectClass(e.target.value)}
                  className="appearance-none text-xl sm:text-2xl font-bold text-slate-900 bg-transparent pr-8 py-0.5 focus:outline-none focus:ring-2 focus:ring-[#4338CA] rounded-lg cursor-pointer hover:text-[#4338CA] transition-colors"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id} className="text-sm font-medium text-slate-800">
                      {cls.name} ({cls.period})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-slate-400 pointer-events-none -ml-7" />
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentClass.time}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentClass.room}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{currentClass.instructor}</span>
            </div>
          </div>

          {/* Tabular Progress Bar & HUD readout */}
          <div className="lg:text-right shrink-0 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex items-baseline justify-between lg:justify-end gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance Rate</span>
              <span className="text-2xl font-bold tabular-nums text-slate-900 tracking-tight">
                {stats.present + stats.late} / {stats.total}{' '}
                <span className="text-xs font-semibold text-[#059669]">
                  ({stats.attendancePercentage.toFixed(1)}%)
                </span>
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full lg:w-64 h-2.5 bg-slate-200 rounded-full overflow-hidden flex mt-2">
              <div
                style={{ width: `${(stats.present / (stats.total || 1)) * 100}%` }}
                className="bg-[#059669] transition-all duration-300"
                title={`${stats.present} Present`}
              />
              <div
                style={{ width: `${(stats.late / (stats.total || 1)) * 100}%` }}
                className="bg-[#D97706] transition-all duration-300"
                title={`${stats.late} Late`}
              />
              <div
                style={{ width: `${(stats.absent / (stats.total || 1)) * 100}%` }}
                className="bg-[#E11D48] transition-all duration-300"
                title={`${stats.absent} Absent`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mt-1.5 tabular-nums">
              <span className="text-[#059669] font-semibold">{stats.present} Present</span>
              <span className="text-[#D97706] font-semibold">{stats.late} Late</span>
              <span className="text-[#E11D48] font-semibold">{stats.absent} Absent</span>
              <span className="text-slate-400">{stats.unmarked} Unmarked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Tray: Search, Filters & Bulk Actions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
        {/* Search Shell: 44px field height, #F1F5F9 background, zero border until focused */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, ID, or desk (e.g. Avery, BIO-1041, A-01)..."
            className="w-full h-[44px] pl-10 pr-9 rounded-lg bg-[#F1F5F9] text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 border-0 focus:outline-none focus:ring-2 focus:ring-[#4338CA] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bulk Action Buttons Tray */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={onBulkMarkPresent}
            className="inline-flex items-center gap-1.5 h-[44px] px-3.5 rounded-lg bg-[#EEF2FF] hover:bg-indigo-100/90 text-[#4338CA] text-xs font-semibold whitespace-nowrap transition-colors active:scale-[0.98]"
            title="Mark all unmarked students as Present"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Present</span>
          </button>

          <button
            type="button"
            onClick={handleRandomPick}
            className="inline-flex items-center gap-1.5 h-[44px] px-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold whitespace-nowrap transition-colors"
            title="Pick a random student for cold call or answers"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Random Cold Call</span>
            <span className="sm:hidden">Pick</span>
          </button>

          <button
            type="button"
            onClick={onResetRollCall}
            className="inline-flex items-center gap-1.5 h-[44px] px-3 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold whitespace-nowrap transition-colors"
            title="Clear current session marks"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-[44px] px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4338CA] cursor-pointer"
          >
            <option value="desk">Sort: Desk Order</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="attendance">Sort: Attendance Rate</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs Bar (Interactive Buttons) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl mb-4 w-fit overflow-x-auto no-scrollbar">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[36px] ${
            statusFilter === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setStatusFilter('present')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[36px] ${
            statusFilter === 'present'
              ? 'bg-[#ECFDF5] text-[#059669] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Present ({stats.present})
        </button>
        <button
          onClick={() => setStatusFilter('late')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[36px] ${
            statusFilter === 'late'
              ? 'bg-[#FFFBEB] text-[#D97706] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Late ({stats.late})
        </button>
        <button
          onClick={() => setStatusFilter('absent')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[36px] ${
            statusFilter === 'absent'
              ? 'bg-[#FFF1F2] text-[#E11D48] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Absent ({stats.absent})
        </button>
        <button
          onClick={() => setStatusFilter('unmarked')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[36px] ${
            statusFilter === 'unmarked'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Unmarked ({stats.unmarked})
        </button>
      </div>

      {/* Student Roster Cards List */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredStudents.map((student) => {
            const entry = attendanceState[student.id];
            const currentStatus = entry?.status || 'unmarked';
            return (
              <StudentCard
                key={student.id}
                student={student}
                currentStatus={currentStatus}
                excuseReason={entry?.excuseReason}
                note={entry?.note}
                onChangeStatus={(status) => onChangeStudentStatus(student.id, status)}
                onOpenDetails={onOpenStudentDetails}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-base font-semibold text-slate-800">No students match your filter</h4>
          <p className="text-xs text-slate-500 mt-1">Try clearing your search query or switching status filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-[#4338CA] bg-indigo-50 rounded-lg hover:bg-indigo-100"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Sticky Bottom Submission CTA Bar (Level 2 Elevation, Height 52px, #4338CA) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left summary counter */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
            <span className="font-bold text-slate-900 tabular-nums">
              {stats.marked} of {stats.total} Marked
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="tabular-nums font-semibold text-[#059669]">{stats.present} Present</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="tabular-nums font-semibold text-[#D97706]">{stats.late} Late</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="tabular-nums font-semibold text-[#E11D48]">{stats.absent} Absent</span>
          </div>

          {/* Right primary CTA button */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onRequestSubmit}
              className="w-full sm:w-auto h-[52px] px-8 rounded-xl bg-[#4338CA] hover:bg-[#372abf] text-white font-semibold text-sm tracking-wide shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Submit Attendance · {currentClass.period}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
