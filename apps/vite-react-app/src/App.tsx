import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { Toaster } from "@workspace/ui/components/sonner";
import { LoginPage } from './pages/Auth/Login/LoginPage';
import { QueryProvider } from './providers/QueryProvider';
import { AuthLayout } from './components/layouts/AuthLayout';
import { MainLayout } from './components/layouts/MainLayout';
import Dashboard from './pages/Dashboard/DashboardPage';
import UnauthorizedPage from './pages/Unauthorized/UnauthorizedPage';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { AuthGuard } from './components/Auth/AuthGuard';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from './components/Auth/AuthProvider';

function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <TooltipProvider>
          <PersistGate loading={null} persistor={persistor}>
            <QueryProvider>
              <AuthProvider>
                {/* <ThemeProvider> */}
                  <BrowserRouter>
                    <AuthGuard>
                      <Toaster />
                      <ReactQueryDevtools initialIsOpen={false} />
                      {/* <ThemeToggle /> */}
                      <Routes>

                        {/* Auth route - Public */}
                        <Route element={<AuthLayout />}>
                          <Route
                            path="/login"
                            element={
                              <ProtectedRoute requireAuth={false}>
                                <LoginPage />
                              </ProtectedRoute>
                            }
                          />
                        </Route>

                        {/* Protected Main Route */}
                        <Route element={<MainLayout />}>
                          <Route
                            path="/"
                            element={
                              <ProtectedRoute requiredRoles={['user', 'admin']}>
                                <Dashboard />
                              </ProtectedRoute>
                            }
                          />
                        </Route>

                        {/* Unauthorized Page - Public */}
                        <Route
                          path="/unauthorized"
                          element={
                            <ProtectedRoute requireAuth={false}>
                              <UnauthorizedPage />
                            </ProtectedRoute>
                          }
                        />

                        {/* Catch-all fallback */}
                        <Route
                          path="*"
                          element={
                            <ProtectedRoute>
                              <Dashboard />
                            </ProtectedRoute>
                          }
                        />

                      </Routes>
                    </AuthGuard>
                  </BrowserRouter>
                {/* </ThemeProvider> */}
              </AuthProvider>
            </QueryProvider>
          </PersistGate>
        </TooltipProvider>
      </Provider>
    </HelmetProvider>
  );
}

export default App;