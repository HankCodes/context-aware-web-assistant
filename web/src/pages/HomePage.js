import React, { useEffect, useState } from 'react';
import { useAIAssistant } from '../ai-assistant';
import './HomePage.css';

/**
 * HomePage - Interactive Tutorial
 * Teaches developers how to use and extend the AI Assistant
 */
function HomePage() {
  const { setContext } = useAIAssistant();
  const [showContextModal, setShowContextModal] = useState(false);
  const [userContext, setUserContext] = useState({
    experience: '',
    interest: '',
    useCase: ''
  });

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowContextModal(true);
    }
  }, []);

  useEffect(() => {
    setContext({
      page: {
        name: 'tutorial',
        title: 'AI Assistant Tutorial',
        description: 'Interactive tutorial showing how to integrate and extend the AI Assistant'
      },
      user: userContext
    });
  }, [setContext, userContext]);

  const handleContextSubmit = (e) => {
    e.preventDefault();
    setShowContextModal(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleSkip = () => {
    setShowContextModal(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  return (
    <div className="home-page">
      {showContextModal && (
        <div className="modal-overlay" onClick={handleSkip}>
          <div className="context-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Welcome! Tell us about yourself</h2>
            <p>Help the AI Assistant provide more relevant information about the system.</p>

            <form onSubmit={handleContextSubmit}>
              <div className="form-group">
                <label htmlFor="experience">Experience Level</label>
                <input
                  id="experience"
                  type="text"
                  placeholder="e.g., Developer, Designer, Product Manager, Business User"
                  value={userContext.experience}
                  onChange={(e) => setUserContext({ ...userContext, experience: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="interest">What interests you most?</label>
                <input
                  id="interest"
                  type="text"
                  placeholder="e.g., How to integrate, Adding custom features, Architecture"
                  value={userContext.interest}
                  onChange={(e) => setUserContext({ ...userContext, interest: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="useCase">What would you use this for?</label>
                <input
                  id="useCase"
                  type="text"
                  placeholder="e.g., Customer support, Internal tools, Product features"
                  value={userContext.useCase}
                  onChange={(e) => setUserContext({ ...userContext, useCase: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleSkip} className="btn-secondary">
                  Skip
                </button>
                <button type="submit" className="btn-primary">
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="page-content">
        <div className="tutorial-hero">
          <h1>AI Assistant for React</h1>
          <p className="subtitle">
            Add conversational AI to your React app in 3 steps. Extend with custom tools.
          </p>
          <button
            className="update-context-btn"
            onClick={() => setShowContextModal(true)}
          >
            Update Your Context
          </button>
        </div>

        <section className="quick-start">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Context</h3>
                <p>Components set context that's automatically sent to the AI with every message</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Tools</h3>
                <p>AI decides which tools to call. Frontend executes them and renders UI components</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Rendering</h3>
                <p>Results show in chat drawer or main page area - you control where</p>
              </div>
            </div>
          </div>
        </section>

        <section className="live-examples">
          <h2>See It In Action</h2>
          <div className="example-grid">
            <div className="example-card">
              <h3>💬 Context Awareness</h3>
              <p>Try: "What context do you have?"</p>
              <p className="example-note">The AI knows your current context</p>
            </div>

            <div className="example-card">
              <h3>🛠️ Tool Execution</h3>
              <p>Try: "What time is it?"</p>
              <p className="example-note">AI calls tools, renders in chat drawer</p>
            </div>

            <div className="example-card">
              <h3>🎨 Component Rendering</h3>
              <p>Visit the Component Area page</p>
              <p className="example-note">Tools can render in main page area</p>
            </div>

            <div className="example-card">
              <h3>🤖 Agent Messages</h3>
              <p>Visit: Agent Messages page</p>
              <p className="example-note">Frontend can initiate messages (reacts to backend events)</p>
            </div>
          </div>
        </section>

        <section className="ask-ai-section">
          <h2>Need Help?</h2>
          <p>Click the chat bubble to ask me anything about:</p>
          <ul className="help-topics">
            <li>How to add custom tools</li>
            <li>Context management patterns</li>
            <li>Component rendering locations</li>
            <li>Backend API integration</li>
            <li>Architecture decisions</li>
          </ul>
        </section>

        <section className="next-steps">
          <h2>Explore Demo Pages</h2>
          <div className="demo-links">
            <a href="/component-area" className="demo-link">
              <strong>Component Area</strong>
              <span>See tools render on the page</span>
            </a>
            <a href="/agent-messages" className="demo-link">
              <strong>Agent Messages</strong>
              <span>Frontend-initiated conversations</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
