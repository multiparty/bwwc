import { FC } from 'react';
import { Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { SessionManageTable } from './session-manage-table';
import { LinkGenerator } from './generate-link';
import { useApi } from '@services/api';

export const SessionManage: FC = () => {
  const { endSession } = useApi();
  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack spacing={2} sx={{ textAlign: 'center' }}>
            <Typography component="h1" variant="h4">
              Manage Session
            </Typography>
            <Typography>Stop a session and generate link for partners</Typography>
            <Divider />
            <Stack spacing={2} direction="row">
              <Button fullWidth variant="contained" color="success" disabled>
                Session Started
              </Button>
              <Button fullWidth variant="outlined" color="error" onClick={endSession}>
                Stop Session
              </Button>
            </Stack>
            <Divider />
            <LinkGenerator />
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Stack spacing={2} sx={{ textAlign: 'center' }}>
            <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
              Submission History
            </Typography>
            <SessionManageTable />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
