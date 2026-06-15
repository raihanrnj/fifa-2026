import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { scrapeAll } from './scraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const DATA_DIR = path.join(process.cwd(), 'data');

app.use(cors());
app.use(express.json());

// Helper to read cached json files
function getCachedData(filename, fallback) {
  const filePath = path.join(DATA_DIR, filename);
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (e) {
      console.error(`Error reading cached ${filename}:`, e.message);
    }
  }
  return fallback;
}

// REST API Endpoints
app.get('/api/standings', async (req, res) => {
  const standings = getCachedData('standings.json', null);
  if (standings) {
    return res.json(standings);
  }
  // If no cache, trigger scrape and return
  const data = await scrapeAll();
  res.json(data.standings);
});

app.get('/api/schedule', async (req, res) => {
  const schedule = getCachedData('schedule.json', null);
  if (schedule) {
    return res.json(schedule);
  }
  const data = await scrapeAll();
  res.json(data.schedule);
});

app.get('/api/bracket', async (req, res) => {
  const bracket = getCachedData('bracket.json', null);
  if (bracket) {
    return res.json(bracket);
  }
  const data = await scrapeAll();
  res.json(data.bracket);
});

// Manual scrape trigger endpoint
app.post('/api/scrape', async (req, res) => {
  try {
    const data = await scrapeAll();
    res.json({ success: true, message: 'Scrape job executed successfully', data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production' || fs.existsSync(path.join(__dirname, 'dist'))) {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('FIFA World Cup 2026 API Server is running. Frontend dev server is on port 5173.');
  });
}

// Start Background Scheduler (Scrape every 30 minutes)
const THIRTY_MINUTES = 30 * 60 * 1000;
setInterval(() => {
  console.log('Scheduler running: periodic scraping started...');
  scrapeAll().catch(err => console.error('Periodic scrape failed:', err.message));
}, THIRTY_MINUTES);

// Run initial scrape job on server startup (async)
scrapeAll().then(() => {
  console.log('Initial scrape job completed successfully.');
}).catch(err => {
  console.error('Initial scrape job failed:', err.message);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
