import { FC, useContext } from 'react';
import { DataFormat } from '@utils/data-format';
import { Box, Card, CardContent, Checkbox, Divider, FormControlLabel, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { TotalEmployeeCheck } from '@components/total-employee-check';
import TableContextProvider from '@context/table.context';

export interface VerifyDataProps {
  data: DataFormat;
}

export const VerifyData: FC<VerifyDataProps> = ({ data }) => {
  const {table, setTable} = useContext(TableContextProvider);

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
          <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />} label="I verified all data is correct." />
          <LoadingButton variant="contained">Submit</LoadingButton>
        </Stack>
      </CardContent>
    </Card>
  );
};
