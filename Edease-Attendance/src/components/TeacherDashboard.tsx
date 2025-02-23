import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Users, QrCode, Clock, Plus } from 'lucide-react';
import { Class, Attendance } from '../types';
import { generateQRCode, getStoredClasses, getStoredAttendance, ATTENDANCE_UPDATE } from '../utils';

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<Class[]>(getStoredClasses());
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>(getStoredAttendance());
  const [newClassName, setNewClassName] = useState('');

  // Add effect to keep attendance data in sync
  useEffect(() => {
    const handleAttendanceUpdate = () => {
      setAttendance(getStoredAttendance());
    };

    // Listen for both storage and custom events
    window.addEventListener('storage', handleAttendanceUpdate);
    window.addEventListener(ATTENDANCE_UPDATE, handleAttendanceUpdate);

    return () => {
      window.removeEventListener('storage', handleAttendanceUpdate);
      window.removeEventListener(ATTENDANCE_UPDATE, handleAttendanceUpdate);
    };
  }, []);

  const createClass = () => {
    if (!newClassName.trim()) return;

    const newClass: Class = {
      id: Date.now().toString(),
      name: newClassName,
      teacher: 'Teacher',
      qrCode: generateQRCode(),
      timestamp: Date.now(),
    };

    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);
    localStorage.setItem('classes', JSON.stringify(updatedClasses));
    setNewClassName('');
  };

  const getAttendanceForClass = (classId: string) => {
    return attendance.filter(a => a.classId === classId);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Create New Class</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Enter class name"
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500"
          />
          <button
            onClick={createClass}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 flex items-center gap-2 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Create Class
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">Classes</h2>
          <div className="space-y-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className={`p-6 border rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedClass?.id === cls.id 
                    ? 'bg-gray-800 border-purple-500' 
                    : 'bg-gray-800 border-gray-700 hover:border-purple-400'
                }`}
                onClick={() => setSelectedClass(cls)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{cls.name}</h3>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <p className="text-sm">
                        {new Date(cls.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-5 h-5" />
                      <span className="font-medium">
                        {getAttendanceForClass(cls.id).length}
                      </span>
                    </div>
                    <QrCode className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
              </div>
            ))}
            {classes.length === 0 && (
              <p className="text-center text-gray-400 py-8">No classes created yet</p>
            )}
          </div>
        </div>

        {selectedClass && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Attendance QR Code</h2>
            <div className="p-8 border border-gray-700 rounded-xl bg-gray-800">
              <div className="bg-white p-8 rounded-lg mb-6">
                <QRCode value={selectedClass.qrCode} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Present Students</h3>
              <div className="space-y-3">
                {getAttendanceForClass(selectedClass.id).map((record) => (
                  <div key={record.studentId} className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">Student ID: {record.studentId}</p>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <p className="text-sm">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {getAttendanceForClass(selectedClass.id).length === 0 && (
                  <p className="text-center text-gray-400 py-4">No students present yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}