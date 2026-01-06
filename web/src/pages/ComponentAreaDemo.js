import React, { useEffect } from 'react';
import { useAIAssistant, ComponentArea } from '../ai-assistant';
import './ComponentAreaDemo.css';

/**
 * ComponentAreaDemo
 * Demonstrates the ComponentArea with interactive tools
 * Shows how tools can be rendered directly on the page
 */
function ComponentAreaDemo() {
  const { setContext } = useAIAssistant();

  // Set page-specific context when component mounts
  useEffect(() => {
    setContext({
      page: {
        name: 'component-area-demo',
        title: 'Component Area Demo',
        description: 'Interactive demonstration of component-area tool rendering'
      }
    });
  }, [setContext]);

  return (
    <div className="component-area-demo">
      {/* ComponentArea renders here - tools appear here */}
      <ComponentArea />

      <div className="demo-content">

        <div className="demo-section">
          <h2>How It Works</h2>
          <div className="info-cards">
            <div className="info-card">
              <div className="card-number">1</div>
              <h3>Ask the Assistant</h3>
              <p>Click the chat bubble and ask for data or information</p>
            </div>
            <div className="info-card">
              <div className="card-number">2</div>
              <h3>Tool Execution</h3>
              <p>The assistant decides which tool to use and executes it</p>
            </div>
            <div className="info-card">
              <div className="card-number">3</div>
              <h3>Render on Page</h3>
              <p>Results appear in the Component Area above</p>
            </div>
          </div>
        </div>

        <div className="demo-section">
          <h2>Available Tools</h2>
          <div className="tools-list">
            <div className="tool-item">
              <div className="tool-icon">📊</div>
              <div className="tool-info">
                <h4>Sample Data</h4>
                <p>Displays a list of sample items (books, services, or products)</p>
                <code>Try: "Show me sample data"</code>
              </div>
            </div>
          </div>
        </div>

        <div className="demo-section highlight">
          <h2>Try It Out!</h2>
          <div className="suggestions">
            <p><strong>Suggested prompts:</strong></p>
            <ul>
              <li>"Show me sample data"</li>
              <li>"Get sample data about books"</li>
              <li>"Display sample services"</li>
              <li>"Show me product samples"</li>
            </ul>
          </div>
        </div>

        <div className="demo-section">
          <h2>Integration Guide</h2>
          <p>To add Component Area to your own pages, simply import and render it:</p>
          <pre className="code-block">
{`import { ComponentArea } from './ai-assistant';

function MyPage() {
  return (
    <div>
      <ComponentArea />
      {/* Your page content */}
    </div>
  );
}`}
          </pre>
          <p className="note">
            <strong>Note:</strong> Pages without ComponentArea will not display component-area tools.
            Only drawer tools will be available on those pages.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ComponentAreaDemo;
