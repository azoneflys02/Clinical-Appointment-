import React, { useState, useEffect } from "react";
import { ShieldAlert, Activity, FileText, Plus, HeartPulse, HardDrive, Check, Edit3, Trash2, CreditCard, QrCode, Truck, Copy, Download, AlertCircle, X, Lock, Printer } from "lucide-react";
import { MedicalRecord, DiagnosticHistory, Prescription, VitalReading } from "../types";
import { Language, translations } from "../translations";
import VitalsTrendChart from "./VitalsTrendChart";

interface MedicalRecordsProps {
  lang?: Language;
  theme?: "light" | "dark";
}

const INITIAL_RECORD: MedicalRecord = {
  id: "rec-an-khang-101",
  patientName: "Nguyễn Văn An",
  patientGender: "Nam",
  patientBirth: "1991-08-12",
  bloodType: "O+",
  allergies: "Thuốc kháng sinh Penicillin, Hải sản có vỏ",
  weight: "68 kg",
  height: "172 cm",
  heartRate: "72 nhịp/phút",
  bloodPressure: "120/80 mmHg",
  personalNotes: "Tiền sử gia đình có người cao huyết áp nhẹ. Bản thân thường xuyên chạy bộ thể thao rèn luyện sức khỏe.",
  updatedAt: new Date().toLocaleDateString("vi-VN"),
  vitalsHistory: [
    { id: "v-1", date: "2026-01-10", heartRate: 76, systolic: 128, diastolic: 82, weight: 70 },
    { id: "v-2", date: "2026-02-15", heartRate: 74, systolic: 125, diastolic: 80, weight: 69 },
    { id: "v-3", date: "2026-03-20", heartRate: 73, systolic: 122, diastolic: 82, weight: 68 },
    { id: "v-4", date: "2026-04-10", heartRate: 71, systolic: 120, diastolic: 79, weight: 68 },
    { id: "v-5", date: "2026-05-20", heartRate: 72, systolic: 118, diastolic: 78, weight: 68 }
  ],
  diagnoses: [
    {
      id: "diag-1",
      date: "2026-04-10",
      diagnosis: "Hội chứng trào ngược dạ dày thực quản (GERD)",
      doctorName: "BS. CKI Nguyễn Tuấn Minh",
      notes: "Ăn uống điều độ, tránh thức khuya, không ăn muộn sau 20:00, ngủ nằm đầu cao.",
      facility: "Phòng khám Đa khoa An Khang"
    },
    {
      id: "diag-2",
      date: "2025-11-05",
      diagnosis: "Viêm mũi dị ứng thời tiết mùa thu đông",
      doctorName: "BS. CKII Huỳnh Anh Quốc",
      notes: "Sử dụng nước muối sinh lý rửa mũi hàng ngày, đeo khẩu trang khi ra đường lọc bụi mịn.",
      facility: "Phòng khám Đa khoa An Khang"
    }
  ],
  prescriptions: [
    {
      id: "pres-1",
      date: "2026-05-20",
      doctorName: "BS. CKI Nguyễn Tuấn Minh",
      status: "Đang sử dụng",
      drugs: [
        { name: "Nexium (Esomeprazole) 40mg", dosage: "Sáng 1 viên uống trước ăn 30 phút", quantity: "14 viên" },
        { name: "Gaviscon Suspension Dual Action", dosage: "Uống 1 gói sau các bữa ăn trưa và tối 1 tiếng", quantity: "20 gói" }
      ],
      price: 345000,
      paymentStatus: "Chưa thanh toán"
    },
    {
      id: "pres-2",
      date: "2026-02-15",
      doctorName: "BS. CKII Huỳnh Anh Quốc",
      status: "Đã hết hạn",
      drugs: [
        { name: "Decolgen Forte (Trị cảm cúm)", dosage: "Uống 1 viên sau ăn no, tối đa 3 lần/ngày", quantity: "10 viên" },
        { name: "Amoxicillin 500mg", dosage: "Sáng 1 viên, Chiều 1 viên sau ăn", quantity: "14 viên" }
      ],
      price: 180000,
      paymentStatus: "Đã thanh toán",
      paymentDate: "2026-02-15",
      transactionId: "TXN2402159823"
    },
    {
      id: "pres-3",
      date: "2025-11-05",
      doctorName: "BS. CKI Lê Hoàng Nam",
      status: "Đã lưu trữ",
      drugs: [
        { name: "Telfast (Fexofenadine) 180mg", dosage: "Mỗi ngày uống 1 viên vào buổi tối", quantity: "30 viên" },
        { name: "Singulair (Montelukast) 10mg", dosage: "Nhai 1 viên trước khi đi ngủ", quantity: "30 viên" }
      ],
      price: 420000,
      paymentStatus: "Đã thanh toán",
      paymentDate: "2025-11-05",
      transactionId: "TXN2511051284"
    }
  ]
};

