import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fallbackStandings, fallbackSchedule, fallbackBracket } from './seedData.js';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// ─────────────────────────────────────────────
//  Helper: Extract match results from RSC payload
//  The worldcupmatchtime.com site embeds match result
//  data in the Next.js React Server Component payload
//  inside <script> tags with self.__next_f.push()
// ─────────────────────────────────────────────
function extractResultsFromRSC(html) {
  const results = new Map();

  // Decode the self.__next_f.push payloads
  const pushRegex = /self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g;
  let m;
  let allData = '';
  while ((m = pushRegex.exec(html)) !== null) {
    allData += m[1]
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }

  // Extract "result" objects: {"idMatch":"...","status":"...","homeScore":...,...}
  const resultRegex = /"result":\{"idMatch":"(\d+)","status":"([^"]+)","homeScore":(\d+|null),"awayScore":(\d+|null),"homePen":(\d+|null),"awayPen":(\d+|null),"homeTeam":"([^"]+)","awayTeam":"([^"]+)"/g;
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

// ─────────────────────────────────────────────
//  Scrape real match scores by visiting individual
//  match detail pages. Each page's RSC payload
//  contains the result for that match AND related matches.
// ─────────────────────────────────────────────
async function scrapeMatchResults() {
  console.log('Scraping real match results from match detail pages...');
  const allResults = new Map();

  // Strategically pick a few match pages that collectively cover all played matches.
  // Each page shows "related matches" and "other matches on same day" with real scores.
  const sampleSlugs = [
    'mexico-vs-south-africa-jun-11-2026',        // covers Jun 11 matches
    'canada-vs-bosnia-and-herzegovina-jun-12-2026', // covers Jun 12 matches
    'qatar-vs-switzerland-jun-13-2026',           // covers Jun 13 matches
    'germany-vs-curacao-jun-14-2026',             // covers Jun 14 matches
    'spain-vs-cabo-verde-jun-15-2026',            // covers Jun 15 matches
    'france-vs-senegal-jun-16-2026',              // covers Jun 16 matches
    'portugal-vs-congo-dr-jun-17-2026',           // covers Jun 17 matches
    'czechia-vs-south-africa-jun-18-2026',        // covers Jun 18 matches
    'usa-vs-australia-jun-19-2026',               // covers Jun 19 matches
    'netherlands-vs-sweden-jun-20-2026',          // covers Jun 20 matches
    'spain-vs-saudi-arabia-jun-21-2026',          // covers Jun 21 matches
    'argentina-vs-austria-jun-22-2026',           // covers Jun 22 matches
    'portugal-vs-uzbekistan-jun-23-2026',         // covers Jun 23 matches
  ];

  for (const slug of sampleSlugs) {
    try {
      const url = `https://www.worldcupmatchtime.com/en/match/${slug}`;
      const response = await axios.get(url, { headers: HEADERS, timeout: 15000 });
      const results = extractResultsFromRSC(response.data);
      for (const [id, result] of results) {
        if (!allResults.has(id)) {
          allResults.set(id, result);
        }
      }
      console.log(`  ${slug}: extracted ${results.size} results`);
    } catch (err) {
      console.warn(`  Could not fetch ${slug}: ${err.message}`);
    }
  }

  console.log(`Total unique match results collected: ${allResults.size}`);
  return allResults;
}

