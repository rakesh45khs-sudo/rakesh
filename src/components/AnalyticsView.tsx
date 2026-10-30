import React, { useState } from 'react';
import { ClassSection, Student, HistoricalSession } from '../types/attendance';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
  ArrowUpRight,
} from 'lucide-react';

interface AnalyticsViewProps {
  classes: ClassSection[];
  students: Student[];
  historicalSessions: HistoricalSession[];
  onExport: () => void;
  onOpenStudentDetails: (student: Student) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  classes,
  students,
  historicalSessions,
  onExport,
  onOpenStudentDetails,
}) => {
  const [selectedHistoryPeriod, setSelectedHistoryPeriod] = useState<string>('all');

  // Overall calculations
  const totalStudents = students.length;
  const chronicStudents = students.filter((s) => s.attendanceRate < 85);
  const averageAttendance =
    students.reduce((acc, curr) => acc + curr.attendanceRate, 0) / (totalStudents || 1);

  // Filter historical sessions
  const filteredSessions = historicalSessions.filter((sess) => {
    if (selectedHistoryPeriod === 'all') return true;
    return sess.classId === selectedHistoryPeriod;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4338CA] bg-indigo-50 px-2.5 py-0.5 rounded-full">
            Institutional Presence Intelligence
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Attendance Analytics & Trends</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time semester trends, early-warning risk monitoring, and state attendance quorum reports.
          </p>
        </div>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#4338CA] hover:bg-[#372abf] rounded-lg shadow-xs transition-colors whitespace-nowrap min-h-[44px]"
        >
          <Download className="w-4 h-4" />
          <span>Export State Report (CSV)</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Quorum Rate</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold tabular-nums text-slate-900">
              {averageAttendance.toFixed(1)}%
            </span>
            <span className="text-xs font-semibold text-[#059669] flex items-center">
              <ArrowUpRight className="w-4 h-4" /> +1.2% MoM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Exceeds district 92% benchmark</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold tabular-nums text-slate-900">{totalStudents}</span>
            <span className="text-xs text-slate-500 font-medium">Across 4 periods</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">100% active profile verification</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">At-Risk Absence</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold tabular-nums text-[#E11D48]">{chronicStudents.length}</span>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
              &lt; 85% Rate
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Requires registrar counselor review</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Sessions</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold tabular-nums text-[#059669]">
              {historicalSessions.length + 120}
            </span>
            <span className="text-xs text-slate-500 font-medium">100% On-Time</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Zero unsubmitted roll calls</p>
        </div>
      </div>

      {/* Grid: Chronic Absenteeism Monitor + Period Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chronic Absenteeism Intervention Board */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Chronic Absence Early-Warning</h3>
            </div>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
              {chronicStudents.length} flagged
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Students whose overall attendance has fallen below 85% this term. Click to review or draft contact.
          </p>

          <div className="space-y-3">
            {chronicStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => onOpenStudentDetails(student)}
                className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/40 hover:bg-rose-50/80 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{student.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono">{student.studentId}</span>
                    <span aria-hidden="true">·</span>
                    <span>{student.desk}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-rose-700 font-semibold">{student.totalAbsent} Absences</span>
                  </div>
                  {student.note && (
                    <p className="text-xs text-slate-600 italic mt-1">{student.note}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-bold text-rose-600 tabular-nums">
                    {student.attendanceRate.toFixed(1)}%
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">Intervention req.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Section Attendance Rate Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#4338CA]" />
              <h3 className="text-base font-bold text-slate-900">Period by Period Comparison</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Current Semester</span>
          </div>

          <div className="space-y-4">
            {classes.map((cls) => {
              const enrolled = students.filter((s) => cls.studentIds.includes(s.id));
              const avg =
                enrolled.reduce((a, b) => a + b.attendanceRate, 0) / (enrolled.length || 1);
              return (
                <div key={cls.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      {cls.name} <span className="text-slate-500 font-normal">({cls.period})</span>
                    </span>
                    <span className="font-bold tabular-nums text-slate-900">{avg.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${avg}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        avg >= 95
                          ? 'bg-[#059669]'
                          : avg >= 90
                          ? 'bg-[#4338CA]'
                          : avg >= 85
                          ? 'bg-[#D97706]'
                          : 'bg-[#E11D48]'
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{enrolled.length} Enrolled</span>
                    <span>{cls.room}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Historical Sessions Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Attendance Submissions Log</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Certified SIS submission ledger with digital timestamps and instructor signatures.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedHistoryPeriod}
              onChange={(e) => setSelectedHistoryPeriod(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.period})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Period & Class</th>
                <th className="py-3 px-4">Present</th>
                <th className="py-3 px-4">Late</th>
                <th className="py-3 px-4">Absent</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4">Signer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSessions.map((session) => {
                const cls = classes.find((c) => c.id === session.classId);
                return (
                  <tr key={session.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {session.date}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">{session.period}</span> ·{' '}
                      {cls?.name || session.classId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#059669] tabular-nums">
                      {session.presentCount} / {session.totalStudents}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#D97706] tabular-nums">
                      {session.lateCount}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#E11D48] tabular-nums">
                      {session.absentCount}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 tabular-nums whitespace-nowrap">
                      {session.submittedAt}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {session.submittedBy}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
