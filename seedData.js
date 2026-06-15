// Seed and Fallback Data for the 2026 FIFA World Cup
// Used when scraping is unavailable or during initial load.

export const fallbackStandings = [
  {
    group: "Group A",
    teams: [
      { name: "Mexico", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/MEX", played: 1, won: 1, drawn: 0, lost: 0, gd: 2, points: 3 },
      { name: "Korea Republic", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/KOR", played: 1, won: 1, drawn: 0, lost: 0, gd: 1, points: 3 },
      { name: "Czechia", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/CZE", played: 1, won: 0, drawn: 0, lost: 1, gd: -1, points: 0 },
      { name: "South Africa", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/RSA", played: 1, won: 0, drawn: 0, lost: 1, gd: -2, points: 0 }
    ]
  },
  {
    group: "Group B",
    teams: [
      { name: "Bosnia and Herzegovina", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/BIH", played: 1, won: 0, drawn: 1, lost: 0, gd: 0, points: 1 },
      { name: "Canada", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/CAN", played: 1, won: 0, drawn: 1, lost: 0, gd: 0, points: 1 },
      { name: "Qatar", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/QAT", played: 1, won: 0, drawn: 1, lost: 0, gd: 0, points: 1 },
      { name: "Switzerland", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/SUI", played: 1, won: 0, drawn: 1, lost: 0, gd: 0, points: 1 }
    ]
  },
  {
    group: "Group C",
    teams: [
      { name: "Scotland", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/SCO", played: 1, won: 1, drawn: 0, lost: 0, gd: 1, points: 3 },
      { name: "Brazil", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/BRA", played: 1, won: 0, drawn: 1, lost: 0, gd: 0, points: 1 },
      { name: "Morocco", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/MAR", played: 1, won: 0, drawn: 1, lost: 0, gd: 0, points: 1 },
      { name: "Uruguay", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/URU", played: 1, won: 0, drawn: 0, lost: 1, gd: -1, points: 0 }
    ]
  },
  {
    group: "Group D",
    teams: [
      { name: "United States", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/USA", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Japan", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/JPN", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Ecuador", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/ECU", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Poland", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/POL", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 }
    ]
  },
  {
    group: "Group E",
    teams: [
      { name: "Argentina", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/ARG", played: 1, won: 1, drawn: 0, lost: 0, gd: 1, points: 3 },
      { name: "Croatia", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/CRO", played: 1, won: 0, drawn: 0, lost: 1, gd: -1, points: 0 },
      { name: "Saudi Arabia", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/KSA", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Ukraine", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/UKR", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 }
    ]
  },
  {
    group: "Group F",
    teams: [
      { name: "France", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/FRA", played: 1, won: 0, drawn: 1, lost: 0, gd: 0, points: 1 },
      { name: "Colombia", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/COL", played: 1, won: 0, drawn: 1, lost: 0, gd: 0, points: 1 },
      { name: "Australia", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/AUS", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Wales", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/WAL", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 }
    ]
  },
  {
    group: "Group G",
    teams: [
      { name: "Germany", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/GER", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Japan", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/JPN", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Costa Rica", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/CRC", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Cameroon", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/CMR", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 }
    ]
  },
  {
    group: "Group H",
    teams: [
      { name: "Spain", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/ESP", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Serbia", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/SRB", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "New Zealand", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/NZL", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Chile", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/CHI", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 }
    ]
  },
  {
    group: "Group I",
    teams: [
      { name: "Portugal", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/POR", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Uruguay", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/URU", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Ghana", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/GHA", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Slovakia", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/SVK", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 }
    ]
  },
  {
    group: "Group J",
    teams: [
      { name: "Belgium", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/BEL", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Italy", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/ITA", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Peru", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/PER", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Egypt", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/EGY", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 }
    ]
  },
  {
    group: "Group K",
    teams: [
      { name: "Netherlands", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/NED", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Sweden", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/SWE", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Canada", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/CAN", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Tunisia", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/TUN", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 }
    ]
  },
  {
    group: "Group L",
    teams: [
      { name: "England", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/ENG", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Denmark", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/DEN", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Algeria", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/ALG", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 },
      { name: "Panama", flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/PAN", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 }
    ]
  }
];

export const fallbackSchedule = [
  // Thursday 11 June 2026
  {
    id: "match-1",
    date: "Thursday 11 June 2026",
    time: "12:00",
    team1: "Mexico",
    team1Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/MEX",
    team2: "South Africa",
    team2Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/RSA",
    venue: "Mexico City Stadium",
    city: "Mexico City",
    group: "Group A",
    stage: "First Stage",
    status: "UPCOMING"
  },
  {
    id: "match-2",
    date: "Thursday 11 June 2026",
    time: "19:00",
    team1: "Korea Republic",
    team1Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/KOR",
    team2: "Czechia",
    team2Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/CZE",
    venue: "Guadalajara Stadium",
    city: "Guadalajara",
    group: "Group A",
    stage: "First Stage",
    status: "UPCOMING"
  },
  // Friday 12 June 2026
  {
    id: "match-3",
    date: "Friday 12 June 2026",
    time: "12:00",
    team1: "Canada",
    team1Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/CAN",
    team2: "Bosnia and Herzegovina",
    team2Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/BIH",
    venue: "Toronto Stadium",
    city: "Toronto",
    group: "Group B",
    stage: "First Stage",
    status: "UPCOMING"
  },
  {
    id: "match-4",
    date: "Friday 12 June 2026",
    time: "18:00",
    team1: "USA",
    team1Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/USA",
    team2: "Paraguay",
    team2Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/PAR",
    venue: "Los Angeles Stadium",
    city: "Los Angeles",
    group: "Group D",
    stage: "First Stage",
    status: "UPCOMING"
  },
  // Sunday 14 June 2026 (Today)
  {
    id: "match-9",
    date: "Sunday 14 June 2026",
    time: "10:00",
    team1: "Germany",
    team1Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/GER",
    team2: "Curaçao",
    team2Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/CUW",
    venue: "Houston Stadium",
    city: "Houston",
    group: "Group E",
    stage: "First Stage",
    status: "UPCOMING"
  },
  {
    id: "match-10",
    date: "Sunday 14 June 2026",
    time: "13:00",
    team1: "Netherlands",
    team1Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/NED",
    team2: "Japan",
    team2Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/JPN",
    venue: "Dallas Stadium",
    city: "Dallas",
    group: "Group F",
    stage: "First Stage",
    status: "UPCOMING"
  },
  {
    id: "match-11",
    date: "Sunday 14 June 2026",
    time: "16:00",
    team1: "Côte d'Ivoire",
    team1Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/CIV",
    team2: "Ecuador",
    team2Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/ECU",
    venue: "Philadelphia Stadium",
    city: "Philadelphia",
    group: "Group E",
    stage: "First Stage",
    status: "UPCOMING"
  },
  {
    id: "match-12",
    date: "Sunday 14 June 2026",
    time: "19:00",
    team1: "Sweden",
    team1Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/SWE",
    team2: "Tunisia",
    team2Flag: "https://api.fifa.com/api/v3/picture/flags-sq-1/TUN",
    venue: "Monterrey Stadium",
    city: "Monterrey",
    group: "Group F",
    stage: "First Stage",
    status: "UPCOMING"
  }
];

export const fallbackBracket = {
  roundOf32: [
    { id: "r32-1", matchNumber: 73, date: "June 28, 2026", time: "12:00 PM", team1: "2A", team2: "2B", score1: null, score2: null, winner: null },
    { id: "r32-2", matchNumber: 74, date: "June 29, 2026", time: "10:00 AM", team1: "1C", team2: "2F", score1: null, score2: null, winner: null },
    { id: "r32-3", matchNumber: 75, date: "June 29, 2026", time: "1:30 PM", team1: "1E", team2: "3ABCDF", score1: null, score2: null, winner: null },
    { id: "r32-4", matchNumber: 76, date: "June 29, 2026", time: "6:00 PM", team1: "1F", team2: "2C", score1: null, score2: null, winner: null },
    { id: "r32-5", matchNumber: 77, date: "June 30, 2026", time: "10:00 AM", team1: "2E", team2: "2I", score1: null, score2: null, winner: null },
    { id: "r32-6", matchNumber: 78, date: "June 30, 2026", time: "2:00 PM", team1: "1I", team2: "3CDFGH", score1: null, score2: null, winner: null },
    { id: "r32-7", matchNumber: 79, date: "June 30, 2026", time: "6:00 PM", team1: "1A", team2: "3CEFHI", score1: null, score2: null, winner: null },
    { id: "r32-8", matchNumber: 80, date: "July 1, 2026", time: "9:00 AM", team1: "1L", team2: "3EHIJK", score1: null, score2: null, winner: null }
  ],
  roundOf16: [
    { id: "r16-1", matchNumber: 89, date: "July 4, 2026", time: "10:00 AM", team1: "W73", team2: "W75", score1: null, score2: null, winner: null },
    { id: "r16-2", matchNumber: 90, date: "July 4, 2026", time: "2:00 PM", team1: "W74", team2: "W77", score1: null, score2: null, winner: null },
    { id: "r16-3", matchNumber: 91, date: "July 5, 2026", time: "1:00 PM", team1: "W76", team2: "W78", score1: null, score2: null, winner: null },
    { id: "r16-4", matchNumber: 92, date: "July 5, 2026", time: "5:00 PM", team1: "W79", team2: "W80", score1: null, score2: null, winner: null }
  ],
  quarterFinals: [
    { id: "qf-1", matchNumber: 97, date: "July 9, 2026", time: "1:00 PM", team1: "W89", team2: "W90", score1: null, score2: null, winner: null },
    { id: "qf-2", matchNumber: 98, date: "July 10, 2026", time: "12:00 PM", team1: "W91", team2: "W92", score1: null, score2: null, winner: null }
  ],
  semiFinals: [
    { id: "sf-1", matchNumber: 101, date: "July 14, 2026", time: "12:00 PM", team1: "W97", team2: "W98", score1: null, score2: null, winner: null }
  ],
  finals: {
    thirdPlace: { id: "tp", matchNumber: 103, date: "July 18, 2026", time: "2:00 PM", team1: "RU101", team2: "RU102", score1: null, score2: null, winner: null },
    final: { id: "fn", matchNumber: 104, date: "July 19, 2026", time: "12:00 PM", team1: "W101", team2: "W102", score1: null, score2: null, winner: null }
  }
};
