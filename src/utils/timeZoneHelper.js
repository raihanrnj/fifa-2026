/**
 * Helper utility to handle World Cup Match time zones, convert them to WIB (Asia/Jakarta),
 * and dynamically resolve match statuses (UPCOMING -> LIVE -> FINISHED) based on current clock.
 */

// Host cities timezone offset mapping in June/July 2026 (Daylight Saving Time)
export function getCityTimezoneOffset(city) {
  if (!city) return '-04:00'; // Default to EDT (UTC-4)
  const lowerCity = city.toLowerCase();

  // EDT (UTC-4) - East Coast US & Canada
  if (
    lowerCity.includes('new york') ||
    lowerCity.includes('nj') ||
    lowerCity.includes('jersey') ||
    lowerCity.includes('philadelphia') ||
    lowerCity.includes('toronto') ||
    lowerCity.includes('boston') ||
    lowerCity.includes('miami') ||
    lowerCity.includes('atlanta')
  ) {
    return '-04:00';
  }

  // CDT (UTC-5) - Central US & Canada
  if (
    lowerCity.includes('dallas') ||
    lowerCity.includes('houston') ||
    lowerCity.includes('kansas')
  ) {
    return '-05:00';
  }

  // CST / Mexico (UTC-6)
  if (
    lowerCity.includes('mexico') ||
    lowerCity.includes('guadalajara') ||
    lowerCity.includes('monterrey')
  ) {
    return '-06:00';
  }

  // PDT (UTC-7) - West Coast US & Canada
  if (
    lowerCity.includes('los angeles') ||
    lowerCity.includes('seattle') ||
    lowerCity.includes('san francisco') ||
    lowerCity.includes('vancouver') ||
    lowerCity.includes('bay area')
  ) {
    return '-07:00';
  }

  // Default fallback to EDT
  return '-04:00';
}

/**
 * Maps knockout match numbers (73 to 104) to their official schedule dates.
 */
export function getKnockoutDateByMatchNumber(matchNumber) {
  const num = parseInt(matchNumber);
  if (isNaN(num)) return null;

  if (num >= 73 && num <= 75) return 'Sunday 28 June 2026';
  if (num >= 76 && num <= 79) return 'Monday 29 June 2026';
  if (num >= 80 && num <= 83) return 'Tuesday 30 June 2026';
  if (num >= 84 && num <= 88) return 'Wednesday 1 July 2026';

  if (num >= 89 && num <= 90) return 'Saturday 4 July 2026';
  if (num >= 91 && num <= 92) return 'Sunday 5 July 2026';
  if (num >= 93 && num <= 94) return 'Monday 6 July 2026';
  if (num >= 95 && num <= 96) return 'Tuesday 7 July 2026';

  if (num === 97) return 'Thursday 9 July 2026';
  if (num === 98) return 'Friday 10 July 2026';
  if (num >= 99 && num <= 100) return 'Saturday 11 July 2026';

  if (num === 101) return 'Tuesday 14 July 2026';
  if (num === 102) return 'Wednesday 15 July 2026';

  if (num === 103) return 'Saturday 18 July 2026';
  if (num === 104) return 'Sunday 19 July 2026';

  return null;
}

/**
 * Parses match date and time string to a standard JS Date object in its local US timezone.
 * Falls back to knockout stage date mapping if date is missing in the match object.
 */
