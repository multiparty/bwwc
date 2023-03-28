import { FC, useState, useEffect } from 'react';
import { Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import { Form, Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '@components/forms/text-input';
import { AutoCompleteInput } from '@components/forms/auto-complete-input';
import { Industries } from '@constants/industries';
import { Sizes } from '@constants/sizes';
import { PasswordInput } from '@components/forms/password-input';
import { CustomFile, FileUpload } from '@components/file-upload/file-upload';
import { useSession } from '@context/session.context';

const validationSchema = Yup.object().shape({
  submissionId: Yup.string().required('Please input the 26-character BWWC 2023 Submission ID.').length(26, 'Submission ID must be 26 characters long.'),
  participationCode: Yup.string().required('Please input the 26-character participation code.').length(26, 'Participation Code must be 26 characters long.'),
  industry: Yup.string().required('Required'),
  size: Yup.string().required('Required')
});

export interface CompanyInputFormProps {
  onFileUpload: (file: CustomFile) => void;
}

interface valueProps {
  submissionId: string;
  participationCode: string;
  industry: string;
  size: string;
}

export const CompanyInputForm: FC<CompanyInputFormProps> = (props) => {
  const urlParams = new URLSearchParams(window.location.search);
  const session_id = urlParams.get('session_id') || '';
  const participant_token = urlParams.get('participant_code') || '';

  const { setSessionId, setParticipantCode, setIndustry, setCompanySize } = useSession();
  const [initialValues, setInitialValues] = useState({
    submissionId: session_id,
    participationCode: participant_token,
    industry: undefined,
    size: undefined
  });

  const FormObserver: React.FC = () => {
    const { values } = useFormikContext<valueProps>();
    useEffect(() => {
      setSessionId(values.submissionId);
      setParticipantCode(values.participationCode);
      setIndustry(values.industry);
      setCompanySize(values.size);
    }, [values]);
    return null;
  };

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
                  <FormObserver />
                  <Stack spacing={2}>
                    <TextInput fullWidth name="submissionId" label="BWWC 2023 Submission ID" />
                    <PasswordInput fullWidth name="participationCode" label="Participation code" />
                    <AutoCompleteInput fullWidth name="industry" options={Industries} label="Industry selection" />
                    <AutoCompleteInput fullWidth name="size" options={Sizes} label="Size" />
                  </Stack>
                </Form>
              </Formik>
            </Grid>
            <Grid item xs={12} md={6}>
              <FileUpload multiple={false} onChange={(file) => props.onFileUpload(file[0])} title="Drag and drop your completed template file here" />
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};
