export const generateQRCode = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const getStoredClasses = () => {
  const stored = localStorage.getItem('classes');
  return stored ? JSON.parse(stored) : [];
};

export const getStoredAttendance = () => {
  const stored = localStorage.getItem('attendance');
  return stored ? JSON.parse(stored) : [];
};

// Custom event for attendance updates
export const ATTENDANCE_UPDATE = 'ATTENDANCE_UPDATE';

export const updateAttendance = (newAttendance: any[]) => {
  localStorage.setItem('attendance', JSON.stringify(newAttendance));
  // Dispatch custom event for local updates
  window.dispatchEvent(new CustomEvent(ATTENDANCE_UPDATE));
  // Dispatch storage event for cross-tab updates
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'attendance',
    newValue: JSON.stringify(newAttendance)
  }));
};