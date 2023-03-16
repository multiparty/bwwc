import { FC, useState } from 'react';
import { Formik, Form } from 'formik';
import { Grid, Button, Box } from '@mui/material';
import * as Yup from 'yup';
import { TextInput } from '@components/forms/text-input';

interface GeneratorProps {
  started: boolean;
  stopped: boolean;
}

export const LinkGenerator: FC<GeneratorProps> = ({ started, stopped }) => {
  const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);
  const [submitterCount, setSubmitterCount] = useState({
    SubmitterCount: 0
  });

  const validationSchema = Yup.object().shape({
    SubmitterCount: Yup.number().integer().required('Please input the number of submitters for the BWWC 2023 Submission.')
  });

  const handleSubmit = (values: { SubmitterCount: number }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    const numSubmitters = values.SubmitterCount;
    const numExistiing = generatedLinks.length;
    const newLink = [];

    for (var i = 0; i < numSubmitters; i++) {
      newLink.push(`http://127.0.0.1:5173/session ${i + numExistiing + 1}`);
    }
    setGeneratedLinks([...generatedLinks, ...newLink]);
    setSubmitting(false);
  };

  return (
    <Grid container spacing={6} direction="row">
      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', textAlign: 'center' }}>
        {started && !stopped && (
          <Formik validationSchema={validationSchema} initialValues={submitterCount} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                  <Grid item xs={12} md={8}>
                    <TextInput fullWidth name="SubmitterCount" label="How many submitters?" />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button type="submit" variant="contained" disabled={isSubmitting} style={{ width: '100%' }}>
                      Generate Link
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        )}
      </Grid>

      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', textAlign: 'center' }}>
        <Box sx={{ mt: 2 }}>
          <h4>Generated Links:</h4>
          <ul>
            {generatedLinks.map((link, index) => (
              <li key={index}>{link}</li>
            ))}
          </ul>
        </Box>
      </Grid>
    </Grid>
  );
};
