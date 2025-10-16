import { FileText, Link as LinkIcon, MoreVertical, Edit, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { TableCell, TableRow } from "@workspace/ui/components/table"
import { FileBase } from "@/services/files/types"
import { getFileTypeIcon, formatFileSize } from "@/utils/file"
import { formatDate } from "@/utils/date"

interface FileCardProps {
    file: FileBase
    isAdmin?: boolean
    viewMode: "list" | "grid"
    onEdit?: (file: FileBase) => void
    onDelete?: (fileId: string) => void
    onOpen?: (file: FileBase) => void
}

const getFileIcon = (file: FileBase) => {
    if (file.file_type === 'link') {
        return <LinkIcon className="h-5 w-5 text-blue-500" />
    }
    const iconType = getFileTypeIcon(file.mime_type || '')
    switch (iconType) {
        case 'pdf':
            return <FileText className="h-5 w-5 text-red-500" />
        case 'image':
            return <FileText className="h-5 w-5 text-green-500" />
        case 'document':
            return <FileText className="h-5 w-5 text-blue-600" />
        case 'spreadsheet':
            return <FileText className="h-5 w-5 text-green-600" />
        case 'archive':
            return <FileText className="h-5 w-5 text-orange-500" />
        default:
            return <FileText className="h-5 w-5 text-gray-500" />
    }
}

export function FileCard({
    file,
    isAdmin = false,
    viewMode,
    onEdit,
    onDelete,
    onOpen
}: FileCardProps) {
    if (viewMode === "list") {
        return (
            <TableRow>
                <TableCell>
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onOpen?.(file)}>
                        {getFileIcon(file)}
                        <span className="font-medium hover:text-primary">{file.name}</span>
                    </div>
                </TableCell>
                <TableCell>{file.file_type === 'link' ? 'Link' : 'File'}</TableCell>
                <TableCell>
                    {file.file_type === 'upload' && file.file_size
                        ? formatFileSize(file.file_size)
                        : '-'}
                </TableCell>
                <TableCell>{formatDate(file.updated_at)}</TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onOpen?.(file)}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Buka
                            </DropdownMenuItem>
                            {isAdmin && file.file_type === 'link' && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => onEdit?.(file)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                </>
                            )}
                            {isAdmin && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => onDelete?.(file.id)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Hapus
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        )
    }

    // Grid view
    return (
        <div className="relative group rounded-lg border bg-card p-2 transition-all hover:shadow-md">
            <div className="flex flex-col items-center p-4 cursor-pointer" onClick={() => onOpen?.(file)}>
                <div className="mb-2">{getFileIcon(file)}</div>
                <p className="font-medium truncate w-full text-center text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                    {file.file_type === 'link' ? 'Link' : file.file_size ? formatFileSize(file.file_size) : 'File'}
                </p>
            </div>

            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onOpen?.(file)}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Buka
                        </DropdownMenuItem>
                        {isAdmin && file.file_type === 'link' && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onEdit?.(file)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                            </>
                        )}
                        {isAdmin && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => onDelete?.(file.id)}
                                    className="text-destructive"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Hapus
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
