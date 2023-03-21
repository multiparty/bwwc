import { ThemeProvider } from '@theme/theme.provider';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from '@pages/home';
import { CreatePage } from '@pages/create';
import { ManagePage } from '@pages/manage';
import { SessionProvider } from '@context/session.context';
import { AdminGuard } from '@guards/admin.guard';
import { Paths } from '@constants/paths';
import { AuthProvider } from '@context/auth.context';
import { AuthCallback } from '@pages/auth-callback';
import { PermissionRequiredPage } from '@pages/permission-required';
import { Page404 } from '@pages/404';
import { LogoutPage } from '@pages/logout';

function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route element={<AdminGuard />}>
                <Route path={Paths.MANAGE} element={<ManagePage />} />
                <Route path={Paths.CREATE} element={<CreatePage />} />
              </Route>
              <Route path={Paths.HOME} element={<HomePage />} />
              <Route path={Paths.AUTH_CALLBACK} element={<AuthCallback />} />
              <Route path={Paths.PERMISSION_REQUIRED} element={<PermissionRequiredPage />} />
              <Route path={Paths.LOGOUT} element={<LogoutPage />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </SessionProvider>
    </AuthProvider>
  );
}

export default App;
