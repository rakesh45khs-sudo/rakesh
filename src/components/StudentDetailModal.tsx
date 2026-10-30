import React, { useState } from 'react';
import { Student, AttendanceStatus, ExcuseReason } from '../types/attendance';
import { X, Phone, Mail, Calendar, FileText, CheckCircle2, Clock, XCircle, ShieldAlert } from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  currentStatus: AttendanceStatus;
  excuseReason?: ExcuseReason;
  note?: string;
  onClose: () => void;
  onUpdateRecord: (studentId: string, status: AttendanceStatus, excuseReason?: ExcuseReason, note?: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  currentStatus,
  excuseReason,
  note,
  onClose,
  onUpdateRecord,
}) => {
  if (!student) return null;

  const [localStatus, setLocalStatus] = useState<AttendanceStatus>(currentStatus);
  const [localExcuse, setLocalExcuse] = useState<ExcuseReason>(excuseReason || 'Pending');
  const [localNote, setLocalNote] = useState<string>(note || student.note || '');

  const handleSave = () => {
    onUpdateRecord(student.id, localStatus, localExcuse, localNote);
    onClose();
  };

  const isChronic = student.attendanceRate < 85;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">{student.name}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="font-mono text-slate-600">{student.studentId}</span>
              <span aria-hidden="true">·</span>
              <span>{student.desk}</span>
              <span aria-hidden="true">·</span>
              <span>{student.email}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2 text-center p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <p className="text-[11px] font-medium text-slate-500">Rate</p>
              <p className={`text-base font-bold tabular-nums ${isChronic ? 'text-rose-600' : 'text-slate-900'}`}>
                {student.attendanceRate.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Present</p>
              <p className="text-base font-bold text-[#059669] tabular-nums">{student.totalPresent}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Late</p>
              <p className="text-base font-bold text-[#D97706] tabular-nums">{student.totalLate}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Absent</p>
              <p className="text-base font-bold text-[#E11D48] tabular-nums">{student.totalAbsent}</p>
            </div>
          </div>

          {isChronic && (
            <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Chronic Absenteeism Warning</p>
                <p className="text-rose-700 mt-0.5">
                  Attendance is below the 85% state threshold. Automated counseling notification queued.
                </p>
              </div>
            </div>
          )}

          {/* Current Session Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Mark Today's Session Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLocalStatus('present')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  localStatus === 'present'
                    ? 'bg-[#ECFDF5] border-[#059669] text-[#059669] ring-2 ring-[#059669]/20'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Present</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalStatus('late')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  localStatus === 'late'
                    ? 'bg-[#FFFBEB] border-[#D97706] text-[#D97706] ring-2 ring-[#D97706]/20'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Late</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalStatus('absent')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  localStatus === 'absent'
                    ? 'bg-[#FFF1F2] border-[#E11D48] text-[#E11D48] ring-2 ring-[#E11D48]/20'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Absent</span>
              </button>
            </div>
          </div>

          {/* Excuse Reason if Absent or Late */}
          {(localStatus === 'absent' || localStatus === 'late') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Absence Classification
              </label>
              <select
                value={localExcuse}
                onChange={(e) => setLocalExcuse(e.target.value as ExcuseReason)}
                className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
              >
                <option value="Pending">Pending Verification</option>
                <option value="Medical">Excused: Medical / Doctor's Note</option>
                <option value="Athletics">Excused: School Athletic Event</option>
                <option value="School Field Trip">Excused: Official Field Trip</option>
                <option value="Family Emergency">Excused: Family Emergency</option>
                <option value="Unexcused">Unexcused: Truancy / No Note</option>
              </select>
            </div>
          )}

          {/* Teacher Attendance Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Teacher Log & Daily Observation Note
            </label>
            <div className="relative">
              <textarea
                rows={2}
                value={localNote}
                onChange={(e) => setLocalNote(e.target.value)}
                placeholder="e.g. Arrived 15 minutes late with nurse pass; missing homework #4"
                className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4338CA] placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Guardian Contact Info Card */}
          <div className="bg-indigo-50/50 rounded-xl p-3.5 border border-indigo-100">
            <h4 className="text-xs font-bold text-indigo-950 mb-2">Primary Guardian Information</h4>
            <div className="text-xs space-y-1.5 text-slate-700">
              <p className="font-semibold text-slate-900">{student.guardianName}</p>
              <div className="flex items-center gap-4 text-xs">
                <a
                  href={`tel:${student.guardianPhone}`}
                  className="flex items-center gap-1.5 text-indigo-700 hover:text-indigo-900 font-medium"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{student.guardianPhone}</span>
                </a>
                <a
                  href={`mailto:${student.guardianEmail}`}
                  className="flex items-center gap-1.5 text-indigo-700 hover:text-indigo-900 font-medium truncate"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{student.guardianEmail}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#4338CA] hover:bg-[#372abf] rounded-lg transition-colors shadow-xs"
          >
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
};
