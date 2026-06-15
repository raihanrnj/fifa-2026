import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, BarChart2, GitFork, RefreshCw, Trophy, Clock } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';
import Standings from './components/Standings';
import Bracket from './components/Bracket';
import { processSchedule, processBracket } from './utils/timeZoneHelper';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [schedule, setSchedule] = useState([]);
  const [standings, setStandings] = useState([]);
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch all tournament data from backend
  const fetchData = async (forceScrape = false) => {
    try {
      if (forceScrape) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // If forcing, trigger backend scrape first
      if (forceScrape) {
        await fetch('/api/scrape', { method: 'POST' });
      }

      const [scheduleRes, standingsRes, bracketRes] = await Promise.all([
        fetch('/api/schedule').then(res => res.json()),
        fetch('/api/standings').then(res => res.json()),
        fetch('/api/bracket').then(res => res.json())
      ]);

      setSchedule(processSchedule(scheduleRes));
      setStandings(standingsRes);
      setBracket(processBracket(bracketRes));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data turnamen. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="navbar-container">
          <a href="#" className="brand" onClick={() => setActiveTab('dashboard')}>
            <img src="/logo.png" alt="RNJ Sport Logo" className="logo-img" />
          </a>

          <div className="nav-links">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <Calendar size={18} />
              <span>Schedule & Results</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'standings' ? 'active' : ''}`}
              onClick={() => setActiveTab('standings')}
            >
              <BarChart2 size={18} />
              <span>Standings</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'bracket' ? 'active' : ''}`}
              onClick={() => setActiveTab('bracket')}
            >
              <GitFork size={18} />
              <span>Bracket</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {lastUpdated && (
              <span className="last-updated-text" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} />
                Synced: {lastUpdated}
              </span>
            )}
            <button 
              className={`refresh-btn ${refreshing ? 'loading' : ''}`}
              onClick={handleRefresh}
              title="Scrape latest data now"
              disabled={refreshing}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Loading tournament data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard 
                schedule={schedule} 
                standings={standings} 
                setActiveTab={setActiveTab} 
              />
            )}
            {activeTab === 'schedule' && (
              <Schedule schedule={schedule} />
            )}
            {activeTab === 'standings' && (
              <Standings standings={standings} />
            )}
            {activeTab === 'bracket' && (
              <Bracket bracket={bracket} />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        <button 
          className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>
        <button 
          className={`mobile-nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Calendar size={20} />
          <span>Schedule</span>
        </button>
        <button 
          className={`mobile-nav-item ${activeTab === 'standings' ? 'active' : ''}`}
          onClick={() => setActiveTab('standings')}
        >
          <BarChart2 size={20} />
          <span>Standings</span>
        </button>
        <button 
          className={`mobile-nav-item ${activeTab === 'bracket' ? 'active' : ''}`}
          onClick={() => setActiveTab('bracket')}
        >
          <GitFork size={20} />
          <span>Bracket</span>
        </button>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-color)',
        padding: '24px 16px',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.85rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p>© 2026 RNJ Sport FIFA World Cup Monitor. Scrapes data from worldcupmatchtime.com every 30 minutes.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" onClick={() => setActiveTab('dashboard')} style={{ fontWeight: 600 }}>Home</a>
            <a href="#" onClick={() => setActiveTab('schedule')} style={{ fontWeight: 600 }}>Jadwal</a>
            <a href="#" onClick={() => setActiveTab('standings')} style={{ fontWeight: 600 }}>Standings</a>
            <a href="#" onClick={() => setActiveTab('bracket')} style={{ fontWeight: 600 }}>Bracket</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
