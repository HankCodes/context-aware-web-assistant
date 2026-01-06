import React, { useState, useEffect } from 'react';
import './AgentNotification.css';

/**
 * AgentNotification component
 * Displays a notification popup above the chat bubble for agent-initiated messages
 *
 * @param {Object} props
 * @param {Object} props.message - The agent message to display
 * @param {Function} props.onClick - Callback when notification is clicked
 * @param {Function} props.onDismiss - Callback when notification auto-dismisses
 */
function AgentNotification({ message, onClick, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const cssTransitinonDuration = 300; 
  const notificationDisplayDuration = 5000;

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, notificationDisplayDuration);

    return () => clearTimeout(dismissTimer);
  }, [message]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss();
    }, cssTransitinonDuration);
  };

  const handleClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClick();
    }, cssTransitinonDuration);
  };

  if (!message) return null;

  return (
    <div
      className={`agent-notification ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}
      onClick={handleClick}
    >
      <div className="notification-header">
        <div className="notification-icon">🤖</div>
        <div className="notification-title">
          {message.title || 'New Message'}
        </div>
        <button
          className="notification-close"
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
        >
          ×
        </button>
      </div>
      <div className="notification-content">
        {message.content}
      </div>
    </div>
  );
}

export default AgentNotification;
