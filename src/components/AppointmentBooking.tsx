import React, { useState, useEffect } from "react";
import { Calendar, User, Phone, Clipboard, FileText, CheckCircle2, AlertCircle, XCircle, Clock, Heart } from "lucide-react";
import { Doctor, Appointment } from "../types";
import { Language, translations } from "../translations";

interface AppointmentBookingProps {
  lang?: Language;
  theme?: "light" | "dark";
}

const FALLBACK_DOCTORS: Doctor[] = [
  { id: "dr-minh", name: "BS. CKI Nguyễn Tuấn Minh", specialty: "Nội tổng quát", desc: "15 năm kinh nghiệm điều trị tim mạch và huyết áp.", availability: "Thứ 2 - Thứ 7" },
  { id: "dr-huong", name: "ThS. BS Trần Thị Mai Hương", specialty: "Nhi khoa", desc: "Chuyên gia tâm lý và sức khỏe trẻ em, cựu bác sĩ BV Nhi Đồng.", availability: "Thứ 2 - Thứ 6" },
  { id: "dr-hoang", name: "BS. CKI Lê Hoàng Nam", specialty: "Chấn thương chỉnh hình", desc: "Chuyên chữa các bệnh cơ xương khớp, phục hồi chức năng thể thao.", availability: "Thứ Ba, Năm, Bảy" },
  { id: "dr-thao", name: "ThS. BS Phạm Phương Thảo", specialty: "Da liễu - Thẩm mỹ", desc: "Thầy thuốc ưu tú chuyên trị liệu mụn trứng cá và trẻ hóa làn da.", availability: "Hàng ngày" },
  { id: "dr-quoc", name: "BS. CKII Huỳnh Anh Quốc", specialty: "Tai Mũi Họng", desc: "Điều trị viêm xoang, amidan, amidal công nghệ plasma.", availability: "Thứ 2 - Thứ 6" }
];

const SPECIALTIES = [
  "Nội tổng quát",
  "Nhi khoa",
  "Chấn thương chỉnh hình",
  "Da liễu - Thẩm mỹ",
  "Tai Mũi Họng"
];

const TIME_SLOTS = [
  "07:30 - 08:30",
  "08:30 - 09:30",
  "09:30 - 10:30",
  "10:30 - 11:30",
  "13:30 - 14:30",
  "14:30 - 15:30",
  "15:30 - 16:30"
];

const COMMON_SYMPTOMS: Record<string, string[]> = {
  "Nội tổng quát": [
    "Đau đầu, chóng mặt, mất ngủ kéo dài",
    "Đau tức cổ họng, nuốt đau, tức ngực khó thở",
    "Đau nóng rát thượng vị dạ dày, đầy hơi, ợ chua",
    "Mệt mỏi suy nhược cơ thể, sút cân không rõ lý do",
    "Khám và kiểm tra sức khỏe tổng quát định kỳ"
  ],
  "Nhi khoa": [
    "Bé bị sốt cao, ho sặc sụa, khò khè, chảy mũi",
    "Bé biếng ăn, chậm tăng cân, quấy khóc nhiều về đêm",
    "Trẻ bị tiêu chảy, nôn trớ sau khi ăn sữa hoặc bột",
    "Phát ban da toàn thân, dị ứng nổi mề đay ở trẻ nhỏ",
    "Tư vấn dinh dưỡng, chiều cao cân nặng của bé"
  ],
  "Chấn thương chỉnh hình": [
    "Đau nhức mỏi thắt lưng cột sống, tê rần vai gáy",
    "Sưng phù đau nhức sụn khớp gối khi cử động đi lại",
    "Chấn thương phần mềm bong gân trật khớp do chơi thể thao",
    "Tê bì các đầu ngón tay chân, nhức mỏi bắp cơ",
    "Tư vấn liệu trình phục hồi sau gãy xương cơ"
  ],
  "Da liễu - Thẩm mỹ": [
    "Mụn bọc sưng viêm nặng trên mặt và cơ thể",
    "Viêm da dị ứng rát đỏ, ngứa ngáy nổi mụn nước",
    "Rụng tóc nhiều bất thường, rát ngứa nấm da đầu",
    "Tư vấn thanh lọc thải chì da mặt, tàn nhang sạm nám",
    "Khám bệnh lý nốt ruồi lạ, dày sừng lớp thượng bì"
  ],
  "Tai Mũi Họng": [
    "Viêm họng amidan cấp tính, giọng khàn khản khó thở",
    "Sổ mũi dịch màu xanh đục, đau ê đầu trán do xoang",
    "Ù đau điếc nhẹ và chảy mủ khoang tai trong",
    "Cảm giác nghẹt cổ họng, có đờm rát vùng vòm họng",
    "Khám tầm soát dị vật vùng hầu họng tai mũi"
  ]
};

