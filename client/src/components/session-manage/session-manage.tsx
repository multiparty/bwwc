import { useState, FC, useEffect } from 'react';
import { Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { TextInput } from '@components/forms/text-input';
import CollapsibleTable from './table';
import { LinkGenerator } from './generate-link';
import { useApi } from '@services/api';
import * as Yup from 'yup';
import { Form, Formik, useFormikContext } from 'formik';
import { useSession } from '@context/session.context';

const validationSchema = Yup.object().shape({
  submissionId: Yup.string().required('Please input the 26-character BWWC 2023 Submission ID.').length(26, 'Submission ID must be 26 characters long.')
});

interface valueProps {
  submissionId: string;
}

export const SessionManage: FC = () => {
  const { endSession } = useApi();
  const urlParams = new URLSearchParams(window.location.search);
  const session_id = urlParams.get('session_id') || '';
  const { sessionId, setSessionId } = useSession();

  const [initialValues, setInitialValues] = useState({
    submissionId: session_id
  });

  const FormObserver: React.FC = () => {
    const { values } = useFormikContext<valueProps>();
    useEffect(() => {
      // Todo: Update this section
      // setSessionId(values.submissionId);
    }, [values]);
    return null;
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
              <Button fullWidth variant="outlined" color="error" onClick={endSession}>
                Stop Session
              </Button>
            </Stack>

            <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={console.log}>
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
      <CollapsibleTable />
    </Stack>
  );
};
