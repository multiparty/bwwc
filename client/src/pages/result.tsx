import { FC } from 'react';
import { AppState } from '@utils/data-format';
import { SessionResult } from '@components/session-result/session-result';
import { Layout } from '@layouts/layout';
import { useSelector } from 'react-redux';

export const ResultPage: FC = () => {
  const { decodedTable } = useSelector((state: AppState) => state.session);
  return (
    <Layout title="Trusted Party" subtitle="Live Session Manager" maxWidth="lg">
      <SessionResult result={decodedTable} />
    </Layout>
  );
};
