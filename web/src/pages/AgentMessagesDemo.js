import React, { useState, useEffect } from 'react';
import { useAIAssistant } from '../ai-assistant';
import './AgentMessagesDemo.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * AgentMessagesDemo
 * Demonstrates agent-initiated messages
 * Shows how backend processes can notify users via the AI assistant
 */
function AgentMessagesDemo() {
  const { setContext, sendAgentMessage } = useAIAssistant();
  const [reportId, setReportId] = useState(null);
  const [reportStatus, setReportStatus] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Set page context
  useEffect(() => {
    setContext({
      page: {
        name: 'agent-messages-demo',
        title: 'Agent Messages Demo',
        description: 'Demonstration of agent-initiated messages and notifications'
      }
    });
  }, [setContext]);

  useEffect(() => {
    if (!reportId || reportStatus?.status === 'completed') return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reports/status/${reportId}`);
        const data = await response.json();

        setReportStatus(data);

        if (data.status === 'completed') {
          clearInterval(pollInterval);
          setIsGenerating(false);

          // Send agent message when report is ready
          const message = `Your ${data.type} report is ready!

Summary: ${data.data.summary}

Key Metrics:
• Total Requests: ${data.data.metrics.totalRequests}
• Avg Response Time: ${data.data.metrics.avgResponseTime}
• Success Rate: ${data.data.metrics.successRate}
• Active Users: ${data.data.metrics.activeUsers}

Period: ${data.data.period}`;

          sendAgentMessage(message, {
            title: '📊 Report Ready'
          });
        }
      } catch (error) {
        console.error('Failed to check report status:', error);
        clearInterval(pollInterval);
        setIsGenerating(false);
      }
    }, 1000);

    return () => clearInterval(pollInterval);
  }, [reportId, reportStatus, sendAgentMessage]);

  const handleGenerateReport = async (reportType) => {
    setIsGenerating(true);
    setReportStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType })
      });

      const data = await response.json();
      setReportId(data.reportId);
      setReportStatus({ status: 'processing' });
    } catch (error) {
      console.error('Failed to generate report:', error);
      setIsGenerating(false);
    }
  };

  const handleTestMessage = () => {
    sendAgentMessage(
      'This is a test notification from the agent. Click to open the chat and see this message!',
      { title: '🔔 Test Notification' }
    );
  };

  return (
    <div className="agent-messages-demo">
      <div className="demo-content">
        <div className="demo-header">
          <h1>Agent-Initiated Messages</h1>
          <p className="demo-subtitle">
            Demonstrate how backend processes can proactively notify users through the AI assistant
          </p>
        </div>

        <div className="demo-section">
          <h2>What Are Agent-Initiated Messages?</h2>
          <p>
            Agent-initiated messages allow your backend systems to send notifications to users
            through the AI assistant. This is useful for:
          </p>
          <ul>
            <li>Notifying users when long-running processes complete</li>
            <li>Sending system alerts or important updates</li>
            <li>Delivering reports or analytics</li>
            <li>Proactive assistance based on user behavior</li>
          </ul>
        </div>

        <div className="demo-section">
          <h2>How It Works</h2>
          <div className="flow-diagram">
            <div className="flow-step">
              <div className="step-number">1</div>
              <h4>Backend Event</h4>
              <p>Process completes, data ready, or event occurs</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">2</div>
              <h4>Frontend Polling</h4>
              <p>Your code checks status endpoint</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">3</div>
              <h4>Send Message</h4>
              <p>Call sendAgentMessage() with content</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">4</div>
              <h4>User Notified</h4>
              <p>Popup appears, badge shows, chat opens</p>
            </div>
          </div>
        </div>

        <div className="demo-section highlight">
          <h2>Try It Out</h2>
          <p>Generate a report and watch for the agent notification when it's ready:</p>

          <div className="demo-actions">
            <button
              className="demo-button primary"
              onClick={() => handleGenerateReport('usage')}
              disabled={isGenerating}
            >
              {isGenerating ? '⏳ Generating...' : '📊 Generate Usage Report'}
            </button>

            <button
              className="demo-button primary"
              onClick={() => handleGenerateReport('performance')}
              disabled={isGenerating}
            >
              {isGenerating ? '⏳ Generating...' : '📈 Generate Performance Report'}
            </button>

            <button
              className="demo-button secondary"
              onClick={handleTestMessage}
            >
              🔔 Send Test Notification
            </button>
          </div>

          {reportStatus && (
            <div className="status-display">
              <strong>Status:</strong> {reportStatus.status}
              {reportStatus.status === 'processing' && (
                <span className="processing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="demo-section">
          <h2>Implementation Guide</h2>

          <h3>1. Import the Hook</h3>
          <pre className="code-block">
{`import { useAIAssistant } from './ai-assistant';

function MyComponent() {
  const { sendAgentMessage } = useAIAssistant();
  // ...
}`}
          </pre>

          <h3>2. Poll Your Backend</h3>
          <pre className="code-block">
{`useEffect(() => {
  const pollInterval = setInterval(async () => {
    const response = await fetch('/api/status');
    const data = await response.json();

    if (data.status === 'completed') {
      // Trigger agent message
      sendAgentMessage(
        'Your process is complete!',
        { title: '✅ Process Complete' }
      );

      clearInterval(pollInterval);
    }
  }, 1000);

  return () => clearInterval(pollInterval);
}, []);`}
          </pre>

          <h3>3. Message Format</h3>
          <pre className="code-block">
{`sendAgentMessage(
  message: string,    // The message content
  options?: {
    title?: string    // Optional title for notification
  }
);`}
          </pre>
        </div>

        <div className="demo-section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔴</div>
              <h4>Badge Indicator</h4>
              <p>Red dot appears on chat bubble for unread messages</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h4>Popup Notification</h4>
              <p>Message preview appears above chat bubble for 5 seconds</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📬</div>
              <h4>Auto-Add to Chat</h4>
              <p>Messages automatically added to chat when opened</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👆</div>
              <h4>Clickable</h4>
              <p>Click notification or badge to open chat and view message</p>
            </div>
          </div>
        </div>

        <div className="demo-section note">
          <h3>💡 Architecture Note</h3>
          <p>
            The AI assistant package is decoupled from your backend events. It only provides
            the <code>sendAgentMessage()</code> API. Your application code decides <strong>when</strong> and
            <strong>why</strong> to send messages based on your business logic.
          </p>
          <p>
            This keeps the package portable and allows you to integrate it with any backend
            architecture (REST APIs, WebSockets, GraphQL subscriptions, etc.).
          </p>
        </div>
      </div>
    </div>
  );
}

export default AgentMessagesDemo;
