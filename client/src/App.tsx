import { ThemeProvider } from '@theme/theme.provider';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Paths } from '@constants/paths';
import { HomePage } from '@pages/home';
import { Layout } from '@layouts/layout';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Router>
          <Routes>
            <Route path={Paths.HOME} element={<HomePage />} />
          </Routes>
        </Router>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
