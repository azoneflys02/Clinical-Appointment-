import React, { useState, useEffect } from "react";
import { Calendar, Bot, Clipboard, Phone, ShieldCheck, MapPin, Award, Stethoscope, HeartHandshake, Sun, Moon, Languages, AlertTriangle } from "lucide-react";
import OnlineConsultation from "./components/OnlineConsultation";
import AppointmentBooking from "./components/AppointmentBooking";
import MedicalRecords from "./components/MedicalRecords";
import { Language, translations } from "./translations";

type Tab = "booking" | "consult" | "records";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("booking");

  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("ankhang_language");
    return (saved === "vi" || saved === "en") ? saved : "vi";
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("ankhang_theme");
    return (saved === "light" || saved === "dark") ? saved : "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("ankhang_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("ankhang_language", lang);
  }, [lang]);

  const t = (key: keyof typeof translations["vi"]) => {
    return translations[lang]?.[key] || translations["vi"][key];
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === "vi" ? "en" : "vi"));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`} id="app-root">
      {/* Top Professional Header Bar */}
      <nav className={`border-b sticky top-0 z-50 transition-colors duration-305 ${theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200 shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-1.5 leading-tight text-slate-900 dark:text-white">
                  {t("clinicName")}
                  <span className="hidden sm:inline bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded border border-emerald-200 font-semibold font-mono dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400">
                    {t("aiClinic")}
                  </span>
                </h1>
                <p className={`text-[10px] font-medium ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{t("slogan")}</p>
              </div>
            </div>

            {/* Quick Contact Desk & Controls */}
            <div className="flex items-center space-x-3">
              <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-500">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="dark:text-slate-400">{t("address")}</span>
              </div>

              {/* Language Switch Button */}
              <button
                onClick={toggleLanguage}
                title={lang === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
                className={`p-2.5 rounded-xl border flex items-center space-x-1.5 text-xs font-semibold cursor-pointer transition-all ${
                  theme === "dark" 
                    ? "bg-slate-800 border-slate-705 hover:bg-slate-700 text-slate-350" 
                    : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-750"
                }`}
              >
                <Languages className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{lang === "vi" ? "EN" : "VI"}</span>
              </button>

              {/* Theme Switch Button */}
              <button
                onClick={toggleTheme}
                title={theme === "light" ? t("themeDark") : t("themeLight")}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-705 text-amber-400 hover:bg-slate-700"
                    : "bg-slate-100 border-slate-200 text-slate-755 hover:bg-slate-200"
                }`}
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4 text-slate-750" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
              </button>

              <a
                href="tel:19008198"
                className="flex items-center bg-rose-50 text-rose-700 hover:bg-rose-100/80 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-rose-100 transition-colors shrink-0 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900"
              >
                <Phone className="w-4 h-4 mr-1.5 animate-bounce shrink-0" />
                <span className="hidden sm:inline">{t("emergencyLabel")}: 1900 8198</span>
                <span className="sm:hidden">1900 8198</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Welcome Banner */}
      <header className={`border-b py-6 sm:py-8 shadow-sm transition-colors duration-300 ${theme === "dark" ? "bg-slate-900/40 border-slate-900" : "bg-white border-slate-200/60"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme === "dark" ? "text-slate-100" : "text-slate-950"}`}>
                {t("healthPortalTitle")}
              </h2>
              <p className={`text-sm mt-2 max-w-2xl leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                {t("healthPortalDesc")}
              </p>
            </div>

            {/* Micro badges summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
              <div className={`p-3 rounded-xl border flex items-center space-x-2 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 dark:text-emerald-400" />
                <div className="text-[11px] leading-tight font-medium">
                  <strong className={theme === "dark" ? "text-slate-200" : "text-slate-700"}>{t("safe")}</strong>
                  <span className="block text-[10px] text-slate-400 font-normal">{t("safeDesc")}</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl border flex items-center space-x-2 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <Award className="w-4.5 h-4.5 text-purple-600 shrink-0 dark:text-purple-400" />
                <div className="text-[11px] leading-tight font-medium">
                  <strong className={theme === "dark" ? "text-slate-200" : "text-slate-700"}>{t("reputable")}</strong>
                  <span className="block text-[10px] text-slate-400 font-normal">{t("reputableDesc")}</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl border col-span-2 sm:col-span-1 flex items-center space-x-2 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <HeartHandshake className="w-4.5 h-4.5 text-red-500 shrink-0 dark:text-red-400" />
                <div className="text-[11px] leading-tight font-medium">
                  <strong className={theme === "dark" ? "text-slate-200" : "text-slate-700"}>{t("dedicated")}</strong>
                  <span className="block text-[10px] text-slate-400 font-normal">{t("dedicatedDesc")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Tab Controls & Viewport Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Tabs bar */}
        <div className={`flex p-1.5 rounded-2xl max-w-xl mx-auto sm:mx-0 shadow-sm border transition-colors ${
          theme === "dark" 
            ? "bg-slate-900 border-slate-800" 
            : "bg-slate-200/70 border-slate-300/40"
        }`}>
          <button
            onClick={() => setActiveTab("booking")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "booking"
                ? (theme === "dark" ? "bg-slate-800 text-emerald-400 shadow-sm" : "bg-white text-emerald-800 shadow-sm")
                : (theme === "dark" ? "text-slate-400 hover:bg-slate-800/45 hover:text-white" : "text-slate-600 hover:bg-white/50 hover:text-slate-900")
            }`}
          >
            <Calendar className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t("tabBooking")}</span>
          </button>

          <button
            onClick={() => setActiveTab("consult")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "consult"
                ? (theme === "dark" ? "bg-slate-800 text-emerald-400 shadow-sm" : "bg-white text-emerald-800 shadow-sm")
                : (theme === "dark" ? "text-slate-400 hover:bg-slate-800/45 hover:text-white" : "text-slate-600 hover:bg-white/50 hover:text-slate-900")
            }`}
          >
            <Bot className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>{t("tabConsult")}</span>
          </button>

          <button
            onClick={() => setActiveTab("records")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "records"
                ? (theme === "dark" ? "bg-slate-800 text-emerald-400 shadow-sm" : "bg-white text-emerald-800 shadow-sm")
                : (theme === "dark" ? "text-slate-400 hover:bg-slate-800/45 hover:text-white" : "text-slate-600 hover:bg-white/50 hover:text-slate-900")
            }`}
          >
            <Clipboard className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t("tabRecords")}</span>
          </button>
        </div>

        {/* View Segment Switcher */}
        <div className="py-2 transition-all">
          {activeTab === "booking" && <AppointmentBooking lang={lang} theme={theme} />}
          {activeTab === "consult" && <OnlineConsultation lang={lang} theme={theme} />}
          {activeTab === "records" && <MedicalRecords lang={lang} theme={theme} />}
        </div>
      </main>

      {/* Trust reassurance footer */}
      <footer className={`border-t py-10 transition-colors duration-300 ${theme === "dark" ? "bg-slate-900/60 text-slate-400 border-slate-800" : "bg-slate-900 text-slate-400 border-slate-800"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-6 gap-4 border-slate-800">
            <div className="flex items-center justify-center sm:justify-start space-x-3 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Stethoscope className="w-4.5 h-4.5" />
              </div>
              <span className="font-bold sm:text-md text-white">{t("clinicName")}</span>
            </div>
            <p className="text-xs">{t("footerProfessionalCharge")}</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs gap-4">
            <p>{t("footerLicence")}</p>
            <div className="flex items-center justify-center space-x-4">
              <span className="hover:text-white transition-colors cursor-pointer">{t("footerPrivacy")}</span>
              <span>•</span>
              <span className="hover:text-white transition-colors cursor-pointer">{t("footerFirstAid")}</span>
            </div>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-600/90 dark:text-amber-400/80 flex items-start gap-3 leading-relaxed mt-4">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
            <div className="space-y-1 text-left">
              <p className="font-bold uppercase tracking-wider text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1.5 font-mono">
                <span>{lang === "vi" ? "CẢNH BÁO PHÁP LÝ QUAN TRỌNG" : "IMPORTANT LEGAL DISCLAIMER"}</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                {t("medicalDisclaimerWarning")}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
