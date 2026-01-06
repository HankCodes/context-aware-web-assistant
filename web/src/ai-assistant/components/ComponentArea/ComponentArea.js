import React from 'react';
import { getToolRenderer } from '../../tools/toolHandler';
import { ToolCard } from '../ToolCard';
import { useAIAssistant } from '../../AIAssistantContext';
import './ComponentArea.css';

/**
 * ComponentArea component
 * Standalone component that renders component-area tools
 * Reads tool results from AIAssistantContext
 *
 * Usage: Import and render this component wherever you want tools to appear
 * Example:
 *   import { ComponentArea } from './ai-assistant';
 *   <ComponentArea />
 */
function ComponentArea() {
  const { componentAreaTools, removeToolResult } = useAIAssistant();

  const handleRemoveTool = (toolName) => {
    removeToolResult(toolName);
  };
  return (
    <div className="component-area">
      <div className="component-area-header">
        <h1>Component Area Demo</h1>
        <p className="intro">
          Try asking: <strong>"Show me sample data"</strong>
        </p>
        <p className="scroll-hint">
          ↓ Scroll down to learn more
        </p>
      </div>

      <div className="tool-results-grid">
        {componentAreaTools.length === 0 ? null : (
          componentAreaTools.map((result, index) => {
            const ToolRenderer = getToolRenderer(result.toolName);

            if (!ToolRenderer) {
              return (
                <div key={index} className="tool-result-item">
                  <ToolCard onClose={() => handleRemoveTool(result.toolName)}>
                    <div className="tool-error">
                      Unknown tool: {result.toolName}
                    </div>
                  </ToolCard>
                </div>
              );
            }

            return (
              <div key={index} className="tool-result-item">
                <ToolCard onClose={() => handleRemoveTool(result.toolName)}>
                  <ToolRenderer data={result.data} />
                </ToolCard>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ComponentArea;
