import { AxiosResponse } from 'axios';
import { FC, useState, useEffect } from 'react';
import { DataFormat } from '@utils/data-format';
import { Box, Card, CardContent, Checkbox, Divider, FormControlLabel, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { TotalEmployeeCheck } from '@components/total-employee-check';
import TableContextProvider from '@context/table.context';
import { SubmissionAlert } from '@components/submission-alert';
import { useSession } from '@context/session.context';

export interface VerifyDataProps {
  submitDataHandler: () => void;
  submitResp: AxiosResponse | undefined;
  data: DataFormat;
  isDataValid: boolean;
  loading: boolean;
  dataIsEncrypted: boolean;
  fileHasBeenLoaded: boolean;
  companyInfoValid: boolean;
}

export const VerifyData: FC<VerifyDataProps> = ({ data, submitResp, submitDataHandler, isDataValid, loading, dataIsEncrypted, fileHasBeenLoaded, companyInfoValid }) => {
  const [verifyTicked, setVerifyTicked] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [pressed, wasPressed] = useState(false);

  useEffect(() => {
    if (verifyTicked && fileHasBeenLoaded && isDataValid && !loading && dataIsEncrypted && companyInfoValid) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [verifyTicked, fileHasBeenLoaded, isDataValid, loading, dataIsEncrypted, companyInfoValid]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerifyTicked(event.target.checked);
  };

  const handleSubmit = async () => {
    submitDataHandler();
    wasPressed(true);
  };

  return (
    <Card>
      <CardContent sx={{ m: 2 }}>
        <Stack spacing={2}>
          <Stack sx={{ textAlign: 'center' }} spacing={2}>
            <Typography component="h1" variant="h4">
              Verify and submit your data
            </Typography>
            <Typography>Please ensure that all entered data is accurate.</Typography>
            <Divider />
          </Stack>
          <Typography variant="subtitle1">Totals Check</Typography>
          <TotalEmployeeCheck data={data?.totalEmployees} />
          <FormControlLabel
            control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} onChange={handleCheckboxChange} data-cy="data-verify" />}
            label="I verified all data is correct."
          />
          <LoadingButton variant="contained" disabled={!canSubmit} onClick={handleSubmit} data-cy="submit">
            Submit
          </LoadingButton>
          <SubmissionAlert
            loading={loading}
            dataIsEncrypted={dataIsEncrypted}
            submitResp={submitResp}
            pressed={pressed}
            isDataValid={isDataValid}
            fileHasBeenLoaded={fileHasBeenLoaded}
            companyInfoValid={companyInfoValid}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
