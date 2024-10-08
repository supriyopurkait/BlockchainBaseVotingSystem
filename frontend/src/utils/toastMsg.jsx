import { toast, Toaster } from 'react-hot-toast';

const toastMsg = (status, msg, duration, position) => {
    // Call the appropriate toast function based on the status
    if (toast[status]) {
      toast[status](msg, {
        duration, // 10 seconds
        position,
      });
    } else {
      console.error(`Invalid status: ${status}`);
    }
  };