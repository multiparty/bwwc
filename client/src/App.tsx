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
import { ApiProvider } from '@services/api';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SessionProvider>
          <ApiProvider>
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
          </ApiProvider>
        </SessionProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;
