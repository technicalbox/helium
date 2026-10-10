import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API Route: Ask Gemini / Chat
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { prompt, pageContext, chatHistory, includePageContext } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      if (!apiKey) {
        return res.json({
          reply: `[Helium Ask Gemini Side Panel]\nI received your query: "${prompt}".\n\nPage context attached: ${includePageContext && pageContext ? 'Yes (' + pageContext.slice(0, 100) + '...)' : 'No'}.\n\nTo connect live responses from Gemini, configure the GEMINI_API_KEY environment variable in your project settings.`
        });
      }

      const contents: any[] = [];

      // If page context is enabled and present, add it as initial background context
      if (includePageContext && pageContext) {
        contents.push({
          role: 'user',
          parts: [{ text: `You are the built-in "Ask Gemini" side panel assistant in Helium Browser. The user is currently reading this active web page:\n\n"""\n${pageContext}\n"""\n\nPlease answer the user's questions clearly, referencing the page content when relevant.` }]
        });
        contents.push({
          role: 'model',
          parts: [{ text: 'Understood. I have read the active page content and will help you analyze, summarize, or answer questions about it.' }]
        });
      }

      // Add prior chat history
      if (Array.isArray(chatHistory)) {
        for (const msg of chatHistory) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        }
      }

      // Add current prompt
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
      });

      const replyText = response.text || 'No response generated.';
      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      return res.status(500).json({
        error: error?.message || 'Failed to generate response from Gemini API'
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Helium Gemini Side Panel' });
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Helium Browser server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
