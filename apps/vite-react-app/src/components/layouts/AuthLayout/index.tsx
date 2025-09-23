import { ReactNode, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthLayoutProps {
  children?: ReactNode;
  rightSectionImage?: string;
}

export function AuthLayout({
  children,
  rightSectionImage = ""
}: AuthLayoutProps) {
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
      {/* Left Section - Form Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-md">
          {children || <Outlet />}
        </div>
      </div>

      {/* Right Section - Background Image */}
      <div
        className="hidden md:flex md:flex-1"
        style={{
          backgroundImage: `url(${rightSectionImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}