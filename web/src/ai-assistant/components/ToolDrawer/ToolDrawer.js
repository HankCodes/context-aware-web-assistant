import React from 'react';
import { getToolRenderer } from '../../tools/toolHandler';
import { ToolCard } from '../ToolCard';
import './ToolDrawer.css';

/**
 * ToolDrawer component
 * Renders tool results in a drawer on the left side of the screen
 * Opens automatically when tools with renderLocation="drawer" are present
 * Stacks components vertically, replacing duplicates of the same tool
 */
function ToolDrawer({ toolResults, isOpen, onRemoveTool }) {
  if (!isOpen || toolResults.length === 0) {
    return null;
  }

  return (
    <div className="tool-drawer">
      <div className="tool-drawer-content">
        {toolResults.map((result, index) => {
          const ToolComponent = getToolRenderer(result.toolName);

          if (!ToolComponent) {
            return (
              <ToolCard key={index} onClose={() => onRemoveTool(result.toolName)}>
                <div className="tool-error">
                  Unknown tool: {result.toolName}
                </div>
              </ToolCard>
            );
          }

          return (
            <ToolCard key={index} onClose={() => onRemoveTool(result.toolName)}>
              <ToolComponent data={result.data} />
            </ToolCard>
          );
        })}
      </div>
    </div>
  );
}

export default ToolDrawer;
