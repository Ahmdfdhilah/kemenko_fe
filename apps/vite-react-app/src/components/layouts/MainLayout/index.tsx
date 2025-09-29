
// MainLayout.tsx
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {

  return (
    <div className="flex h-screen bg-background">

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 mx-auto p-2">
        <div className="mb-4">
          <Header />
        </div>
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}