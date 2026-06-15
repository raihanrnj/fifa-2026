import axios from 'axios';

async function getFinished(slug) {
  const url = `https://www.worldcupmatchtime.com/en/match/${slug}`;
  const resp = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 });
  const html = resp.data;
  const pushRegex = /self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g;
  let m, allData = '';
  while ((m = pushRegex.exec(html)) !== null) {
    allData += m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  const resultRegex = /"result":\{"idMatch":"(\d+)","status":"([^"]+)","homeScore":(\d+|null),"awayScore":(\d+|null),"homePen":(\d+|null),"awayPen":(\d+|null),"homeTeam":"([^"]+)","awayTeam":"([^"]+)"/g;
  let match;
  while ((match = resultRegex.exec(allData)) !== null) {
    if (match[2] === 'finished') {
      console.log(`${match[7]} ${match[3]}-${match[4]} ${match[8]} (id:${match[1]})`);
    }
  }
}

await getFinished('qatar-vs-switzerland-jun-13-2026');
await getFinished('mexico-vs-south-africa-jun-11-2026');
