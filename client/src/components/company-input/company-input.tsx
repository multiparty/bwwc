import { FC, useState } from 'react';
import { Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '@components/forms/text-input';
import { AutoCompleteInput } from '@components/forms/auto-complete-input';
import { Industries } from '@constants/industries';
import { Sizes } from '@constants/sizes';
import { PasswordInput } from '@components/forms/password-input';

const validationSchema = Yup.object().shape({
  submissionId: Yup.string().required('Please input the 26-character BWWC 2023 Submission ID.').length(26, 'Submission ID must be 26 characters long.'),
  participationCode: Yup.string().required('Please input the 26-character participation code.').length(26, 'Participation Code must be 26 characters long.'),
  industry: Yup.string().required('Required'),
  size: Yup.string().required('Required')
});

export const CompanyInputForm: FC = () => {
  const [initialValues, setInitialValues] = useState({
    submissionId: '',
    participationCode: '',
    industry: undefined,
    size: undefined
  });

  return (
    <Card>
      <CardContent sx={{ m: 2 }}>
        <Stack spacing={2} sx={{ textAlign: 'center' }}>
          <Typography component="h1" variant="h4">
            Input your data
          </Typography>
          <Typography>
            Please make sure your BWWC 2023 Submission ID and participation code match the ones provided in the email sent to you by the Boston Women's Workforce Council. Drag and
            drop your completed template file to encrypt and include your submission in the aggregate data.
          </Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={console.log}>
                <Form>
                  <Stack spacing={2}>
                    <TextInput fullWidth name="submissionId" label="BWWC 2023 Submission ID" />
                    <PasswordInput fullWidth name="participationCode" label="Participation code" />
                    <AutoCompleteInput fullWidth name="industry" options={Industries} label="Industry selection" />
                    <AutoCompleteInput fullWidth name="size" options={Sizes} label="Size" />
                  </Stack>
                </Form>
              </Formik>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};