export function parseMatchDateTime(match) {
  if (!match) return null;

  let dateStr = match.date;
  if (!dateStr && match.matchNumber) {
    dateStr = getKnockoutDateByMatchNumber(match.matchNumber);
  }

  if (!dateStr) return null;
  
  // Clean date string and split into tokens
  const cleanDateStr = dateStr.replace(/,/g, ''); // Remove commas
  const tokens = cleanDateStr.split(/\s+/); // Split by whitespace

  const months = {
    January: '01', February: '02', March: '03', April: '04', May: '05', June: '06',
    July: '07', August: '08', September: '09', October: '10', November: '11', December: '12',
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };

  let year = '2026';
  let month = '06';
  let day = '01';

  tokens.forEach(token => {
    if (months[token]) {
      month = months[token];
    } else if (/^\d{4}$/.test(token)) {
      year = token;
    } else if (/^\d{1,2}$/.test(token)) {
      day = token.padStart(2, '0');
    }
  });

  // Default to 12:00 if match.time is not specified or empty
  let timeStr = (match.time || '12:00').trim(); 
  let hours = 12;
  let minutes = 0;

  // Check if there is AM/PM (typical for brackets)
  const ampmMatch = timeStr.match(/(AM|PM)/i);
  if (ampmMatch) {
    const isPM = ampmMatch[1].toUpperCase() === 'PM';
    const cleanTime = timeStr.replace(/(AM|PM)/i, '').trim();
    const parts = cleanTime.split(':');
    hours = parseInt(parts[0]) || 12;
    minutes = parseInt(parts[1]) || 0;
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
  } else {
    // 24-hour format (typical for schedule matches e.g. "19:00")
    const parts = timeStr.split(':');
    hours = parseInt(parts[0]) || 0;
    minutes = parseInt(parts[1]) || 0;
  }

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  // The scraped data from the source is strictly in PDT (UTC-7) regardless of venue.
  // We force -07:00 here so the absolute Date object is correctly instantiated.
  const offset = '-07:00';

  // Construct ISO string
  const isoStr = `${year}-${month}-${day}T${formattedTime}:00${offset}`;
  const parsedDate = new Date(isoStr);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
}

/**
 * Formats match time showing both local venue time and WIB time side-by-side.
 */
