import { useState, useEffect } from 'react';
import React from 'react';
import Modal from './Modal';
import { ExternalLink } from 'lucide-react';

const Message = ({ onClose, data, txhash}) => {
  const [show, setShow] = useState(true);

  // Using useEffect to handle side effects like updating state when `data` changes
  useEffect(() => {
    if (data === 'You have already voted') {
      setShow(false);
    }
  }, [data]);

  return (
    <>
      {show ? (
        <Modal title="Notification" onClose={onClose}>
          {/* Display the message content dynamically */}
          <p className="mb-6">{data} <ExternalLink txhash={txhash} /></p>
        </Modal>
      ) : (
        <Modal title="Notification" onClose={onClose}>
          {/* Display a different message when `show` is false */}
          <p className="mb-6">{data}</p>
        </Modal>
      )}
    </>
  );
};

export default Message;
