import { FC } from 'react';
import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { DataFormat } from '@utils/data-format';
import { Table } from '@components/table';

export interface ViewDataProps {
  data?: DataFormat;
  check: boolean;
  setCheck: (check:boolean) => void;
}

export const ViewData: FC<ViewDataProps> = ({ data, check, setCheck }) => {

  return (
    <Card>
      <CardContent sx={{ m: 2 }}>
        <Stack spacing={2} sx={{ textAlign: 'center' }}>
          <Typography component="h1" variant="h4">
            View your data
          </Typography>
          <Typography>Your data will appear here after you drag/drop or browse to find your completed Excel template file above.</Typography>
          <Typography>If you have noticed an error in the submitted data, make the necessary corrections in the excel file, and reupload it.</Typography>
          <Divider />
          <Stack spacing={4} sx={{ textAlign: 'start' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Number Of Employees
              </Typography>
              {check && (
                <Typography gutterBottom color="#f73378">
                  **Please check your input for the number of employees. Your input contains negative values and/or decimals.
                </Typography>
              )}
              <Table data={data?.numberOfEmployees} setCheck={setCheck} />
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Total Annual Compensation (Dollars)
              </Typography>
              <Table data={data?.wages} />
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Total Annual Cash Performance Pay (Dollars)
              </Typography>
              <Table data={data?.performance} />
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Total Length of Service (Months)
              </Typography>
              <Table data={data?.lengthOfService} />
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