// ─────────────────────────────────────────────
//  Normalize team names for matching
// ─────────────────────────────────────────────
function normalizeTeam(name) {
  if (!name) return '';
  return name.toLowerCase()
    .replace(/['']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─────────────────────────────────────────────
//  Apply real results to the schedule
// ─────────────────────────────────────────────
function mergeResultsIntoSchedule(schedule, resultsMap) {
  if (!Array.isArray(schedule) || resultsMap.size === 0) return schedule;

  // Build a lookup by normalized team pair
  const resultsByTeams = new Map();
  for (const [, result] of resultsMap) {
    const key = `${normalizeTeam(result.homeTeam)}|${normalizeTeam(result.awayTeam)}`;
    resultsByTeams.set(key, result);
  }

  return schedule.map(match => {
    const key = `${normalizeTeam(match.team1)}|${normalizeTeam(match.team2)}`;
    const result = resultsByTeams.get(key);

    if (result) {
      const isFinished = result.status === 'finished';
      const isLive = result.status === 'live';
      return {
        ...match,
        score1: result.homeScore,
        score2: result.awayScore,
        penScore1: result.homePen,
        penScore2: result.awayPen,
        status: isFinished ? 'FINISHED' : (isLive ? 'LIVE' : match.status)
      };
    }
    return match;
  });
}

// ─────────────────────────────────────────────
//  Scrape Standings Page
// ─────────────────────────────────────────────
export async function scrapeStandings() {
  try {
    console.log('Scraping standings from worldcupmatchtime.com...');
    const response = await axios.get('https://www.worldcupmatchtime.com/en/standings', {
      headers: HEADERS,
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const groups = [];

    $('section').each((i, section) => {
      const groupName = $(section).find('h2').text().trim();
      if (!groupName || !groupName.startsWith('Group')) return;

      const teams = [];
      $(section).find('div.grid').each((j, row) => {
        // Find team anchor link (contains href to /by-team/)
        const teamLink = $(row).find('a[href*="/by-team/"]');
        if (teamLink.length === 0) return;

        const rank = parseInt($(row).find('span').first().text().trim()) || j;
        const name = teamLink.find('span').text().trim() || teamLink.text().trim();
        
        let flag = teamLink.find('img').attr('src') || '';
        // Decode flags nested inside NextJS Image loader
        if (flag.includes('url=')) {
          const urlParams = new URLSearchParams(flag.split('?')[1]);
          flag = urlParams.get('url') || flag;
        }

        // Gather statistics using tabular-nums class
        const statsSpans = $(row).find('.tabular-nums');
        const played = parseInt(statsSpans.eq(0).text().trim()) || 0;
        const won = parseInt(statsSpans.eq(1).text().trim()) || 0;
        const drawn = parseInt(statsSpans.eq(2).text().trim()) || 0;
        const lost = parseInt(statsSpans.eq(3).text().trim()) || 0;
        
        const gdText = statsSpans.eq(4).text().trim();
        const gd = parseInt(gdText.replace('+', '')) || 0;
        
        const points = parseInt($(row).find('.text-wc-gold, span.font-bold').last().text().trim()) || 0;

        teams.push({ rank, name, flag, played, won, drawn, lost, gd, points });
      });

      if (teams.length > 0) {
        groups.push({ group: groupName, teams });
      }
    });

    if (groups.length > 0) {
      fs.writeFileSync(path.join(DATA_DIR, 'standings.json'), JSON.stringify(groups, null, 2));
      console.log(`Successfully scraped standings for ${groups.length} groups.`);
      return groups;
    }
    
    throw new Error('No groups parsed from the page.');
  } catch (error) {
    console.error('Error scraping standings:', error.message);
    // Use fallback data
    fs.writeFileSync(path.join(DATA_DIR, 'standings.json'), JSON.stringify(fallbackStandings, null, 2));
    console.log('Standings fallback data saved.');
    return fallbackStandings;
  }
}

// ─────────────────────────────────────────────
//  Scrape Schedule + Real Scores
// ─────────────────────────────────────────────
export async function scrapeSchedule() {
  try {
    console.log('Scraping schedule from worldcupmatchtime.com...');

    // Step 1: Load existing schedule from cache if available
    let existingSchedule = [];
    const cacheFile = path.join(DATA_DIR, 'schedule.json');
    if (fs.existsSync(cacheFile)) {
      try {
        existingSchedule = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      } catch (e) {
        console.warn('Could not read cached schedule:', e.message);
      }
    }

    // If we don't have a base schedule, use fallback
    if (!Array.isArray(existingSchedule) || existingSchedule.length === 0) {
      existingSchedule = fallbackSchedule;
    }

    // Step 2: Scrape real match results from match detail pages
    const matchResults = await scrapeMatchResults();

    // Step 3: Merge real scores into schedule
    const updatedSchedule = mergeResultsIntoSchedule(existingSchedule, matchResults);

    // Step 4: Save
    fs.writeFileSync(cacheFile, JSON.stringify(updatedSchedule, null, 2));
    console.log(`Successfully updated ${updatedSchedule.length} matches with real scores.`);
    return updatedSchedule;

  } catch (error) {
    console.error('Error scraping schedule:', error.message);
    // Use fallback data
    fs.writeFileSync(path.join(DATA_DIR, 'schedule.json'), JSON.stringify(fallbackSchedule, null, 2));
    console.log('Schedule fallback data saved.');
    return fallbackSchedule;
  }
}

// ─────────────────────────────────────────────
//  Scrape Bracket Page
// ─────────────────────────────────────────────
export async function scrapeBracket() {
  try {
    console.log('Scraping bracket from worldcupmatchtime.com...');
    const response = await axios.get('https://www.worldcupmatchtime.com/en/bracket', {
      headers: HEADERS,
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const bracket = {
      roundOf32: [],
      roundOf16: [],
      quarterFinals: [],
      semiFinals: [],
      finals: {
        thirdPlace: null,
        final: null
      }
    };

    // Note: Since brackets are complex dynamically generated SVG structures or list sections,
    // we parse the text blocks under headers: "Round of 32", "Round of 16", "Quarter-final", etc.
    $('section').each((i, section) => {
      const heading = $(section).find('h2.section-heading').text().trim();
      let roundPrefix = 'r32';
      let startNumber = 73;

      if (heading.includes('Round of 16')) {
        roundPrefix = 'r16';
        startNumber = 89;
      } else if (heading.includes('Quarter-final')) {
        roundPrefix = 'qf';
        startNumber = 97;
      } else if (heading.includes('Semi-final')) {
        roundPrefix = 'sf';
        startNumber = 101;
      } else if (heading.includes('Play-off for third place')) {
        roundPrefix = 'tp';
        startNumber = 103;
      } else if (heading.includes('Final')) {
        roundPrefix = 'fn';
        startNumber = 104;
      }

      const matchesInRound = [];

      $(section).find('a[href*="/match/"]').each((j, matchEl) => {
        const card = $(matchEl);
        const matchNumber = startNumber + j;
        const matchId = `bracket-match-${roundPrefix}-${j + 1}`;

        const teamDivs = card.find('.flex-1');
        if (teamDivs.length < 2) return;

        const team1Name = teamDivs.eq(0).text().trim();
        const team2Name = teamDivs.eq(1).text().trim();

        const timeOrScore = card.find('.flex-shrink-0').text().trim();
        let score1 = null;
        let score2 = null;
        let winner = null;

        if (timeOrScore.includes('-')) {
          const parts = timeOrScore.split('-');
          score1 = parseInt(parts[0]);
          score2 = parseInt(parts[1]);
          if (score1 > score2) winner = team1Name;
          else if (score2 > score1) winner = team2Name;
        }

        matchesInRound.push({
          id: matchId,
          matchNumber,
          team1: team1Name,
          team2: team2Name,
          score1,
          score2,
          winner,
          time: !score1 ? timeOrScore : null
        });
      });

      if (heading.includes('Round of 32')) {
        bracket.roundOf32 = matchesInRound;
      } else if (heading.includes('Round of 16')) {
        bracket.roundOf16 = matchesInRound;
      } else if (heading.includes('Quarter-final')) {
        bracket.quarterFinals = matchesInRound;
      } else if (heading.includes('Semi-final')) {
        bracket.semiFinals = matchesInRound;
      } else if (heading.includes('Play-off for third place')) {
        if (matchesInRound.length > 0) bracket.finals.thirdPlace = matchesInRound[0];
      } else if (heading.includes('Final')) {
        if (matchesInRound.length > 0) bracket.finals.final = matchesInRound[0];
      }
    });

    // Also try to get bracket results from RSC payload
    const bracketResults = extractResultsFromRSC(response.data);
    // TODO: merge bracket results if needed

    // Validate that we got some data, otherwise fail to trigger fallback
    if (bracket.roundOf32.length > 0 || bracket.roundOf16.length > 0) {
      fs.writeFileSync(path.join(DATA_DIR, 'bracket.json'), JSON.stringify(bracket, null, 2));
      console.log('Successfully scraped bracket.');
      return bracket;
    }

    throw new Error('Could not parse bracket items.');
  } catch (error) {
    console.error('Error scraping bracket:', error.message);
    // Use fallback data
    fs.writeFileSync(path.join(DATA_DIR, 'bracket.json'), JSON.stringify(fallbackBracket, null, 2));
    console.log('Bracket fallback data saved.');
    return fallbackBracket;
  }
}

// ─────────────────────────────────────────────
//  Scrape All
// ─────────────────────────────────────────────
export async function scrapeAll() {
  console.log('--- Starting World Cup Scrape Job ---');
  const standings = await scrapeStandings();
  const schedule = await scrapeSchedule();
  const bracket = await scrapeBracket();
  console.log('--- Finished World Cup Scrape Job ---');
  return { standings, schedule, bracket };
}

// Test runner if executed directly
if (process.argv.includes('--test')) {
  scrapeAll().then(() => console.log('Test scrape complete.'));
}
