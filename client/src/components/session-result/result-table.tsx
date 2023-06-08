import { FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { DataFormat } from '@utils/data-format';
import { Table } from '@components/table';

export interface ViewResultProps {
  data?: DataFormat;
}

export const ResultTable: FC<ViewResultProps> = ({ data }) => {
  return (
    <Stack spacing={4} sx={{ textAlign: 'start' }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Number Of Employees
        </Typography>
        <Table data={data?.numberOfEmployees} allowDecimal={true} />
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          Total Annual Compensation (Dollars)
        </Typography>
        <Table data={data?.wages} allowDecimal={true} />
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          Total Annual Cash Performance Pay (Dollars)
        </Typography>
        <Table data={data?.performance} allowDecimal={true} />
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          Total Length of Service (Months)
        </Typography>
        <Table data={data?.lengthOfService} allowDecimal={true} />
      </Box>
    </Stack>
  );
};
