import { FC, useEffect } from 'react';
import { Layout } from '@layouts/layout';
import { Card, CardContent, CardHeader, Divider, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { TextInput } from '@components/forms/text-input';
import { PasswordInput } from '@components/forms/password-input';
import { SubmitButton } from '@components/forms/submit-button';
import * as Yup from 'yup';
import { useSession } from '@context/session.context';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  sessionId: Yup.string().required('Please input the 26-character Session ID.').length(26, 'Session ID must be 26 characters long.'),
  sessionPassword: Yup.string().required('Please input the 26-character session password.').length(26, 'Session passwords must be 26 characters long.')
});

export const LoginPage: FC = () => {
  const { sessionId, sessionPassword, setSessionId, setSessionPassword } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId && sessionPassword) {
      navigate('/manage');
    }
  }, [sessionId, sessionPassword]);

  return (
    <Layout title="Trusted Party" subtitle="Live Session Manager">
      <Card>
        <CardHeader title="Enter Session details" />
        <CardContent>
          <Formik
            enableReinitialize={true}
            initialValues={{
              sessionId,
              sessionPassword
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              setSessionId(values.sessionId);
              setSessionPassword(values.sessionPassword);
            }}
          >
            <Form>
              <Stack spacing={2}>
                <TextInput fullWidth name="sessionId" label="Session ID" />
                <PasswordInput fullWidth name="sessionPassword" label="Session password" />
                <SubmitButton fullWidth variant="contained">
                  Submit
                </SubmitButton>
              </Stack>
            </Form>
          </Formik>
        </CardContent>
      </Card>
    </Layout>
  );
};
