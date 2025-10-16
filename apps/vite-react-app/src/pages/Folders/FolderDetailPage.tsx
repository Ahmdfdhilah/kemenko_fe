"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
    ChevronRight,
    Folder,
    Grid,
    List,
    Plus,
    Search,
    Upload,
    Loader2,
    FolderPlus,
    Link as LinkIcon,
    X,
    ChevronDown,
    ArrowUpDown,
    ChevronLeft,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Tabs, TabsContent } from "@workspace/ui/components/tabs"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@workspace/ui/components/empty"
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
import { SubFolderCard } from "@/components/common/SubFolderCard"
import { FileCard } from "@/components/common/FileCard"
import { getPageNumbers } from "@/utils/pagination"

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

    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
    const [viewMode, setViewMode] = useState<ViewMode>("list")
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(12)
    const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'updated_at'>('name')
    const [sortType, setSortType] = useState<'asc' | 'desc'>('asc')

    // Modals state
    const [subFolderModalOpen, setSubFolderModalOpen] = useState(false)
    const [fileLinkModalOpen, setFileLinkModalOpen] = useState(false)
    const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [editingFolder, setEditingFolder] = useState<FolderBase | null>(null)
    const [editingFile, setEditingFile] = useState<FileBase | null>(null)
    const [deletingItem, setDeletingItem] = useState<{ id: string; type: ItemType } | null>(null)

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Queries
    const { data: folder, isLoading: isLoadingFolder } = useFolder(id || '')
    const { data: filesResponse, isLoading: isLoadingFiles } = useFiles(id || '', {
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm || null,
        sort_by: sortBy,
        sort_type: sortType
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
        debouncedSearchTerm === "" || f.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )

    // Calculate combined items for pagination
    const allItems = [...filteredSubFolders, ...files]
    const totalItems = allItems.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedItems = allItems.slice(startIndex, endIndex)
    const paginatedFolders = paginatedItems.filter(item => 'children' in item) as FolderBase[]
    const paginatedFiles = paginatedItems.filter(item => 'file_type' in item) as FileBase[]

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
        const allPageItems: SelectedItem[] = [
            ...paginatedFolders.map(f => ({ id: f.id, type: 'folder' as ItemType })),
            ...paginatedFiles.map(f => ({ id: f.id, type: 'file' as ItemType }))
        ]

        if (selectedItems.length === allPageItems.length && allPageItems.length > 0) {
            setSelectedItems([])
        } else {
            setSelectedItems(allPageItems)
        }
    }

    const toggleSortType = () => {
        setSortType(prev => prev === 'asc' ? 'desc' : 'asc')
        setCurrentPage(1)
    }

    const handleSortByChange = (value: string) => {
        setSortBy(value as 'name' | 'created_at' | 'updated_at')
        setCurrentPage(1)
    }

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value))
        setCurrentPage(1)
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
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="px-4 md:px-6 lg:px-8 xl:px-12 py-6">
                    <div className="flex flex-col gap-4">
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

                        {/* Title and Actions */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground">
                                    {folder.title}
                                </h1>
                                {folder.description && (
                                    <p className="text-muted-foreground mt-2">
                                        {folder.description}
                                    </p>
                                )}
                            </div>

                            {isAdmin && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="flex items-center gap-2 w-fit">
                                            <Plus className="h-4 w-4" />
                                            Baru
                                            <ChevronDown className="h-4 w-4" />
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
                            )}
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1 max-w-2xl">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                                <Input
                                    type="search"
                                    placeholder="Cari folder atau file..."
                                    className="pl-10 border-border focus:border-primary focus:ring-primary"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                <Select value={sortBy} onValueChange={handleSortByChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Urutkan berdasarkan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="name">Nama</SelectItem>
                                        <SelectItem value="updated_at">Terakhir Diubah</SelectItem>
                                        <SelectItem value="created_at">Tanggal Dibuat</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={toggleSortType}
                                    title={sortType === 'asc' ? 'Urutkan Menurun' : 'Urutkan Menaik'}
                                >
                                    <ArrowUpDown className="h-4 w-4" />
                                </Button>

                                <div className="hidden md:flex border rounded-md">
                                    <Button
                                        variant={viewMode === "list" ? "secondary" : "ghost"}
                                        size="icon"
                                        className="h-10 w-10 rounded-r-none"
                                        onClick={() => setViewMode("list")}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                                        size="icon"
                                        className="h-10 w-10 rounded-l-none"
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="12">12 per halaman</SelectItem>
                                        <SelectItem value="24">24 per halaman</SelectItem>
                                        <SelectItem value="36">36 per halaman</SelectItem>
                                        <SelectItem value="48">48 per halaman</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedItems.length > 0 && (
                <div className="bg-muted/50 px-4 md:px-6 lg:px-8 xl:px-12 py-2 flex items-center justify-between border-b">
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

            {/* Content */}
            <div className="flex-1 px-4 md:px-6 lg:px-8 xl:px-12 py-6">
                {isLoadingFiles && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Memuat konten...</span>
                        </div>
                    </div>
                )}

                {!isLoadingFiles && totalItems === 0 && (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Folder className="h-6 w-6" />
                            </EmptyMedia>
                            <EmptyTitle>Folder kosong</EmptyTitle>
                            <EmptyDescription>
                                {debouncedSearchTerm
                                    ? `Tidak ada hasil untuk "${debouncedSearchTerm}"`
                                    : "Belum ada file atau folder di sini"}
                            </EmptyDescription>
                        </EmptyHeader>
                        {isAdmin && !debouncedSearchTerm && (
                            <EmptyContent>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={handleCreateSubFolder}>
                                        <FolderPlus className="h-4 w-4 mr-2" />
                                        Folder Baru
                                    </Button>
                                    <Button size="sm" onClick={handleUploadFile}>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload File
                                    </Button>
                                </div>
                            </EmptyContent>
                        )}
                    </Empty>
                )}

                {!isLoadingFiles && totalItems > 0 && (
                    <>
                        {/* Results Info */}
                        <div className="mb-4 text-sm text-muted-foreground">
                            Menampilkan {startIndex + 1} - {Math.min(endIndex, totalItems)} dari {totalItems} item
                        </div>

                        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                            <TabsContent value="list" className="m-0">
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[40px]">
                                                    <Checkbox
                                                        checked={selectedItems.length === (paginatedFolders.length + paginatedFiles.length) && (paginatedFolders.length + paginatedFiles.length) > 0}
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
                                            {paginatedFolders.map((subFolder) => (
                                                <SubFolderCard
                                                    key={`folder-${subFolder.id}`}
                                                    folder={subFolder}
                                                    isAdmin={isAdmin}
                                                    isSelected={selectedItems.some(item => item.id === subFolder.id && item.type === 'folder')}
                                                    viewMode="list"
                                                    onSelect={() => toggleSelection(subFolder.id, 'folder')}
                                                    onEdit={handleEditFolder}
                                                    onDelete={handleDeleteFolder}
                                                />
                                            ))}

                                            {/* Files */}
                                            {paginatedFiles.map((file) => (
                                                <FileCard
                                                    key={`file-${file.id}`}
                                                    file={file}
                                                    isAdmin={isAdmin}
                                                    isSelected={selectedItems.some(item => item.id === file.id && item.type === 'file')}
                                                    viewMode="list"
                                                    onSelect={() => toggleSelection(file.id, 'file')}
                                                    onEdit={handleEditFile}
                                                    onDelete={handleDeleteFile}
                                                    onOpen={handleOpenLink}
                                                />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="grid" className="m-0">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
                                    {/* Sub Folders */}
                                    {paginatedFolders.map((subFolder) => (
                                        <SubFolderCard
                                            key={`folder-${subFolder.id}`}
                                            folder={subFolder}
                                            isAdmin={isAdmin}
                                            isSelected={selectedItems.some(item => item.id === subFolder.id && item.type === 'folder')}
                                            viewMode="grid"
                                            onSelect={() => toggleSelection(subFolder.id, 'folder')}
                                            onEdit={handleEditFolder}
                                            onDelete={handleDeleteFolder}
                                        />
                                    ))}

                                    {/* Files */}
                                    {paginatedFiles.map((file) => (
                                        <FileCard
                                            key={`file-${file.id}`}
                                            file={file}
                                            isAdmin={isAdmin}
                                            isSelected={selectedItems.some(item => item.id === file.id && item.type === 'file')}
                                            viewMode="grid"
                                            onSelect={() => toggleSelection(file.id, 'file')}
                                            onEdit={handleEditFile}
                                            onDelete={handleDeleteFile}
                                            onOpen={handleOpenLink}
                                        />
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-muted-foreground">
                                    Halaman {currentPage} dari {totalPages}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    <div className="flex gap-1">
                                        {getPageNumbers(totalPages, currentPage).map((page, index) => (
                                            page === '...' ? (
                                                <span key={`ellipsis-${index}`} className="px-3 py-2 text-muted-foreground">
                                                    ...
                                                </span>
                                            ) : (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(page as number)}
                                                    className="min-w-[40px]"
                                                >
                                                    {page}
                                                </Button>
                                            )
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

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
