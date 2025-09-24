
// MainLayout.tsx
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
// import { Sheet, SheetContent, SheetTrigger } from '@workspace/ui/components/sheet';
// import { Button } from '@workspace/ui/components/button';
// import { NavItem } from '@/components/common/NavItem';
// import { FolderItem } from '@/components/common/FolderItem';
// import { LayoutGrid, Menu, Users } from 'lucide-react';

// import logo from '@/assets/logo.webp';
import Header from './Header';

interface MainLayoutProps {
  children?: ReactNode;
}
// function SidebarContent() {
//   return (
//     <div className="h-full flex flex-col">
//       <div className="p-4 border-b mt-2 md:mt-0">
//         <div className="flex items-center space-x-3">
//           <img
//             src={logo}
//             alt="Company Logo"
//             className="h-8 w-auto max-w-full object-contain"
//           />
//           <h1 className="text-xl font-bold text-foreground">File Manager</h1>
//         </div>
//       </div>

//       <nav className="flex-1 space-y-1 px-2 py-4">
//         <NavItem href="#" icon={<LayoutGrid className="h-4 w-4" />} active>
//           Semua Dokumen
//         </NavItem>
//         <NavItem href="#" icon={<Users className="h-4 w-4" />}>
//           User Manajemen
//         </NavItem>

//         <div className="py-4">
//           <div className="px-3 text-xs font-semibold uppercase text-muted-foreground tracking-wide">
//             Folder Kategori
//           </div>
//           <div className="mt-3 space-y-1">
//             <FolderItem href="#">Surat</FolderItem>
//             <FolderItem href="#">Peraturan</FolderItem>
//             <FolderItem href="#">Kepegawaian</FolderItem>
//             <FolderItem href="#">Diklat</FolderItem>
//             <FolderItem href="#">Agenda Internal</FolderItem>
//             <FolderItem href="#">SOP</FolderItem>
//             <FolderItem href="#">Dokumen</FolderItem>
//             <FolderItem href="#">Kegiatan Eksternal</FolderItem>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }

export function MainLayout({ children }: MainLayoutProps) {

  return (
    <div className="flex h-screen bg-background">


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 mx-auto p-4 sm:p-6">
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