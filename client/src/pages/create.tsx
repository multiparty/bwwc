import { FC } from 'react';
import { Stack } from '@mui/material';
import { SessionCreateForm } from '@components/session-create/session-create';
import { Layout } from '@layouts/layout';

export const CreatePage: FC = () => {
  return (
    <Layout title="Trusted Party" subtitle="Secure Session Creator">
      <Stack spacing={5}>
        <SessionCreateForm />
      </Stack>
    </Layout>
  );
};