const COMMON_SYMPTOMS_EN: Record<string, string[]> = {
  "Nội tổng quát": [
    "Headache, dizziness, prolonged insomnia",
    "Sore throat, painful swallowing, chest pressure",
    "Belly burn, upper gastric bloating, acid reflux",
    "General body weight loss, fatigue without clear cause",
    "Scheduled general health checks & biometric screenings"
  ],
  "Nhi khoa": [
    "High temperature fever, severe dry cough, wheezing, runny nose",
    "Low appetite, slow growth charts, baby crying at night",
    "Infant loose bowel movements, spitting up after feeding",
    "Symptomatic rash over body, allergic skincare bumps",
    "Nutrition consults, infant height & weight progress mapping"
  ],
  "Chấn thương chỉnh hình": [
    "Lower spine ache, neck pressure & local numbness",
    "Knee fluid swelling, severe click-joint pain during walks",
    "Sprains, wrist sports injuries, cartilage strains",
    "Fingertips sensory numbness, muscle soreness",
    "Consult on rehabilitation after orthopedic fractures"
  ],
  "Da liễu - Thẩm mỹ": [
    "Severe chest or face cysts & swelling acne",
    "Contact allergy, skin redness, itchy micro-vesicles",
    "Intense hair thinning, dandruff scaling & itchy scalp",
    "Melasma consults, skin hyperpigmentation, skin detox",
    "Diagnostic evaluation of irregular moles, hyperkeratosis"
  ],
  "Tai Mũi Họng": [
    "Acute laryngitis, raspy throat, vocal hoarseness",
    "Thick greenish nasal discharge, intense sinus headache",
    "Ache or fullness inside ears, internal fluid secretion",
    "Sensation of phlegm blockage in throat or gullet",
    "Screening for accidental airway or ear canal foreign bodies"
  ]
};

