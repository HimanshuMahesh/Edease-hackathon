export interface Class {
  id: string;
  name: string;
  teacher: string;
  qrCode: string;
  timestamp: number;
}

export interface Attendance {
  classId: string;
  studentId: string;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
  };
}