import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Executive Dashboard', icon: '🏢' },
    { path: '/manufacturing', label: 'Manufacturing', icon: '🏭' },
    { path: '/financials', label: 'Financials', icon: '💰' },
    { path: '/hr-management', label: 'HR Management', icon: '👥' },
    { path: '/supply-chain', label: 'Supply Chain', icon: '🚚' },
    { path: '/crm', label: 'CRM', icon: '🤝' },
    { path: '/business-intelligence', label: 'BI & Analytics', icon: '📊' },
    { path: '/project-management', label: 'Projects', icon: '📋' },
    { path: '/asset-management', label: 'Assets', icon: '🏢' },
    { path: '/compliance', label: 'Compliance', icon: '⚖️' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <header className="titan-header">
      <div className="titan-header-content">
        <div className="titan-logo">
          <span style={{ fontSize: '1.5em' }}>⚡</span>
          <span>Titan Grove</span>
          <span style={{ 
            fontSize: '0.75rem', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            marginLeft: '8px'
          }}>
            Enterprise
          </span>
        </div>

        <nav className="titan-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`titan-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span style={{ marginRight: '6px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="titan-user-menu">
          <div style={{ position: 'relative', marginRight: '16px' }}>
            <input
              type="text"
              placeholder="Global Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                width: '200px',
                fontFamily: 'var(--font-primary)'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                fontSize: '18px',
                position: 'relative'
              }}
            >
              🔔
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '12px',
                height: '12px',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                3
              </span>
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              👤
            </button>
            
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                minWidth: '200px',
                marginTop: '8px',
                zIndex: 1000
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 600 }}>John Executive</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Chief Operations Officer
                  </div>
                </div>
                <div style={{ padding: '8px 0' }}>
                  <button style={{ 
                    width: '100%', 
                    padding: '8px 16px', 
                    background: 'none', 
                    border: 'none', 
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>
                    Profile Settings
                  </button>
                  <button style={{ 
                    width: '100%', 
                    padding: '8px 16px', 
                    background: 'none', 
                    border: 'none', 
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>
                    Preferences
                  </button>
                  <button style={{ 
                    width: '100%', 
                    padding: '8px 16px', 
                    background: 'none', 
                    border: 'none', 
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: 'var(--error)'
                  }}>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;