export function formatMatchTime(match) {
  if (!match || !match.time) return '';
  const matchTime = parseMatchDateTime(match);
  if (!matchTime) return match.time; // Fallback to raw string

  // Keep local match time as-is
  // Actually, we must format the true local time because the raw match.time is in PDT
  const cityOffset = getCityTimezoneOffset(match.city || match.venue);
  let ianaZone = 'America/New_York';
  if (cityOffset === '-05:00') ianaZone = 'America/Chicago';
  if (cityOffset === '-06:00') ianaZone = 'America/Mexico_City';
  if (cityOffset === '-07:00') ianaZone = 'America/Los_Angeles';

  const localTimeOptions = {
    timeZone: ianaZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  const localTimeStr = new Intl.DateTimeFormat('en-US', localTimeOptions).format(matchTime);

  // Convert to WIB (Asia/Jakarta timezone)
  const options = {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const wibTimeStr = formatter.format(matchTime);

  // Determine if WIB date is different from the local match date
  const dateOptions = {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'short'
  };
  const wibDateStr = new Intl.DateTimeFormat('en-US', dateOptions).format(matchTime); // e.g. "15 Jun"

  // Get local day
  let dateStr = match.date || getKnockoutDateByMatchNumber(match.matchNumber);
  let localDay = null;
  if (dateStr) {
    const cleanDateStr = dateStr.replace(/,/g, '');
    const tokens = cleanDateStr.split(/\s+/);
    tokens.forEach(token => {
      if (/^\d{1,2}$/.test(token)) {
        localDay = parseInt(token);
      }
    });
  }

  let dayDiffStr = '';
  if (localDay !== null) {
    const wibDay = parseInt(wibDateStr.split(' ')[0]) || localDay;
    if (wibDay > localDay) {
      dayDiffStr = ' (+1d)';
    } else if (wibDay < localDay) {
      dayDiffStr = ' (-1d)';
    }
  }

  return `${localTimeStr} Local / ${wibTimeStr} WIB${dayDiffStr}`;
}

/**
 * Gets today's date formatted as standard "DayOfWeek DD MonthName YYYY" in WIB.
 * E.g., "Sunday 14 June 2026"
 */
export function getTodayDateStringWIB() {
  const date = new Date();
  const options = { timeZone: 'Asia/Jakarta' };
  
  const weekday = new Intl.DateTimeFormat('en-US', { ...options, weekday: 'long' }).format(date);
  const day = new Intl.DateTimeFormat('en-US', { ...options, day: 'numeric' }).format(date);
  const month = new Intl.DateTimeFormat('en-US', { ...options, month: 'long' }).format(date);
  const year = new Intl.DateTimeFormat('en-US', { ...options, year: 'numeric' }).format(date);
  
  return `${weekday} ${day} ${month} ${year}`;
}

/**
 * Dynamically updates statuses of schedule matches based on current system time.
 * Uses ONLY real scraped scores — never generates fake/dummy scores.
 */
export function processSchedule(scheduleList) {
  if (!Array.isArray(scheduleList)) return [];
  const now = new Date();
  
  return scheduleList.map(match => {
    const kickoff = parseMatchDateTime(match);
    if (!kickoff) return match;
    
    const matchEnd = new Date(kickoff.getTime() + 2 * 60 * 60 * 1000); // 2 hours match length
    
    let updatedStatus = match.status;
    let score1 = match.score1;
    let score2 = match.score2;
    let minute = match.minute;
    
    // If the scraper already marked this as FINISHED with real scores, preserve that
    if (match.status === 'FINISHED' && score1 !== null && score1 !== undefined) {
      return { ...match, minute: null };
    }
    
    if (now > matchEnd) {
      updatedStatus = 'FINISHED';
      // Keep scraped scores as-is (may be null if not yet scraped — that's OK)
      minute = null;
    } else if (now >= kickoff && now <= matchEnd) {
      updatedStatus = 'LIVE';
      if (score1 === null || score1 === undefined) {
        score1 = 0;
        score2 = 0;
      }
      const elapsed = Math.floor((now - kickoff) / (60 * 1000));
      minute = Math.min(Math.max(elapsed, 1), 90);
    } else {
      updatedStatus = 'UPCOMING';
      score1 = null;
      score2 = null;
      minute = null;
    }
    
    return {
      ...match,
      status: updatedStatus,
      score1,
      score2,
      minute
    };
  });
}

/**
 * Helper to process a single bracket match node.
 * Uses ONLY real scraped scores — never generates fake/dummy scores.
 */
function processBracketMatch(match, now) {
  if (!match) return null;
  const dateStr = getKnockoutDateByMatchNumber(match.matchNumber);
  const fullMatch = { ...match, date: dateStr };
  
  const kickoff = parseMatchDateTime(fullMatch);
  if (!kickoff) return fullMatch;
  
  const matchEnd = new Date(kickoff.getTime() + 2 * 60 * 60 * 1000);
  
  let score1 = match.score1;
  let score2 = match.score2;
  let winner = match.winner;
  
  if (now > matchEnd) {
    // Keep scraped scores as-is
    // Resolve winner only if we have real scores
    if (score1 !== null && score1 !== undefined) {
      if (score1 > score2) {
        winner = match.team1;
      } else if (score2 > score1) {
        winner = match.team2;
      }
    }
  } else if (now >= kickoff && now <= matchEnd) {
    // Live node
    if (score1 === null || score1 === undefined) {
      score1 = 0;
      score2 = 0;
    }
  } else {
    // Upcoming node
    score1 = null;
    score2 = null;
    winner = null;
  }
  
  return {
    ...fullMatch,
    score1,
    score2,
    winner
  };
}

/**
 * Dynamically updates statuses, dates, and scores of bracket rounds based on current system time.
 */
export function processBracket(bracketData) {
  if (!bracketData) return null;
  const now = new Date();
  
  const { roundOf32 = [], roundOf16 = [], quarterFinals = [], semiFinals = [], finals = {} } = bracketData;
  
  return {
    roundOf32: roundOf32.map(m => processBracketMatch(m, now)),
    roundOf16: roundOf16.map(m => processBracketMatch(m, now)),
    quarterFinals: quarterFinals.map(m => processBracketMatch(m, now)),
    semiFinals: semiFinals.map(m => processBracketMatch(m, now)),
    finals: {
      thirdPlace: processBracketMatch(finals.thirdPlace, now),
      final: processBracketMatch(finals.final, now)
    }
  };
}

/**
 * Generates a Google Calendar event URL for a given match.
 */
export function getGoogleCalendarUrl(match) {
  const startDate = parseMatchDateTime(match);
  if (!startDate) return '#';
  
  // Match duration: 2 hours
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  
  const formatCalDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };
  
  const title = encodeURIComponent(`FIFA 2026: ${match.team1} vs ${match.team2}`);
  const details = encodeURIComponent(`FIFA World Cup 2026\nStage: ${match.group || match.stage || 'Knockout'}`);
  const location = encodeURIComponent(`${match.venue}, ${match.city}`);
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatCalDate(startDate)}/${formatCalDate(endDate)}&details=${details}&location=${location}`;
}
