import React from 'react';
import './ChatBubble.css';

function ChatBubble({ onClick, hasUnread }) {
  return (
    <button className="chat-bubble" onClick={onClick} aria-label="Open chat assistant">
      <div className="chat-bubble-icon">
        💬
      </div>
      {hasUnread && <div className="chat-bubble-badge"></div>}
    </button>
  );
}

export default ChatBubble;
