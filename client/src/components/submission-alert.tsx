import { AxiosResponse } from 'axios';
import { Alert, AlertColor } from '@mui/material';

interface SubmissionAlertProps {
  submitResp: AxiosResponse | undefined;
  pressed: boolean;
  check: boolean;
}

export const SubmissionAlert = ({ submitResp, pressed, check }: SubmissionAlertProps) => {
  let severity: AlertColor | undefined;
  let message = 'You have not submitted yet';
  severity = 'warning';

  if (check) {
    severity = 'warning';
    message = 'Please check your input for the number of employees. Your input contains negative values and/or decimals.';
  } else if (submitResp === undefined) {
    if (pressed) {
      severity = 'warning';
      message = 'Cannot submit data. Please contact an administrator.';
    }
  } else if (submitResp.status == 200) {
    severity = 'success';
    message = 'Your submission was successful — You can close the window. Thank you!';
  } else if (submitResp.status == 400) {
    severity = 'error';
    message = submitResp.data;
  }

  return (
    <Alert severity={severity} data-cy="alert">
      {message}
    </Alert>
  );
};
