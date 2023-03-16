import { FC } from 'react';
import { Grid, Stack } from '@mui/material';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ButtonProps {
  started: boolean;
  setStarted: (value: boolean) => void;
  stopped: boolean;
  setStopped: (value: boolean) => void;
}

export const Buttons: FC<ButtonProps> = ({ started, setStarted, stopped, setStopped }) => {
  return (
    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', textAlign: 'center' }}>
      <Stack spacing={2} direction="row">
        {started ? (
          <Button variant="outlined" size="large" style={{ width: '100px' }} disabled={stopped} onClick={() => setStarted(false)}>
            Paused
          </Button>
        ) : (
          <Button variant="contained" color="success" size="large" style={{ width: '100px' }} disabled={stopped} onClick={() => setStarted(true)}>
            Start
          </Button>
        )}
        {stopped ? (
          <Button variant="outlined" size="large" style={{ width: '100px' }} endIcon={<SendIcon />}>
            Unmask
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="error"
            size="large"
            style={{ width: '100px' }}
            disabled={!started}
            onClick={() => {
              setStopped(true);
            }}
          >
            Stop
          </Button>
        )}
      </Stack>
    </Grid>
  );
};
