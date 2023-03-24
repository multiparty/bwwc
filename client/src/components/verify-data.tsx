import { FC, useState, useEffect } from 'react';
import { DataFormat } from '@utils/data-format';
import { Box, Card, CardContent, Checkbox, Divider, FormControlLabel, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { TotalEmployeeCheck } from '@components/total-employee-check';
import { SubmissionAlert } from '@components/submission-alert';

export interface VerifyDataProps {
  data: DataFormat;
}

export const VerifyData: FC<VerifyDataProps> = ({ data }) => {
  const [verifyTicked, setVerifyTicked] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (verifyTicked && data?.totalEmployees) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [verifyTicked, data]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerifyTicked(event.target.checked);
  };

  const handleSubmit = () => {
    setSubmitted(true);
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
          <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} onChange={handleCheckboxChange} />} label="I verified all data is correct." />
          <LoadingButton variant="contained" disabled={!canSubmit} onClick={handleSubmit}>
            Submit
          </LoadingButton>
          <SubmissionAlert success={submitted} />
        </Stack>
      </CardContent>
    </Card>
  );
};
