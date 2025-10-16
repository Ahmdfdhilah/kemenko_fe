import { Link } from "react-router-dom"
import { Folder, MoreVertical, Edit, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import { FolderBase } from "@/services/folders/types"
import { formatDate } from "@/utils/date"

interface SubFolderCardProps {
    folder: FolderBase
    isAdmin?: boolean
    isSelected?: boolean
    viewMode: "list" | "grid"
    onSelect?: () => void
    onEdit?: (folder: FolderBase) => void
    onDelete?: (folderId: string) => void
}

export function SubFolderCard({
    folder,
    isAdmin = false,
    isSelected = false,
    viewMode,
    onSelect,
    onEdit,
    onDelete
}: SubFolderCardProps) {
    if (viewMode === "list") {
        return (
            <TableRow>
                <TableCell>
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={onSelect}
                    />
                </TableCell>
                <TableCell>
                    <Link to={`/folders/${folder.id}`}>
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <Folder className="h-5 w-5 text-blue-500" />
                            <span className="font-medium hover:text-primary">{folder.title}</span>
                        </div>
                    </Link>
                </TableCell>
                <TableCell>Folder</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{formatDate(folder.updated_at)}</TableCell>
                <TableCell>
                    {isAdmin && (
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
        <div className="relative group rounded-lg border bg-card p-2 transition-all hover:shadow-md">
            <div className="absolute top-2 right-2">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onSelect}
                />
            </div>

            <Link to={`/folders/${folder.id}`}>
                <div className="flex flex-col items-center p-4 cursor-pointer">
                    <Folder className="h-12 w-12 text-blue-500 mb-2" />
                    <p className="font-medium truncate w-full text-center">{folder.title}</p>
                    <p className="text-xs text-muted-foreground">Folder</p>
                </div>
            </Link>

            {isAdmin && (
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100">
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
                </div>
            )}
        </div>
    )
}
