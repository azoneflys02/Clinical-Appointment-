import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { TrendingUp, Plus, Trash2, Heart, Activity } from "lucide-react";
import { VitalReading } from "../types";
import { Language } from "../translations";

// Quick local translations for compact layout
const chartTranslations = {
  vi: {
    title: "Xu Hướng Chỉ Số Sinh Tồn",
    sub: "Theo dõi biến động huyết áp và nhịp tim theo thời gian",
    toggleBP: "Huyết áp (systolic/diastolic)",
    toggleHR: "Nhịp tim (bpm)",
    toggleBoth: "Xem cả hai",
    addLogTitle: "Ghi nhận chỉ số mới",
    date: "Ngày đo",
    systolic: "Huyết áp tâm thu (Systolic)",
    diastolic: "Huyết áp tâm trương (Diastolic)",
    heartRate: "Mạch tim (nhịp/phút)",
    weight: "Cân nặng (kg - không bắt buộc)",
    btnSubmit: "Lưu chỉ số",
    btnCancel: "Hủy",
    logHistory: "Lịch sử đo đạc y tế",
    noLogs: "Chưa có chỉ số sinh tồn nào được ghi nhận.",
    colDate: "Ngày",
    colBP: "Huyết áp",
    colHR: "Nhịp tim",
    colWeight: "Cân nặng",
    colAction: "Thao tác",
    bpLabel: "Huyết áp (mmHg)",
    hrLabel: "Nhịp tim (BPM)",
    systolicLabel: "Tâm thu (Systolic)",
    diastolicLabel: "Tâm trương (Diastolic)",
    heartRateLegend: "Nhịp tim (Heart Rate)",
    valDate: "Vui lòng chọn ngày.",
    valBP: "Vui lòng nhập chỉ số huyết áp hợp lệ.",
    valHR: "Vui lòng nhập nhịp tim hợp lệ."
  },
  en: {
    title: "Vitals Trend Charts",
    sub: "Track changes in your blood pressure and heart rate over time",
    toggleBP: "Blood Pressure (systolic/diastolic)",
    toggleHR: "Heart Rate (bpm)",
    toggleBoth: "Combined View",
    addLogTitle: "Log New Vitals",
    date: "Date of Measurement",
    systolic: "Systolic BP (mmHg)",
    diastolic: "Diastolic BP (mmHg)",
    heartRate: "Heart Rate (BPM)",
    weight: "Weight (kg - optional)",
    btnSubmit: "Log Vitals",
    btnCancel: "Cancel",
    logHistory: "Measurement Log History",
    noLogs: "No vitals entries found on this health record database.",
    colDate: "Date",
    colBP: "Blood Pressure",
    colHR: "Heart Rate",
    colWeight: "Weight",
    colAction: "Actions",
    bpLabel: "Blood Pressure (mmHg)",
    hrLabel: "Heart Rate (BPM)",
    systolicLabel: "Systolic",
    diastolicLabel: "Diastolic",
    heartRateLegend: "Heart Rate (BPM)",
    valDate: "Please select a valid measurement date.",
    valBP: "Please input valid blood pressure values.",
    valHR: "Please input a valid heart rate."
  }
};

interface VitalsTrendChartProps {
  vitalsHistory: VitalReading[];
  onAddVital: (newVital: VitalReading) => void;
  onDeleteVital: (id: string) => void;
  lang?: Language;
  theme?: "light" | "dark";
}

