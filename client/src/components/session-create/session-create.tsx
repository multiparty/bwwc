import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Checkbox, Divider, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material';
import { startSession } from '@services/api';
import { useSession } from '@context/session.context';
import { TextInput } from '@components/forms/text-input';
import { Form, Formik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { LockOpenTwoTone, LockTwoTone, DownloadTwoTone } from '@mui/icons-material';

export const SessionCreateForm: FC = (props) => {
  const navigate = useNavigate();
  const { sessionId, setSessionId } = useSession();
  const [privateKey, setPrivateKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  const handleClick = async () => {
    setLoading(true);
    const { sessionId, privateKey } = await startSession('dummy_auth_token');
    setPrivateKey(privateKey);
    setSessionId(sessionId);
    setLoading(false);
  };

  return (
    <Card>
      <CardContent sx={{ m: 2 }}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            sessionId,
            privateKey
          }}
          onSubmit={() => {}}
        >
          <Form>
            <Stack spacing={2}>
              <LoadingButton disabled={!!sessionId} loading={loading} fullWidth variant="contained" onClick={handleClick}>
                Create New Session
              </LoadingButton>
              <Divider sx={{ p: 1 }} />
              <Stack spacing={2} direction="row" alignItems="center">
                <LockOpenTwoTone />
                <Typography variant="h5">BWWC 2023 Submission ID</Typography>
              </Stack>
              <Typography variant="subtitle1">
                The BWWC 2023 Submission ID is a unique identifier for this session. It will be provided to participants as well. Please record this in order to manage the session
                and verify that participants are in the correct session.
              </Typography>
              <TextInput disabled fullWidth name="sessionId" label="Submission ID" />
              <Stack spacing={2} direction="row" alignItems="center">
                <LockTwoTone />
                <Typography variant="h5">Private Key</Typography>
              </Stack>
              <Typography variant="subtitle1">
                The private key is required to receive results. Without it, none of the data will be accessible. Do not share your private key with anyone.
              </Typography>
              <TextInput disabled fullWidth multiline name="privateKey" label="Private Key" rows={4} />
              <Box>
                <Button
                  disabled={!privateKey}
                  variant="contained"
                  startIcon={<DownloadTwoTone />}
                  component="a"
                  href={`data:${privateKey}`}
                  download={`${sessionId}-privateKey.pem`}
                >
                  Download Private Key
                </Button>
              </Box>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox value={checked} onChange={(event) => setChecked(event.target.checked)} />}
                  label="I have saved the BWWC 2023 Submission ID, and private key in a secure location."
                />
              </FormGroup>
              <Button disabled={!checked && !privateKey && !sessionId} variant="contained">
                Manage Session
              </Button>
            </Stack>
          </Form>
        </Formik>
      </CardContent>
    </Card>
  );
};
