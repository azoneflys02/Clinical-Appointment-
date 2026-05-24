import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, HelpCircle, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage } from "../types";
import { Language, translations } from "../translations";

interface OnlineConsultationProps {
  lang?: Language;
  theme?: "light" | "dark";
}

const SUGGESTIONS_VI = [
  "Tôi bị ho khan kèm sốt nhẹ về chiều 3 ngày nay, nên làm gì?",
  "Chế độ ăn phù hợp cho người bị mỡ máu cao?",
  "Huyết áp 140/90 mmHg có nguy hiểm không?",
  "Nên chuẩn bị gì trước khi đi nội soi dạ dày?"
];

const SUGGESTIONS_EN = [
  "I have had a dry cough & mild fever in afternoon for 3 days, what is advised?",
  "What diet is recommended for individuals with high blood cholesterol?",
  "Is a high blood pressure measurement of 144/90 mmHg dangerous?",
  "How should I prepare before undergoing an endoscopy checkup?"
];

export default function OnlineConsultation({ lang = "vi", theme = "light" }: OnlineConsultationProps) {
  const t = (key: keyof typeof translations["vi"]) => {
    return translations[lang]?.[key] || translations["vi"][key];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("ankhang_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: "welcome",
        role: "model",
        text: t("chatWelcome"),
        timestamp: new Date()
      }
    ];
  });

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync welcome message if language was switched on mount
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "welcome") {
      setMessages([
        {
          id: "welcome",
          role: "model",
          text: t("chatWelcome"),
          timestamp: messages[0].timestamp
        }
      ]);
    }
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("ankhang_chat_history", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorStatus(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const contextHistory = messages
        .slice(-8)
        .map(m => ({ role: m.role, text: m.text }));

      const response = await fetch("/api/health-consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, chatHistory: contextHistory, lang })
      });

      if (!response.ok) {
        throw new Error(lang === "vi" ? "Không phản hồi từ máy chủ y tế. Vui lòng kiểm tra phím Gemini API." : "No response from the health server. Please verify the Gemini API key.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "model",
        text: data.text || (lang === "vi" ? "Xin lỗi, tôi chưa nhận được chẩn đoán tư vấn rõ ràng." : "Sorry, I could not retrieve clinical suggestions at this moment."),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
      setErrorStatus(error.message || (lang === "vi" ? "Đã xảy ra sự cố trong quá trình giao tiếp y khoa từ xa." : "An error occurred during medical remote assistance transmission."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm(t("clearChatHistory"))) {
      const initial = [
        {
          id: "welcome",
          role: "model",
          text: t("chatWelcome"),
          timestamp: new Date()
        }
      ];
      setMessages(initial);
      localStorage.setItem("ankhang_chat_history", JSON.stringify(initial));
    }
  };

  const suggestions = lang === "vi" ? SUGGESTIONS_VI : SUGGESTIONS_EN;

  return (
    <div className={`flex flex-col h-[650px] rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300 ${
      theme === "dark" ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-800"
    }`} id="online-consultation-section">
      
      {/* Consultation Sub Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b transition-colors duration-300 ${
        theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-semibold text-sm md:text-base leading-tight ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
              {t("aiBotTitle")}
            </h3>
            <p className={`text-xs flex items-center mt-1 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              {t("aiBotStatus")}
            </p>
          </div>
        </div>
        <button
          onClick={handleClearHistory}
          title={lang === "vi" ? "Xóa cuộc trò chuyện" : "Clear chat history"}
          className="text-slate-400 hover:text-rose-500 p-2.5 hover:bg-slate-150/45 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Warning Legal Disclaimer */}
      <div className={`border-b px-6 py-3 flex items-start space-x-2 text-xs transition-colors duration-300 ${
        theme === "dark" 
          ? "bg-amber-950/20 border-amber-900/60 text-amber-300" 
          : "bg-amber-50 border-amber-200/60 text-amber-800"
      }`}>
        <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-normal">{t("legalAlert")}</p>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-3 ${
                msg.role === "user" ? "flex-row-reverse space-x-reverse" : "justify-start"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  msg.role === "user"
                    ? "bg-slate-800 text-white border-slate-700 dark:bg-slate-700 dark:border-slate-600"
                    : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-350 dark:border-emerald-900"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="flex flex-col max-w-[80%]">
                <div
                  className={`px-4 py-3 rounded-2xl shadow-xs text-sm ${
                    msg.role === "user"
                      ? "bg-slate-850 text-white rounded-tr-none dark:bg-slate-800 dark:text-slate-100"
                      : "rounded-tl-none whitespace-pre-wrap leading-relaxed border " + 
                        (theme === "dark" 
                          ? "bg-slate-900 text-slate-100 border-slate-800" 
                          : "bg-white text-slate-800 border-slate-100")
                  }`}
                >
                  {msg.text}
                </div>
                <span
                  className={`text-[10px] text-slate-400 mt-1 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString(lang === "vi" ? "vi-VN" : "en-US", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex items-start space-x-3 justify-start">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-350 dark:border-emerald-900 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className={`px-4 py-3.5 rounded-2xl rounded-tl-none max-w-[80%] flex items-center space-x-2 shadow-xs border ${
              theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-100 text-slate-500"
            }`}>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-450" />
              <span className="text-xs">{t("aiThinking")}</span>
            </div>
          </div>
        )}

        {errorStatus && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs flex items-center space-x-2 dark:bg-rose-955/20 dark:border-rose-900 dark:text-rose-350">
            <AlertTriangle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
            <div>
              <p className="font-semibold">{t("chatErrorHeader")}</p>
              <p>{errorStatus}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Fast Questions */}
      {messages.length === 1 && !isLoading && (
        <div className={`px-6 py-3 border-t transition-colors duration-300 ${
          theme === "dark" ? "bg-slate-900 border-slate-800/80" : "bg-white border-slate-100"
        }`}>
          <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold mb-2 dark:text-slate-400">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t("suggestedQuestions")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(s)}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-all text-left font-medium cursor-pointer border ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-350 hover:bg-slate-700 hover:text-slate-100"
                    : "bg-slate-55 hover:bg-emerald-50 hover:border-emerald-100 text-slate-700 hover:text-emerald-999 border-slate-150"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Typing Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className={`p-4 border-t transition-colors duration-300 flex items-center space-x-2 ${
          theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-205"
        }`}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t("placeholderChatField")}
          disabled={isLoading}
          className={`flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all disabled:opacity-75 ${
            theme === "dark"
              ? "bg-slate-800 border border-slate-705 text-white placeholder-slate-500 focus:border-emerald-500 focus:bg-slate-850 focus:ring-1 focus:ring-emerald-900"
              : "bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white"
          }`}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white p-3.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
