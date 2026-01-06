import React, { useState } from 'react';
import './TimeDisplay.css';

/**
 * TimeDisplay component
 * Renders the current time result from the getCurrentTime tool
 * Displays an interactive card that opens a modal with more details
 */
function TimeDisplay({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { datetime, timezone, formatted } = data;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="time-display-card" onClick={openModal}>
        <div className="time-display-icon">🕐</div>
        <div className="time-display-content">
          <div className="time-display-time">{formatted}</div>
          <div className="time-display-timezone">{timezone || 'UTC'}</div>
        </div>
        <div className="time-display-hint">Click for details</div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Time Details</h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="time-detail-row">
                <span className="time-detail-label">Full DateTime:</span>
                <span className="time-detail-value">{datetime}</span>
              </div>
              <div className="time-detail-row">
                <span className="time-detail-label">Formatted:</span>
                <span className="time-detail-value">{formatted}</span>
              </div>
              <div className="time-detail-row">
                <span className="time-detail-label">Timezone:</span>
                <span className="time-detail-value">{timezone || 'UTC'}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TimeDisplay;
