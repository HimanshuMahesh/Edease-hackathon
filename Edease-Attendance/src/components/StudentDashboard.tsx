import React, { useState, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import toast from 'react-hot-toast';
import { Attendance } from '../types';
import { getStoredAttendance, updateAttendance, ATTENDANCE_UPDATE } from '../utils';
import { Camera, CheckCircle2, Clock } from 'lucide-react';

export default function StudentDashboard() {
  const [scanning, setScanning] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [attendance, setAttendance] = useState<Attendance[]>(getStoredAttendance());

  useEffect(() => {
    return () => {
      const videoElement = document.querySelector('#scanner-container video');
      if (videoElement) {
        videoElement.remove();
      }
    };
  }, []);

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

  const startScanning = async () => {
    if (!studentId) {
      toast.error('Please enter your student ID');
      return;
    }

    try {
      const existingVideo = document.querySelector('#scanner-container video');
      if (existingVideo) {
        existingVideo.remove();
      }

      const video = document.createElement('video');
      document.getElementById('scanner-container')?.appendChild(video);
      
      const qrScanner = new QrScanner(
        video,
        async (result) => {
          try {
            const position = await getCurrentPosition();
            if (!position) {
              toast.error('Unable to get location. Please enable location services.');
              return;
            }

            const existingAttendance = attendance.find(
              a => a.classId === result.data && a.studentId === studentId
            );

            if (existingAttendance) {
              toast.error('You have already marked attendance for this class!');
              qrScanner.destroy();
              setScanning(false);
              return;
            }

            const newAttendance: Attendance = {
              classId: result.data,
              studentId,
              timestamp: Date.now(),
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
            };

            const updatedAttendance = [...attendance, newAttendance];
            updateAttendance(updatedAttendance);
            setAttendance(updatedAttendance);
            
            toast.success('Attendance marked successfully!');
            qrScanner.destroy();
            setScanning(false);
          } catch (error) {
            toast.error('Error processing QR code');
            console.error(error);
          }
        },
        { 
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScanner.start();
      setScanning(true);
    } catch (error) {
      toast.error('Error accessing camera. Please ensure camera permissions are granted.');
      console.error(error);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Mark Attendance</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-300 mb-2">
              Student ID
            </label>
            <input
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter your student ID"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500"
            />
          </div>
          <button
            onClick={startScanning}
            disabled={scanning}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-300"
          >
            {scanning ? (
              <>
                <Camera className="w-6 h-6 animate-pulse" />
                <span className="text-lg">Scanning...</span>
              </>
            ) : (
              <>
                <Camera className="w-6 h-6" />
                <span className="text-lg">Scan QR Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div id="scanner-container" className="aspect-square bg-gray-800 rounded-xl overflow-hidden mb-8 border border-gray-700">
        {!scanning && (
          <div className="h-full flex items-center justify-center text-gray-400 p-6 text-center">
            <div>
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-lg mb-2">Camera preview will appear here</p>
              <p className="text-sm text-gray-500">Make sure to grant camera permissions</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          Your Attendance History
        </h3>
        <div className="space-y-4">
          {attendance
            .filter(record => record.studentId === studentId)
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((record) => (
              <div key={record.timestamp} className="p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">Class ID: {record.classId}</p>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <p className="text-sm">
                      {new Date(record.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          {attendance.filter(record => record.studentId === studentId).length === 0 && (
            <p className="text-gray-400 text-center py-8">No attendance records found</p>
          )}
        </div>
      </div>
    </div>
  );
}