import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini API Client to prevent startup failure if key is missing
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// 🩺 AI Health Advisor Endpoint
app.post("/api/health-consult", async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const client = getGeminiClient();

    // Map history to contents payload format expected by the SDK
    const formattedContents = [];
    
    // System instruction to guide the medical persona
    const systemInstruction = 
      "Bạn là Bác sĩ Trợ lý Tư vấn Y tế ảo siêu thông minh tại Phòng khám Đa khoa An Khang. " +
      "Nhiệm vụ của bạn là lắng nghe triệu chứng, đưa ra các tư vấn sức khỏe hữu ích, giải thích y khoa dễ hiểu, " +
      "và hướng dẫn các biện pháp ăn uống, tập luyện, nghỉ ngơi thích hợp. " +
      "Hãy luôn ân cần, thấu hiểu và lịch sự. " +
      "Lưu ý quan trọng: Nhắc nhở bệnh nhân khám trực tiếp tại Phòng khám Đa khoa An Khang (địa chỉ hoặc trực tuyến qua mục đặt lịch) " +
      "để có kết quả chẩn đoán chính xác nhất bằng các thiết bị cận lâm sàng nếu nhận diện triệu chứng có chuyển biến phức tạp. " +
      "Tuyệt đối không kê đơn thuốc điều trị đặc hiệu trực tuyến mà chỉ định hướng chuyên khoa phù hợp (ví dụ: Nội tổng quát, Tai Mũi Họng, Da liễu, Nhi khoa, v.v.). " +
      "Sử dụng tiếng Việt chuẩn mực để hồi đáp và kết câu một cách thân thiện.";

    // Convert client-provided historical conversation
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        formattedContents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add current user message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Health Consult Error:", error);
    res.status(500).json({ 
      error: "Không thể kết nối với Bác sĩ tư vấn AI vào lúc này. " + (error.message || "")
    });
  }
});

// Mock Initial Specialists & Doctors data for appointments & consulting references
app.get("/api/doctors", (req, res) => {
  res.json([
    { id: "dr-minh", name: "BS. CKI Nguyễn Tuấn Minh", specialty: "Nội tổng quát", desc: "15 năm kinh nghiệm điều trị tim mạch và huyết áp.", availability: "Thứ 2 - Thứ 7" },
    { id: "dr-huong", name: "ThS. BS Trần Thị Mai Hương", specialty: "Nhi khoa", desc: "Chuyên gia tâm lý và sức khỏe trẻ em, cựu bác sĩ BV Nhi Đồng.", availability: "Thứ 2 - Thứ 6" },
    { id: "dr-hoang", name: "BS. CKI Lê Hoàng Nam", specialty: "Chấn thương chỉnh hình", desc: "Chuyên chữa các bệnh cơ xương khớp, phục hồi chức năng thể thao.", availability: "Thứ Ba, Năm, Bảy" },
    { id: "dr-thao", name: "ThS. BS Phạm Phương Thảo", specialty: "Da liễu - Thẩm mỹ", desc: "Thầy thuốc ưu tú chuyên trị liệu mụn trứng cá và trẻ hóa làn da.", availability: "Hàng ngày" },
    { id: "dr-quoc", name: "BS. CKII Huỳnh Anh Quốc", specialty: "Tai Mũi Họng", desc: "Điều trị viêm xoang, amidan, amidal công nghệ plasma.", availability: "Thứ 2 - Thứ 6" }
  ]);
});

// Vite Middleware Configuration for Full-Stack App
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Clinic server is active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
