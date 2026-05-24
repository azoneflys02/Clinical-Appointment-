export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  desc: string;
  availability: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  specialty: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  symptoms: string;
  status: "Chờ xác nhận" | "Đã xác nhận" | "Hoàn thành" | "Đã hủy";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  text: string;
  timestamp: Date;
}

export interface VitalReading {
  id: string;
  date: string;
  heartRate: number; // e.g. 72 bpm
  systolic: number;  // e.g. 120 mmHg
  diastolic: number; // e.g. 80 mmHg
  weight?: number;    // e.g. 68 kg
}

export interface MedicalRecord {
  id: string;
  patientName: string;
  patientGender: "Nam" | "Nữ" | "Khác";
  patientBirth: string;
  bloodType: string;
  allergies: string;
  weight: string; // e.g. "65 kg"
  height: string; // e.g. "172 cm"
  heartRate?: string; // e.g. "72 bpm"
  bloodPressure?: string; // e.g. "120/80 mmHg"
  diagnoses: DiagnosticHistory[];
  prescriptions: Prescription[];
  vitalsHistory?: VitalReading[];
  personalNotes?: string;
  updatedAt: string;
}

export interface DiagnosticHistory {
  id: string;
  date: string;
  diagnosis: string;
  doctorName: string;
  notes: string;
  facility: string;
}

export interface Prescription {
  id: string;
  date: string;
  doctorName: string;
  status: "Đang sử dụng" | "Đã hết hạn" | "Đã lưu trữ";
  drugs: {
    name: string;
    dosage: string; // e.g. "Sáng 1 viên, Tối 1 viên sau ăn"
    quantity: string; // e.g. "20 viên"
  }[];
  price?: number; // Price in VND
  paymentStatus?: "Chưa thanh toán" | "Đã thanh toán";
  paymentDate?: string;
  transactionId?: string;
}
