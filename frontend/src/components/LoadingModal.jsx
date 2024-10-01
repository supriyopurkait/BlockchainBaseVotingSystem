import React from 'react';
// Import the CSS file for styles

const LoadingModal = ({
  modalVisible,
  task = 'Loading...',          // Default task message
  onClose = () => {}             // Callback when modal is closed
}) => {
  if (!modalVisible) return null; // Do not render anything if modal is not visible

  return (
    <div className="loading-modal-overlay" onClick={onClose}>
      <div className="loading-modal">
        <div className="spinner"></div>
        <p>{task}</p>
      </div>
    </div>
  );
};

export default LoadingModal;
