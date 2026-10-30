import React, { useState } from 'react';
import { Student } from '../types/attendance';
import { X, UserPlus } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: Omit<Student, 'id' | 'attendanceRate' | 'totalPresent' | 'totalLate' | 'totalAbsent' | 'streakDays'>) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [desk, setDesk] = useState('Desk G-01');
  const [email, setEmail] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddStudent({
      name: name.trim(),
      studentId: studentId.trim() || `BIO-${Math.floor(1000 + Math.random() * 9000)}`,
      desk: desk.trim() || 'Desk A-01',
      deskRow: 1,
      deskCol: 1,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@academy.edu`,
      guardianName: guardianName.trim() || 'Parent/Guardian',
      guardianPhone: guardianPhone.trim() || '(555) 000-0000',
      guardianEmail: guardianEmail.trim() || 'parent@example.com',
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-[#4338CA]">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Add Student to Roster</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Student Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Lin"
              className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. BIO-1065"
                className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Desk Assignment</label>
              <input
                type="text"
                value={desk}
                onChange={(e) => setDesk(e.target.value)}
                placeholder="e.g. Desk G-01"
                className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">School Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. m.lin@academy.edu"
              className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Guardian Contact</h4>
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Guardian Name</label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="e.g. Helen Lin"
                  className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    placeholder="h.lin@gmail.com"
                    className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Teacher Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Transfer student from West Coast district"
              className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#4338CA] hover:bg-[#372abf] rounded-lg transition-colors shadow-xs"
            >
              Enroll Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
