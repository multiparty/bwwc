import { FC } from 'react';
import { SessionResult } from '@components/session-result/session-result';
import { Layout } from '@layouts/layout';

export const ResultPage: FC = () => {

  return (
    <Layout title="Trusted Party" subtitle="Live Session Manager" maxWidth="lg">
      <SessionResult />
    </Layout>
  );
};
