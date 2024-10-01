import React from "react";
import Webcam from "react-webcam";

const WebcamStreamCapture = (data) => {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      data.sendData(blob);
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement("a");
      // document.body.appendChild(a);
      // a.style = "display: none";
      // a.href = url;
      // a.download = "react-webcam-stream-capture.webm";
      // a.click();
      // window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return (
    <>
      <h1 className="mb-2">Capture Yourself Saying "I Have The Right To Vote."</h1>
      <div className="flex flex-row items-center">
        <div className="pl-4 pr-14"><Webcam audio={true} muted={true} width={160} ref={webcamRef} style={{ borderRadius: "1rem"}} /></div>
        <div className="flex flex-col items-center">
        {capturing ? (
          <button 
          onClick={handleStopCaptureClick} 
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold my-2 py-2 px-4 rounded"
          > Stop </button>
        ) : (
          <button 
          onClick={handleStartCaptureClick} 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold my-2 py-2 px-4 rounded"
          > Start </button>
        )}
        {recordedChunks.length > 0 && (
          <button 
          onClick={handleDownload} 
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold my-2 py-2 px-4 rounded"
          > Confirm </button>
        )}
        </div>
      </div>
    </>
  );
};

export default WebcamStreamCapture;