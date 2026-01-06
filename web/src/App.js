import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AIAssistantProvider } from './ai-assistant';
import { AIAssistant } from './ai-assistant';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ComponentAreaDemo from './pages/ComponentAreaDemo';
import AgentMessagesDemo from './pages/AgentMessagesDemo';
import './App.css';

function AppContent() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/component-area" element={<ComponentAreaDemo />} />
          <Route path="/agent-messages" element={<AgentMessagesDemo />} />
        </Routes>
        <AIAssistant />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AIAssistantProvider>
      <AppContent />
    </AIAssistantProvider>
  );
}

export default App;
