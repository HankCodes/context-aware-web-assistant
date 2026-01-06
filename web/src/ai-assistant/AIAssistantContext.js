import React, { createContext, useState, useCallback, useMemo, useContext } from 'react';
import { getToolRenderLocation } from './tools/toolHandler';

/**
 * AIAssistantContext
 * Provides global state for the AI Assistant including context management and tool results
 */
export const AIAssistantContext = createContext(null);

/**
 * useAIAssistant Hook
 * Provides access to AI Assistant state and methods from anywhere in the component tree
 *
 * @example
 * const { context, setContext } = useAIAssistant();
 *
 * // Update context (merges)
 * setContext({ userRole: 'admin', page: '/dashboard' });
 *
 * // Clear context
 * clearContext();
 *
 * @throws {Error} If used outside of AIAssistantProvider
 */
export function useAIAssistant() {
  const context = useContext(AIAssistantContext);

  if (!context) {
    throw new Error(
      'useAIAssistant must be used within an AIAssistantProvider. ' +
      'Wrap your app or component tree with <AIAssistantProvider>.'
    );
  }

  return context;
}

/**
 * AIAssistantProvider
 * Wraps the application to provide AI Assistant state and methods
 */
export function AIAssistantProvider({ children }) {
  const [context, setContextState] = useState({});
  const [toolResults, setToolResults] = useState([]);
  const [agentMessages, setAgentMessages] = useState([]);
  const [hasUnreadAgentMessages, setHasUnreadAgentMessages] = useState(false);

  /**
   * Update context (merges with existing context)
   */
  const setContext = useCallback((newContext) => {
    if (typeof newContext === 'function') {
      setContextState(prevContext => ({
        ...prevContext,
        ...newContext(prevContext)
      }));
    } else {
      setContextState(prevContext => ({
        ...prevContext,
        ...newContext
      }));
    }
  }, []);

  /**
   * Clear all context
   */
  const clearContext = useCallback(() => {
    setContextState({});
  }, []);

  /**
   * Replace entire context (does not merge)
   */
  const replaceContext = useCallback((newContext) => {
    setContextState(newContext || {});
  }, []);

  /**
   * Add or update a tool result
   */
  const addToolResult = useCallback((toolResult) => {
    setToolResults(prev => {
      const existingIndex = prev.findIndex(item => item.toolName === toolResult.toolName);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = toolResult;
        return updated;
      } else {
        return [...prev, toolResult];
      }
    });
  }, []);

  /**
   * Remove a tool result by tool name
   */
  const removeToolResult = useCallback((toolName) => {
    setToolResults(prev => prev.filter(item => item.toolName !== toolName));
  }, []);

  /**
   * Clear all tool results
   */
  const clearToolResults = useCallback(() => {
    setToolResults([]);
  }, []);

  /**
   * Send a message from the agent (backend-initiated)
   * This allows developers to programmatically create agent messages
   *
   * @param {string} message - The message content
   * @param {Object} options - Optional metadata (title, etc.)
   */
  const sendAgentMessage = useCallback((message, options = {}) => {
    const agentMessage = {
      id: `agent_msg_${Date.now()}`,
      content: message,
      timestamp: new Date().toISOString(),
      read: false,
      ...options
    };

    setAgentMessages(prev => [...prev, agentMessage]);
    setHasUnreadAgentMessages(true);
  }, []);

  /**
   * Mark all agent messages as read
   */
  const markAgentMessagesAsRead = useCallback(() => {
    setAgentMessages(prev => prev.map(msg => ({ ...msg, read: true })));
    setHasUnreadAgentMessages(false);
  }, []);

  /**
   * Clear all agent messages
   */
  const clearAgentMessages = useCallback(() => {
    setAgentMessages([]);
    setHasUnreadAgentMessages(false);
  }, []);

  const componentAreaTools = useMemo(() => {
    return toolResults.filter(tool =>
      getToolRenderLocation(tool.toolName) === 'component-area'
    );
  }, [toolResults]);

  const drawerTools = useMemo(() => {
    return toolResults.filter(tool =>
      getToolRenderLocation(tool.toolName) === 'drawer'
    );
  }, [toolResults]);

  const value = {
    context,
    setContext,
    updateContext: setContext, 
    clearContext,
    replaceContext,
    toolResults,
    componentAreaTools,
    drawerTools,
    addToolResult,
    removeToolResult,
    clearToolResults,
    agentMessages,
    hasUnreadAgentMessages,
    sendAgentMessage,
    markAgentMessagesAsRead,
    clearAgentMessages,
  };

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
}
