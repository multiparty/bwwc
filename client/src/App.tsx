import { ThemeProvider } from '@theme/theme.provider';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Paths } from '@constants/paths';
import { HomePage } from '@pages/home';
import { CreatePage } from '@pages/create';
import { ManagePage } from '@pages/manage';
import { Layout } from '@layouts/layout';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Router>
          <Routes>
            <Route path={Paths.HOME} element={<HomePage />} />
            <Route path={Paths.CREATE} element={<CreatePage />} />
            <Route path={Paths.MANAGE} element={<ManagePage />} />
          </Routes>
        </Router>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
