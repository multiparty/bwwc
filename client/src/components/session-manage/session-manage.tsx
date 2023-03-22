import { FC } from 'react';
import { Button, Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import CollapsibleTable from './table';
import { LinkGenerator } from './generate-link';
import { useSession } from '@context/session.context';
import { endSession } from '@services/api';

export const SessionManage: FC = () => {
  const { sessionId } = useSession();
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
              <Button fullWidth variant="outlined" color="error" onClick={() => endSession(sessionId)}>
                Stop Session
              </Button>
            </Stack>
            <Divider />
            <LinkGenerator />
          </Stack>
        </CardContent>
      </Card>
      <CollapsibleTable />
    </Stack>
  );
};
