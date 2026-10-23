import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Server-side endpoint to fetch Google Sheets CSV without browser CORS / redirect errors
  app.get('/api/sync-sheets', async (req, res) => {
    try {
      const targetUrl = (req.query.url as string) ||
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTxlUiZj0SKGlRo5_kIH5dnNKQ5GIE3MlMR4x7IBbNEdD1JdWVyjKRW9Z6wKgVgypMJ2sclXbHg7C_J/pub?gid=1714766812&single=true&output=csv';

      const response = await fetch(targetUrl);
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Error al contactar con Google Sheets' });
      }

      const csvText = await response.text();
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(csvText);
    } catch (err: any) {
      console.error('Server sync error:', err);
      res.status(500).json({ error: err.message || 'Error de conexión con Google Sheets' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
