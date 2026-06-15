import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { parseMatchDateTime } from '../utils/timeZoneHelper';
import { getTranslation } from '../utils/i18n';

function Bracket({ bracket, lang }) {
  const [selectedRoundTab, setSelectedRoundTab] = useState('r32'); // For mobile list view

  if (!bracket) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p>{getTranslation(lang, 'bracketNotAvailable')}</p>
      </div>
    );
  }

  const { roundOf32 = [], roundOf16 = [], quarterFinals = [], semiFinals = [], finals = {} } = bracket;

  const rounds = [
    { key: 'r32', title: getTranslation(lang, 'round32'), data: roundOf32 },
    { key: 'r16', title: getTranslation(lang, 'round16'), data: roundOf16 },
    { key: 'qf', title: getTranslation(lang, 'quarterFinal'), data: quarterFinals },
    { key: 'sf', title: getTranslation(lang, 'semiFinal'), data: semiFinals },
    { 
      key: 'fn', 
      title: getTranslation(lang, 'final'), 
      data: [
        ...(finals.final ? [finals.final] : []),
        ...(finals.thirdPlace ? [finals.thirdPlace] : [])
      ] 
    }
  ];

  // Helper to get WIB date and time string for bracket nodes
  const getBracketWIBDateTimeStr = (match) => {
    const matchTime = parseMatchDateTime(match);
    if (!matchTime) return `${match.date} ${match.time || ''}`;
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jakarta',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return `${formatter.format(matchTime)} WIB`;
  };

  // Helper to render single match node in tree
  const renderMatchNode = (match) => {
    if (!match) return null;
    const isTeam1Winner = match.winner === match.team1 && match.winner !== null;
    const isTeam2Winner = match.winner === match.team2 && match.winner !== null;

    return (
      <div key={match.id} className="bracket-match-node">
        <div className="bracket-meta">
          <span>{getTranslation(lang, 'match')} #{match.matchNumber}</span>
          {match.time && <span>{match.time} Local</span>}
        </div>
        
        {/* Team 1 Row */}
        <div className={`bracket-team-row ${isTeam1Winner ? 'winner' : ''}`}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: isTeam1Winner ? 'var(--color-primary-light)' : 'var(--border-color)' 
            }}></span>
            {match.team1}
          </span>
          {match.score1 !== null && match.score1 !== undefined && (
            <span className="bracket-score">{match.score1}</span>
          )}
        </div>

        {/* Team 2 Row */}
        <div className={`bracket-team-row ${isTeam2Winner ? 'winner' : ''}`}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: isTeam2Winner ? 'var(--color-primary-light)' : 'var(--border-color)' 
            }}></span>
            {match.team2}
          </span>
          {match.score2 !== null && match.score2 !== undefined && (
            <span className="bracket-score">{match.score2}</span>
          )}
        </div>

        {match.date && (
          <div style={{ fontSize: '0.65rem', color: 'var(--color-accent)', fontWeight: 600, borderTop: '1px solid var(--border-color)', paddingTop: '6px', marginTop: '4px' }}>
            ⏰ {getBracketWIBDateTimeStr(match)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Title */}
      <div className="page-title-section">
        <h1 className="page-title">{getTranslation(lang, 'knockoutBracket')}</h1>
        <p className="page-subtitle">{getTranslation(lang, 'roadToFinal')}</p>
      </div>

      {/* Desktop Column Bracket View */}
      <div className="desktop-only-bracket" style={{ display: 'block' }}>
        <div className="bracket-wrapper" style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div className="bracket-container">
            {/* Column 1: Round of 32 */}
            <div className="bracket-column">
              <h3 className="bracket-header">{getTranslation(lang, 'round32')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-around' }}>
                {roundOf32.map(match => renderMatchNode(match))}
              </div>
            </div>

            {/* Column 2: Round of 16 */}
            <div className="bracket-column">
              <h3 className="bracket-header">{getTranslation(lang, 'round16')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-around' }}>
                {roundOf16.map(match => renderMatchNode(match))}
              </div>
            </div>

            {/* Column 3: Quarter-finals */}
            <div className="bracket-column">
              <h3 className="bracket-header">{getTranslation(lang, 'quarterFinal')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-around' }}>
                {quarterFinals.map(match => renderMatchNode(match))}
              </div>
            </div>

            {/* Column 4: Semi-finals */}
            <div className="bracket-column">
              <h3 className="bracket-header">{getTranslation(lang, 'semiFinal')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-around' }}>
                {semiFinals.map(match => renderMatchNode(match))}
              </div>
            </div>

            {/* Column 5: Finals */}
            <div className="bracket-column" style={{ minWidth: '260px' }}>
              <h3 className="bracket-header">{getTranslation(lang, 'final')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', gap: '40px' }}>
                {finals.final && (
                  <div>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-gold)', textAlign: 'center', marginBottom: '4px', fontWeight: 800 }}>🏆 {getTranslation(lang, 'final')}</h4>
                    {renderMatchNode(finals.final)}
                  </div>
                )}
                {finals.thirdPlace && (
                  <div>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '4px', fontWeight: 800 }}>🥉 Third Place Play-off</h4>
                    {renderMatchNode(finals.thirdPlace)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS overrides for desktop/mobile toggle */}
      <style>{`
        .desktop-only-bracket {
          display: block;
        }
        .mobile-only-bracket-tabs {
          display: none;
        }
        @media (max-width: 1024px) {
          .desktop-only-bracket {
            display: none;
          }
          .mobile-only-bracket-tabs {
            display: block;
          }
        }
      `}</style>

      {/* Mobile Tabbed List View */}
      <div className="mobile-only-bracket-tabs">
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '20px'
        }}>
          {rounds.map(r => (
            <button
              key={r.key}
              className={`filter-btn ${selectedRoundTab === r.key ? 'active' : ''}`}
              onClick={() => setSelectedRoundTab(r.key)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {r.title}
            </button>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {rounds.find(r => r.key === selectedRoundTab)?.data.map(match => (
            <div key={match.id} style={{ display: 'flex', justifyContent: 'center' }}>
              {renderMatchNode(match)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Bracket;
