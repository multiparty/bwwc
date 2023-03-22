import { FC } from 'react';
import { SessionManage } from '@components/session-manage/session-manage';
import { Layout } from '@layouts/layout';

export const ManagePage: FC = () => {
  return (
    <Layout title="Trusted Party" subtitle="Live Session Manager" maxWidth="lg">
      <SessionManage />
    </Layout>
  );
};
