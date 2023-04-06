import { AxiosResponse } from 'axios';
import { Alert, AlertColor } from '@mui/material';

interface SubmissionAlertProps {
  submitResp: AxiosResponse | undefined;
}

export const SubmissionAlert = ({ submitResp }: SubmissionAlertProps) => {
  let severity: AlertColor | undefined;
  let message = '';

  if (submitResp === undefined) {
    severity = 'warning';
    message = 'Cannot submit data. Please contact an administrator.';
  } else if (submitResp.status == 0) {
    severity = 'warning';
    message = 'You have not submitted yet';
  } else if (submitResp.status == 200) {
    severity = 'success';
    message = 'Your submission was successful — You can close the window. Thank you!';
  } else if (submitResp.status == 400) {
    severity = 'error';
    message = submitResp.data;
  }

  return <Alert severity={severity}>{message}</Alert>;
};
