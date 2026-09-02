import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { MessageFeedback } from '../MessageFeedback';
import { getToolRenderLocation } from '../../tools/toolHandler';
import './ChatDrawer.css';

function ChatDrawer({ isOpen, onClose, messages, onSendMessage, isLoading, error, context }) {
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

  // Keep every user/assistant message, plus any 'tool' message whose tool is configured with
  // renderLocation: 'inline' (see toolsConfig.js) - those render in place via ChatMessage, the
  // way any other message would. Tool messages for 'drawer'/'component-area' tools are skipped
  // here; they render elsewhere (ToolDrawer / <ComponentArea />) from AIAssistantContext instead.
  const visibleMessages = messages.filter(
    (msg) => msg.role !== 'tool' || getToolRenderLocation(msg.toolName) === 'inline'
  );

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
          {visibleMessages.length === 0 && !error && (
            <div className="chat-drawer-welcome">
              <p>👋 Hi! How can I help you today?</p>
            </div>
          )}

          {visibleMessages.map((msg, index) => (
            <div key={index}>
              <ChatMessage
                role={msg.role}
                content={msg.content}
                toolName={msg.toolName}
                data={msg.data}
              />
              {msg.role === 'assistant' && (
                <MessageFeedback
                  message={msg}
                  conversation={messages.slice(0, messages.indexOf(msg) + 1)}
                  context={context}
                />
              )}
            </div>
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
