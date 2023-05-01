import { Stack } from '@mui/material';
import { DecryptInputForm } from '@components/session-decrypt/decrypt-input';
import { Layout } from '@layouts/layout';

export const DecryptPage = () => {

  return (
    <Layout title="Boston Women's Workforce Council" subtitle="100% Talent Data Submission">
      <Stack spacing={5}>
        <DecryptInputForm />
      </Stack>
    </Layout>
  );
};
