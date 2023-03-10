import { FC, useState } from 'react';
import { Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { TextInput } from '@components/forms/text-input';

const validationSchema = Yup.object().shape({
  submitterCount: Yup.number()
  .integer()
  .required('Please input the number of submitters for the BWWC 2023 Submission.'),
});

export const SessionManage: FC = (props) => {
  const [initialValues, setInitialValues] = useState({
    SubmitterCount: 1
  });

  const [started, setStarted] = useState(false);
  const [stopped, setStopped] = useState(false);

  return (
    <Card>
      <CardContent sx={{ m: 2 }}>
        <Stack spacing={2} sx={{ textAlign: 'center' }}>
          <Typography component="h1" variant="h4">
            Manage Session
          </Typography>

          <Typography>Input your session title and description</Typography>

          <Divider />

          <Grid container spacing={5} >
            <Grid item xs={6} md={6} sx={{ justifyContent: 'left', alignItems: 'flex-start', textAlign: 'center' }}>
              <Stack spacing={2}>
                {stopped ? null : started ? (
                  <Button variant="outlined" size="large" style={{ width: '100px' }} onClick={() => setStarted(false)}>
                    Paused
                  </Button>
                ) : (
                  <Button variant="contained" color="success" size="large" style={{ width: '100px' }} onClick={() => setStarted(true)}>
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
                    onClick={() => {
                      setStopped(true);
                    }}
                  >
                    Stop
                  </Button>
                )}
              
              </Stack>
            </Grid>
            
            <Grid item xs={6} md={6} sx={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <Formik
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={(values, { setSubmitting }) => {
                  console.log(values);
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Grid item xs={6} md={6} sx={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                      <TextInput fullWidth name="submitterCount" style={{ width: '150px' }} label="How many submitters?" />
                      <Button variant="contained" disabled={isSubmitting} style={{ width: '100px' }} > Generate Submission Link</Button>
                    </Grid>
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
