import { ThemeProvider } from '@theme/theme.provider';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from '@pages/home';
import { CreatePage } from '@pages/create';
import { ManagePage } from '@pages/manage';
import { LoginPage } from '@pages/login';
import { SessionProvider } from '@context/session.context';

function App() {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default App;
