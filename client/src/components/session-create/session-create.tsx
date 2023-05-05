import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Checkbox, Divider, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material';
import { AppState } from '@utils/data-format';
import { TextInput } from '@components/forms/text-input';
import { Form, Formik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { LockOpenTwoTone, LockTwoTone, DownloadTwoTone } from '@mui/icons-material';
import { useApi } from '@services/api';
import { setPublicKey, setPrivateKey, setSessionId, setPrime } from '../../redux/session';
import { useSelector, useDispatch } from 'react-redux';

export const SessionCreateForm: FC = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const { startSession } = useApi();
  const { privateKey, sessionId } = useSelector((state: AppState) => state.session);

  useEffect(() => {
    // create key file to download
    const blob = new Blob([privateKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    setFileUrl(url);
  }, [privateKey]);

  const handleClick = async () => {
    setLoading(true);
    const { privateKey, publicKey, sessionId, prime } = await startSession();
    localStorage.removeItem('generatedUrls');
    dispatch(setSessionId(sessionId));
    dispatch(setPrivateKey(privateKey));
    dispatch(setPublicKey(publicKey));
    dispatch(setPrime(prime));
    setPublicKey(publicKey);
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
              <LoadingButton disabled={!!sessionId} loading={loading} fullWidth variant="contained" onClick={handleClick} id="creare-submission">
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
                  href={fileUrl}
                  download={`privateKey-${sessionId}.pem`}
                  id="downloadKey"
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
              <Button disabled={!checked || !privateKey || !sessionId} variant="contained" onClick={() => navigate('/manage')} id="manage-session">
                Manage Session
              </Button>
            </Stack>
          </Form>
        </Formik>
      </CardContent>
    </Card>
  );
};
