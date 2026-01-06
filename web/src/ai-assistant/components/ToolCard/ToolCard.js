import React from 'react';
import './ToolCard.css';

/**
 * ToolCard component
 * Generic wrapper for tool components that provides:
 * - Close button on hover
 * - Consistent styling
 * - Works in both drawer and component area
 */
function ToolCard({ children, onClose, className = '' }) {
  return (
    <div className={`tool-card ${className}`}>
      {onClose && (
        <button
          className="tool-card-close"
          onClick={onClose}
          aria-label="Close tool"
        >
          ×
        </button>
      )}
      {children}
    </div>
  );
}

export default ToolCard;
