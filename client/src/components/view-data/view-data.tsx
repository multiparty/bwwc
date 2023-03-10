import { FC } from 'react';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { DataFormat } from '@utils/data-format';

export interface ViewDataProps {
  open: boolean;
  data?: DataFormat;
}

export const ViewData: FC<ViewDataProps> = () => {
  return (
    <Card>
      <CardContent sx={{ m: 2 }}>
        <Stack spacing={2} sx={{ textAlign: 'center' }}>
          <Typography component="h1" variant="h4">
            View your data
          </Typography>
          <Typography>Your data will appear here after you drag/drop or browse to find your completed Excel template file above.</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
