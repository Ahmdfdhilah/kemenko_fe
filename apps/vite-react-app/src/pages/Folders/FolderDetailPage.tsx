"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
    ChevronRight,
    Folder,
    FileText,
    Link as LinkIcon,
    Grid,
    List,
    MoreVertical,
    Plus,
    Search,
    Upload,
    Loader2,
    FolderPlus,
    Edit,
    Trash2,
    ExternalLink,
    X,
    ChevronDown
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Tabs, TabsContent } from "@workspace/ui/components/tabs"
import { useAuth } from "@/hooks/useAuth"
import { useFolder } from "@/hooks/useFolders"
import { useFiles } from "@/hooks/useFiles"
import { useCreateFolder, useUpdateFolder, useDeleteFolder } from "@/hooks/useFolders"
import { useCreateFileLink, useUploadFile, useUpdateFileLink, useDeleteFile } from "@/hooks/useFiles"
import { FolderBase, FolderCreate, FolderUpdate } from "@/services/folders/types"
import { FileBase, FileCreateLink, FileUpdateLink, FileUpload } from "@/services/files/types"
import { SubFolderModal } from "@/components/common/SubFolderModal"
import { FileLinkModal } from "@/components/common/FileLinkModal"
import { FileUploadModal } from "@/components/common/FileUploadModal"
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog"
import { getFileTypeIcon, formatFileSize } from "@/utils/file"
import { formatDate } from "@/utils/date"

type ViewMode = "list" | "grid"
type ItemType = "folder" | "file"

interface SelectedItem {
    id: string
    type: ItemType
}

