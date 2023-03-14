import { FC } from 'react';
import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { DataFormat } from '@utils/data-format';
import { Table } from '@components/table';
import { date } from 'yup';

export interface ViewDataProps {
  open: boolean;
  data?: DataFormat;
}

export const ViewData: FC<ViewDataProps> = ({ open, data }) => {
  return (
    <Card>
      <CardContent sx={{ m: 2 }}>
        <Stack spacing={2} sx={{ textAlign: 'center' }}>
          <Typography component="h1" variant="h4">
            View your data
          </Typography>
          <Typography>Your data will appear here after you drag/drop or browse to find your completed Excel template file above.</Typography>
          <Divider />
          <Stack spacing={4} sx={{ textAlign: 'start' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Number Of Employees
              </Typography>
              <Table data={data?.numberOfEmployees} />
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
