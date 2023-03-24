import { Alert } from '@mui/material';

interface SubmissionAlertProps {
  success: boolean;
}

export const SubmissionAlert = ({ success }: SubmissionAlertProps) => {
  const Severity = success ? 'success' : 'warning';
  const Message = success ? 'Your submission was successful — You can close the window. Thank you!' : 'You have not submitted yet';

  return <Alert severity={Severity}>{Message}</Alert>;
};
