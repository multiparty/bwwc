import { FC, useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { Card, CardContent, Grid, Box, Typography, Stack, Divider, Button, Snackbar } from '@mui/material';
import * as Yup from 'yup';
import { TextInput } from '@components/forms/text-input';
import { SubmitButton } from '@components/forms/submit-button';
import { useApi } from '@services/api';
import { AppState } from '@utils/data-format';
import { useSelector } from 'react-redux';
import CopyAllIcon from '@mui/icons-material/CopyAll';

type CopyToClipboardButtonProps = {
  links: string[];
};

function CopyToClipboardButton(props: CopyToClipboardButtonProps) {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
    const linksToCopy = props.links.join('\r\n');
    navigator.clipboard.writeText(linksToCopy);
  };

  return (
    <>
      <Button onClick={handleClick}>
        <CopyAllIcon color="action" />
      </Button>

      <Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={2000} message="Copied to clipboard" />
    </>
  );
}

export const LinkGenerator: FC = () => {
  const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);
  const [existingLinks, setExistingLinks] = useState<string[]>([]);
  const { createNewSubmissionUrls } = useApi();
  const { sessionId, authToken } = useSelector((state: AppState) => state.session);

  const validationSchema = Yup.object().shape({
    count: Yup.number().positive().integer().required('Please input the number of submitters for the BWWC 2023 Submission.')
  });

  const handleSubmit = (values: { count: number }, { setSubmitting }: FormikHelpers<any>) => {
    if (generatedLinks.length != 0) {
      setExistingLinks([...existingLinks, ...generatedLinks]);
    }
    createNewSubmissionUrls(values.count, sessionId, authToken)
      .then((urls) => {
        setGeneratedLinks(Object.values(urls));
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Stack spacing={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <Box style={{ width: '50%' }}>
        <Formik validationSchema={validationSchema} initialValues={{ count: 0 }} onSubmit={handleSubmit}>
          <Form>
            <Stack spacing={0}>
              <Typography variant="h5">Add Participants</Typography>
              <Stack spacing={2}>
                <Typography variant="subtitle1">Generate more URLs for new participants.</Typography>

                <TextInput fullWidth name="count" label="New participants" type="number" />
                <SubmitButton type="submit" variant="contained" fullWidth>
                  Submit
                </SubmitButton>
              </Stack>
            </Stack>
          </Form>
        </Formik>
      </Box>

      {generatedLinks.length != 0 && (
        <Stack spacing={0}>
          <Typography variant="h5">Generated Links</Typography>
          <Typography variant="subtitle1">The following links can be sent to participants to join the session.</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Card>
              <Grid container direction="row" alignItems="center" sx={{ justifyContent: 'flex-end' }}>
                <Grid item sx={{ marginLeft: 'auto' }}>
                  <CopyToClipboardButton links={generatedLinks} />
                </Grid>
              </Grid>
              <CardContent>
                <Stack spacing={0}>
                  {generatedLinks.map((link, index) => (
                    <Typography key={index} variant="subtitle1">
                      {link}
                    </Typography>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      )}

      {existingLinks.length != 0 && (
        <Stack spacing={0}>
          <Typography variant="h5">Existing Participant Links</Typography>
          <Typography variant="subtitle1">The following links can be sent to participants to join the session.</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Card>
              <Grid container direction="row" alignItems="center" sx={{ justifyContent: 'flex-end' }}>
                <Grid item sx={{ marginLeft: 'auto' }}>
                  <CopyToClipboardButton links={existingLinks} />
                </Grid>
              </Grid>
              <CardContent>
                <Stack spacing={0}>
                  {existingLinks.map((link, index) => (
                    <Typography key={index} variant="subtitle1">
                      {link}
                    </Typography>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      )}
    </Stack>
  );
};