export default function FolderDetailPage() {
    const { id } = useParams<{ id: string }>()
    const { user } = useAuth()
    const isAdmin = user?.role === 'admin'

    const [searchQuery, setSearchQuery] = useState("")
    const [viewMode, setViewMode] = useState<ViewMode>("list")
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])

    // Modals state
    const [subFolderModalOpen, setSubFolderModalOpen] = useState(false)
    const [fileLinkModalOpen, setFileLinkModalOpen] = useState(false)
    const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [editingFolder, setEditingFolder] = useState<FolderBase | null>(null)
    const [editingFile, setEditingFile] = useState<FileBase | null>(null)
    const [deletingItem, setDeletingItem] = useState<{ id: string; type: ItemType } | null>(null)

    // Queries
    const { data: folder, isLoading: isLoadingFolder } = useFolder(id || '')
    const { data: filesResponse, isLoading: isLoadingFiles } = useFiles(id || '', {
        page: 1,
        limit: 100,
        search: searchQuery || null,
        sort_by: 'name',
        sort_type: 'asc'
    })

    // Mutations
    const createFolderMutation = useCreateFolder()
    const updateFolderMutation = useUpdateFolder()
    const deleteFolderMutation = useDeleteFolder()
    const createFileLinkMutation = useCreateFileLink(id || '')
    const uploadFileMutation = useUploadFile(id || '')
    const updateFileLinkMutation = useUpdateFileLink()
    const deleteFileMutation = useDeleteFile()

    const isLoading = isLoadingFolder || isLoadingFiles ||
        createFolderMutation.isPending ||
        updateFolderMutation.isPending ||
        deleteFolderMutation.isPending ||
        createFileLinkMutation.isPending ||
        uploadFileMutation.isPending ||
        updateFileLinkMutation.isPending ||
        deleteFileMutation.isPending

    // Parse path for breadcrumb
    const pathParts = folder?.path ? folder.path.split('/').filter(Boolean) : []

    // Filter data
    const subFolders = folder?.children || []
    const files = filesResponse?.items || []

    const filteredSubFolders = subFolders.filter(f =>
        searchQuery === "" || f.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Handlers
    const toggleSelection = (id: string, type: ItemType) => {
        setSelectedItems(prev => {
            const exists = prev.find(item => item.id === id && item.type === type)
            if (exists) {
                return prev.filter(item => !(item.id === id && item.type === type))
            }
            return [...prev, { id, type }]
        })
    }

    const toggleSelectAll = () => {
        const allItems: SelectedItem[] = [
            ...filteredSubFolders.map(f => ({ id: f.id, type: 'folder' as ItemType })),
            ...files.map(f => ({ id: f.id, type: 'file' as ItemType }))
        ]

        if (selectedItems.length === allItems.length) {
            setSelectedItems([])
        } else {
            setSelectedItems(allItems)
        }
    }

    // Folder actions
    const handleCreateSubFolder = () => {
        setModalMode('create')
        setEditingFolder(null)
        setSubFolderModalOpen(true)
    }

    const handleEditFolder = (folder: FolderBase) => {
        setModalMode('edit')
        setEditingFolder(folder)
        setSubFolderModalOpen(true)
    }

    const handleSaveFolder = (data: FolderCreate | FolderUpdate) => {
        if (modalMode === 'create') {
            createFolderMutation.mutate(data as FolderCreate, {
                onSuccess: () => setSubFolderModalOpen(false)
            })
        } else if (editingFolder) {
            updateFolderMutation.mutate({
                data: data as FolderUpdate,
                id: editingFolder.id
            }, {
                onSuccess: () => {
                    setSubFolderModalOpen(false)
                    setEditingFolder(null)
                }
            })
        }
    }

    const handleDeleteFolder = (folderId: string) => {
        setDeletingItem({ id: folderId, type: 'folder' })
        setDeleteDialogOpen(true)
    }

    // File actions
    const handleCreateLink = () => {
        setModalMode('create')
        setEditingFile(null)
        setFileLinkModalOpen(true)
    }

    const handleUploadFile = () => {
        setFileUploadModalOpen(true)
    }

    const handleEditFile = (file: FileBase) => {
        setModalMode('edit')
        setEditingFile(file)
        if (file.file_type === 'link') {
            setFileLinkModalOpen(true)
        }
    }

    const handleSaveFileLink = (data: FileCreateLink | FileUpdateLink) => {
        if (modalMode === 'create') {
            createFileLinkMutation.mutate(data as FileCreateLink, {
                onSuccess: () => setFileLinkModalOpen(false)
            })
        } else if (editingFile) {
            updateFileLinkMutation.mutate({
                data: data as FileUpdateLink,
                fileId: editingFile.id
            }, {
                onSuccess: () => {
                    setFileLinkModalOpen(false)
                    setEditingFile(null)
                }
            })
        }
    }

    const handleSaveFileUpload = (data: FileUpload) => {
        uploadFileMutation.mutate(data, {
            onSuccess: () => setFileUploadModalOpen(false)
        })
    }

    const handleDeleteFile = (fileId: string) => {
        setDeletingItem({ id: fileId, type: 'file' })
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (!deletingItem) return

        if (deletingItem.type === 'folder') {
            deleteFolderMutation.mutate(deletingItem.id, {
                onSuccess: () => {
                    setDeleteDialogOpen(false)
                    setDeletingItem(null)
                }
            })
        } else {
            deleteFileMutation.mutate(deletingItem.id, {
                onSuccess: () => {
                    setDeleteDialogOpen(false)
                    setDeletingItem(null)
                }
            })
        }
    }

    const handleOpenLink = (file: FileBase) => {
        if (file.file_type === 'link' && file.external_link) {
            window.open(file.external_link, '_blank')
        } else if (file.file_type === 'upload' && file.file_url) {
            window.open(file.file_url, '_blank')
        }
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

    if (isLoadingFolder) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Memuat folder...</span>
                </div>
            </div>
        )
    }

    if (!folder) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Folder tidak ditemukan</h2>
                    <Link to="/folders">
                        <Button variant="outline">Kembali ke Folders</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Card className="w-full shadow-md border-0">
                <CardHeader className="p-4 border-b">
                    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                        {/* Breadcrumb */}
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground flex-wrap">
                            <Link to="/" className="hover:text-primary">
                                Home
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link to="/folders" className="hover:text-primary">
                                Folders
                            </Link>
                            {pathParts.map((part, index) => (
                                <div key={index} className="flex items-center">
                                    <ChevronRight className="h-4 w-4 mx-1" />
                                    <span>{part}</span>
                                </div>
                            ))}
                            <ChevronRight className="h-4 w-4 mx-1" />
                            <span className="font-medium text-primary">{folder.title}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari..."
                                    className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {isAdmin && (
                                <>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Baru
                                                <ChevronDown className="h-4 w-4 ml-2" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={handleCreateSubFolder}>
                                                <FolderPlus className="h-4 w-4 mr-2" />
                                                Folder Baru
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={handleCreateLink}>
                                                <LinkIcon className="h-4 w-4 mr-2" />
                                                Tambah Link
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={handleUploadFile}>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload File
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )}

                            <div className="hidden md:flex border rounded-md">
                                <Button
                                    variant={viewMode === "list" ? "secondary" : "ghost"}
                                    size="icon"
                                    className="h-8 w-8 rounded-r-none"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                                    size="icon"
                                    className="h-8 w-8 rounded-l-none"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                {/* Bulk Actions Toolbar */}
                {selectedItems.length > 0 && (
                    <div className="bg-muted/50 p-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedItems([])}>
                                <X className="h-4 w-4 mr-2" />
                                Batal
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {selectedItems.length} item dipilih
                            </span>
                        </div>
                    </div>
                )}

                <CardContent className="p-0">
                    <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                        <TabsContent value="list" className="m-0">
                            {(filteredSubFolders.length > 0 || files.length > 0) ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[40px]">
                                                <Checkbox
                                                    checked={selectedItems.length === (filteredSubFolders.length + files.length) && (filteredSubFolders.length + files.length) > 0}
                                                    onCheckedChange={toggleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead className="w-[300px]">Nama</TableHead>
                                            <TableHead>Tipe</TableHead>
                                            <TableHead>Ukuran</TableHead>
                                            <TableHead>Terakhir Diubah</TableHead>
                                            <TableHead className="w-[80px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Sub Folders */}
                                        {filteredSubFolders.map((subFolder) => (
                                            <TableRow key={`folder-${subFolder.id}`}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedItems.some(item => item.id === subFolder.id && item.type === 'folder')}
                                                        onCheckedChange={() => toggleSelection(subFolder.id, 'folder')}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Link to={`/folders/${subFolder.id}`}>
                                                        <div className="flex items-center space-x-2 cursor-pointer">
                                                            <Folder className="h-5 w-5 text-blue-500" />
                                                            <span className="font-medium hover:text-primary">{subFolder.title}</span>
                                                        </div>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>Folder</TableCell>
                                                <TableCell>-</TableCell>
                                                <TableCell>{formatDate(subFolder.updated_at)}</TableCell>
                                                <TableCell>
                                                    {isAdmin && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleEditFolder(subFolder)}>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDeleteFolder(subFolder.id)}
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
                                        ))}

                                        {/* Files */}
                                        {files.map((file) => (
                                            <TableRow key={`file-${file.id}`}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedItems.some(item => item.id === file.id && item.type === 'file')}
                                                        onCheckedChange={() => toggleSelection(file.id, 'file')}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleOpenLink(file)}>
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
                                                            <DropdownMenuItem onClick={() => handleOpenLink(file)}>
                                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                                Buka
                                                            </DropdownMenuItem>
                                                            {isAdmin && file.file_type === 'link' && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => handleEditFile(file)}>
                                                                        <Edit className="h-4 w-4 mr-2" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                            {isAdmin && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDeleteFile(file.id)}
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
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Folder className="h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold">Folder kosong</h3>
                                    <p className="text-sm text-muted-foreground text-center max-w-sm mt-2">
                                        {searchQuery
                                            ? `Tidak ada hasil untuk "${searchQuery}"`
                                            : "Belum ada file atau folder di sini"}
                                    </p>
                                    {isAdmin && !searchQuery && (
                                        <div className="mt-4 flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={handleCreateSubFolder}>
                                                <FolderPlus className="h-4 w-4 mr-2" />
                                                Folder Baru
                                            </Button>
                                            <Button size="sm" onClick={handleUploadFile}>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload File
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="grid" className="m-0">
                            {(filteredSubFolders.length > 0 || files.length > 0) ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                                    {/* Sub Folders */}
                                    {filteredSubFolders.map((subFolder) => (
                                        <div
                                            key={`folder-${subFolder.id}`}
                                            className="relative group rounded-lg border bg-card p-2 transition-all hover:shadow-md"
                                        >
                                            <div className="absolute top-2 right-2">
                                                <Checkbox
                                                    checked={selectedItems.some(item => item.id === subFolder.id && item.type === 'folder')}
                                                    onCheckedChange={() => toggleSelection(subFolder.id, 'folder')}
                                                />
                                            </div>

                                            <Link to={`/folders/${subFolder.id}`}>
                                                <div className="flex flex-col items-center p-4 cursor-pointer">
                                                    <Folder className="h-12 w-12 text-blue-500 mb-2" />
                                                    <p className="font-medium truncate w-full text-center">{subFolder.title}</p>
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
                                                            <DropdownMenuItem onClick={() => handleEditFolder(subFolder)}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteFolder(subFolder.id)}
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
                                    ))}

                                    {/* Files */}
                                    {files.map((file) => (
                                        <div
                                            key={`file-${file.id}`}
                                            className="relative group rounded-lg border bg-card p-2 transition-all hover:shadow-md"
                                        >
                                            <div className="absolute top-2 right-2">
                                                <Checkbox
                                                    checked={selectedItems.some(item => item.id === file.id && item.type === 'file')}
                                                    onCheckedChange={() => toggleSelection(file.id, 'file')}
                                                />
                                            </div>

                                            <div className="flex flex-col items-center p-4 cursor-pointer" onClick={() => handleOpenLink(file)}>
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
                                                        <DropdownMenuItem onClick={() => handleOpenLink(file)}>
                                                            <ExternalLink className="h-4 w-4 mr-2" />
                                                            Buka
                                                        </DropdownMenuItem>
                                                        {isAdmin && file.file_type === 'link' && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => handleEditFile(file)}>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                        {isAdmin && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDeleteFile(file.id)}
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
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Folder className="h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold">Folder kosong</h3>
                                    <p className="text-sm text-muted-foreground text-center max-w-sm mt-2">
                                        {searchQuery
                                            ? `Tidak ada hasil untuk "${searchQuery}"`
                                            : "Belum ada file atau folder di sini"}
                                    </p>
                                    {isAdmin && !searchQuery && (
                                        <div className="mt-4 flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={handleCreateSubFolder}>
                                                <FolderPlus className="h-4 w-4 mr-2" />
                                                Folder Baru
                                            </Button>
                                            <Button size="sm" onClick={handleUploadFile}>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload File
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Modals */}
            <SubFolderModal
                isOpen={subFolderModalOpen}
                onClose={() => {
                    setSubFolderModalOpen(false)
                    setEditingFolder(null)
                }}
                onSave={handleSaveFolder}
                parentId={id || ''}
                folder={editingFolder}
                mode={modalMode}
                isLoading={isLoading}
            />

            <FileLinkModal
                isOpen={fileLinkModalOpen}
                onClose={() => {
                    setFileLinkModalOpen(false)
                    setEditingFile(null)
                }}
                onSave={handleSaveFileLink}
                file={editingFile}
                mode={modalMode}
                isLoading={isLoading}
            />

            <FileUploadModal
                isOpen={fileUploadModalOpen}
                onClose={() => setFileUploadModalOpen(false)}
                onSave={handleSaveFileUpload}
                isLoading={isLoading}
            />

            <ConfirmationDialog
                isOpen={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false)
                    setDeletingItem(null)
                }}
                onConfirm={handleDeleteConfirm}
                title={`Hapus ${deletingItem?.type === 'folder' ? 'Folder' : 'File'}`}
                description={`Apakah Anda yakin ingin menghapus ${deletingItem?.type === 'folder' ? 'folder' : 'file'} ini? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus"
                cancelText="Batal"
                isLoading={isLoading}
                variant="destructive"
            />
        </div>
    )
}
