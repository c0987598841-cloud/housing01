import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Test and Detect Available Models with user's API Key
  app.post("/api/gemini/test-key", async (req, res) => {
    try {
      const { apiKey, model } = req.body;
      const keyToUse = apiKey?.trim();
      if (!keyToUse) {
        return res.status(400).json({
          success: false,
          error: "尚未填寫 API Key。請輸入您自己的 Google Gemini API Key 以進行連線測試。",
        });
      }

      const ai = new GoogleGenAI({
        apiKey: keyToUse,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const testModel = model || "gemini-2.5-flash";
      const response = await ai.models.generateContent({
        model: testModel,
        contents: "Ping. 請回覆繁體中文『驗證成功』四個字。",
      });

      const replyText = response.text || "";

      return res.json({
        success: true,
        message: `API Key 驗證成功！已成功連線至 ${testModel}`,
        reply: replyText.trim(),
        availableModels: [
          { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (最新高效 - 推薦)" },
          { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (深度推理)" },
          { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash (極速響應)" },
          { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (穩定版)" },
          { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
        ],
      });
    } catch (error: any) {
      console.error("Gemini API key test error:", error);
      return res.status(400).json({
        success: false,
        error: error.message || "API Key 驗證失敗，請檢查 Key 是否正確並具有 Gemini API 權限",
      });
    }
  });

  // Server-side Gemini AI Real Estate Analysis Endpoint
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const { city, district, averagePrice, trendRate, propertyType, transactionCount, apiKey, model } = req.body;

      const keyToUse = apiKey?.trim();
      if (!keyToUse) {
        return res.status(400).json({
          error: "【未輸入 API Key】為保護系統額度與安全，請在頁面上方輸入您自己的 Google Gemini API Key 後再執行 AI 房市分析。",
        });
      }

      const selectedModel = model || "gemini-2.5-flash";

      const ai = new GoogleGenAI({
        apiKey: keyToUse,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `你是一位專業的台灣房地產資深分析師與估價專家。
請針對使用者查詢的區域進行精闢、專業且客觀的房市行情分析：
- 縣市：${city}
- 行政區：${district}
- 目前實價登錄平均單價：約 ${averagePrice} 萬元/坪
- 近期價格季增/年增趨勢：約 ${trendRate}%
- 主力產品：${propertyType || "電梯大樓、華廈與透天"}
- 近期成交熱度：${transactionCount || "正常"}

請以結構化且易於閱讀的繁體中文提供分析，包含以下四大面向：
1. 💡【區域房市現況與行情定位】：該區生活機能、交通優勢（如捷運/高鐵/交流道/主要幹道）與人口/重大建設題材。
2. 📈【房價走勢與未來增值潛力評估】：支撐目前每坪 ${averagePrice} 萬單價的關鍵因素，以及未來 1~3 年房價可能走勢預測。
3. 🎯【首購族 vs 換屋/置產族群 挑屋建議】：推薦關注之路段或社區類型、新成屋與中古屋挑選心法。
4. ⚠️【購屋風險提示與議價技巧】：該區需注意的抗性（如屋齡過高、公設比、車位價格拆算、特定地段嫌惡設施等）與出價議價策略。

語氣請專業、誠懇、貼近台灣在地購屋者的實際考量，條理分明。`;

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
      });

      return res.json({
        analysis: response.text,
        city,
        district,
      });
    } catch (error: any) {
      console.error("Gemini analysis error:", error);
      return res.status(500).json({
        error: error.message || "Failed to generate AI real estate analysis",
      });
    }
  });

  // Server-side Live Real-Time Data Fetch with Search Grounding
  app.post("/api/realprice/live-search", async (req, res) => {
    try {
      const { city, district, apiKey, model } = req.body;
      const keyToUse = apiKey?.trim();
      if (!keyToUse) {
        return res.status(400).json({
          error: "【未輸入 API Key】為保護系統額度與安全，請在頁面上方輸入您的 Google Gemini API Key 以啟用即時公開房市檢索。",
        });
      }

      const selectedModel = model || "gemini-2.5-flash";

      const ai = new GoogleGenAI({
        apiKey: keyToUse,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const queryPrompt = `請利用 Google 搜尋台灣最新房地產真實公開資料（包含內政部實價登錄、591房屋交易網、樂居網 LEJU、信義房屋、永慶房產集團等）：
目標區域：【${city} ${district}】

請檢索並整理出：
1. 該行政區近期真實的「實價登錄成交紀錄」（至少 3~5 筆具體真實社區名稱、路段、交易單價萬/坪、總價萬元、坪數、樓層或建築類型）。
2. 該行政區近期市場上真實的「在售中古屋/預售新成屋物件」（至少 3~4 筆真實社區或建案名稱、路段、開價、坪數、格局）。
3. 該行政區最新市場真實行情綜述（實價登錄均價 萬/坪、近一年走勢、熱門成交路段）。

請務必輸出合法的 JSON 格式（包含在 markdown \`\`\`json \`\`\` 代碼塊中），格式如下：
{
  "summary": {
    "avgPrice": 數字(萬/坪),
    "trendText": "走勢描述文字",
    "hotStreets": ["熱門路段1", "熱門路段2"],
    "description": "200字以內市場現況客觀說明"
  },
  "realPriceTransactions": [
    {
      "id": "TX_REAL_1",
      "communityName": "真實社區名稱或路段大樓",
      "address": "真實路段 (例如 介壽路一段...)",
      "transactionDate": "交易年月",
      "totalPrice": 總價數字(萬元),
      "areaPing": 坪數數字,
      "unitPricePing": 單價數字(萬/坪),
      "buildingType": "電梯大樓" 或 "華廈" 或 "公寓" 或 "透天別墅",
      "floor": "樓層 (例如 7樓/共12樓)",
      "layout": "格局 (例如 3房2廳2衛)"
    }
  ],
  "liveProperties": [
    {
      "id": "PROP_REAL_1",
      "title": "真實待售物件或建案標題",
      "communityName": "真實社區或建案名稱",
      "address": "真實地址路段",
      "price": 開價數字(萬元),
      "pingTotal": 總坪數數字,
      "pricePerPing": 單價數字(萬/坪),
      "rooms": 房數數字,
      "livingRooms": 廳數數字,
      "bathrooms": 衛數數字,
      "age": 屋齡數字,
      "buildingType": "電梯大樓" 或 "華廈" 或 "公寓" 或 "透天別墅",
      "description": "物件特色簡述",
      "sourcePlatform": "591 / 樂居 / 信義 / 永慶 / 內政部"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: queryPrompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const webSources = groundingChunks
        .filter((chunk: any) => chunk.web?.uri)
        .map((chunk: any) => ({
          title: chunk.web.title || "公開房產資料來源",
          url: chunk.web.uri,
        }));

      // Parse JSON from codeblock or raw string
      let parsedData: any = null;
      try {
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          parsedData = JSON.parse(jsonMatch[1]);
        } else {
          // direct JSON parse attempt
          const cleanText = text.trim();
          const firstBrace = cleanText.indexOf("{");
          const lastBrace = cleanText.lastIndexOf("}");
          if (firstBrace !== -1 && lastBrace !== -1) {
            parsedData = JSON.parse(cleanText.substring(firstBrace, lastBrace + 1));
          }
        }
      } catch (parseErr) {
        console.warn("JSON parsing failed, returning raw analysis text:", parseErr);
      }

      return res.json({
        success: true,
        city,
        district,
        data: parsedData,
        rawText: text,
        sources: webSources,
      });
    } catch (error: any) {
      console.error("Live realprice search error:", error);
      return res.status(500).json({
        error: error.message || "Failed to search live real estate data",
      });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
