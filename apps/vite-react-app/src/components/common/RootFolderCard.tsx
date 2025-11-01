import { Button } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import { FolderOpen, ChevronDown, Trash2, Edit, UserCheck } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { FolderBase } from "@/services/folders/types"
import { formatDate } from "@/utils/date"
import { ScrollToTopLink } from "./ScrollToTopLink"

interface RootFolderCardProps {
    folder: FolderBase;
    isAdmin?: boolean;
    onUpdate?: (id: string) => void;
    onDelete?: (id: string) => void;
    onManagePermissions?: (id: string) => void;
}

export function RootFolderCard({
    folder,
    isAdmin = false,
    onUpdate,
    onDelete,
    onManagePermissions
}: RootFolderCardProps) {
    const handleUpdate = () => {
        if (onUpdate) {
            onUpdate(folder.id);
        }
    }

    const handleDelete = () => {
        if (onDelete) {
            onDelete(folder.id);
        }
    }

    const handleManagePermissions = () => {
        if (onManagePermissions) {
            onManagePermissions(folder.id);
        }
    }

   

    return (
        <div className="group relative overflow-hidden rounded-xl border shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:border-primary/50 min-h-[280px] flex flex-col">
            {/* Decorative Background Pattern */}
            <svg
                className="absolute bottom-0 left-0 mb-8 opacity-5 text-chart-1"
                viewBox="0 0 375 283"
                fill="none"
                style={{ transform: 'scale(1.5)' }}
            >
                <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="currentColor" />
                <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="currentColor" />
            </svg>

            {/* Content Section */}
            <div className="relative p-8 flex-1 flex flex-col">
                <div className="mb-3">
                    <p className="text-xs uppercase tracking-wide font-medium opacity-60 text-chart-1">
                        Diperbarui {formatDate(folder.updated_at)}
                    </p>
                </div>

                <div className="flex justify-between items-start gap-3 mb-6 flex-1">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-2xl text-foreground mb-3 line-clamp-2 leading-tight">
                            {folder.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {folder.description}
                        </p>
                    </div>
                </div>

                {/* Button Group dengan Dropdown */}
                <ButtonGroup className="w-full">
                    <ScrollToTopLink to={`/folders/${folder.id}`} className="flex-1">
                        <Button
                            variant="outline"
                            className="w-full"
                        >
                            <FolderOpen className="h-4 w-4 mr-2" />
                            Buka Folder
                        </Button>
                    </ScrollToTopLink>

                    {isAdmin && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="!pl-2">
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="[--radius:1rem]">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={handleUpdate}>
                                        <Edit className="h-4 w-4" />
                                        Edit Folder
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleManagePermissions}>
                                        <UserCheck className="h-4 w-4" />
                                        Kelola Hak Akses
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={handleDelete}>
                                        <Trash2 className="h-4 w-4" />
                                        Hapus Folder
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </ButtonGroup>
            </div>
        </div>
    )
}