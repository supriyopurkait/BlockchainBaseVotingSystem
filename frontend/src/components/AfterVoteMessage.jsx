import React from 'react';
import Modal from './Modal';

// Accept the `data` prop from the parent component
const Message = ({ onClose, data }) => (
  <Modal title="Notification" onClose={onClose}>
    {/* Display the message content dynamically */}
    <p className="mb-6">{data}</p>
  </Modal>
);

export default Message;
