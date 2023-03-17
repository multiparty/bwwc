import { ThemeProvider } from '@theme/theme.provider';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
            <Route path='/' element={<HomePage />} />
            <Route path='/create' element={<CreatePage />} />
            <Route path='/manage' element={<ManagePage />} />
          </Routes>
        </Router>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
