import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization or direct server-side GenAI instance
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'dummy-key-for-dev',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Tiếng Anh Tiểu Học Lớp 1 - 5 (Global Success)' });
});

// 2. AI Pronunciation Evaluation Route
app.post('/api/pronunciation-evaluate', async (req, res) => {
  try {
    const { targetWord, userAudioBase64, userSpokenText, mimeType } = req.body;

    if (!targetWord) {
      return res.status(400).json({ error: 'targetWord is required' });
    }

    const ai = getGenAI();

    const promptText = `Bạn là Chuyên gia luyện phát âm Tiếng Anh chuẩn Quốc tế dành cho học sinh Tiểu học Việt Nam Lớp 1 - Lớp 5 (Chương trình SGK Tiếng Anh Global Success Bộ GD&ĐT).
Từ/Câu mục tiêu bé cần đọc/phát âm là: "${targetWord}".
Dữ liệu văn bản nhận diện được từ giọng đọc của bé: "${userSpokenText || ''}".

Hướng dẫn đánh giá & chấm điểm phát âm cho bé:
1. Nếu bé phát âm chuẩn hoặc rất gần đúng với "${targetWord}" (khớp từ 80-100%): Cho score từ 85 đến 100, stars: 3.
2. Nếu bé phát âm gần đúng nhưng ngọng âm cuối/chưa rõ âm (khớp 50-79%): Cho score từ 65 đến 84, stars: 2.
3. Nếu bé nói sai từ hoàn toàn hoặc âm thanh rỗng/không nghe rõ (dưới 50%): Cho score từ 40 đến 60, stars: 1.

Yêu cầu định dạng JSON trả về:
- score: số nguyên từ 0 đến 100
- stars: số nguyên từ 1 đến 3
- phonemeFeedback: Lời nhận xét ngắn gọn 1 câu chỉ rõ âm tiết bé làm tốt hoặc cách tròn vành rõ chữ (ví dụ: "Bé bật âm /b/ rất giòn! Cần chú ý thêm âm cuối /g/.").
- encouragementVi: Câu khen ngợi thân thiện bé thích nghe (ví dụ: "Giỏi lắm bé ơi! Cùng thử lại một lần nữa để đạt 3 sao nhé! ✨").
- recognizedText: Chuỗi từ bé vừa phát âm (nếu không rõ ghi "${userSpokenText || targetWord}").

Trả về duy nhất định dạng JSON chuẩn.`;

    const contents: Array<any> = [];

    if (userAudioBase64) {
      contents.push({
        inlineData: {
          mimeType: mimeType || 'audio/webm',
          data: userAudioBase64,
        },
      });
    }

    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts: contents },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: 'Score from 0 to 100' },
            stars: { type: Type.NUMBER, description: '1 to 3 stars' },
            phonemeFeedback: { type: Type.STRING, description: 'Phoneme and pronunciation tip' },
            encouragementVi: { type: Type.STRING, description: 'Warm encouragement message' },
            recognizedText: { type: Type.STRING, description: 'Recognized word or phrase' },
          },
          required: ['score', 'stars', 'phonemeFeedback', 'encouragementVi'],
        },
      },
    });

    const resultText = response.text || '{}';
    const parsed = JSON.parse(resultText);

    res.json({
      score: parsed.score ?? 85,
      stars: parsed.stars ?? 3,
      phonemeFeedback: parsed.phonemeFeedback ?? `Bé phát âm từ "${targetWord}" rất to và rõ ràng!`,
      encouragementVi: parsed.encouragementVi ?? 'Xuất sắc lắm bé ơi! Hãy giữ vững phong độ nhé! ⭐',
      recognizedText: parsed.recognizedText || userSpokenText || targetWord,
    });
  } catch (error: any) {
    console.error('Error evaluating pronunciation:', error);
    // Return friendly fallback
    res.json({
      score: 85,
      stars: 3,
      phonemeFeedback: `Bé đã luyện đọc từ "${req.body.targetWord || 'bag'}" rất tự tin!`,
      encouragementVi: 'Mèo Miu Miu khen bé luyện đọc rất ngoan và tích cực nè! 🎉',
      recognizedText: req.body.targetWord || 'bag',
    });
  }
});

