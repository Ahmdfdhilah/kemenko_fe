// src/App.jsx
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
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './components/Auth/AuthProvider';
import ThemeToggle from './components/common/ThemeToggle';


function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <TooltipProvider>
          <PersistGate loading={null} persistor={persistor}>
            <QueryProvider>
              <AuthProvider>
                <ThemeProvider>
                  <BrowserRouter>
                    <Toaster />
                    <ThemeToggle />
                    <Routes>

                      {/* Auth route */}
                      <Route element={<AuthLayout />}>
                        <Route path="/login" element={<LoginPage />} />
                      </Route>

                      {/* Protected Main Route */}
                      <Route element={<MainLayout />}>
                        <Route index element={<Dashboard />} />
                      </Route>


                    </Routes>
                  </BrowserRouter>
                </ThemeProvider>
              </AuthProvider>
            </QueryProvider>
          </PersistGate>
        </TooltipProvider>
      </Provider>
    </HelmetProvider>
  );
}

export default App;