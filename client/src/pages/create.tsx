import { FC } from 'react';
import Box from '@mui/material/Box';
import { SessionCreateForm } from '@components/session-create/session-create';
import { Layout } from '@layouts/layout';
import { NavBar } from '@components/navbar/navbar';

export const CreatePage: FC = () => {
  const drawerWidth = 20;
  return (
    <Layout title="Trusted Party" subtitle="Secure Session Creator" maxWidth="lg">
      <NavBar />
      <Box sx={{ ml: drawerWidth }}>
        <SessionCreateForm />
      </Box>
    </Layout>
  );
};
