import { FileText, Link as LinkIcon, MoreVertical, Edit, Trash2, ExternalLink, ChevronDown } from "lucide-react"
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
import { FileBase } from "@/services/files/types"
import { getFileTypeIcon, formatFileSize } from "@/utils/file"
import { formatDate } from "@/utils/date"
import { getItemTypeBadge, getItemTypeColor, type ItemType } from "@/utils/badge"

interface FileCardProps {
    file: FileBase
    isAdmin?: boolean
    canCRUD?: boolean  // Permission dari parent folder
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
    canCRUD = false,
    viewMode,
    onEdit,
    onDelete,
    onOpen
}: FileCardProps) {
    // User can edit/delete if they're admin OR have CRUD permission on parent folder
    const hasEditPermission = isAdmin || canCRUD
    if (viewMode === "list") {
        return (
            <TableRow>
                <TableCell>
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onOpen?.(file)}>
                        {getFileIcon(file)}
                        <span className="font-medium hover:text-primary">{file.name}</span>
                    </div>
                </TableCell>
                <TableCell>{file.file_type === 'link' ? 'Tautan' : 'Berkas'}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                    {file.updated_at ? formatDate(file.updated_at) : '-'}
                </TableCell>
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
                            {hasEditPermission && file.file_type === 'link' && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => onEdit?.(file)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Ubah
                                    </DropdownMenuItem>
                                </>
                            )}
                            {hasEditPermission && (
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
    const fileType: ItemType = file.file_type === 'link' ? 'link' : 'upload'

    return (
        <div className="group relative overflow-hidden rounded-xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-primary/50 min-h-[200px] flex flex-col">
            {/* Decorative Background Pattern */}
            <svg
                className={`absolute bottom-0 left-0 mb-8 opacity-5 ${getItemTypeColor(fileType)}`}
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
                    <p className={`text-xs uppercase tracking-wide font-medium opacity-60 ${getItemTypeColor(fileType)}`}>
                        {file.updated_at ? `Diperbarui ${formatDate(file.updated_at)}` : 'Baru'}
                    </p>
                </div>

                <div className="flex-1 mb-6">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-2 leading-tight mb-3">
                        {file.name}
                    </h3>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    {getItemTypeBadge(fileType)}
                    {file.file_type === 'upload' && file.file_size && (
                        <span className="text-xs px-2.5 py-1 bg-muted rounded-md text-muted-foreground font-medium">
                            {formatFileSize(file.file_size)}
                        </span>
                    )}
                </div>

                {/* Button Group dengan Dropdown */}
                <ButtonGroup className="w-full">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => onOpen?.(file)}
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Buka
                    </Button>

                    {hasEditPermission && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="!pl-2">
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {file.file_type === 'link' && (
                                    <>
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onClick={() => onEdit?.(file)}>
                                                <Edit className="h-4 w-4" />
                                                Ubah
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => onDelete?.(file.id)}>
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
