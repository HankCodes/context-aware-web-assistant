import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>AI Assistant Demo</h2>
        </div>
        <ul className="nav-links">
          <li>
            <Link
              to="/"
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/component-area"
              className={isActive('/component-area') ? 'active' : ''}
            >
              Component Area
            </Link>
          </li>
          <li>
            <Link
              to="/agent-messages"
              className={isActive('/agent-messages') ? 'active' : ''}
            >
              Agent Messages
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
