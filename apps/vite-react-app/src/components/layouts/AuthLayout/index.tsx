import { ReactNode, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import loginImg from '@/assets/hero/img3.jpg';
import logo from '@/assets/logo.webp';

interface AuthLayoutProps {
  children?: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden md:flex md:flex-2 bg-card relative overflow-hidden flex-col">
        <div
          className="flex-1 relative"
          style={{
            backgroundImage: `url(${loginImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-background/20 to-transparent" />
        </div>
      </div>

      {/* Right Section - Form Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 bg-gradient-to-tl from-card to-background/50 backdrop-blur-sm">
        <div className="w-full max-w-md relative">
          {/* Logo and Company Name */}
          <div className="flex flex-col items-center mb-8">
            <img 
              src={logo} 
              alt="Company Logo" 
              className="w-16 h-16 mb-4 object-contain"
            />
            <h1 className="text-2xl font-bold text-foreground mb-2">
             Inspektorat Kemenko Pangan RI
            </h1>
            <p className="text-sm text-muted-foreground text-center">
             Aplikasi Manajemen Folder
            </p>
          </div>
          
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
}