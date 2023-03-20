import { FC } from 'react';
import { SessionCreateForm } from '@components/session-create/session-create';
import { Layout } from '@layouts/layout';

export const CreatePage: FC = () => {
  return (
    <Layout title="Trusted Party" subtitle="Secure Session Creator">
        <SessionCreateForm />
    </Layout>
  );
};