export default function VitalsTrendChart({
  vitalsHistory,
  onAddVital,
  onDeleteVital,
  lang = "vi",
  theme = "light"
}: VitalsTrendChartProps) {
  const trans = chartTranslations[lang] || chartTranslations["vi"];

  const [viewType, setViewType] = useState<"bp" | "hr" | "both">("both");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [sysInput, setSysInput] = useState<number>(120);
  const [diaInput, setDiaInput] = useState<number>(80);
  const [hrInput, setHrInput] = useState<number>(72);
  const [weightInput, setWeightInput] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formDate) {
      alert(trans.valDate);
      return;
    }

    if (sysInput <= 0 || diaInput <= 0) {
      alert(trans.valBP);
      return;
    }

    if (hrInput <= 0) {
      alert(trans.valHR);
      return;
    }

    const newReading: VitalReading = {
      id: `vital-${Date.now()}`,
      date: formDate,
      systolic: Number(sysInput),
      diastolic: Number(diaInput),
      heartRate: Number(hrInput),
      weight: weightInput ? Number(weightInput) : undefined
    };

    onAddVital(newReading);
    setShowAddForm(false);
    
    // Reset defaults
    setWeightInput("");
  };

  // Sort history chronologically for the chart
  const sortedHistory = [...vitalsHistory].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm transition-colors duration-300 ${
        theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
      }`}
      id="vitals-trend-chart-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h4 className={`font-semibold text-base ${theme === "dark" ? "text-slate-100" : "text-slate-850"}`}>
              {trans.title}
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-1">{trans.sub}</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{trans.addLogTitle}</span>
        </button>
      </div>

      {/* Add New Vital Log Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className={`mb-6 p-4 border rounded-xl space-y-4 transition-all duration-200 ${
            theme === "dark" ? "bg-slate-950 border-slate-800 text-slate-250" : "bg-slate-50 border-slate-200 text-slate-700"
          }`}
        >
          <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">{trans.addLogTitle}</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400">{trans.date}</label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                  theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
                }`}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400">{trans.weight}</label>
              <input
                type="number"
                placeholder="e.g. 68"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                  theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400">{trans.systolic} (mmHg)</label>
              <input
                type="number"
                required
                min={50}
                max={250}
                value={sysInput}
                onChange={(e) => setSysInput(Number(e.target.value))}
                className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                  theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
                }`}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400">{trans.diastolic} (mmHg)</label>
              <input
                type="number"
                required
                min={30}
                max={180}
                value={diaInput}
                onChange={(e) => setDiaInput(Number(e.target.value))}
                className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                  theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
                }`}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400">{trans.heartRate}</label>
              <input
                type="number"
                required
                min={30}
                max={220}
                value={hrInput}
                onChange={(e) => setHrInput(Number(e.target.value))}
                className={`w-full mt-1 border rounded-lg px-2.5 py-1.5 text-xs outline-none ${
                  theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs px-3 py-1.5 text-slate-400 hover:text-slate-500 dark:hover:text-slate-350 cursor-pointer"
            >
              {trans.btnCancel}
            </button>
            <button
              type="submit"
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-center cursor-pointer font-semibold"
            >
              {trans.btnSubmit}
            </button>
          </div>
        </form>
      )}

      {/* Segments Selection Row */}
      <div className="flex justify-center mb-6">
        <div className={`inline-flex p-1 rounded-xl border ${theme === "dark" ? "bg-slate-950 border-slate-850" : "bg-slate-100 border-slate-200"}`}>
          <button
            onClick={() => setViewType("both")}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer transition-all ${
              viewType === "both"
                ? (theme === "dark" ? "bg-slate-800 text-emerald-400 border border-slate-705" : "bg-white text-emerald-850 shadow-sm")
                : "text-slate-500 hover:text-slate-805 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
          >
            {trans.toggleBoth}
          </button>
          <button
            onClick={() => setViewType("bp")}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer transition-all ${
              viewType === "bp"
                ? (theme === "dark" ? "bg-slate-800 text-emerald-400 border border-slate-705" : "bg-white text-emerald-850 shadow-sm")
                : "text-slate-500 hover:text-slate-805 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
          >
            {trans.toggleBP}
          </button>
          <button
            onClick={() => setViewType("hr")}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer transition-all ${
              viewType === "hr"
                ? (theme === "dark" ? "bg-slate-800 text-emerald-400 border border-slate-705" : "bg-white text-emerald-850 shadow-sm")
                : "text-slate-500 hover:text-slate-805 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
          >
            {trans.toggleHR}
          </button>
        </div>
      </div>

      {/* Main Chart Canvas Container */}
      <div className="h-64 sm:h-72 md:h-80 w-full" id="vitals-chart-stage">
        {sortedHistory.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-slate-400 border-2 border-dashed border-slate-150 rounded-xl dark:border-slate-850">
            <Activity className="w-10 h-10 text-slate-300 dark:text-slate-700 animate-pulse mb-3" />
            <p className="text-xs font-semibold">{trans.noLogs}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sortedHistory}
              margin={{ top: 12, right: 12, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#1e293b" : "#f1f5f9"}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: theme === "dark" ? "#94a3b8" : "#64748b", fontSize: 10, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: theme === "dark" ? "#94a3b8" : "#64748b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
                  borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                  borderRadius: "12px",
                  color: theme === "dark" ? "#f1f5f9" : "#1e293b",
                  fontSize: "11px",
                  fontFamily: "Inter, sans-serif"
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingTop: "15px" }}
              />

              {/* Systolic BP Line */}
              {(viewType === "bp" || viewType === "both") && (
                <Line
                  name={trans.systolicLabel}
                  type="monotone"
                  dataKey="systolic"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 4, stroke: "#ef4444", strokeWidth: 1.5, fill: "#fff" }}
                  activeDot={{ r: 6 }}
                />
              )}

              {/* Diastolic BP Line */}
              {(viewType === "bp" || viewType === "both") && (
                <Line
                  name={trans.diastolicLabel}
                  type="monotone"
                  dataKey="diastolic"
                  stroke="#fb923c"
                  strokeWidth={2}
                  dot={{ r: 4, stroke: "#fb923c", strokeWidth: 1.5, fill: "#fff" }}
                  activeDot={{ r: 5 }}
                />
              )}

              {/* Heart Rate Line */}
              {(viewType === "hr" || viewType === "both") && (
                <Line
                  name={trans.heartRateLegend}
                  type="monotone"
                  dataKey="heartRate"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, stroke: "#10b981", strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Historical Ledger Table */}
      <div className="mt-8">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 mb-3">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>{trans.logHistory}</span>
        </h5>
        
        {vitalsHistory.length === 0 ? (
          <p className="text-xs text-slate-400 italic">{trans.noLogs}</p>
        ) : (
          <div className="overflow-x-auto border border-dashed rounded-xl border-slate-150 dark:border-slate-800">
            <table className="min-w-full text-left text-xs">
              <thead className={`${theme === "dark" ? "bg-slate-950/70" : "bg-slate-50"} text-slate-500 font-semibold font-sans`}>
                <tr>
                  <th className="p-3">{trans.colDate}</th>
                  <th className="p-3">{trans.colBP}</th>
                  <th className="p-3">{trans.colHR}</th>
                  <th className="p-3">{trans.colWeight}</th>
                  <th className="p-3 text-right">{trans.colAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {vitalsHistory.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="p-3 font-mono font-medium">{log.date}</td>
                    <td className="p-3">
                      <span className="font-semibold text-rose-600 dark:text-rose-400">{log.systolic}</span>
                      <span className="text-slate-400 mx-0.5">/</span>
                      <span className="font-semibold text-orange-500 dark:text-orange-400">{log.diastolic}</span>
                      <span className="text-[10px] text-slate-400 ml-1">mmHg</span>
                    </td>
                    <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                      {log.heartRate} <span className="text-[10px] text-slate-400 font-normal">bpm</span>
                    </td>
                    <td className="p-3 text-slate-500 dark:text-slate-400 font-medium">
                      {log.weight ? `${log.weight} kg` : "—"}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeleteVital(log.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                        title={lang === "vi" ? "Xóa ghi ghép tủ" : "Delete entry"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
