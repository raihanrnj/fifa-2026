import React from 'react';
import { Award, Info } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

function Standings({ standings, lang }) {
  return (
    <div>
      {/* Title */}
      <div className="page-title-section">
        <h1 className="page-title">{getTranslation(lang, 'groupStandings')}</h1>
        <p className="page-subtitle">{getTranslation(lang, 'liveStandingsDesc')}</p>
      </div>

      {/* Legend & Info Card */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        backgroundColor: '#FFFFFF',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={20} style={{ color: 'var(--color-primary-light)' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {getTranslation(lang, 'qualificationKey')}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--color-green-qualified)' }}></span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{getTranslation(lang, 'autoQualify')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--color-gold)' }}></span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{getTranslation(lang, 'bestThird')}</span>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="groups-container">
        {standings.map((groupData, idx) => (
          <div key={idx} className="group-table-card">
            {/* Group Header */}
            <div className="group-header">
              <span>{groupData.group}</span>
              <Award size={18} />
            </div>

            {/* Standings Table */}
            <div className="table-responsive">
              <table className="group-table">
                <thead>
                  <tr>
                    <th className="team-col">{getTranslation(lang, 'team')}</th>
                    <th title="Played">{getTranslation(lang, 'played')}</th>
                    <th title="Won">{getTranslation(lang, 'won')}</th>
                    <th title="Drawn">{getTranslation(lang, 'drawn')}</th>
                    <th title="Lost">{getTranslation(lang, 'lost')}</th>
                    <th title="Goal Difference">{getTranslation(lang, 'gd')}</th>
                    <th title="Points">{getTranslation(lang, 'pts')}</th>
                  </tr>
                </thead>
                <tbody>
                  {groupData.teams.map((team, tIdx) => {
                    // Classify rank indicators
                    let qualifyClass = 'none';
                    if (team.rank === 1 || team.rank === 2) {
                      qualifyClass = 'advance';
                    } else if (team.rank === 3) {
                      qualifyClass = 'contention';
                    }

                    return (
                      <tr key={tIdx}>
                        {/* Team name + flag + rank */}
                        <td className="team-col">
                          <div className={`qualify-indicator ${qualifyClass}`}></div>
                          <span className="rank-num">{team.rank}</span>
                          {team.flag && (
                            <img 
                              src={team.flag} 
                              alt={team.name} 
                              className="team-flag" 
                              style={{ marginLeft: '4px' }}
                            />
                          )}
                          <span className="team-name" style={{ marginLeft: '6px' }}>
                            {team.name}
                          </span>
                        </td>

                        {/* Stats */}
                        <td>{team.played}</td>
                        <td>{team.won}</td>
                        <td>{team.drawn}</td>
                        <td>{team.lost}</td>
                        <td style={{ 
                          fontWeight: 600, 
                          color: team.gd > 0 ? 'var(--color-finished)' : team.gd < 0 ? 'var(--color-live)' : 'inherit'
                        }}>
                          {team.gd > 0 ? `+${team.gd}` : team.gd}
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                          {team.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Standings;