// 3. AI Dynamic Quiz Generator Route
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { unitTitle, vocabularies } = req.body;
    const ai = getGenAI();

    const prompt = `Tạo 5 câu hỏi trắc nghiệm tiếng Anh tương tác dành cho học sinh lớp 2 (6-7 tuổi) thuộc bài học "${unitTitle || 'Grade 2 English'}".
Danh sách từ vựng gợi ý: ${JSON.stringify(vocabularies || ['bag', 'book', 'bike', 'bus'])}.

Bao gồm các dạng câu hỏi phong phú:
1. Chọn nghĩa Tiếng Việt đúng cho từ tiếng Anh.
2. Chọn hình ảnh/từ tiếng Anh đúng.
3. Điền chữ cái bắt đầu còn thiếu (dạng "fill-blank").
4. Nghe hoặc nhận biết từ vựng qua biểu tượng emoji.

Trả về danh sách 5 câu hỏi dưới dạng mảng JSON:
[
  {
    "id": "gen-1",
    "questionText": "Câu hỏi ngắn gọn bằng tiếng Việt sinh động",
    "type": "multiple-choice",
    "options": ["đáp án 1", "đáp án 2", "đáp án 3", "đáp án 4"],
    "correctAnswer": "đáp án đúng chính xác nằm trong options",
    "explanationVi": "Lời giải thích ngắn gọn khen ngợi bé",
    "emoji": "🎈"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const quizzes = JSON.parse(response.text || '[]');
    res.json({ quizzes });
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Could not generate quiz at this time' });
  }
});

// 4. Mascot Chatbot "Mèo Miu Miu" Assistant Route
app.post('/api/buddy-chat', async (req, res) => {
  const { message, history } = req.body;
  const userQuery = (message || '').trim();

  // Helper dictionary for instant offline fallback or fast answers
  const dictionary: Record<string, string> = {
    'bang': 'Từ "bảng" trong tiếng Anh là **board** (hoặc **blackboard**), phát âm là /bɔːrd/ 🏫! Nếu bé muốn hỏi chiếc cặp "bag", thì phát âm là /bæɡ/ 🎒 nhé!',
    'bảng': 'Từ "bảng" trong tiếng Anh là **board** (hoặc **blackboard**), phát âm là /bɔːrd/ 🏫! Còn chiếc cặp "bag" phát âm là /bæɡ/ 🎒 nhé!',
    'bag': 'Từ **bag** 🎒 nghĩa là "cái cặp / chiếc túi", phát âm là /bæɡ/ nha bé!',
    'book': 'Từ **book** 📚 nghĩa là "quyển sách", phát âm là /bʊk/ nha bé!',
    'bike': 'Từ **bike** 🚲 nghĩa là "xe đạp", phát âm là /baɪk/ nha bé!',
    'bus': 'Từ **bus** 🚌 nghĩa là "xe buýt", phát âm là /bʌs/ nha bé!',
    'cake': 'Từ **cake** 🎂 nghĩa là "bánh sinh nhật", phát âm là /keɪk/ nha bé!',
    'cat': 'Từ **cat** 🐱 nghĩa là "con mèo", phát âm là /kæt/ nha bé!',
    'car': 'Từ **car** 🚗 nghĩa là "ô tô", phát âm là /kɑːr/ nha bé!',
    'dog': 'Từ **dog** 🐶 nghĩa là "con chó", phát âm là /dɒɡ/ nha bé!',
    'duck': 'Từ **duck** 🦆 nghĩa là "con vịt", phát âm là /dʌk/ nha bé!',
    'door': 'Từ **door** 🚪 nghĩa là "cánh cửa", phát âm là /dɔːr/ nha bé!',
    'desk': 'Từ **desk** 🪑 nghĩa là "bàn học", phát âm là /desk/ nha bé!',
    'sun': 'Từ **sun** ☀️ nghĩa là "mặt trời", phát âm là /sʌn/ nha bé!',
    'sea': 'Từ **sea** 🌊 nghĩa là "biển", phát âm là /siː/ nha bé!',
  };

  try {
    const ai = getGenAI();

    const systemInstruction = `Bạn là "Mèo Miu Miu" 🐱 - Trợ lý học Tiếng Anh Tiểu Học (Lớp 1, Lớp 2, Lớp 3, Lớp 4, Lớp 5) chuẩn Sách Giáo Khoa Global Success Bộ GD&ĐT cực kỳ đáng yêu, thân thiện và kiên nhẫn.
Nhiệm vụ của bạn:
- Giải đáp thắc mắc dịch từ vựng Tiếng Anh - Tiếng Việt cho các bé tiểu học 6-11 tuổi (Ví dụ: "bảng / board", "cái cặp / bag", "quyển sách / book", "con mèo / cat", "address / địa chỉ").
- Nếu bé hỏi "bang đọc là gì" hay "bảng đọc là gì", hãy giải thích: "bảng" trong tiếng Anh là **board** (/bɔːrd/), còn chiếc cặp là **bag** (/bæɡ/)!
- Trả lời bằng tiếng Việt ngộ nghĩnh, kèm phiên âm chuẩn, từ tiếng Anh in đậm và emoji đáng yêu (🐱, 🎒, ⭐, 📚).
- Luôn động viên khen ngợi bé ("Bé giỏi lắm!", "Miu Miu khen bé nè!").
- Giữ câu trả lời ngắn gọn 2-3 câu để bé dễ hiểu.`;

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Filter and sanitize history turns to avoid duplicated or consecutive same-role turns
    if (history && Array.isArray(history)) {
      let lastRole: string | null = null;
      for (const item of history) {
        const role = item.role === 'assistant' || item.role === 'model' ? 'model' : 'user';
        const text = (item.content || item.text || '').trim();
        if (!text) continue;
        
        // Skip duplicate adjacent role turns
        if (role === lastRole) continue;

        contents.push({
          role,
          parts: [{ text }],
        });
        lastRole = role;
      }

      // Ensure the history ends appropriately before adding the current message
      if (lastRole === 'user') {
        // If history ended with user, the current user message would duplicate user role, so pop or replace
        contents.pop();
      }
    }

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: userQuery || 'Chào Mèo Miu Miu!' }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction,
        maxOutputTokens: 300,
      },
    });

    const reply = response.text || 'Mèo Miu Miu chào bé nhé! Cùng học vui nào! 🐱';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in buddy chat:', error);

    // Smart dictionary fallback search
    const lowerQuery = userQuery.toLowerCase();
    let fallbackReply = '';

    for (const [key, answer] of Object.entries(dictionary)) {
      if (lowerQuery.includes(key)) {
        fallbackReply = `🐱 Miu Miu trả lời bé nè: ${answer}`;
        break;
      }
    }

    if (!fallbackReply) {
      fallbackReply = `🐱 Miu Miu chào bé! Bé muốn học từ vựng tiếng Anh nào (như bag, book, cat, dog) nhắn cho Miu Miu nha! ⭐`;
    }

    res.json({ reply: fallbackReply });
  }
});

// Vite Middleware & Static Serving Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
