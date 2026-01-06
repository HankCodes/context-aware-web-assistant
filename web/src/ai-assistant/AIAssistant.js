import React, { useState, useEffect } from 'react';
import { ChatBubble, ChatDrawer } from './components/AIChat';
import { ToolDrawer } from './components/ToolDrawer';
import AgentNotification from './components/AgentNotification';
import { sendChatMessage, checkHealth } from './services/chatService';
import { executeToolCall } from './tools/toolHandler';
import { useAIAssistant } from './AIAssistantContext';

/**
 * AIAssistant component 
 * Main orchestrator that manages:
 * - Chat state (messages, loading, errors)
 * - Chat drawer and tool drawer visibility
 * - Context integration from provider
 * - Tool execution and state management via context
 *
 */
function AIAssistant() {
  const {
    context,
    addToolResult,
    drawerTools,
    removeToolResult,
    agentMessages,
    hasUnreadAgentMessages,
    markAgentMessagesAsRead
  } = useAIAssistant();

  const [messages, setMessages] = useState([]);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [shownNotificationIds, setShownNotificationIds] = useState(new Set());

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        await checkHealth();
      } catch (err) {
        console.error('Failed to check API health:', err);
        setError('Unable to connect to the AI assistant.');
      }
    };

    fetchHealth();
  }, []);

  useEffect(() => {
    const unreadMessages = agentMessages.filter(msg => !msg.read);
    if (unreadMessages.length > 0 && !currentNotification) {
      const latestMessage = unreadMessages.find(msg => !shownNotificationIds.has(msg.id));

      if (latestMessage) {
        setCurrentNotification(latestMessage);
        setShownNotificationIds(prev => new Set(prev).add(latestMessage.id));
      }
    }
  }, [agentMessages, currentNotification, shownNotificationIds]);

  useEffect(() => {
    if (isChatDrawerOpen && agentMessages.length > 0) {
      const unreadMessages = agentMessages.filter(msg => !msg.read);
      unreadMessages.forEach(agentMsg => {
        const chatMessage = {
          role: 'assistant',
          content: agentMsg.content
        };
        setMessages(prev => {
          // Check if message already exists
          const exists = prev.some(m =>
            m.role === 'assistant' &&
            m.content === agentMsg.content &&
            m.timestamp === agentMsg.timestamp
          );
          if (!exists) {
            return [...prev, { ...chatMessage, timestamp: agentMsg.timestamp }];
          }
          return prev;
        });
      });

      markAgentMessagesAsRead();
    }
  }, [isChatDrawerOpen, agentMessages, markAgentMessagesAsRead]);

  const handleSendMessage = async (userMessage) => {
    setError(null);

    const newUserMessage = { role: 'user', content: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);

    setIsLoading(true);

    try {
      const chatHistory = messages
        .filter(msg => msg.role !== 'tool')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await sendChatMessage(userMessage, chatHistory, context);

      // Handle tool calls
      if (response.toolCalls && response.toolCalls.length > 0) {
        // If agent didn't provide text but is using tools, add a default message
        if (!response.text || response.text.trim() === '') {
          const defaultMessage = {
            role: 'assistant',
            content: 'I\'ve created a component for you.'
          };
          setMessages((prev) => [...prev, defaultMessage]);
        } else {
          // Add assistant text response if provided
          const assistantMessage = {
            role: 'assistant',
            content: response.text
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
        for (const toolCall of response.toolCalls) {
          try {
            // Execute the tool call
            const toolResult = await executeToolCall(
              toolCall.toolName,
              toolCall.parameters
            );

            // Add tool result to context (automatically categorized by render location)
            const toolResultItem = {
              toolName: toolCall.toolName,
              toolId: toolCall.id,
              data: toolResult
            };

            addToolResult(toolResultItem);

            // Also add a marker to messages so we can track it
            const toolMessage = {
              role: 'tool',
              toolName: toolCall.toolName,
              toolId: toolCall.id,
              data: toolResult
            };
            setMessages((prev) => [...prev, toolMessage]);

          } catch (toolError) {
            console.error('Tool execution error:', toolError);
            setError(`Failed to execute tool: ${toolCall.toolName}`);
          }
        }
      } else if (response.text) {
        const assistantMessage = {
          role: 'assistant',
          content: response.text
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message. Please try again.');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChat = () => {
    setIsChatDrawerOpen(true);
    setCurrentNotification(null); 
  };

  const handleCloseChat = () => {
    setIsChatDrawerOpen(false);
  };

  const handleNotificationDismiss = () => {
    setCurrentNotification(null);
  };

  const handleRemoveTool = (toolName) => {
    removeToolResult(toolName);
  };

  const isToolDrawerOpen = isChatDrawerOpen && drawerTools.length > 0;

  return (
    <>
      <ToolDrawer
        toolResults={drawerTools}
        isOpen={isToolDrawerOpen}
        onRemoveTool={handleRemoveTool}
      />

      {currentNotification && (
        <AgentNotification
          message={currentNotification}
          onClick={handleOpenChat}
          onDismiss={handleNotificationDismiss}
        />
      )}

      <ChatBubble
        onClick={handleOpenChat}
        hasUnread={hasUnreadAgentMessages}
      />

      <ChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={handleCloseChat}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}

export default AIAssistant;
