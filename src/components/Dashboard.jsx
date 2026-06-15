import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertCircle, Clock } from 'lucide-react';
import { parseMatchDateTime, formatMatchTime, getTodayDateStringWIB } from '../utils/timeZoneHelper';
import { getTranslation } from '../utils/i18n';

function Dashboard({ schedule, standings, setActiveTab, lang }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextMatch, setNextMatch] = useState(null);

  // Find next upcoming match and calculate countdown
  useEffect(() => {
    const now = new Date();
    // Parse matches and find upcoming ones sorted by actual kickoff time
    const parsedUpcoming = schedule
      .map(m => ({ ...m, parsedKickoff: parseMatchDateTime(m) }))
      .filter(m => m.status === 'UPCOMING' && m.parsedKickoff !== null)
      .sort((a, b) => a.parsedKickoff - b.parsedKickoff);
    
    // Find the closest upcoming match that is in the future
    let targetMatch = parsedUpcoming.find(m => m.parsedKickoff > now);
    
    // If none are in the future, fallback to the first upcoming match
    if (!targetMatch && parsedUpcoming.length > 0) {
      targetMatch = parsedUpcoming[0];
    }
    
    if (targetMatch) {
      setNextMatch(targetMatch);
      
      const updateCountdown = () => {
        const currentTime = new Date();
        const diff = targetMatch.parsedKickoff - currentTime;
        
        if (diff <= 0) {
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setCountdown({ days, hours, minutes, seconds });
        }
      };
      
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [schedule]);

  // Compute tournament stats
  const finishedMatches = schedule.filter(m => m.status === 'FINISHED');
  const liveMatches = schedule.filter(m => m.status === 'LIVE');
  const totalMatches = 80;
  const matchesPlayed = finishedMatches.length + liveMatches.length;
  
  const totalGoals = schedule.reduce((sum, m) => {
    if (m.score1 !== undefined && m.score1 !== null) {
      return sum + (parseInt(m.score1) || 0) + (parseInt(m.score2) || 0);
    }
    return sum;
  }, 0);

  // Filter today's matches dynamically based on WIB date or if they are live
  const todayStr = getTodayDateStringWIB();
  const todayMatches = schedule.filter(m => {
    if (m.status === 'LIVE') return true;
    if (m.date.includes(todayStr)) return true;
    
    const matchTime = parseMatchDateTime(m);
    if (!matchTime) return false;
    
    const matchWIBDateStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(matchTime).replace(/,/g, '');
    
    return matchWIBDateStr === todayStr;
  });

  return (
    <div>
      {/* Title Section */}
      <div className="page-title-section">
        <h1 className="page-title">{getTranslation(lang, 'dashboard')}</h1>
        <p className="page-subtitle">{getTranslation(lang, 'liveStandingsDesc')}</p>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-label">{getTranslation(lang, 'totalMatches')}</span>
          <span className="stat-value">{totalMatches}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">{getTranslation(lang, 'matchesPlayed')}</span>
          <span className="stat-value">{matchesPlayed} / {totalMatches}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">{getTranslation(lang, 'goalsScored')}</span>
          <span className="stat-value">{totalGoals}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">{getTranslation(lang, 'totalGroups')}</span>
          <span className="stat-value">{getTranslation(lang, '12Groups')}</span>
        </div>
      </div>

      {/* Countdown / Next Match Banner */}
      {nextMatch && (
        <div className="countdown-banner">
          <div>
            <div className="countdown-title">{getTranslation(lang, 'upcomingMatch')}</div>
            <div className="countdown-subtitle">
              {nextMatch.team1} vs {nextMatch.team2}
            </div>
            <div style={{ fontSize: '0.9rem', marginTop: '6px', fontWeight: '500', opacity: 0.9 }}>
              🕒 {formatMatchTime(nextMatch)}
            </div>
            <div style={{ fontSize: '0.85rem', marginTop: '6px', opacity: 0.9 }}>
              {getTranslation(lang, 'venue')}: {nextMatch.venue}, {nextMatch.city}
            </div>
          </div>
          <div className="timer-box">
            <div className="time-segment">
              <span className="time-val">{String(countdown.days).padStart(2, '0')}</span>
              <span className="time-lbl">{getTranslation(lang, 'days')}</span>
            </div>
            <div className="time-segment">
              <span className="time-val">{String(countdown.hours).padStart(2, '0')}</span>
              <span className="time-lbl">{getTranslation(lang, 'hours')}</span>
            </div>
            <div className="time-segment">
              <span className="time-val">{String(countdown.minutes).padStart(2, '0')}</span>
              <span className="time-lbl">{getTranslation(lang, 'mins')}</span>
            </div>
            <div className="time-segment">
              <span className="time-val">{String(countdown.seconds).padStart(2, '0')}</span>
              <span className="time-lbl">{getTranslation(lang, 'secs')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Live & Today's Matches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Live matches first */}
          {liveMatches.length > 0 && (
            <div className="card" style={{ borderColor: 'var(--color-live)', boxShadow: '0 0 15px rgba(239, 68, 68, 0.15)' }}>
              <div className="card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-live)' }}>
                  <span className="status-badge live" style={{ width: '12px', height: '12px', minWidth: 'auto', borderRadius: '50%', padding: 0 }}></span>
                  {getTranslation(lang, 'matchesLiveNow')}
                </span>
              </div>
              <div className="match-card-list">
                {liveMatches.map(match => (
                  <div key={match.id} className="match-row" style={{ backgroundColor: 'var(--color-live-light)30', borderColor: 'var(--color-live)30' }}>
                    <div className="match-info-meta">
                      <span className="match-stage" style={{ color: 'var(--color-live)' }}>{getTranslation(lang, 'minute')} {match.minute}</span>
                      <span className="match-venue">{match.city}</span>
                    </div>
                    <div className="match-teams-score">
                      <div className="team-container left">
                        <span className="team-name">{match.team1}</span>
                        {match.team1Flag && <img src={match.team1Flag} alt={match.team1} className="team-flag" />}
                      </div>
                      <div className="score-display live-score">
                        {match.score1 ?? 0} - {match.score2 ?? 0}
                      </div>
                      <div className="team-container right">
                        {match.team2Flag && <img src={match.team2Flag} alt={match.team2} className="team-flag" />}
                        <span className="team-name">{match.team2}</span>
                      </div>
                    </div>
                    <span className="status-badge live">{getTranslation(lang, 'live')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's schedule */}
          <div className="card">
            <div className="card-title">
              <span>{getTranslation(lang, 'todayMatches')}</span>
              <button onClick={() => setActiveTab('schedule')} style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {getTranslation(lang, 'fullSchedule')} <ArrowRight size={14} />
              </button>
            </div>
            {todayMatches.length > 0 ? (
              <div className="match-card-list">
                {todayMatches.map(match => (
                  <div key={match.id} className="match-row">
                    <div className="match-info-meta">
                      <span className="match-stage">{match.group || match.stage}</span>
                      <span className="match-venue">{formatMatchTime(match)}</span>
                    </div>
                    <div className="match-teams-score">
                      <div className="team-container left">
                        <span className="team-name">{match.team1}</span>
                        {match.team1Flag && <img src={match.team1Flag} alt={match.team1} className="team-flag" />}
                      </div>
                      <div className={`score-display ${match.status === 'LIVE' ? 'live-score' : ''}`}>
                        {match.status === 'UPCOMING' ? 'vs' : `${match.score1 ?? '-'} - ${match.score2 ?? '-'}`}
                      </div>
                      <div className="team-container right">
                        {match.team2Flag && <img src={match.team2Flag} alt={match.team2} className="team-flag" />}
                        <span className="team-name">{match.team2}</span>
                      </div>
                    </div>
                    <span className={`status-badge ${match.status.toLowerCase()}`}>
                      {match.status === 'LIVE' ? getTranslation(lang, 'live') : match.status === 'FINISHED' ? getTranslation(lang, 'finished') : getTranslation(lang, 'scheduled')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px 0' }}>
                {getTranslation(lang, 'noMatchesToday')}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Standings Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div className="card-title" style={{ marginBottom: '16px' }}>
              <span>{getTranslation(lang, 'standingsPreview')}</span>
              <button onClick={() => setActiveTab('standings')} style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {getTranslation(lang, 'allGroups')} <ArrowRight size={14} />
              </button>
            </div>
            {standings.slice(0, 2).map((groupData, idx) => (
              <div key={idx} className="group-table-card" style={{ marginBottom: '16px', boxShadow: 'none', border: '1px solid var(--border-color)' }}>
                <div className="group-header" style={{ padding: '10px 16px', fontSize: '0.95rem' }}>
                  <span>{groupData.group}</span>
                </div>
                <div className="table-responsive">
                  <table className="group-table">
                    <thead>
                      <tr>
                        <th className="team-col">{getTranslation(lang, 'team')}</th>
                        <th>{getTranslation(lang, 'played')}</th>
                        <th>{getTranslation(lang, 'gd')}</th>
                        <th>{getTranslation(lang, 'pts')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupData.teams.map((team, tIdx) => (
                        <tr key={tIdx}>
                          <td className="team-col" style={{ padding: '8px 10px', fontSize: '0.85rem' }}>
                            <span className="rank-num" style={{ marginRight: '6px' }}>{team.rank}</span>
                            {team.flag && <img src={team.flag} alt={team.name} className="team-flag" style={{ width: '16px', height: '16px' }} />}
                            <span className="team-name" style={{ fontSize: '0.85rem' }}>{team.name}</span>
                          </td>
                          <td style={{ padding: '8px 10px', fontSize: '0.85rem' }}>{team.played}</td>
                          <td style={{ padding: '8px 10px', fontSize: '0.85rem' }}>{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                          <td style={{ padding: '8px 10px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{team.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Guide Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--color-accent-light) 0%, rgba(255,255,255,1) 100%)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--color-primary)' }}>Tournament Format</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              The FIFA World Cup 2026 features 48 teams divided into 12 groups (A–L).
            </p>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Top 2 teams from each group automatically qualify.</li>
              <li>The 8 best third-placed teams advance to the Round of 32.</li>
              <li>Knockout stages follow a single-elimination bracket format.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
