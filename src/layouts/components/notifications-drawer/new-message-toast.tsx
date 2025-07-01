import { Alert, Snackbar } from '@mui/material';

export function NewMessageToast({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity="info" sx={{ width: '100%' }} variant="filled">
        Yangi xabar!
      </Alert>
    </Snackbar>
  );
}
