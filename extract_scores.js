import axios from 'axios';

// Extract ALL match results from the embedded Next.js RSC data in match detail pages
async function extractAllResults(slug) {
  const url = `https://www.worldcupmatchtime.com/en/match/${slug}`;
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    timeout: 15000
  });
  
  const html = response.data;
  
  // Extract and decode all self.__next_f.push payloads
  const pushRegex = /self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g;
  let m;
  let allData = '';
  while ((m = pushRegex.exec(html)) !== null) {
    allData += m[1]
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }
  
  // Extract all "result" objects from the RSC data
  // Pattern: "result":{"idMatch":"...","status":"...","homeScore":...,"awayScore":...,...,"homeTeam":"...","awayTeam":"..."}
  const resultRegex = /"result":\{"idMatch":"(\d+)","status":"([^"]+)","homeScore":(\d+|null),"awayScore":(\d+|null),"homePen":(\d+|null),"awayPen":(\d+|null),"homeTeam":"([^"]+)","awayTeam":"([^"]+)"/g;
  
  const results = new Map();
  let match;
  while ((match = resultRegex.exec(allData)) !== null) {
    const idMatch = match[1];
    if (!results.has(idMatch)) {
      results.set(idMatch, {
        idMatch,
        status: match[2],
        homeScore: match[3] === 'null' ? null : parseInt(match[3]),
        awayScore: match[4] === 'null' ? null : parseInt(match[4]),
        homePen: match[5] === 'null' ? null : parseInt(match[5]),
        awayPen: match[6] === 'null' ? null : parseInt(match[6]),
        homeTeam: match[7],
        awayTeam: match[8]
      });
    }
  }
  
  return results;
}

// Scrape multiple pages to collect all results
const slugs = [
  'mexico-vs-south-africa-jun-11-2026',
  'canada-vs-bosnia-and-herzegovina-jun-12-2026', 
  'qatar-vs-switzerland-jun-13-2026',
  'germany-vs-curacao-jun-14-2026',
  'spain-vs-cabo-verde-jun-15-2026',
  'france-vs-senegal-jun-16-2026'
];

const allResults = new Map();

for (const slug of slugs) {
  console.log(`Scraping ${slug}...`);
  try {
    const results = await extractAllResults(slug);
    for (const [id, result] of results) {
      if (!allResults.has(id)) {
        allResults.set(id, result);
      }
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

console.log('\n====== ALL MATCH RESULTS ======');
const sorted = [...allResults.values()].sort((a, b) => a.idMatch.localeCompare(b.idMatch));
for (const r of sorted) {
  const score = r.homeScore !== null ? `${r.homeScore}-${r.awayScore}` : 'N/A';
  const pen = r.homePen !== null ? ` (pen: ${r.homePen}-${r.awayPen})` : '';
  console.log(`${r.homeTeam} vs ${r.awayTeam}: ${score}${pen} [${r.status}] (id: ${r.idMatch})`);
}
console.log(`\nTotal: ${allResults.size} matches found`);

// Output as JSON for use in the scraper
const jsonOutput = sorted.map(r => ({
  idMatch: r.idMatch,
  homeTeam: r.homeTeam,
  awayTeam: r.awayTeam,
  homeScore: r.homeScore,
  awayScore: r.awayScore,
  homePen: r.homePen,
  awayPen: r.awayPen,
  status: r.status
}));

console.log('\n====== JSON OUTPUT ======');
console.log(JSON.stringify(jsonOutput, null, 2));
