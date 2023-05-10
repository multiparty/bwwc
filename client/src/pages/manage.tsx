import { FC } from 'react';
import { SessionManage } from '@components/session-manage/session-manage';
import { Layout } from '@layouts/layout';
import { NavBar } from '@components/navbar/navbar';

export const ManagePage: FC = () => {
  return (
    <Layout title="Trusted Party" subtitle="Live Session Manager" maxWidth="lg">
      <NavBar />
      <SessionManage />
    </Layout>
  );
};
