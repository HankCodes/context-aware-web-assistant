import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import './ChatDrawer.css';

function ChatDrawer({ isOpen, onClose, messages, onSendMessage, isLoading, error }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) {
    return null;
  }

  const textMessages = messages.filter(msg => msg.role !== 'tool');

  return (
    <>
      <div className="chat-drawer-backdrop" onClick={onClose}></div>

      <div className="chat-drawer">
        <div className="chat-drawer-header">
          <div className="chat-drawer-title">
            <span className="chat-drawer-icon">🤖</span>
            <h3>AI Assistant</h3>
          </div>
          <button className="chat-drawer-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="chat-drawer-messages">
          {textMessages.length === 0 && !error && (
            <div className="chat-drawer-welcome">
              <p>👋 Hi! How can I help you today?</p>
            </div>
          )}

          {textMessages.map((msg, index) => (
            <ChatMessage
              key={index}
              role={msg.role}
              content={msg.content}
            />
          ))}

          {isLoading && (
            <div className="loading-indicator">
              <div className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
              <span>Thinking...</span>
            </div>
          )}

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-drawer-input">
          <ChatInput
            onSendMessage={onSendMessage}
            disabled={isLoading}
          />
        </div>
      </div>
    </>
  );
}

export default ChatDrawer;
