import { FC, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Grid, Box, Typography, Stack } from '@mui/material';
import * as Yup from 'yup';
import { TextInput } from '@components/forms/text-input';
import { SubmitButton } from '@components/forms/submit-button';
import { getSubmissionUrls, createNewSubmissionUrls } from '@services/api';
import { useSession } from '@context/session.context';

export const LinkGenerator: FC = () => {
  const { sessionId } = useSession();
  const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);
  const [existingLinks, setExistingLinks] = useState<string[]>([]);
  useEffect(() => {
    getSubmissionUrls().then((urls) => {
      setExistingLinks(Object.values(urls));
    });
  }, []);

  const validationSchema = Yup.object().shape({
    count: Yup.number().integer().required('Please input the number of submitters for the BWWC 2023 Submission.')
  });

  const handleSubmit = (values: { count: number }) => {
    const numSubmitters = values.count;
    createNewSubmissionUrls(sessionId, numSubmitters).then((urls) => {
      setGeneratedLinks(Object.values(urls));
    });
  };

  return (
    <Grid container>
      <Grid item xs={12} md={4} sx={{ p: 1 }}>
        <Formik validationSchema={validationSchema} initialValues={{ count: 0 }} onSubmit={handleSubmit}>
          <Form>
            <Stack spacing={2}>
              <Typography variant="h5">Add Participants</Typography>
              <Typography variant="subtitle1">Generate more URLs for new participants.</Typography>
              <TextInput fullWidth name="count" label="New participants" type="number" />
              <SubmitButton type="submit" variant="contained" fullWidth>
                Submit
              </SubmitButton>
            </Stack>
          </Form>
        </Formik>
      </Grid>
      <Grid item xs={12} md={4} sx={{ p: 1 }}>
        <Stack spacing={2}>
          <Typography variant="h5">Generated Links</Typography>
          <Typography variant="subtitle1">The following links can be sent to participants to join the session.</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Stack spacing={2}>
              {generatedLinks.map((link, index) => (
                <Typography key={index} variant="subtitle1">
                  {link}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12} md={4} sx={{ p: 1 }}>
        <Stack spacing={2}>
          <Typography variant="h5">Existing Participant Links</Typography>
          <Typography variant="subtitle1">The following links can be sent to participants to join the session.</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Stack spacing={2}>
              {existingLinks.map((link, index) => (
                <Typography key={index} variant="subtitle1">
                  {link}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};
