import React, { useState } from 'react';
import { Search, MapPin, Calendar, Award, CalendarPlus } from 'lucide-react';
import { parseMatchDateTime, formatMatchTime, getTodayDateStringWIB, getGoogleCalendarUrl } from '../utils/timeZoneHelper';
import { getTranslation } from '../utils/i18n';

function Schedule({ schedule, lang }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'today' | 'group' | 'knockout'
  const [searchQuery, setSearchQuery] = useState('');

  // Filter matches based on selection and search query
  const filteredMatches = schedule.filter(match => {
    // 1. Tab Filters
    if (filter === 'today') {
      const todayStr = getTodayDateStringWIB();
      const isToday = match.date.includes(todayStr) || match.status === 'LIVE' || (() => {
        const matchTime = parseMatchDateTime(match);
        if (!matchTime) return false;
        const matchWIBDateStr = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Jakarta',
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(matchTime).replace(/,/g, '');
        return matchWIBDateStr === todayStr;
      })();
      if (!isToday) return false;
    } else if (filter === 'group') {
      const isGroup = match.group && match.group.startsWith('Group');
      if (!isGroup) return false;
    } else if (filter === 'knockout') {
      const isKnockout = !match.group || !match.group.startsWith('Group');
      if (!isKnockout) return false;
    }

    // 2. Search query filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const team1Match = match.team1.toLowerCase().includes(query);
      const team2Match = match.team2.toLowerCase().includes(query);
      const venueMatch = match.venue.toLowerCase().includes(query);
      const cityMatch = match.city.toLowerCase().includes(query);
      return team1Match || team2Match || venueMatch || cityMatch;
    }

    return true;
  });

  // Group matches by date
  const matchesByDate = {};
  filteredMatches.forEach(match => {
    if (!matchesByDate[match.date]) {
      matchesByDate[match.date] = [];
    }
    matchesByDate[match.date].push(match);
  });

  return (
    <div>
      {/* Title */}
      <div className="page-title-section">
        <h1 className="page-title">{getTranslation(lang, 'matchSchedule')}</h1>
        <p className="page-subtitle">{getTranslation(lang, 'browseMatches')}</p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
        backgroundColor: '#FFFFFF',
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid var(--border-color)'
      }}>
        <div className="schedule-filters" style={{ margin: 0 }}>
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {getTranslation(lang, 'allMatches')}
          </button>
          <button 
            className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
            onClick={() => setFilter('today')}
          >
            {getTranslation(lang, 'today')}
          </button>
          <button 
            className={`filter-btn ${filter === 'group' ? 'active' : ''}`}
            onClick={() => setFilter('group')}
          >
            {getTranslation(lang, 'groupStage')}
          </button>
          <button 
            className={`filter-btn ${filter === 'knockout' ? 'active' : ''}`}
            onClick={() => setFilter('knockout')}
          >
            {getTranslation(lang, 'knockoutStage')}
          </button>
        </div>

        {/* Search Input */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flex: '0 1 300px',
          width: '100%'
        }}>
          <input 
            type="text" 
            placeholder={getTranslation(lang, 'searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              outline: 'none',
              fontSize: '0.9rem',
              transition: 'var(--transition)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary-light)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
          <Search size={18} style={{
            position: 'absolute',
            left: '14px',
            color: 'var(--text-muted)'
          }} />
        </div>
      </div>

      {/* Matches Listing */}
      {Object.keys(matchesByDate).length > 0 ? (
        Object.keys(matchesByDate).map(date => (
          <div key={date} style={{ marginBottom: '32px' }}>
            {/* Date Header */}
            <h2 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderLeft: '4px solid var(--color-accent)',
              paddingLeft: '12px'
            }}>
              <Calendar size={18} />
              {date}
            </h2>

            {/* Matches for this date */}
            <div className="match-card-list">
              {matchesByDate[date].map(match => (
                <div key={match.id} className="match-row">
                  {/* Meta data */}
                  <div className="match-info-meta">
                    <span className="match-stage" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Award size={12} />
                      {match.group || match.stage}
                    </span>
                    <span className="match-venue" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <MapPin size={12} />
                      {match.venue}, {match.city}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      ⏰ {formatMatchTime(match)}
                    </span>
                  </div>

                  {/* Team details & scores */}
                  <div className="match-teams-score">
                    <div className="team-container left">
                      <span className="team-name">{match.team1}</span>
                      {match.team1Flag && <img src={match.team1Flag} alt={match.team1} className="team-flag" />}
                    </div>

                    <div className={`score-display ${match.status === 'LIVE' ? 'live-score' : ''}`}>
                      {match.status === 'UPCOMING' ? (
                        <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {match.time}
                        </span>
                      ) : (
                        `${match.score1 ?? '-'} - ${match.score2 ?? '-'}`
                      )}
                    </div>

                    <div className="team-container right">
                      {match.team2Flag && <img src={match.team2Flag} alt={match.team2} className="team-flag" />}
                      <span className="team-name">{match.team2}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span className={`status-badge ${match.status.toLowerCase()}`}>
                      {match.status === 'LIVE' ? `${getTranslation(lang, 'live')} (${match.minute || '75\''})` : match.status === 'FINISHED' ? getTranslation(lang, 'finished') : getTranslation(lang, 'scheduled')}
                    </span>
                    {match.status === 'UPCOMING' && (
                      <a 
                        href={getGoogleCalendarUrl(match)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#FFFFFF',
                          backgroundColor: '#4285F4',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          transition: 'background-color 0.2s',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3367D6'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4285F4'}
                        title={getTranslation(lang, 'addToCalendar')}
                      >
                        <CalendarPlus size={14} />
                        {getTranslation(lang, 'addToCalendar')}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>{getTranslation(lang, 'noMatchesFound')}</p>
          <p style={{ fontSize: '0.9rem' }}>{getTranslation(lang, 'tryAdjustingFilters')}</p>
        </div>
      )}
    </div>
  );
}

export default Schedule;
