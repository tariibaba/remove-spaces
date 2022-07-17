import { Snackbar } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Timeout from 'await-timeout';

export default function AppSnackbar({ messageInfo }) {
  const [open, setOpen] = useState(false);
  const timeout = useRef(new Timeout());
  const [message, setMessage] = useState(undefined);

  useEffect(() => {
    if (!messageInfo) return;

    const { message } = messageInfo;

    if (open) {
      setOpen(false);
      timeout.current.clear();
      timeout.current.set(250).then(() => {
        setMessage(message);
        setOpen(true);
      });
    } else {
      setMessage(message);
      setOpen(true);
    }
  }, [messageInfo]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      message={message}
      autoHideDuration={5000}
      onClose={handleClose}
    ></Snackbar>
  );
}
