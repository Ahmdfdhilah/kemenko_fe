import { Folder } from "lucide-react"
import { Link } from "react-router-dom";

export function FolderItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      to={href} 
      className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-150 group"
    >
      <Folder className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
      <span className="font-medium">{children}</span>
    </Link>
  )
}