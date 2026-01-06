import React, { useState } from 'react';
import './SampleDataList.css';

/**
 * SampleDataList component
 * Demonstrates a component-area rendering with interactive cards
 * Shows how to build a list-based tool component with modals
 */
function SampleDataList({ data }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const { items, title } = data;

  const openModal = (item) => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);

  if (!items || items.length === 0) {
    return (
      <div className="sample-data-empty">
        <div className="sample-data-empty-icon">📋</div>
        <p>No items found</p>
      </div>
    );
  }

  return (
    <>
      <div className="sample-data-container">
        <div className="sample-data-header">
          <h3>{title || 'Sample Data'}</h3>
          <span className="sample-data-count">{items.length} items</span>
        </div>

        <div className="sample-data-list">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="sample-data-card"
              onClick={() => openModal(item)}
            >
              <div className="sample-data-card-header">
                <h4 className="sample-data-name">{item.name || item.title}</h4>
                {item.category && (
                  <span className="sample-data-category">{item.category}</span>
                )}
              </div>
              <div className="sample-data-card-body">
                {item.description && (
                  <p className="sample-data-description">{item.description}</p>
                )}
                {item.value && (
                  <div className="sample-data-info">
                    <span className="sample-data-label">Value:</span>
                    <span className="sample-data-value">{item.value}</span>
                  </div>
                )}
              </div>
              {item.metadata && (
                <div className="sample-data-card-footer">
                  <span className="sample-data-meta">
                    {typeof item.metadata === 'string'
                      ? item.metadata
                      : JSON.stringify(item.metadata)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedItem.name || selectedItem.title}</h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="sample-data-detail-section">
                {selectedItem.category && (
                  <div className="sample-data-detail-row">
                    <span className="sample-data-detail-label">Category:</span>
                    <span className="sample-data-detail-value">{selectedItem.category}</span>
                  </div>
                )}
                {selectedItem.description && (
                  <div className="sample-data-detail-row">
                    <span className="sample-data-detail-label">Description:</span>
                    <span className="sample-data-detail-value">{selectedItem.description}</span>
                  </div>
                )}
                {selectedItem.value && (
                  <div className="sample-data-detail-row">
                    <span className="sample-data-detail-label">Value:</span>
                    <span className="sample-data-detail-value">{selectedItem.value}</span>
                  </div>
                )}
                {selectedItem.metadata && (
                  <div className="sample-data-detail-row">
                    <span className="sample-data-detail-label">Metadata:</span>
                    <span className="sample-data-detail-value">
                      {typeof selectedItem.metadata === 'string'
                        ? selectedItem.metadata
                        : JSON.stringify(selectedItem.metadata, null, 2)}
                    </span>
                  </div>
                )}
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

export default SampleDataList;
