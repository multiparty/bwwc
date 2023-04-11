import { FC } from 'react';
import { SessionResult } from '@components/session-result/session-result';
import { Layout } from '@layouts/layout';
import { ToyResult } from '@constants/delete/toy-result';

export const ResultPage: FC = () => {
  return (
    <Layout title="Trusted Party" subtitle="Live Session Manager" maxWidth="lg">
      <SessionResult result={ToyResult} />
    </Layout>
  );
};
