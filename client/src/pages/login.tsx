import { FC } from 'react';
import { Layout } from '@layouts/layout';
import { Card, CardContent, CardHeader, Divider, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { TextInput } from '@components/forms/text-input';
import { PasswordInput } from '@components/forms/password-input';
import { SubmitButton } from '@components/forms/submit-button';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  sessionId: Yup.string().required('Please input the 26-character BWWC 2023 Submission ID.').length(26, 'Submission ID must be 26 characters long.'),
  sessionPassword: Yup.string().required('Please input the 26-character session password.').length(26, 'Session passwords must be 26 characters long.')
});

export const LoginPage: FC = () => {
  return (
    <Layout title="Trusted Party" subtitle="Live Session Manager">
      <Card>
        <CardHeader title="Enter Session details" />
        <CardContent>
          <Formik
            initialValues={{
              sessionId: '',
              sessionPassword: ''
            }}
            validationSchema={validationSchema}
            onSubmit={console.log}
          >
            <Form>
              <Stack spacing={2}>
                <TextInput fullWidth name="sessionId" label="BWWC 2023 Submission ID" />
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
