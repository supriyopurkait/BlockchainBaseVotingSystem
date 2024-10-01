import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';

const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const webcamRef = React.createRef();

  useEffect(() => {
    if (isOpen) {
      setIsCameraActive(true);
    } else {
      setIsCameraActive(false);
    }
  }, [isOpen]);

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      onCapture(imageSrc);
      onClose();
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-md shadow-lg w-[90%] md:w-[50%]">
        <h2 className="text-xl font-bold mb-4">Camera Capture</h2>

        {isCameraActive ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              height={720}
              screenshotFormat="image/jpeg"
              width={1280}
              style={{ borderRadius: "1rem"}}
            />
            <div className="flex justify-between mt-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                onClick={() => {
                  onClose();
                }}
              >
                Close
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                onClick={capturePhoto}
              >
                Capture
              </button>
            </div>
          </>
        ) : (
          <p>Starting camera...</p>
        )}
      </div>
    </div>
  ) : null;
};

export default CameraModal;