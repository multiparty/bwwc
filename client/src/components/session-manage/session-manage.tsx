import { useState, FC, useEffect } from 'react';
import { Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { TextInput } from '@components/forms/text-input';
import { SessionManageTable } from './session-manage-table';
import { LinkGenerator } from './generate-link';
import { useApi, getPrime } from '@services/api';
import * as Yup from 'yup';
import { Form, Formik, useFormikContext } from 'formik';
import { AppState } from '@utils/data-format';
import { useSelector, useDispatch } from 'react-redux';
import { setSessionId, setPrime } from '../../redux/session';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  submissionId: Yup.string().required('Please input the 26-character BWWC 2023 Submission ID.').length(26, 'Submission ID must be 26 characters long.')
});

interface valueProps {
  submissionId: string;
}

export const SessionManage: FC = () => {
  const { stopSession } = useApi();
  const dispatch = useDispatch();
  const urlParams = new URLSearchParams(window.location.search);
  const { sessionId, authToken } = useSelector((state: AppState) => state.session);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    submissionId: sessionId
  });
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    const sessionIdfromStorage = localStorage.getItem('sessionId');
    const primefromStorage = localStorage.getItem('prime');
    dispatch(setSessionId(sessionIdfromStorage));
    dispatch(setPrime(primefromStorage));
  }, []);

  const FormObserver: React.FC = () => {
    const { values } = useFormikContext<valueProps>();
    useEffect(() => {
      async function updateIDandPrime() {
        setSessionId(values.submissionId);
        if (values.submissionId !== '') {
          dispatch(setSessionId(values.submissionId));
          const prime = await getPrime(sessionId);
          setPrime(prime);
          dispatch(setPrime(prime));
        }
      }
      updateIDandPrime();
    }, [values]);
    return null;
  };

  function revealResult() {
    navigate('/decrypt');
  }
  const handleClick = async () => {
    setStopped(true);
    stopSession(sessionId, authToken);
  };

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

              {stopped ? (
                <Button fullWidth variant="outlined" color="success" onClick={revealResult} id="reveal">
                  Reveal Result
                </Button>
              ) : (
                <Button fullWidth variant="outlined" color="error" onClick={handleClick} id="stop">
                  Stop Session
                </Button>
              )}
            </Stack>

            <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={() => {}}>
              <Form>
                <FormObserver />
                <Stack spacing={2}>
                  <TextInput fullWidth name="submissionId" label="BWWC 2023 Submission ID" sx={{ width: '49%' }} />
                </Stack>
              </Form>
            </Formik>

            <Divider />
            <LinkGenerator />
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Stack spacing={2} sx={{ textAlign: 'center', alignItems: 'center' }}>
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
