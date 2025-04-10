import { FC, useState, useEffect } from 'react';
import { Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import { Form, Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '@components/forms/text-input';
import { CompanyAutoCompleteInput } from '@components/forms/auto-complete-input';
import { Industries } from '@constants/industries';
import { Sizes } from '@constants/sizes';
import { PasswordInput } from '@components/forms/password-input';
import { CustomFile, FileUpload } from '@components/file-upload/file-upload';
import { useSession } from '@context/session.context';
import { setSessionId, setParticipantCode, setIndustry, setCompanySize } from '../../redux/session';
import { useDispatch } from 'react-redux';

const validationSchema = Yup.object().shape({
  submissionId: Yup.string().required('Please input the 26-character BWWC 2025 Submission ID.').length(26, 'Submission ID must be 26 characters long.'),
  participationCode: Yup.string().required('Please input the participation code.').length(26, 'Participation code must be 26 characters long.'),
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
  const dispatch = useDispatch();

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id') || '';
  const participantToken = urlParams.get('participant_code') || '';

  const [initialValues, setInitialValues] = useState({
    submissionId: sessionId,
    participationCode: participantToken,
    industry: '',
    size: ''
  });

  const FormObserver: React.FC = () => {
    const { values } = useFormikContext<valueProps>();
    useEffect(() => {
      dispatch(setSessionId(values.submissionId));
      dispatch(setParticipantCode(values.participationCode));
      dispatch(setIndustry(values.industry));
      dispatch(setCompanySize(values.size));
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
            Please make sure your BWWC 2025 Submission ID and participation code match the ones provided in the email sent to you by the Boston Women's Workforce Council. Drag and
            drop your completed template file to encrypt and include your submission in the aggregate data.
          </Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={() => {}}>
                <Form>
                  <FormObserver />
                  <Stack spacing={2}>
                    <TextInput fullWidth name="submissionId" label="BWWC 2025 Submission ID" data-cy="submissionID" />
                    <PasswordInput fullWidth name="participationCode" label="Participation code" data-cy="sessionCode" />
                    <CompanyAutoCompleteInput fullWidth name="industry" options={Industries} label="Industry selection" data-cy="industry" />
                    <CompanyAutoCompleteInput fullWidth name="size" options={Sizes} label="Size" data-cy="size" />
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
