import { FC } from 'react';
import { SessionCreateForm } from '@components/session-create/session-create';
import { Layout } from '@layouts/layout';
import { NavBar } from '@components/navbar/navbar';

export const CreatePage: FC = () => {
  return (
    <Layout title="Trusted Party" subtitle="Secure Session Creator" maxWidth="lg">
      <NavBar />
      <SessionCreateForm />
    </Layout>
  );
};