export default function AppointmentBooking({ lang = "vi", theme = "light" }: AppointmentBookingProps) {
  const [doctors, setDoctors] = useState<Doctor[]>(FALLBACK_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem("ankhang_appointments");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: "apt-mock-1",
        patientName: "Nguyễn Văn An",
        patientPhone: "0905123456",
        patientAge: 35,
        specialty: "Nội tổng quát",
        doctorId: "dr-minh",
        doctorName: "BS. CKI Nguyễn Tuấn Minh",
        date: new Date().toISOString().split('T')[0],
        timeSlot: "08:30 - 09:30",
        symptoms: "Kiểm tra định kỳ và xét nghiệm huyết áp",
        status: "Đã xác nhận",
        createdAt: new Date(Date.now() - 86400000).toLocaleString("vi-VN")
      }
    ];
  });

  // Booking Form State
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState<number | "">("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(SPECIALTIES[0]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState(TIME_SLOTS[0]);
  const [symptoms, setSymptoms] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const t = (key: keyof typeof translations["vi"]) => {
    return translations[lang]?.[key] || translations["vi"][key];
  };

  const getSpecialtyName = (spec: string) => {
    switch (spec) {
      case "Nội tổng quát": return t("specialtyGeneral");
      case "Nhi khoa": return t("specialtyPed");
      case "Chấn thương chỉnh hình": return t("specialtyOrtho");
      case "Da liễu - Thẩm mỹ": return t("specialtyDerm");
      case "Tai Mũi Họng": return t("specialtyEnt");
      default: return spec;
    }
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

  // Load live doctors from API
  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        setDoctors(data);
        const match = data.find((d: Doctor) => d.specialty === selectedSpecialty);
        if (match) setSelectedDoctorId(match.id);
      })
      .catch(() => {
        const match = FALLBACK_DOCTORS.find((d) => d.specialty === selectedSpecialty);
        if (match) setSelectedDoctorId(match.id);
      });
  }, []);

  // Update selected doctor when specialty changes
  useEffect(() => {
    const match = doctors.find((d) => d.specialty === selectedSpecialty);
    if (match) {
      setSelectedDoctorId(match.id);
    } else {
      setSelectedDoctorId("");
    }
  }, [selectedSpecialty, doctors]);

  // Save appointments to storage
  useEffect(() => {
    localStorage.setItem("ankhang_appointments", JSON.stringify(appointments));
  }, [appointments]);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMsg(null);

    // Form inputs validation with localized warnings
    if (!patientName.trim()) {
      setValidationError(t("valName"));
      return;
    }
    if (!patientPhone.trim()) {
      setValidationError(t("valPhone"));
      return;
    }
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/g;
    if (!phoneRegex.test(patientPhone.trim()) && patientPhone.length < 10) {
      setValidationError(t("valPhoneInvalid"));
      return;
    }
    if (!patientAge || Number(patientAge) <= 0 || Number(patientAge) > 120) {
      setValidationError(t("valAge"));
      return;
    }
    if (!bookingDate) {
      setValidationError(t("valDate"));
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (bookingDate < todayStr) {
      setValidationError(t("valDatePast"));
      return;
    }

    const selDoc = doctors.find((d) => d.id === selectedDoctorId);
    const docName = selDoc ? selDoc.name : "Thầy thuốc trực chuyên khoa";

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientAge: Number(patientAge),
      specialty: selectedSpecialty,
      doctorId: selectedDoctorId,
      doctorName: docName,
      date: bookingDate,
      timeSlot: bookingTime,
      symptoms: symptoms.trim() || (lang === "vi" ? "Chưa có văn bản ghi chú triệu chứng đặc biệt." : "No specific symptoms described."),
      status: "Chờ xác nhận",
      createdAt: new Date().toLocaleString(lang === "vi" ? "vi-VN" : "en-US")
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setSuccessMsg(
      t("bookingSuccess")
        .replace("{name}", patientName)
        .replace("{phone}", patientPhone)
    );
    
    setSymptoms("");
    setBookingDate("");
  };

  const handleCancelAppointment = (id: string) => {
    if (confirm(t("confirmCancelApt"))) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, status: "Đã hủy" as const } : apt
        )
      );
    }
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "Đã xác nhận":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {t("statusConfirmed")}
          </span>
        );
      case "Chờ xác nhận":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950/45 dark:text-blue-300">
            <Clock className="w-3.5 h-3.5 mr-1 animate-pulse" /> {t("statusPending")}
          </span>
        );
      case "Hoàn thành":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-750 dark:bg-slate-800 dark:text-slate-300">
            {t("statusCompleted")}
          </span>
        );
      case "Đã hủy":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-955/40 dark:text-rose-300">
            <XCircle className="w-3.5 h-3.5 mr-1" /> {t("statusCanceled")}
          </span>
        );
    }
  };

  const currentSymptomsOptions = lang === "vi" 
    ? COMMON_SYMPTOMS[selectedSpecialty] 
    : COMMON_SYMPTOMS_EN[selectedSpecialty];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="appointment-booking-module">
      {/* booking Form */}
      <div className={`rounded-2xl border p-6 shadow-sm transition-colors duration-300 lg:col-span-12 xl:col-span-5 ${
        theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-850"
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-semibold text-base md:text-lg ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
              {t("bookingFormTitle")}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-400">{t("bookingFormDesc")}</p>
          </div>
        </div>

        <form onSubmit={handleBookAppointment} className="space-y-4">
          {/* Patient name */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-slate-300" : "text-slate-705"}`}>
              {t("patientName")} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={t("placeholderName")}
                className={`w-full border focus:border-emerald-500 focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all ${
                  theme === "dark" 
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-850" 
                    : "bg-slate-50/70 border-slate-200 text-slate-800 placeholder-slate-400"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-slate-300" : "text-slate-705"}`}>
                {t("patientPhone")} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder={t("placeholderPhone")}
                  className={`w-full border focus:border-emerald-500 focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all ${
                    theme === "dark" 
                      ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-850" 
                      : "bg-slate-50/70 border-slate-200 text-slate-800 placeholder-slate-400"
                  }`}
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-slate-300" : "text-slate-705"}`}>
                {t("patientAge")} <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="120"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder={t("placeholderAge")}
                className={`w-full border focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${
                  theme === "dark" 
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-850" 
                    : "bg-slate-50/70 border-slate-200 text-slate-800 placeholder-slate-400"
                }`}
              />
            </div>
          </div>

          {/* Specialty */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-slate-300" : "text-slate-705"}`}>{t("specialty")}</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className={`w-full border focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all cursor-pointer ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-slate-50/70 border-slate-200 text-slate-800"
              }`}
            >
              {SPECIALTIES.map((spec) => (
                <option key={spec} value={spec} className="dark:bg-slate-900">{getSpecialtyName(spec)}</option>
              ))}
            </select>
          </div>

          {/* Select Doctor */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-slate-300" : "text-slate-755"}`}>{t("doctor")}</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className={`w-full border focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all cursor-pointer ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-slate-50/70 border-slate-200 text-slate-800"
              }`}
            >
              {doctors
                .filter((d) => d.specialty === selectedSpecialty)
                .map((d) => (
                  <option key={d.id} value={d.id} className="dark:bg-slate-900">
                    {getDoctorName(d.name)} ({d.availability})
                  </option>
                ))}
              {doctors.filter((d) => d.specialty === selectedSpecialty).length === 0 && (
                <option value="" className="dark:bg-slate-900">
                  {t("rotateDoctor").replace("{spec}", getSpecialtyName(selectedSpecialty))}
                </option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Booking Date */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-slate-300" : "text-slate-705"}`}>
                {t("bookingDate")} <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className={`w-full border focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all cursor-pointer ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-white dark:[color-scheme:dark]"
                    : "bg-slate-50/70 border-slate-200 text-slate-800"
                }`}
              />
            </div>

            {/* Time Slot */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-slate-300" : "text-slate-705"}`}>{t("timeSlot")}</label>
              <select
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className={`w-full border focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all cursor-pointer ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-slate-50/70 border-slate-200 text-slate-800"
                }`}
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t} className="dark:bg-slate-900">{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Symptoms Suggestions Dropdown */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-slate-300" : "text-slate-705"}`}>
              {t("quickSymptoms")} ({getSpecialtyName(selectedSpecialty)})
            </label>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  setSymptoms(e.target.value);
                }
              }}
              className={`w-full border rounded-xl px-3 py-2.5 text-xs outline-none transition-all cursor-pointer font-medium ${
                theme === "dark"
                  ? "bg-emerald-950/20 hover:bg-emerald-900/30 border-emerald-900/60 text-emerald-350"
                  : "bg-emerald-50/75 hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-200 text-emerald-800"
              }`}
            >
              <option value="">{t("quickSymptomPlaceholder")}</option>
              {currentSymptomsOptions?.map((sym, idx) => (
                <option key={idx} value={sym} className="dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
                  {sym}
                </option>
              ))}
            </select>
          </div>

          {/* Symptoms Description */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-slate-300" : "text-slate-705"}`}>
              {t("medicalSymptoms")}
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder={t("placeholderSymptoms")}
              className={`w-full border focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-850"
                  : "bg-slate-50/70 border-slate-200 text-slate-800 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Messages */}
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs flex items-center space-x-2 dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 dark:text-rose-450" />
              <span>{validationError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs shadow-sm flex items-start space-x-2 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 dark:text-emerald-450" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-sm py-3 px-4 rounded-xl shadow-sm hover:shadow active:scale-98 transition-all cursor-pointer"
          >
            {t("submitBooking")}
          </button>
        </form>
      </div>

      {/* Appointment History Board */}
      <div className="lg:col-span-12 xl:col-span-7 flex flex-col space-y-4">
        <div className={`rounded-2xl border p-6 shadow-sm flex-1 transition-colors duration-300 ${
          theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-850"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clipboard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h4 className={`font-semibold text-sm md:text-base ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>
                {t("historyBookings")} ({appointments.length})
              </h4>
            </div>
          </div>

          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
            {appointments.length === 0 ? (
              <div className="text-center py-20 text-slate-450 dark:text-slate-550">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">{t("noAptDesc")}</p>
                <p className="text-xs">{t("noAptSub")}</p>
              </div>
            ) : (
              appointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`p-4 rounded-xl border transition-all ${
                    apt.status === "Đã hủy"
                      ? "bg-slate-50/50 border-slate-200 opacity-55 dark:bg-slate-800/20 dark:border-slate-800"
                      : "bg-white border-slate-200 hover:border-emerald-300 dark:bg-slate-950/40 dark:border-slate-850 dark:hover:border-emerald-800 hover:shadow-xs"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2 pb-2 border-b border-sidebar-line border-slate-100/60 dark:border-slate-800/60">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold text-sm ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>{apt.patientName}</span>
                        <span className="text-xs text-slate-400">({apt.patientAge} {lang === "vi" ? "tuổi" : "yo"})</span>
                      </div>
                      <p className="text-xs text-slate-400">{lang === "vi" ? "SĐT" : "Phone"}: {apt.patientPhone}</p>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      {getStatusBadge(apt.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-slate-600 dark:text-slate-350 mb-3">
                    <p className="flex items-center leading-relaxed">
                      <strong className="text-slate-500 dark:text-slate-450 min-w-[75px] shrink-0 font-medium">{lang === "vi" ? "Chuyên khoa" : "Specialty"}:</strong> 
                      <span className="font-semibold">{getSpecialtyName(apt.specialty)}</span>
                    </p>
                    <p className="flex items-center leading-relaxed">
                      <strong className="text-slate-500 dark:text-slate-450 min-w-[75px] shrink-0 font-medium">{lang === "vi" ? "Bác sĩ khám" : "Doctor"}:</strong> 
                      <span className="font-semibold">{getDoctorName(apt.doctorName)}</span>
                    </p>
                    <p className="flex items-center leading-relaxed">
                      <strong className="text-slate-500 dark:text-slate-450 min-w-[75px] shrink-0 font-medium">{lang === "vi" ? "Ngày khám" : "Date"}:</strong> 
                      <span>{apt.date}</span>
                    </p>
                    <p className="flex items-center leading-relaxed">
                      <strong className="text-slate-500 dark:text-slate-450 min-w-[75px] shrink-0 font-medium">{lang === "vi" ? "Giờ hẹn" : "Time"}:</strong> 
                      <span>{apt.timeSlot}</span>
                    </p>
                  </div>

                  <div className={`p-2.5 rounded-lg text-xs mb-3 block border-l-2 ${
                    theme === "dark" 
                      ? "bg-slate-900 border-slate-700 text-slate-300" 
                      : "bg-slate-50 border-slate-300 text-slate-600"
                  }`}>
                    <p className={`font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>
                      {lang === "vi" ? "Lý do/Triệu chứng:" : "Symptom description:"}
                    </p>
                    <p className="italic">{apt.symptoms}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span>{t("bookedAt")} {apt.createdAt}</span>
                    {apt.status === "Chờ xác nhận" && (
                      <button
                        onClick={() => handleCancelAppointment(apt.id)}
                        className="text-rose-500 hover:text-rose-700 underline font-semibold cursor-pointer dark:text-rose-400 dark:hover:text-rose-300 transition-colors"
                      >
                        {t("cancelApt")}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic Doctor Availabilities */}
        <div className={`rounded-2xl border p-4 shrink-0 flex items-center space-x-3 transition-colors ${
          theme === "dark" 
            ? "bg-emerald-950/20 border-emerald-900/60 text-emerald-300" 
            : "bg-emerald-50 border-emerald-100 text-emerald-900"
        }`}>
          <Heart className="w-8 h-8 text-emerald-600 shrink-0 dark:text-emerald-450" />
          <div className="text-xs leading-relaxed">
            <span className="font-semibold block">{t("doctorCommitmentTitle")}</span>
            <span className="dark:text-emerald-400/90">{t("doctorCommitmentDesc")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
