
// MainLayout.tsx
import Footer from '@/components/common/Footer';
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {

  return (
    <div className="flex  flex-col bg-background">
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer/>
    </div>
  );
}