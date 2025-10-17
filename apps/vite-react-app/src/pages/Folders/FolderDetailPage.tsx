"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
    ChevronRight,
    Folder,
    Grid,
    List,
    Plus,
    Loader2,
    FolderPlus,
    Link as LinkIcon,
    Upload,
    ChevronDown
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Tabs, TabsContent } from "@workspace/ui/components/tabs"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@workspace/ui/components/empty"
import { useAuth } from "@/hooks/useAuth"
import { useFolder } from "@/hooks/useFolders"
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

type ViewMode = "list" | "grid"
type ItemType = "folder" | "file"

export default function FolderDetailPage() {
    const { id } = useParams<{ id: string }>()
    const { user } = useAuth()
    const isAdmin = user?.role === 'admin'

    const [viewMode, setViewMode] = useState<ViewMode>("list")

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

    // Mutations
    const createFolderMutation = useCreateFolder()
    const updateFolderMutation = useUpdateFolder()
    const deleteFolderMutation = useDeleteFolder()
    const createFileLinkMutation = useCreateFileLink(id || '')
    const uploadFileMutation = useUploadFile(id || '')
    const updateFileLinkMutation = useUpdateFileLink()
    const deleteFileMutation = useDeleteFile()

    const isLoading = isLoadingFolder ||
        createFolderMutation.isPending ||
        updateFolderMutation.isPending ||
        deleteFolderMutation.isPending ||
        createFileLinkMutation.isPending ||
        uploadFileMutation.isPending ||
        updateFileLinkMutation.isPending ||
        deleteFileMutation.isPending

    // Parse path for breadcrumb
    const pathParts = folder?.path ? folder.path.split('/').filter(Boolean) : []

    // Get data from folder
    const subFolders = folder?.children || []
    const files = folder?.files || []
    const totalItems = subFolders.length + files.length

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

    const handleOpenFile = (file: { id: string; name: string; file_type: 'link' | 'upload' }) => {
        // For simplified file info, we just open based on ID
        // You might want to fetch full file details here if needed
        console.log('Opening file:', file)
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

                            <div className="flex items-center gap-2">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 md:px-6 lg:px-8 xl:px-12 py-6">
                {totalItems === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Folder className="h-6 w-6" />
                            </EmptyMedia>
                            <EmptyTitle>Folder kosong</EmptyTitle>
                            <EmptyDescription>
                                Belum ada file atau folder di sini
                            </EmptyDescription>
                        </EmptyHeader>
                        {isAdmin && (
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
                ) : (
                    <>
                        {/* Results Info */}
                        <div className="mb-4 text-sm text-muted-foreground">
                            {totalItems} item ({subFolders.length} folder, {files.length} file)
                        </div>

                        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                            <TabsContent value="list" className="m-0">
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nama</TableHead>
                                                <TableHead className="w-[100px]">Tipe</TableHead>
                                                <TableHead className="w-[180px]">Terakhir Diupdate</TableHead>
                                                <TableHead className="w-[80px]">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {/* Sub Folders */}
                                            {subFolders.map((subFolder) => (
                                                <SubFolderCard
                                                    key={`folder-${subFolder.id}`}
                                                    folder={subFolder}
                                                    isAdmin={isAdmin}
                                                    viewMode="list"
                                                    onEdit={handleEditFolder}
                                                    onDelete={handleDeleteFolder}
                                                />
                                            ))}

                                            {/* Files - Simplified */}
                                            {files.map((file) => (
                                                <FileCard
                                                    key={`file-${file.id}`}
                                                    file={file as any}
                                                    isAdmin={isAdmin}
                                                    viewMode="list"
                                                    onEdit={handleEditFile}
                                                    onDelete={handleDeleteFile}
                                                    onOpen={handleOpenFile}
                                                />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="grid" className="m-0">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
                                    {/* Sub Folders */}
                                    {subFolders.map((subFolder) => (
                                        <SubFolderCard
                                            key={`folder-${subFolder.id}`}
                                            folder={subFolder}
                                            isAdmin={isAdmin}
                                            viewMode="grid"
                                            onEdit={handleEditFolder}
                                            onDelete={handleDeleteFolder}
                                        />
                                    ))}

                                    {/* Files - Simplified */}
                                    {files.map((file) => (
                                        <FileCard
                                            key={`file-${file.id}`}
                                            file={file as any}
                                            isAdmin={isAdmin}
                                            viewMode="grid"
                                            onEdit={handleEditFile}
                                            onDelete={handleDeleteFile}
                                            onOpen={handleOpenFile}
                                        />
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
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
