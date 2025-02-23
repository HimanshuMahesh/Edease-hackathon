import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { GraduationCap, UserCog, CheckCircle, MapPin, QrCode, Shield } from 'lucide-react';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  const [role, setRole] = useState<'student' | 'teacher' | null>(null);

  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <h1 className="text-7xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 text-transparent bg-clip-text">
              EdEase
            </h1>
            <p className="text-xl text-blue-300 mb-12">Smart Attendance Management Platform</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
              <div className="p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
                <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <QrCode className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">QR-Based Attendance</h3>
                <p className="text-gray-400">Quick and secure attendance tracking with unique QR codes</p>
              </div>
              <div className="p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
                <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Location Verified</h3>
                <p className="text-gray-400">Ensures students are physically present in class</p>
              </div>
              <div className="p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300">
                <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Secure & Reliable</h3>
                <p className="text-gray-400">Tamper-proof attendance records with real-time tracking</p>
              </div>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <button
                onClick={() => setRole('student')}
                className="w-full p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 flex items-center justify-center gap-3 transition-all duration-300 shadow-xl hover:shadow-blue-500/20"
              >
                <GraduationCap className="w-6 h-6" />
                <span className="text-lg font-semibold">Continue as Student</span>
              </button>
              <button
                onClick={() => setRole('teacher')}
                className="w-full p-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl hover:from-purple-700 hover:to-purple-900 flex items-center justify-center gap-3 transition-all duration-300 shadow-xl hover:shadow-purple-500/20"
              >
                <UserCog className="w-6 h-6" />
                <span className="text-lg font-semibold">Continue as Teacher</span>
              </button>
            </div>
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                EdEase
              </h1>
              <span className="text-gray-600">|</span>
              <h2 className="text-xl text-gray-300">
                {role === 'teacher' ? 'Teacher Dashboard' : 'Student Dashboard'}
              </h2>
            </div>
            <button
              onClick={() => setRole(null)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              Switch Role
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;