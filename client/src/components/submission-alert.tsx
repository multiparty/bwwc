import { AxiosResponse } from 'axios';
import { Alert, AlertColor } from '@mui/material';

interface SubmissionAlertProps {
  submitResp: AxiosResponse | undefined;
  pressed: boolean;
  isDataValid: boolean;
  dataIsEncrypted: boolean;
  loading: boolean;
  fileHasBeenLoaded: boolean;
  companyInfoValid: boolean;
}

export const SubmissionAlert = ({ submitResp, pressed, isDataValid, dataIsEncrypted, loading, fileHasBeenLoaded, companyInfoValid }: SubmissionAlertProps) => {
  let severity: AlertColor | undefined;
  let message = 'You have not submitted yet';
  severity = 'warning';

  if (loading) {
    severity = 'info';
    message = 'Please wait while submitting your data';
  } else if (!fileHasBeenLoaded) {
    severity = 'warning';
    message = 'Please upload a file before submitting.';
  } else if (!companyInfoValid) {
    severity = 'error';
    message = 'Please check your company information.';
  } else if (!dataIsEncrypted && fileHasBeenLoaded) {
    severity = 'error';
    message = 'Unable to submit, data is not encrypted correctly. Please contact an administrator.';
  } else if (!isDataValid) {
    severity = 'error';
    message = 'Please check your input. Your input contains negative, decimal, or non-numeric values.';
  } else if (submitResp === undefined) {
    if (pressed) {
      severity = 'warning';
      message = 'Cannot submit data. Please contact an administrator.';
    }
  } else if (submitResp.status == 200) {
    severity = 'success';
    message = 'Your submission was successful — You can close the window. Thank you!';
  } else if (submitResp.status != 200) {
    severity = 'error';
    message = submitResp.data;
  }

  return (
    <Alert severity={severity} data-cy="alert">
      {message}
    </Alert>
  );
};
