import { Link } from "react-router-dom"
import { Folder, MoreVertical, Edit, Trash2, FolderOpen, ChevronDown } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@workspace/ui/components/dropdown-menu"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import { FolderBase } from "@/services/folders/types"
import { formatDate } from "@/utils/date"
import { ScrollToTopLink } from "./ScrollToTopLink"
import { getItemTypeBadge, getItemTypeColor } from "@/utils/badge"

interface SubFolderCardProps {
    folder: FolderBase
    isAdmin?: boolean
    viewMode: "list" | "grid"
    onEdit?: (folder: FolderBase) => void
    onDelete?: (folderId: string) => void
}

export function SubFolderCard({
    folder,
    isAdmin = false,
    viewMode,
    onEdit,
    onDelete
}: SubFolderCardProps) {
    if (viewMode === "list") {
        return (
            <TableRow>
                <TableCell>
                    <Link to={`/folders/${folder.id}`}>
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <Folder className="h-5 w-5 text-blue-500" />
                            <span className="font-medium hover:text-primary">{folder.title}</span>
                        </div>
                    </Link>
                </TableCell>
                <TableCell>Folder</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                    {formatDate(folder.updated_at)}
                </TableCell>
                <TableCell>
                    {(isAdmin || folder.can_crud) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEdit?.(folder)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => onDelete?.(folder.id)}
                                    className="text-destructive"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Hapus
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </TableCell>
            </TableRow>
        )
    }

    // Grid view
    return (
        <div className="group relative overflow-hidden rounded-xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-primary/50 min-h-[200px] flex flex-col">
            {/* Decorative Background Pattern */}
            <svg
                className={`absolute bottom-0 left-0 mb-8 opacity-5 ${getItemTypeColor('folder')}`}
                viewBox="0 0 375 283"
                fill="none"
                style={{ transform: 'scale(1.2)' }}
            >
                <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="currentColor" />
                <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="currentColor" />
            </svg>

            {/* Content Section */}
            <div className="relative p-6 flex-1 flex flex-col">
                <div className="mb-3">
                    <p className={`text-xs uppercase tracking-wide font-medium opacity-60 ${getItemTypeColor('folder')}`}>
                        Diperbarui {formatDate(folder.updated_at)}
                    </p>
                </div>

                <div className="flex-1 mb-6">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-2 leading-tight mb-3">
                        {folder.title}
                    </h3>
                </div>

                <div className="mb-4">
                    {getItemTypeBadge('folder')}
                </div>

                {/* Button Group dengan Dropdown */}
                <ButtonGroup className="w-full">
                    <ScrollToTopLink to={`/folders/${folder.id}`} className="flex-1">
                        <Button
                            variant="outline"
                            className="w-full"
                        >
                            <FolderOpen className="h-4 w-4 mr-2" />
                            Buka
                        </Button>
                    </ScrollToTopLink>

                    {(isAdmin || folder.can_crud) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="!pl-2">
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => onEdit?.(folder)}>
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => onDelete?.(folder.id)}>
                                        <Trash2 className="h-4 w-4" />
                                        Hapus
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
