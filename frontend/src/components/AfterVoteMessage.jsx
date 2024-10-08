import { useState, useEffect } from 'react';
import React from 'react';
import Modal from '@/components/Modal';
import { ExternalLink } from 'lucide-react';

const Message = ({ onClose, data, txhash }) => {
  const [show, setShow] = useState(true);

  // Use useEffect to handle side effects like updating state when `data` changes
  useEffect(() => {
    if ((data === 'You have already voted')||(txhash === 'null')) {
      setShow(false);
    }
  }, [data]);

  // Sliced version of the txhash to display
  const displayTxhash = `${txhash.slice(0, 10)}...${txhash.slice(-4)}`;

  return (
    <>
      {show ? (
        <Modal title="Notification" onClose={onClose}>
          {/* Display the message content dynamically */}
          <div className="main">
            {/* Display data on one line */}
            <p className="mb-2">{data}</p>
            
            {/* Display txhash and ExternalLink on the next line */}
            <div className="flex items-center gap-1">
              <p>Transaction id: {displayTxhash}</p>
              <a
                href={`https://base-sepolia.blockscout.com/tx/${txhash}`} // Update this URL based on your needs
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-5 w-5 hover:text-blue-400 transition-colors duration-200" />
              </a>
            </div>
          </div>
        </Modal>
      ) : (
        <Modal title="Notification" onClose={onClose}>
          {/* Display a different message when `show` is false */}
          <p className="mb-6">{data}.</p>
        </Modal>
      )}
    </>
  );
};

export default Message;