export default function MedicalRecords({ lang = "vi", theme = "light" }: MedicalRecordsProps) {
  const t = (key: keyof typeof translations["vi"]) => {
    return translations[lang]?.[key] || translations["vi"][key];
  };

  const getDoctorName = (docName: string) => {
    switch (docName) {
      case "BS. CKI Nguyễn Tuấn Minh": return t("drMinh");
      case "ThS. BS Trần Thị Mai Hương": return t("drHuong");
      case "BS. CKI Lê Hoàng Nam": return t("drHoang");
      case "ThS. BS Phạm Phương Thảo": return t("drThao");
      case "BS. CKII Huỳnh Anh Quốc": return t("drQuoc");
      default: return docName;
    }
  };

  const getTranslatedDiagnosis = (diagText: string) => {
    if (lang === "vi") return diagText;
    if (diagText === "Hội chứng trào ngược dạ dày thực quản (GERD)") {
      return "Gastroesophageal Reflux Disease (GERD) Syndrome";
    }
    if (diagText === "Viêm mũi dị ứng thời tiết mùa thu đông") {
      return "Autumn-Winter Seasonal Allergic Rhinitis";
    }
    return diagText;
  };

  const getTranslatedNotes = (notes: string) => {
    if (lang === "vi") return notes;
    if (notes === "Ăn uống điều độ, tránh thức khuya, không ăn muộn sau 20:00, ngủ nằm đầu cao.") {
      return "Eat regularly, avoid late nights, do not eat past 20:00, sleep with a raised head pillow.";
    }
    if (notes === "Sử dụng nước muối sinh lý rửa mũi hàng ngày, đeo khẩu trang khi ra đường lọc bụi mịn.") {
      return "Use isotonic saline nose spray daily; wear masks to screen out PM2.5 particles on roads.";
    }
    return notes;
  };

  const getTranslatedDrugName = (drug: string) => {
    if (lang === "vi") return drug;
    if (drug === "Nexium (Esomeprazole) 40mg") return "Nexium (Esomeprazole) 40mg";
    if (drug === "Gaviscon Suspension Dual Action") return "Gaviscon Suspension Dual Action";
    if (drug === "Decolgen Forte (Trị cảm cúm)") return "Decolgen Forte (Cold relief tabs)";
    if (drug === "Amoxicillin 500mg") return "Amoxicillin 500mg antibiotic";
    if (drug === "Telfast (Fexofenadine) 180mg") return "Telfast (Fexofenadine) 180mg";
    if (drug === "Singulair (Montelukast) 10mg") return "Singulair (Montelukast) 10mg";
    return drug;
  };

  const getTranslatedDosage = (dosage: string) => {
    if (lang === "vi") return dosage;
    if (dosage === "Sáng 1 viên uống trước ăn 30 phút") return "1 pill in the morning, 30 minutes before meal";
    if (dosage === "Uông 1 gói sau các bữa ăn trưa và tối 1 tiếng" || dosage === "Uống 1 gói sau các bữa ăn trưa và tối 1 tiếng") return "1 sachet 1 hour after lunch and dinner";
    if (dosage === "Uống 1 viên sau ăn no, tối đa 3 lần/ngày") return "1 pill after food, maximum 3 times/day";
    if (dosage === "Sáng 1 viên, Chiều 1 viên sau ăn") return "1 pill in morning, 1 pill in afternoon after food";
    if (dosage === "Mỗi ngày uống 1 viên vào buổi tối") return "1 pill every evening";
    if (dosage === "Nhai 1 viên trước khi đi ngủ") return "Chew 1 tablet before sleeping";
    return dosage;
  };

  const getTranslatedQty = (qty: string) => {
    if (lang === "vi") return qty;
    return qty.replace("viên", "tabs").replace("gói", "sachets").replace("vỉ", "blisters");
  };

  const [record, setRecord] = useState<MedicalRecord>(() => {
    const saved = localStorage.getItem("ankhang_medical_record");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.vitalsHistory) {
          parsed.vitalsHistory = INITIAL_RECORD.vitalsHistory;
        }
        return parsed;
      } catch (e) {
        // use default
      }
    }
    return INITIAL_RECORD;
  });

  const [isEditingVitals, setIsEditingVitals] = useState(false);
  
  // Payment transaction & delivery states for medicine prescriptions online bills
  const [payingPrescription, setPayingPrescription] = useState<Prescription | null>(null);
  const [paymentStep, setPaymentStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "card">("qr");
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"counter" | "delivery">("counter");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [paymentError, setPaymentError] = useState("");
  
  // Vitals State Edit Inputs
  const [bloodType, setBloodType] = useState(record.bloodType);
  const [allergies, setAllergies] = useState(record.allergies);
  const [weight, setWeight] = useState(record.weight);
  const [height, setHeight] = useState(record.height);
  const [heartRate, setHeartRate] = useState(record.heartRate || "");
  const [bloodPressure, setBloodPressure] = useState(record.bloodPressure || "");
  const [personalNotes, setPersonalNotes] = useState(record.personalNotes || "");

  // Keep form fields in sync when record changes
  useEffect(() => {
    setBloodType(record.bloodType);
    setAllergies(record.allergies);
    setWeight(record.weight);
    setHeight(record.height);
    setHeartRate(record.heartRate || "");
    setBloodPressure(record.bloodPressure || "");
    setPersonalNotes(record.personalNotes || "");
  }, [record]);

  // Add Diagnosis State
  const [showAddDiag, setShowAddDiag] = useState(false);
  const [newDiagDate, setNewDiagDate] = useState(new Date().toISOString().split("T")[0]);
  const [newDiagName, setNewDiagName] = useState("");
  const [newDiagDoc, setNewDiagDoc] = useState("");
  const [newDiagNotes, setNewDiagNotes] = useState("");
  const [newDiagFacility, setNewDiagFacility] = useState("");

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("ankhang_medical_record", JSON.stringify(record));
  }, [record]);

  // Set default additions doctor on mount or lang change
  useEffect(() => {
    setNewDiagDoc(lang === "vi" ? "Tự khai báo y tế" : "Self declared health");
    setNewDiagFacility(lang === "vi" ? "Cá nhân lưu trữ" : "Personal archive");
  }, [lang]);

  // Prescription Management States
  const [prescriptionFilter, setPrescriptionFilter] = useState<"Tất cả" | "Đang sử dụng" | "Đã hết hạn" | "Đã lưu trữ">("Tất cả");
  const [showAddPrescription, setShowAddPrescription] = useState(false);
  const [newPresDate, setNewPresDate] = useState(new Date().toISOString().split("T")[0]);
  const [newPresDoc, setNewPresDoc] = useState("BS. CKI Nguyễn Tuấn Minh");
  const [newPresStatus, setNewPresStatus] = useState<"Đang sử dụng" | "Đã hết hạn" | "Đã lưu trữ">("Đang sử dụng");
  const [newPresDrugs, setNewPresDrugs] = useState<{ name: string; dosage: string; quantity: string }[]>([
    { name: "", dosage: "", quantity: "" }
  ]);

  const addDrugRow = () => {
    setNewPresDrugs(prev => [...prev, { name: "", dosage: "", quantity: "" }]);
  };

  const updateDrugRow = (index: number, field: "name" | "dosage" | "quantity", value: string) => {
    setNewPresDrugs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeDrugRow = (index: number) => {
    if (newPresDrugs.length > 1) {
      setNewPresDrugs(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const validDrugs = newPresDrugs.filter((d) => d.name.trim());
    if (validDrugs.length === 0) {
      alert(lang === "vi" ? "Vui lòng điền ít nhất tên một loại thuốc." : "Please input at least one drug name.");
      return;
    }

    const newPres: Prescription = {
      id: `pres-${Date.now()}`,
      date: newPresDate,
      doctorName: newPresDoc,
      status: newPresStatus,
      drugs: validDrugs.map((d) => ({
        name: d.name.trim(),
        dosage: d.dosage.trim() || (lang === "vi" ? "Uống theo chỉ định" : "Take as directed"),
        quantity: d.quantity.trim() || "1 vỉ"
      })),
      price: Math.floor((Math.random() * 200 + 100) * 1000), // Random prices from 100,000 VND to 300,000 VND
      paymentStatus: "Chưa thanh toán"
    };

    setRecord((prev) => ({
      ...prev,
      prescriptions: [newPres, ...prev.prescriptions],
      updatedAt: new Date().toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")
    }));

    setNewPresDrugs([{ name: "", dosage: "", quantity: "" }]);
    setShowAddPrescription(false);
  };

  const handleUpdatePresStatus = (id: string, nextStatus: "Đang sử dụng" | "Đã hết hạn" | "Đã lưu trữ") => {
    setRecord((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.map((p) =>
        p.id === id ? { ...p, status: nextStatus } : p
      ),
      updatedAt: new Date().toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")
    }));
  };

  const handleDeletePrescription = (id: string) => {
    if (confirm(lang === "vi" ? "Bạn có chắc chắn muốn xóa đơn thuốc này khỏi hồ sơ y tế?" : "Are you sure you want to delete this prescription from your health medical records?")) {
      setRecord((prev) => ({
        ...prev,
        prescriptions: prev.prescriptions.filter((p) => p.id !== id),
        updatedAt: new Date().toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")
      }));
    }
  };

  const handleSaveVitals = () => {
    setRecord((prev) => ({
      ...prev,
      bloodType,
      allergies,
      weight,
      height,
      heartRate,
      bloodPressure,
      personalNotes,
      updatedAt: new Date().toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")
    }));
    setIsEditingVitals(false);
  };

  const handleAddVital = (newVital: VitalReading) => {
    setRecord((prev) => {
      const updatedHistory = [newVital, ...(prev.vitalsHistory || [])];
      
      const sorted = [...updatedHistory].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latest = sorted[0];

      return {
        ...prev,
        vitalsHistory: updatedHistory,
        weight: latest ? `${latest.weight || parseFloat(prev.weight) || 68} kg` : prev.weight,
        bloodPressure: latest ? `${latest.systolic}/${latest.diastolic} mmHg` : prev.bloodPressure,
        heartRate: latest ? `${latest.heartRate} nhịp/phút` : prev.heartRate,
        updatedAt: new Date().toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")
      };
    });
  };

  const handleDeleteVital = (id: string) => {
    const confirmMsg = lang === "vi" 
      ? "Bạn có chắc chắn muốn xóa số đo sinh tồn này?" 
      : "Are you sure you want to delete this vitals entry?";
    if (confirm(confirmMsg)) {
      setRecord((prev) => {
        const updatedHistory = (prev.vitalsHistory || []).filter((v) => v.id !== id);
        
        const sorted = [...updatedHistory].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const latest = sorted[0];

        return {
          ...prev,
          vitalsHistory: updatedHistory,
          weight: latest ? `${latest.weight || parseFloat(prev.weight) || 68} kg` : prev.weight,
          bloodPressure: latest ? `${latest.systolic}/${latest.diastolic} mmHg` : prev.bloodPressure,
          heartRate: latest ? `${latest.heartRate} nhịp/phút` : prev.heartRate,
          updatedAt: new Date().toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")
        };
      });
    }
  };

  const handleConfirmPayment = () => {
    if (!payingPrescription) return;

    if (paymentMethod === "card") {
      // Validate card fields
      const cleanCard = cardNumber.replace(/\s/g, "");
      if (!cleanCard || cleanCard.length < 15) {
        setPaymentError(lang === "vi" ? "Vui lòng nhập đủ số thẻ thanh toán (từ 15-16 chữ số)." : "Please enter a valid card number (15-16 digits).");
        return;
      }
      if (!cardExpiry.trim() || !cardExpiry.includes("/")) {
        setPaymentError(lang === "vi" ? "Vui lòng nhập ngày hết hạn định dạng MM/YY." : "Please enter expiration date as MM/YY.");
        return;
      }
      if (!cardCVV.trim() || cardCVV.trim().length < 3) {
        setPaymentError(lang === "vi" ? "Vui lòng nhập mã CVV bảo mật (3 chữ số)." : "Please enter a valid 3-digit CVV back code.");
        return;
      }
      if (!cardHolder.trim()) {
        setPaymentError(lang === "vi" ? "Vui lòng nhập tên chủ thẻ không dấu." : "Please enter the cardholder's name.");
        return;
      }
    }

    if (deliveryMethod === "delivery") {
      if (!shippingAddress.trim()) {
        setPaymentError(lang === "vi" ? "Vui lòng nhập địa chỉ nhận thuốc tận nơi." : "Please enter a delivery address.");
        return;
      }
      if (!shippingPhone.trim() || shippingPhone.trim().length < 9) {
        setPaymentError(lang === "vi" ? "Vui lòng nhập số điện thoại nhận hàng hợp lệ." : "Please enter a valid recipient phone number.");
        return;
      }
    }

    setPaymentError("");
    setIsSimulatingPayment(true);

    // Simulate online processing with An Khang secure gateway
    setTimeout(() => {
      const generatedTxnId = `TXN${Date.now().toString().slice(-8).toUpperCase()}`;
      const currentDateString = new Date().toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US");

      setRecord((prev) => {
        const updatedPrescriptions = prev.prescriptions.map((p) => {
          if (p.id === payingPrescription.id) {
            return {
              ...p,
              paymentStatus: "Đã thanh toán" as const,
              paymentDate: currentDateString,
              transactionId: generatedTxnId
            };
          }
          return p;
        });

        return {
          ...prev,
          prescriptions: updatedPrescriptions,
          updatedAt: currentDateString
        };
      });

      setIsSimulatingPayment(false);
      setPaymentStep(3); // Go to receipt screen
    }, 2200);
  };

  const handleAddDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiagName.trim()) return;

    const newDiag: DiagnosticHistory = {
      id: `diag-${Date.now()}`,
      date: newDiagDate,
      diagnosis: newDiagName.trim(),
      doctorName: newDiagDoc.trim(),
      notes: newDiagNotes.trim() || (lang === "vi" ? "Không có chỉ dẫn đặc biệt." : "No specific treatment instructions given."),
      facility: newDiagFacility.trim()
    };

    setRecord((prev) => ({
      ...prev,
      diagnoses: [newDiag, ...prev.diagnoses],
      updatedAt: new Date().toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")
    }));

    setNewDiagName("");
    setNewDiagNotes("");
    setShowAddDiag(false);
  };

  const handleDeleteDiagnosis = (id: string) => {
    if (confirm(lang === "vi" ? "Xóa dòng chẩn đoán lịch sử này sẽ không thể khôi phục. Bạn vẫn muốn xóa?" : "Deleting this diagnostic ledger cannot be undone. Do you wish to proceed?")) {
      setRecord((prev) => ({
        ...prev,
        diagnoses: prev.diagnoses.filter((d) => d.id !== id),
        updatedAt: new Date().toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US")
      }));
    }
  };

  const filterOptions = ["Tất cả", "Đang sử dụng", "Đã hết hạn", "Đã lưu trữ"] as const;

  const getFilterTranslatedLabel = (option: typeof filterOptions[number]) => {
    switch (option) {
      case "Tất cả": return t("filterAll");
      case "Đang sử dụng": return t("presStatusUsing");
      case "Đã hết hạn": return t("presStatusExpired");
      case "Đã lưu trữ": return t("presStatusArchived");
      default: return option;
    }
  };

  return (
    <div className="space-y-8" id="medical-records-dashboard">
      
      {/* Premium Patient Banner Card */}
      <div className={`rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm transition-colors duration-300 ${
        theme === "dark" ? "bg-slate-900 text-white border border-slate-800 animate-fadeIn" : "bg-slate-900 text-white"
      }`}>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-600/10 rounded-l-full filter blur-xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <HeartPulse className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-xl md:text-2xl font-bold font-sans tracking-tight">{record.patientName}</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] md:text-xs px-2.5 py-0.5 rounded-full uppercase font-mono font-bold">
                  {t("medicalRecordCode")} MR-{record.id.split("-").pop()}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1.5 flex flex-wrap gap-2">
                <span>{t("gender")}: {record.patientGender === "Nam" ? (lang === "vi" ? "Nam" : "Male") : (lang === "vi" ? "Nữ" : "Female")}</span>
                <span>•</span>
                <span>{t("birth")}:{" "}
                  {new Date(record.patientBirth).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </p>
            </div>
          </div>
          <div className="text-left md:text-right text-xs md:text-sm text-slate-400 shrink-0">
            <p className="font-medium">{t("securedArchivelabel")}</p>
            <p className="mt-1 font-mono text-emerald-400 font-medium">{t("updatedLabel")}: {record.updatedAt}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Vitals Side Card */}
        <div className={`rounded-2xl border p-6 shadow-sm h-fit transition-colors duration-300 ${
          theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-205 text-slate-800"
        }`}>
          <div className={`flex items-center justify-between mb-4 pb-3 border-b ${theme === "dark" ? "border-slate-800" : "border-slate-100"}`}>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h4 className={`font-semibold text-sm md:text-base ${theme === "dark" ? "text-white" : "text-slate-800"}`}>{t("vitalsTitle")}</h4>
            </div>
            {!isEditingVitals ? (
              <button
                onClick={() => setIsEditingVitals(true)}
                className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline flex items-center space-x-1 cursor-pointer font-bold dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t("btnEdit")}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveVitals}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-md flex items-center space-x-1 cursor-pointer font-medium"
                >
                  <Check className="w-3 h-3" />
                  <span>{t("btnDone")}</span>
                </button>
                <button
                  onClick={() => setIsEditingVitals(false)}
                  className="text-xs text-slate-400 hover:text-slate-250 px-1 cursor-pointer"
                >
                  {t("btnCancel")}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {isEditingVitals ? (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">{t("bloodType")}</label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className={`w-full mt-1 border rounded-lg px-2.5 py-2 text-xs outline-none ${
                      theme === "dark" ? "bg-slate-800 border-slate-705 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <option value="A+" className="dark:bg-slate-900">A+</option>
                    <option value="B+" className="dark:bg-slate-900">B+</option>
                    <option value="AB+" className="dark:bg-slate-900">AB+</option>
                    <option value="O+" className="dark:bg-slate-900">O+</option>
                    <option value="A-" className="dark:bg-slate-900">A-</option>
                    <option value="B-" className="dark:bg-slate-900">B-</option>
                    <option value="AB-" className="dark:bg-slate-900">AB-</option>
                    <option value="O-" className="dark:bg-slate-900">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">{t("weight")} (kg)</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 68 kg"
                    className={`w-full mt-1 border rounded-lg px-2.5 py-2 text-xs outline-none ${
                      theme === "dark" ? "bg-slate-800 border-slate-705 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">{t("height")} (cm)</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 172 cm"
                    className={`w-full mt-1 border rounded-lg px-2.5 py-2 text-xs outline-none ${
                      theme === "dark" ? "bg-slate-800 border-slate-705 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">{t("bloodPressure")}</label>
                  <input
                    type="text"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    placeholder="e.g. 120/80 mmHg"
                    className={`w-full mt-1 border rounded-lg px-2.5 py-2 text-xs outline-none ${
                      theme === "dark" ? "bg-slate-800 border-slate-705 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">{t("heartRate")}</label>
                  <input
                    type="text"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    placeholder="e.g. 72 nhịp/phút"
                    className={`w-full mt-1 border rounded-lg px-2.5 py-2 text-xs outline-none ${
                      theme === "dark" ? "bg-slate-800 border-slate-705 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">{t("allergies")}</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Thuốc kháng sinh Penicillin"
                    className={`w-full mt-1 border rounded-lg px-2.5 py-2 text-xs outline-none ${
                      theme === "dark" ? "bg-slate-800 border-slate-705 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">{t("healthNotes")}</label>
                  <textarea
                    rows={3}
                    value={personalNotes}
                    onChange={(e) => setPersonalNotes(e.target.value)}
                    placeholder="Chạy bộ thể thao, tập thể hình hằng ngày..."
                    className={`w-full mt-1 border rounded-lg px-2.5 py-2 text-xs outline-none resize-none ${
                      theme === "dark" ? "bg-slate-800 border-slate-705 text-white focus:bg-slate-850" : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white"
                    }`}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-slate-950/40 text-slate-200" : "bg-slate-50 text-slate-800"}`}>
                    <span className="block text-[9px] font-semibold text-slate-500 uppercase">{t("bloodType")}</span>
                    <span className="text-base font-bold">{record.bloodType}</span>
                  </div>
                  <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-slate-950/40 text-slate-200" : "bg-slate-50 text-slate-800"}`}>
                    <span className="block text-[9px] font-semibold text-slate-500 uppercase">{t("vitalsGroup")}</span>
                    <span className="text-xs font-bold block mt-1">{record.weight} / {record.height}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-slate-950/40 text-slate-200" : "bg-slate-50 text-slate-800"}`}>
                    <span className="block text-[9px] font-semibold text-slate-500 uppercase">{t("bloodPressure")}</span>
                    <span className="text-xs font-bold">{record.bloodPressure || t("noVitals")}</span>
                  </div>
                  <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-slate-950/40 text-slate-200" : "bg-slate-50 text-slate-800"}`}>
                    <span className="block text-[9px] font-semibold text-slate-500 uppercase">{t("heartRate")}</span>
                    <span className="text-xs font-bold">{record.heartRate || t("noVitals")}</span>
                  </div>
                </div>

                {/* Allergies Highlight Card */}
                <div className={`p-3 border rounded-xl ${theme === "dark" ? "bg-rose-955/20 border-rose-900/60" : "bg-rose-50/50 border-rose-100"}`}>
                  <span className="block text-[10px] text-rose-700 font-bold uppercase flex items-center dark:text-rose-450">
                    <ShieldAlert className="w-4 h-4 text-rose-600 mr-1 shrink-0 dark:text-rose-455" />
                    {t("allergiesTitle")}
                  </span>
                  <p className={`text-xs font-medium mt-1.5 ${theme === "dark" ? "text-rose-300" : "text-rose-900"}`}>
                    {record.allergies || t("noAllergies")}
                  </p>
                </div>

                {/* Personal Notes Bio */}
                {record.personalNotes && (
                  <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-slate-950/30 text-slate-350" : "bg-slate-50 text-slate-600"}`}>
                    <span className="block text-[9px] text-slate-500 uppercase font-bold">{t("habitHistory")}</span>
                    <p className="text-xs mt-1.5 italic leading-relaxed">"{record.personalNotes}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Diagnosis Timeline & Prescriptions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Medical Vitals Historical Trend Chart */}
          <VitalsTrendChart
            vitalsHistory={record.vitalsHistory || []}
            onAddVital={handleAddVital}
            onDeleteVital={handleDeleteVital}
            lang={lang}
            theme={theme}
          />
          
          {/* Timeline Feed */}
          <div className={`rounded-2xl border p-6 shadow-sm transition-colors duration-300 ${
            theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200"
          }`}>
            <div className={`flex items-center justify-between mb-6 pb-3 border-b ${theme === "dark" ? "border-slate-800" : "border-slate-100"}`}>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h4 className={`font-semibold text-sm md:text-base ${theme === "dark" ? "text-slate-100" : "text-slate-850"}`}>
                  {t("clinicalHistoryTitle")} ({record.diagnoses.length})
                </h4>
              </div>
              <button
                onClick={() => setShowAddDiag(!showAddDiag)}
                className="bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 dark:bg-emerald-955/40 dark:text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("addDiagnosisBtn")}</span>
              </button>
            </div>

            {/* Self additions form */}
            {showAddDiag && (
              <form onSubmit={handleAddDiagnosis} className={`mb-6 p-4 border rounded-xl space-y-3 transition-all ${
                theme === "dark" ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-222"
              }`}>
                <span className="block text-xs font-semibold">{t("diagnosisTitleAdd")}</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400">{t("dateLabel")}</label>
                    <input
                      type="date"
                      value={newDiagDate}
                      onChange={(e) => setNewDiagDate(e.target.value)}
                      className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                        theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400">{t("doctorLabel")}</label>
                    <input
                      type="text"
                      value={newDiagDoc}
                      onChange={(e) => setNewDiagDoc(e.target.value)}
                      className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                        theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400">{t("diagnosisNameLabel")}</label>
                    <input
                      type="text"
                      required
                      value={newDiagName}
                      onChange={(e) => setNewDiagName(e.target.value)}
                      placeholder="e.g. GERD Flare-up, Sinusitis"
                      className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                        theme === "dark" ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400">{t("facilityLabel")}</label>
                    <input
                      type="text"
                      value={newDiagFacility}
                      onChange={(e) => setNewDiagFacility(e.target.value)}
                      className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                        theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400">{t("notesLabel")}</label>
                  <textarea
                    rows={2}
                    value={newDiagNotes}
                    onChange={(e) => setNewDiagNotes(e.target.value)}
                    placeholder="E.g. Sleep with head raised, avoid spices..."
                    className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none resize-none ${
                      theme === "dark" ? "bg-slate-900 border-slate-800 text-white focus:bg-slate-850" : "bg-white border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div className={`flex justify-end space-x-2 pt-1 border-t ${theme === "dark" ? "border-slate-800" : "border-slate-200"}`}>
                  <button
                    type="button"
                    onClick={() => setShowAddDiag(false)}
                    className="text-xs px-3 py-1.5 text-slate-400 hover:text-slate-250 cursor-pointer"
                  >
                    {t("btnCancel")}
                  </button>
                  <button
                    type="submit"
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-1.5 rounded-lg text-center cursor-pointer"
                  >
                    {t("diagnoseSaveBtn")}
                  </button>
                </div>
              </form>
            )}

            {/* Diagnostic feed thread */}
            <div className="space-y-6">
              {record.diagnoses.map((diag, index) => (
                <div key={diag.id} className={`relative pl-5 md:pl-6 border-l last:border-0 pb-1 ${theme === "dark" ? "border-slate-800" : "border-emerald-100"}`}>
                  {/* bullet circle */}
                  <span className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-emerald-600 border-2 ${
                    theme === "dark" ? "border-slate-955" : "border-white"
                  }`}></span>
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md font-bold tracking-tight ${
                        theme === "dark" ? "text-emerald-400 bg-emerald-955/20 border border-emerald-900/60" : "text-emerald-700 bg-emerald-50"
                      }`}>
                        {diag.date}
                      </span>
                      <h5 className={`font-bold text-sm md:text-base mt-2.5 ${theme === "dark" ? "text-slate-100" : "text-slate-850"}`}>
                        {getTranslatedDiagnosis(diag.diagnosis)}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1">
                        Bác sĩ: <span className={`${theme === "dark" ? "text-slate-300" : "text-slate-705"} font-semibold`}>{getDoctorName(diag.doctorName)}</span> • {diag.facility}
                      </p>
                    </div>
                    {diag.id !== "diag-1" && diag.id !== "diag-2" && (
                      <button
                        onClick={() => handleDeleteDiagnosis(diag.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className={`mt-2.5 p-3 rounded-xl border text-xs leading-relaxed ${
                    theme === "dark" ? "bg-slate-950/40 border-slate-850 text-slate-350" : "bg-slate-50 border-slate-100 text-slate-600"
                  }`}>
                    <p className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>
                      {t("diagnosticDisclaimer")}:
                    </p>
                    <p className="mt-0.5 whitespace-pre-wrap">{getTranslatedNotes(diag.notes)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Prescriptions List */}
          <div className={`rounded-2xl border p-6 shadow-sm space-y-6 transition-colors duration-300 ${
            theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200"
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b flex-wrap gap-3 ${theme === "dark" ? "border-slate-800" : "border-slate-100"}`}>
              <div className="flex items-center space-x-2">
                <HardDrive className="w-5 h-5 text-emerald-600 dark:text-emerald-450" />
                <h4 className={`font-semibold text-sm md:text-base ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>
                  {t("prescriptionTitle")} ({record.prescriptions.length})
                </h4>
              </div>
              <button
                onClick={() => setShowAddPrescription(!showAddPrescription)}
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center space-x-1 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("addPrescriptionBtn")}</span>
              </button>
            </div>

            {/* Quick Filter tabs with counts dynamically segmented */}
            <div className={`flex flex-wrap p-1 rounded-xl gap-1 ${
              theme === "dark" ? "bg-slate-950/70 border border-slate-850" : "bg-slate-100"
            }`}>
              {filterOptions.map((filter) => {
                const count = filter === "Tất cả" 
                  ? record.prescriptions.length 
                  : record.prescriptions.filter(p => p.status === filter).length;
                return (
                  <button
                    key={filter}
                    onClick={() => setPrescriptionFilter(filter)}
                    className={`flex-1 min-w-[70px] text-center text-xs py-2 px-1 rounded-lg font-medium transition-all cursor-pointer ${
                      prescriptionFilter === filter
                        ? (theme === "dark" ? "bg-slate-800 text-emerald-400 font-bold border border-slate-705" : "bg-white text-emerald-850 shadow-sm font-bold")
                        : "text-slate-500 hover:text-slate-800 hover:bg-white/40 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900/50"
                    }`}
                  >
                    <span>{getFilterTranslatedLabel(filter)}</span>
                    <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      theme === "dark" ? "bg-slate-900 text-slate-350" : "bg-slate-200 text-slate-600"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Form to manual add a prescription */}
            {showAddPrescription && (
              <form onSubmit={handleCreatePrescription} className={`p-4 border rounded-xl space-y-4 ${
                theme === "dark" ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-222"
              }`}>
                <h5 className="text-xs font-bold">{t("diagnosisTitleAdd")}</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400">{t("prescriptionDate")}</label>
                    <input
                      type="date"
                      required
                      value={newPresDate}
                      onChange={(e) => setNewPresDate(e.target.value)}
                      className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                        theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400">{lang === "vi" ? "Bác sĩ điều trị" : "Medical Practitioner"}</label>
                    <input
                      type="text"
                      required
                      value={newPresDoc}
                      onChange={(e) => setNewPresDoc(e.target.value)}
                      className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                        theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400">{t("presStatusCurrent")}</label>
                    <select
                      value={newPresStatus}
                      onChange={(e) => setNewPresStatus(e.target.value as any)}
                      className={`w-full mt-1 border rounded-lg px-2 py-1.5 text-xs outline-none cursor-pointer ${
                        theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
                      }`}
                    >
                      <option value="Đang sử dụng" className="dark:bg-slate-900">{getFilterTranslatedLabel("Đang sử dụng")}</option>
                      <option value="Đã hết hạn" className="dark:bg-slate-900">{getFilterTranslatedLabel("Đã hết hạn")}</option>
                      <option value="Đã lưu trữ" className="dark:bg-slate-900">{getFilterTranslatedLabel("Đã lưu trữ")}</option>
                    </select>
                  </div>
                </div>

                {/* List of drugs input rows */}
                <div className={`space-y-2 pb-2 border-b ${theme === "dark" ? "border-slate-800" : "border-slate-200"}`}>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">
                    {t("presDrugsHeading")}
                  </label>
                  {newPresDrugs.map((drug, di) => (
                    <div key={di} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6">
                        <input
                          type="text"
                          required
                          placeholder={t("presDrugPlaceholder")}
                          value={drug.name}
                          onChange={(e) => updateDrugRow(di, "name", e.target.value)}
                          className={`w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                            theme === "dark" ? "bg-slate-900 border-slate-805 text-white" : "bg-white border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder={t("presDosagePlaceholder")}
                          value={drug.dosage}
                          onChange={(e) => updateDrugRow(di, "dosage", e.target.value)}
                          className={`w-full border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                            theme === "dark" ? "bg-slate-900 border-slate-805 text-white" : "bg-white border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>
                      <div className="col-span-2 flex items-center space-x-1">
                        <input
                          type="text"
                          placeholder={t("presQuantityPlaceholder")}
                          value={drug.quantity}
                          onChange={(e) => updateDrugRow(di, "quantity", e.target.value)}
                          className={`w-full border rounded-lg px-1.5 py-1.5 text-xs outline-none text-center ${
                            theme === "dark" ? "bg-slate-900 border-slate-805 text-white" : "bg-white border-slate-200 text-slate-800"
                          }`}
                        />
                        {newPresDrugs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDrugRow(di)}
                            className="p-1 hover:bg-slate-805/45 rounded text-rose-500 hover:text-rose-700 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addDrugRow}
                    className="text-[11px] text-emerald-600 hover:text-emerald-555 font-bold flex items-center space-x-1 cursor-pointer pt-1 dark:text-emerald-400"
                  >
                    <span>{t("addDrugBtn")}</span>
                  </button>
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddPrescription(false)}
                    className="text-xs px-3 py-1.5 text-slate-400 hover:text-slate-300 cursor-pointer"
                  >
                    {t("btnCancel")}
                  </button>
                  <button
                    type="submit"
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-center cursor-pointer font-bold"
                  >
                    {t("savePrescription")}
                  </button>
                </div>
              </form>
            )}

            {/* List prescriptions feed */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {record.prescriptions.filter(p => prescriptionFilter === "Tất cả" || p.status === prescriptionFilter).length === 0 ? (
                <div className="text-center py-16 text-slate-400 dark:text-slate-555">
                  <p className="text-xs font-semibold">{t("noPrescriptionGroup")}</p>
                  <span className="text-[10px] block mt-1">{t("presManualSaves")}</span>
                </div>
              ) : (
                record.prescriptions
                  .filter(p => prescriptionFilter === "Tất cả" || p.status === prescriptionFilter)
                  .map((pres) => {
                    // Styled colors dynamically on theme and status classification
                    let statusBgClass = "";
                    let badgeClass = "";
                    
                    if (pres.status === "Đang sử dụng") {
                      statusBgClass = theme === "dark" 
                        ? "bg-emerald-950/20 border-emerald-900/50" 
                        : "bg-gradient-to-r from-teal-50/40 to-emerald-50/40 border-emerald-100/50";
                      badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900";
                    } else if (pres.status === "Đã hết hạn") {
                      statusBgClass = theme === "dark" 
                        ? "bg-amber-955/15 border-amber-900/40" 
                        : "bg-amber-50/30 border-amber-100/60";
                      badgeClass = "bg-amber-100 text-amber-800 border-amber-250/50 dark:bg-amber-955/40 dark:text-amber-400 dark:border-amber-900";
                    } else if (pres.status === "Đã lưu trữ") {
                      statusBgClass = theme === "dark" 
                        ? "bg-slate-800/25 border-slate-800" 
                        : "bg-slate-50/80 border-slate-200/70";
                      badgeClass = "bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-900 dark:text-slate-350 dark:border-slate-850";
                    }

                    return (
                      <div key={pres.id} className={`p-4 rounded-xl border ${statusBgClass} transition-shadow`}>
                        <div className={`flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3 pb-2 border-b ${
                          theme === "dark" ? "border-slate-850/60" : "border-slate-100/60"
                        }`}>
                          <div>
                            <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                theme === "dark" ? "text-slate-400 bg-slate-900 border-slate-800" : "text-slate-600 bg-white border-slate-200"
                              }`}>
                                {lang === "vi" ? "Đơn ngày" : "Prescribed"}: {pres.date}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                                • {getFilterTranslatedLabel(pres.status)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                              Bác sĩ: <strong className={theme === "dark" ? "text-slate-200" : "text-slate-705"}>{getDoctorName(pres.doctorName)}</strong>
                            </p>

                            {/* Cost & Payment Indicators */}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span className={`text-[11px] font-medium ${theme === "dark" ? "text-slate-450" : "text-slate-505"}`}>
                                {lang === "vi" ? "Tiền thuốc:" : "Medicine:"}
                              </span>
                              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">
                                {(pres.price || 345000).toLocaleString("vi-VN")} ₫
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border inline-flex items-center gap-1 leading-tight ${
                                pres.paymentStatus === "Đã thanh toán"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400 dark:border-emerald-800"
                                  : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400 dark:border-amber-800"
                              }`}>
                                <span className={`w-1 h-1 rounded-full ${pres.paymentStatus === "Đã thanh toán" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                                {pres.paymentStatus === "Đã thanh toán"
                                  ? (lang === "vi" ? "Đã thanh toán" : "Paid")
                                  : (lang === "vi" ? "Chờ thanh toán" : "Unpaid")}
                              </span>
                            </div>

                            {pres.paymentStatus === "Đã thanh toán" && pres.transactionId && (
                              <p className="text-[10px] font-mono text-slate-400 mt-1.5 flex items-center gap-1 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-800/50 w-max max-w-full">
                                <Lock className="w-3 h-3 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                <span>ID: {pres.transactionId} {pres.paymentDate ? `(${pres.paymentDate})` : ""}</span>
                              </p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 flex-wrap gap-2 justify-between md:justify-end w-full md:w-auto">
                            {/* Pay online button trigger */}
                            {pres.paymentStatus !== "Đã thanh toán" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPayingPrescription(pres);
                                  setPaymentStep(1);
                                  setCardNumber("");
                                  setCardExpiry("");
                                  setCardCVV("");
                                  setCardHolder("");
                                  setShippingAddress("");
                                  setShippingPhone("");
                                  setDeliveryMethod("counter");
                                  setIsSimulatingPayment(false);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>{lang === "vi" ? "Thanh toán Online" : "Pay Online"}</span>
                              </button>
                            )}

                            {/* Fast categorization switcher */}
                            <div className={`flex items-center space-x-1 p-1 rounded-lg border ${
                              theme === "dark" ? "bg-slate-950 border-slate-900" : "bg-white/70 border-slate-200"
                            }`}>
                              {(["Đang sử dụng", "Đã hết hạn", "Đã lưu trữ"] as const).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleUpdatePresStatus(pres.id, st)}
                                  className={`text-[9px] px-1.5 py-0.5 rounded transition-all cursor-pointer font-semibold ${
                                    pres.status === st
                                      ? (theme === "dark" ? "bg-emerald-600 text-white font-extrabold shadow-xs" : "bg-slate-800 text-white font-extrabold shadow-sm")
                                      : "text-slate-400 hover:text-slate-150 hover:bg-slate-900"
                                  }`}
                                >
                                  {st === "Đang sử dụng" ? (lang === "vi" ? "Đang dùng" : "Active") : st === "Đã hết hạn" ? (lang === "vi" ? "Hết hạn" : "Expired") : (lang === "vi" ? "Lưu trữ" : "Archived")}
                                </button>
                              ))}
                            </div>
                            
                            <button
                              onClick={() => handleDeletePrescription(pres.id)}
                              className="text-slate-450 hover:text-rose-600 transition-colors p-1 cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* List drugs details */}
                        <div className={`space-y-2 p-3 rounded-lg border ${
                          theme === "dark" ? "bg-slate-950/40 border-slate-900" : "bg-white/60 border-slate-100/60"
                        }`}>
                          {pres.drugs.map((drug, di) => (
                            <div key={di} className={`flex justify-between items-start text-xs border-b last:border-0 py-1 last:pb-0 ${
                              theme === "dark" ? "border-slate-900" : "border-slate-100"
                            }`}>
                              <div>
                                <p className={`font-bold ${theme === "dark" ? "text-slate-105" : "text-slate-800"}`}>
                                  {di + 1}. {getTranslatedDrugName(drug.name)}
                                </p>
                                <p className="text-slate-400 text-[11px] mt-0.5">
                                  {t("presInstructions")} <span className={`italic font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>{getTranslatedDosage(drug.dosage)}</span>
                                </p>
                              </div>
                              <span className={`font-semibold shadow-xs px-2 py-0.5 rounded border shrink-0 font-mono text-[10px] ${
                                theme === "dark" ? "bg-slate-900 text-slate-300 border-slate-800" : "bg-white text-slate-705 border-slate-150"
                              }`}>
                                {t("presQuantity")} {getTranslatedQty(drug.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PROFESSIONAL ONLINE MEDICINE PRESCRIPTION BILL PAYMENT MODAL */}
      {/* ========================================================= */}
      {payingPrescription && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div
            className={`w-full max-w-lg rounded-2xl border shadow-xl p-6 relative transition-all duration-200 overflow-hidden ${
              theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
            }`}
            id="prescription-payment-modal-container"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">
                    {lang === "vi" ? "Thanh Toán Đơn Thuốc Trực Tuyến" : "Online Prescription Payment"}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {lang === "vi" ? "Cổng kết nối y tế trực tuyến bảo mật An Khang Pay" : "Secure digital payment gateway handled with An Khang Pay"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPayingPrescription(null)}
                className="text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step Wizard Indicator */}
            <div className="flex items-center justify-between mb-5 px-6">
              {[1, 2, 3].map((step) => {
                const stepNames = lang === "vi" 
                  ? ["Đơn thuốc", "Thanh toán", "Hóa đơn"] 
                  : ["Review Bill", "Payment", "Receipt"];
                const isCompleted = step < paymentStep;
                const isActive = step === paymentStep;

                return (
                  <div key={step} className="flex flex-col items-center relative flex-1">
                    {/* Line connecting */}
                    {step > 1 && (
                      <div className={`absolute top-3.5 right-1/2 left-0 h-0.5 -translate-y-1/2 ${
                        step <= paymentStep ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                      }`} />
                    )}
                    {step < 3 && (
                      <div className={`absolute top-3.5 left-1/2 right-0 h-0.5 -translate-y-1/2 ${
                        step < paymentStep ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                      }`} />
                    )}

                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shadow-sm relative z-10 ${
                      isCompleted 
                        ? "bg-emerald-500 text-white" 
                        : isActive 
                        ? "bg-emerald-650 text-white border-2 border-emerald-300 dark:border-emerald-800" 
                        : (theme === "dark" ? "bg-slate-800 text-slate-400 border border-slate-700" : "bg-slate-50 text-slate-400 border border-slate-200")
                    }`}>
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : step}
                    </div>
                    <span className={`text-[9px] font-bold mt-1.5 ${
                      isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                    }`}>
                      {stepNames[step - 1]}
                    </span>
                  </div>
                );
              })}
            </div>

            {paymentError && (
              <div className="mb-4 p-3 bg-rose-50/85 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* STEP 1: REVIEW BILL */}
            {paymentStep === 1 && (
              <div className="space-y-4">
                <div className={`p-3 rounded-xl border ${theme === "dark" ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{lang === "vi" ? "Thông tin người thụ hưởng" : "Patient Beneficiary"}</span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1.5 text-xs text-slate-500">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{lang === "vi" ? "Họ và tên:" : "Patient Name:"}</span>
                      <strong className={theme === "dark" ? "text-slate-200" : "text-slate-800"}>{record.patientName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">{lang === "vi" ? "Mã bệnh án:" : "Patient ID:"}</span>
                      <strong className="font-mono">{record.id}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">{lang === "vi" ? "Bác sĩ kê đơn:" : "Prescribing Doctor:"}</span>
                      <strong>{getDoctorName(payingPrescription.doctorName)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">{lang === "vi" ? "Ngày kê đơn:" : "Prescription Date:"}</span>
                      <strong>{payingPrescription.date}</strong>
                    </div>
                  </div>
                </div>

                {/* Drugs Items List */}
                <div className="border border-dashed rounded-xl p-3 border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">{lang === "vi" ? "Chi tiết gói thuốc" : "Prescription Medicine Details"}</span>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {payingPrescription.drugs.map((drug, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-100 dark:border-slate-850 last:border-0 last:pb-0">
                        <div className="max-w-[75%]">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                            {idx + 1}. {getTranslatedDrugName(drug.name)}
                          </p>
                          <p className="text-[10px] text-slate-450 italic font-mono">{getTranslatedDosage(drug.dosage)}</p>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500 px-1.5 py-0.5 rounded border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
                          {t("presQuantity")} {getTranslatedQty(drug.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Pickup options */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{lang === "vi" ? "Phương thức nhận thuốc" : "Medicine Delivery Method"}</span>
                  <div className="grid grid-cols-2 gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryMethod("counter");
                        setPaymentError("");
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        deliveryMethod === "counter"
                          ? "border-emerald-600 bg-emerald-500/5 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-400"
                          : (theme === "dark" ? "border-slate-800 bg-slate-950/20 text-slate-400 text-slate-350" : "border-slate-200 bg-white text-slate-500")
                      }`}
                    >
                      <HardDrive className="w-5 h-5 mb-1.5 text-slate-400 dark:text-slate-600" />
                      <span className="text-xs font-bold">{lang === "vi" ? "Nhận tại Nhà thuốc" : "Collect at Pharmacy"}</span>
                      <span className="text-[9px] text-slate-400 mt-1">{lang === "vi" ? "Phòng khám An Khang (Miễn phí)" : "An Khang Clinic (Free)"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryMethod("delivery");
                        setPaymentError("");
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        deliveryMethod === "delivery"
                          ? "border-emerald-600 bg-emerald-500/5 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-400"
                          : (theme === "dark" ? "border-slate-800 bg-slate-950/20 text-slate-400 text-slate-350" : "border-slate-200 bg-white text-slate-500")
                      }`}
                    >
                      <Truck className="w-5 h-5 mb-1.5 text-slate-400 dark:text-slate-600" />
                      <span className="text-xs font-bold">{lang === "vi" ? "Giao hàng tận nhà" : "Home Delivery"}</span>
                      <span className="text-[9px] text-slate-400 mt-1">{lang === "vi" ? "Chuyển phát nhanh 2H (+30K)" : "Insured shipment 2H (+30K)"}</span>
                    </button>
                  </div>

                  {deliveryMethod === "delivery" && (
                    <div className="space-y-2 mt-2 p-3 rounded-xl border border-dashed border-emerald-500/25 bg-emerald-500/[0.01] animate-fadeIn text-left">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400">{lang === "vi" ? "Địa chỉ nhận thuốc tận nơi" : "Shipment Address"}</label>
                        <input
                          type="text"
                          required
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder={lang === "vi" ? "Ví dụ: 153 Lê Duẩn, Phường Bến Thành, Quận 1, TPHCM" : "e.g. 153 Le Duan street, District 1, HCMC"}
                          className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                            theme === "dark" ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400">{lang === "vi" ? "Số điện thoại nhận hàng" : "Shipment Phone Number"}</label>
                        <input
                          type="tel"
                          required
                          value={shippingPhone}
                          onChange={(e) => setShippingPhone(e.target.value)}
                          placeholder="09xxxxxxxx"
                          className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                            theme === "dark" ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Total Billing Block */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-left">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">{lang === "vi" ? "Tổng cộng phí cần thanh toán" : "Grand Total Fee"}</span>
                    <span className="text-lg font-black text-rose-600 dark:text-rose-400 font-mono">
                      {((payingPrescription.price || 345000) + (deliveryMethod === "delivery" ? 30000 : 0)).toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (deliveryMethod === "delivery") {
                        if (!shippingAddress.trim()) {
                          setPaymentError(lang === "vi" ? "Vui lòng nhập địa chỉ giao nhận thuốc." : "Please enter a valid shipping address.");
                          return;
                        }
                        if (!shippingPhone.trim() || shippingPhone.trim().length < 9) {
                          setPaymentError(lang === "vi" ? "Vui lòng nhập số điện thoại để giao hàng." : "Please enter shipping contact phone.");
                          return;
                        }
                      }
                      setPaymentError("");
                      setPaymentStep(2);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    {lang === "vi" ? "Tiếp tục thanh toán" : "Proceed to Pay"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PAYMENT METHOD & SIMULATION */}
            {paymentStep === 2 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block text-left">{lang === "vi" ? "Chọn kênh thanh toán" : "Select Payment Gateway"}</span>
                  <div className="grid grid-cols-2 gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod("qr");
                        setPaymentError("");
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        paymentMethod === "qr"
                          ? "border-emerald-600 bg-emerald-500/5 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-400"
                          : (theme === "dark" ? "border-slate-800 bg-slate-950/20 text-slate-400 text-slate-350" : "border-slate-200 bg-white text-slate-500")
                      }`}
                    >
                      <QrCode className="w-5 h-5 mb-1.5 text-slate-400 dark:text-slate-600" />
                      <span className="text-xs font-bold">{lang === "vi" ? "Quét mã QR Thần Tốc" : "Instant QR Transfer"}</span>
                      <span className="text-[9px] text-slate-400 mt-1">{lang === "vi" ? "Momo, Zalopay, VietQR" : "Vietnam banks e-scanning"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod("card");
                        setPaymentError("");
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        paymentMethod === "card"
                          ? "border-emerald-600 bg-emerald-500/5 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-400"
                          : (theme === "dark" ? "border-slate-800 bg-slate-950/20 text-slate-400 text-slate-350" : "border-slate-200 bg-white text-slate-500")
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mb-1.5 text-slate-400 dark:text-slate-600" />
                      <span className="text-xs font-bold">{lang === "vi" ? "Thẻ tín dụng Quốc tế" : "Credit Card Gateway"}</span>
                      <span className="text-[9px] text-slate-400 mt-1">{lang === "vi" ? "Visa, Mastercard, JCB" : "100% Secure Transaction"}</span>
                    </button>
                  </div>
                </div>

                {/* Sub payload */}
                {paymentMethod === "qr" ? (
                  <div className="flex flex-col items-center justify-center p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl animate-fadeIn space-y-3">
                    <span className="text-[10px] font-bold text-center text-slate-400 tracking-wider">
                      {lang === "vi" 
                        ? "VUI LÒNG MỞ APP NGÂN HÀNG ĐỂ QUÉT" 
                        : "SCAN QR VIA BANKING OR MOBILE WALLETS"}
                    </span>
                    
                    {/* Simulated SVG QR code with canvas visual */}
                    <div className="p-3 bg-white border rounded-xl shadow-xs relative">
                      <svg width="150" height="150" viewBox="0 0 100 100" className="text-slate-900 border-emerald-500">
                        <rect x="0" y="0" width="22" height="22" fill="currentColor" />
                        <rect x="2" y="2" width="18" height="18" fill="#fff" />
                        <rect x="5" y="5" width="12" height="12" fill="currentColor" />
                        
                        <rect x="78" y="0" width="22" height="22" fill="currentColor" />
                        <rect x="80" y="2" width="18" height="18" fill="#fff" />
                        <rect x="83" y="5" width="12" height="12" fill="currentColor" />
                        
                        <rect x="0" y="78" width="22" height="22" fill="currentColor" />
                        <rect x="2" y="80" width="18" height="18" fill="#fff" />
                        <rect x="5" y="83" width="12" height="12" fill="currentColor" />
                        
                        <rect x="35" y="5" width="8" height="8" fill="currentColor" />
                        <rect x="55" y="10" width="14" height="6" fill="currentColor" />
                        <rect x="42" y="25" width="16" height="16" fill="currentColor" />
                        <rect x="10" y="40" width="12" height="15" fill="currentColor" />
                        <rect x="25" y="55" width="22" height="12" fill="currentColor" />
                        <rect x="75" y="32" width="14" height="24" fill="currentColor" />
                        <rect x="52" y="65" width="30" height="15" fill="currentColor" />
                        <rect x="15" y="60" width="8" height="12" fill="currentColor" />
                        <rect x="80" y="65" width="12" height="10" fill="currentColor" />
                        <rect x="32" y="80" width="24" height="18" fill="currentColor" />
                        <rect x="42" y="42" width="16" height="16" rx="3" fill="#059669" />
                        <path d="M 46 50 H 54 M 50 46 V 54" stroke="#fff" strokeWidth="2.5" />
                      </svg>
                      <div className="absolute inset-x-0 h-0.5 bg-emerald-500 animate-pulse top-5" />
                    </div>

                    <div className="text-center space-y-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {lang === "vi" ? "Người thụ hưởng: Nhà thuốc Phòng khám An Khang" : "Beneficiary: An Khang Hospital Pharmacy"}
                      </p>
                      <p className="text-xs font-mono font-medium text-slate-400">
                        {lang === "vi" ? "Nội dung chuyển khoản:" : "Memo content:"} <span className="font-extrabold text-emerald-600 select-all font-mono">AKP PAY {payingPrescription.id.toUpperCase()}</span>
                      </p>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-normal text-center max-w-xs flex items-center justify-center gap-1.5 pt-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-505 shrink-0" />
                      <span>{lang === "vi" ? "Hệ thống tự động phát hiện giao dịch khi khách chuyển thành công" : "Automatic recognition engine, securely encrypted 256-bit"}</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 border p-3 border-slate-150 dark:border-slate-850 rounded-2xl bg-slate-50 dark:bg-slate-950 animate-fadeIn text-slate-700 text-left">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">{lang === "vi" ? "Nhập thông tin thẻ quốc tế" : "Enter Credit Card Credentials"}</span>
                    
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400">{lang === "vi" ? "Số thẻ tín dụng" : "Card Number"}</label>
                      <div className="relative mt-1">
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => {
                            const formatted = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                            setCardNumber(formatted);
                          }}
                          placeholder="4123 4567 8901 2345"
                          className={`w-full border rounded-lg pl-8 pr-2.5 py-1.5 text-xs outline-none ${
                            theme === "dark" ? "bg-slate-900 border-slate-800 text-white animate-pulse" : "bg-white border-slate-200 text-slate-800"
                          }`}
                        />
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <CreditCard className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400">{lang === "vi" ? "Ngày hết hạn (MM/YY)" : "Expiry Date"}</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (val.length === 2 && !val.includes("/")) {
                              val = val + "/";
                            }
                            setCardExpiry(val);
                          }}
                          placeholder="MM/YY"
                          className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none text-center ${
                            theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400">{lang === "vi" ? "Mã CVV bảo mật" : "CVV Back code"}</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ""))}
                          placeholder="***"
                          className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none text-center ${
                            theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400">{lang === "vi" ? "Tên ghi trên thẻ (Chữ in không dấu)" : "Cardholder Name"}</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="NGUYEN VAN AN"
                        className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                          theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Simulated Loading trigger button spinner */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentStep(1);
                      setPaymentError("");
                    }}
                    className="text-xs px-3 py-2 text-slate-450 hover:text-slate-500 dark:hover:text-slate-300 cursor-pointer font-semibold"
                  >
                    {lang === "vi" ? "Quay lại kiểm tra" : "Back / Review"}
                  </button>

                  <button
                    type="button"
                    disabled={isSimulatingPayment}
                    onClick={handleConfirmPayment}
                    className={`bg-emerald-600 hover:bg-emerald-700 min-w-[150px] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSimulatingPayment ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSimulatingPayment ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{lang === "vi" ? "Đang kết nối..." : "Securing..."}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>{lang === "vi" ? "Xác nhận Thanh toán" : "Confirm & Pay Now"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS BILL RECEIPT */}
            {paymentStep === 3 && (
              <div className="space-y-4 text-center py-2 animate-fadeIn" id="payment-receipt-print-area">
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-650 dark:text-emerald-400 border-4 border-emerald-50 dark:border-emerald-900/40">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {lang === "vi" ? "Thanh Toán Thành Công!" : "Payment Successful!"}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {lang === "vi" ? "Hệ thống An Khang đã ghi nhận thanh toán hoàn tất." : "Your transaction has been securely processed & saved."}
                  </p>
                </div>

                {/* Complete printable Invoice receipt box */}
                <div className={`p-4 rounded-xl text-left border relative text-xs text-slate-600 font-mono space-y-3 ${
                  theme === "dark" ? "bg-slate-950/70 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-150"
                }`}>
                  <div className="absolute top-0 right-0 p-1 bg-emerald-500 text-white text-[8px] font-sans font-extrabold uppercase rounded-tr-xl rounded-bl-sm">
                    {lang === "vi" ? "ĐÃ THU TIỀN" : "PAID"}
                  </div>
                  
                  <div className="text-center font-sans tracking-wide pb-1.5 border-b border-dashed border-slate-205 dark:border-slate-800 font-bold uppercase text-[10px] text-slate-400">
                    {lang === "vi" ? "BIÊN LAI HÓA ĐƠN ĐIỆN TỬ" : "E-INVOICE RECEIPT"}
                  </div>

                  <div className="space-y-1 font-mono text-[10px]">
                    <div className="flex justify-between">
                      <span>{lang === "vi" ? "Mã giao dịch:" : "Txn Reference:"}</span>
                      <span className="font-bold text-slate-805 dark:text-slate-200 font-mono">{payingPrescription.transactionId || `TXN${Date.now().toString().slice(-8).toUpperCase()}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === "vi" ? "Họ tên người bệnh:" : "Patient Name:"}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{record.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === "vi" ? "Bác sĩ điều trị:" : "Attending MD:"}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-350">{getDoctorName(payingPrescription.doctorName)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === "vi" ? "Đơn thuốc số:" : "Prescription ID:"}</span>
                      <span>{payingPrescription.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === "vi" ? "Ngày đóng phí:" : "Timestamp Date:"}</span>
                      <span>{payingPrescription.paymentDate || new Date().toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-1.5 text-[10px]">
                    <div className="text-[9px] font-bold text-slate-400 block mb-1">{lang === "vi" ? "TOA THUỐC CẤP PHÁT" : "DISPENSED MEDICINES"}</div>
                    {payingPrescription.drugs.map((drug, di) => (
                      <div key={di} className="flex justify-between text-slate-500 font-mono">
                        <span className="truncate max-w-[180px]">{di + 1}. {getTranslatedDrugName(drug.name)}</span>
                        <span>x{getTranslatedQty(drug.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-1.5 font-sans leading-tight">
                    <div className="flex justify-between text-slate-700 dark:text-slate-350">
                      <span className="text-[10px] font-bold">{lang === "vi" ? "Hình thức nhận dược phẩm:" : "Medicine Fulfillment:"}</span>
                      <span className="text-[10px] font-bold">
                        {deliveryMethod === "counter" 
                          ? (lang === "vi" ? "Nhận tại quầy nhà thuốc" : "Counter pickup")
                          : (lang === "vi" ? "Vận chuyển tận nhà" : "Home delivery")}
                      </span>
                    </div>
                    
                    {deliveryMethod === "delivery" && (
                      <div className="mt-1 text-[9px] text-slate-500 font-mono leading-relaxed pl-2 border-l border-emerald-500/50">
                        <p>{lang === "vi" ? "Giao gấp trong 2H đến địa chỉ:" : "Shipment delivery coordinates:"}</p>
                        <p className="font-bold text-slate-700 dark:text-slate-300">{shippingAddress}</p>
                        <p className="font-bold text-slate-700 dark:text-slate-300">{lang === "vi" ? "SĐT người nhận:" : "Recipient Tel:"} {shippingPhone}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-250 dark:border-slate-800 pt-2 flex justify-between font-sans text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{lang === "vi" ? "TỔNG THANH TOÁN:" : "PAID TOTAL AMOUNT:"}</span>
                    <span className="font-black text-emerald-650 dark:text-emerald-400 font-mono text-sm">
                      {((payingPrescription.price || 345000) + (deliveryMethod === "delivery" ? 30000 : 0)).toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                    }}
                    className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      theme === "dark" 
                        ? "bg-slate-850 border-slate-755 hover:bg-slate-750 text-slate-300"
                        : "bg-slate-50 border-slate-205 hover:bg-slate-100 text-slate-650"
                    }`}
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{lang === "vi" ? "In hóa đơn / Tải" : "Print Invoice / Download"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPayingPrescription(null); // Close Modal
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-1.5 rounded-lg text-center cursor-pointer"
                  >
                    {lang === "vi" ? "Hoàn tất & Đóng" : "Finish & Close"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
