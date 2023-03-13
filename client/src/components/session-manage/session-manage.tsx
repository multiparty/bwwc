import { FC, useState } from 'react';
import { Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import CollapsibleTable from './table';
import { LinkGenerator } from './generate-link';
import { Buttons } from './buttons';

export const SessionManage: FC = (props) => {
  const [started, setStarted] = useState(false);
  const [stopped, setStopped] = useState(false);
  return (
    <Card>
      <CardContent sx={{ m: 2 }}>
        <Stack spacing={2} sx={{ textAlign: 'center' }}>
          <Typography component="h1" variant="h4">
            Manage Session
          </Typography>

          <Typography>Start a new session and generate link for partners</Typography>

          <Divider />

          <Grid container spacing={2} direction="column">
            <Grid item spacing={5} direction="row">
              <Buttons started={started} setStarted={setStarted} stopped={stopped} setStopped={setStopped} />
              <LinkGenerator started={started} stopped={stopped} />
            </Grid>

            <Grid item spacing={5} direction="column">
              <CollapsibleTable />
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};
