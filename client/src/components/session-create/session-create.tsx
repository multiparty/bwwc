import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { TextInput } from '@components/forms/text-input';
import { MultilineTextInput } from '@components/forms/multiline-text-input';

const validationSchema = Yup.object().shape({
  sessionTitle: Yup.string().required('Please input the title for the BWWC 2023 Submission.'),
  sessionDescription: Yup.string().required('Please input the project description for the BWWC 2023 Submission.')
});

export const SessionCreateForm: FC = (props) => {
  const [initialValues, setInitialValues] = useState({
    sessionTitle: null,
    sessionDescription: null
  });

  const navigate = useNavigate();

  function handleClick() {
    navigate('/manage');
  }

  return (
    <Card>
      <CardContent sx={{ m: 2 }}>
        <Stack spacing={2} sx={{ textAlign: 'center' }}>
          <Typography component="h1" variant="h4">
            Create Session
          </Typography>
          <Typography>Input your session title and description</Typography>
          <Divider />
          <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              <Formik
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(false);
                }}
                validateOnMount={true}
              >
                {({ isSubmitting, isValid }) => (
                  <Form>
                    <Stack spacing={2}>
                      <TextInput fullWidth name="sessionTitle" label="Session title" />
                      <MultilineTextInput fullWidth name="sessionDescription" label="Session Description" />
                    </Stack>
                    {isValid && (
                      <LoadingButton type="submit" disabled={isSubmitting} sx={{ justifyContent: 'center', width: '10%' }} onClick={handleClick}>
                        Submit
                      </LoadingButton>
                    )}
                  </Form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};
