import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Header as CarbonHeader,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Search,
  SkipToContent,
} from '@carbon/react';
import {
  Search as SearchIcon,
  Notification,
  UserAvatar,
} from '@carbon/icons-react';

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
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <CarbonHeader aria-label="Titan Grove Enterprise Suite">
          <SkipToContent />
          <HeaderName element={Link} to="/" prefix="">
            ⚡ Titan Grove
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
          </HeaderName>
          <HeaderNavigation aria-label="Titan Grove Enterprise Suite">
            {navItems.map((item) => (
              <HeaderMenuItem
                key={item.path}
                element={Link}
                to={item.path}
                isActive={isActive(item.path)}
              >
                <span style={{ marginRight: '8px' }}>{item.icon}</span>
                {item.label}
              </HeaderMenuItem>
            ))}
          </HeaderNavigation>
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label="Search"
              tooltipAlignment="center"
              onClick={() => {/* Add search functionality */}}
            >
              <SearchIcon size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="Notifications"
              tooltipAlignment="center"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Notification size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="User Avatar"
              tooltipAlignment="end"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <UserAvatar size={20} />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
        </CarbonHeader>
      )}
    />
  );
};

export default Header;