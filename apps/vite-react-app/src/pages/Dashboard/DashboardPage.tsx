"use client"

import { FileCard } from "@/components/common/FileCard"
import { FolderModal, FolderData } from "@/components/common/FolderModal"
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog"
import { FolderBase } from "@/services/folders/types"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Search, Plus, FolderPlus, Loader2 } from "lucide-react"
import { useState } from "react"
import { useFolders, useCreateFolder, useUpdateFolder, useDeleteFolder } from '@/hooks/useFolders'

export default function DashboardPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [editingFolder, setEditingFolder] = useState<FolderBase | null>(null)
    const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageLimit] = useState(12)


    // Set to true if user is admin
    const isAdmin = true

    // Use custom hooks for folder operations
    const {
        data: foldersResponse,
        isLoading: isLoadingFolders,
        error: foldersError,
        refetch: refetchFolders
    } = useFolders({
        page: currentPage,
        limit: pageLimit,
        search: searchTerm || null,
        sort_by: 'updated_at',
        sort_type: 'desc'
    })

    const createFolderMutation = useCreateFolder()
    const updateFolderMutation = useUpdateFolder()
    const deleteFolderMutation = useDeleteFolder()



    const handleCreateFolder = () => {
        setModalMode('create')
        setEditingFolder(null)
        setIsModalOpen(true)
    }

    const handleEditFolder = (id: string) => {
        const folder = foldersResponse?.items.find(folder => folder.id === id)
        if (folder) {
            setModalMode('edit')
            setEditingFolder(folder)
            setIsModalOpen(true)
        }
    }

    const handleDeleteFolder = async (id: string) => {
        deleteFolderMutation.mutate(id, {
            onSuccess: () => {
                setDeletingFolderId(null)
            },
            onError: () => {
                setDeletingFolderId(null)
            }
        })
    }

    const handleSaveFolder = async (folderData: FolderData) => {
        if (modalMode === 'create') {
            createFolderMutation.mutate({
                title: folderData.title,
                link: folderData.link,
                description: folderData.description,
                image: folderData.image
            }, {
                onSuccess: () => {
                    setIsModalOpen(false)
                    setEditingFolder(null)
                }
            })
        } else if (modalMode === 'edit' && editingFolder) {
            updateFolderMutation.mutate({
                data: {
                    title: folderData.title,
                    link: folderData.link,
                    description: folderData.description,
                    image: folderData.image,
                    remove_image: folderData.removeImage
                },
                id: editingFolder.id
            }, {
                onSuccess: () => {
                    setIsModalOpen(false)
                    setEditingFolder(null)
                }
            })
        }
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setEditingFolder(null)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const isLoading = isLoadingFolders ||
        createFolderMutation.isPending ||
        updateFolderMutation.isPending ||
        deleteFolderMutation.isPending

    const folders = foldersResponse?.items || []

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <header className="flex items-center justify-between border-b bg-card px-4 md:px-6 py-4 shadow-sm">
                <div className="w-full max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                        <Input
                            type="search"
                            placeholder="Cari dokumen dan kategori..."
                            className="pl-10 border-border focus:border-primary focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Create Folder Button - Only visible for admins */}
                {isAdmin && (
                    <div className="flex gap-2">
                        <Button
                            onClick={handleCreateFolder}
                            className="flex items-center gap-2"
                            disabled={isLoading}
                        >
                            <FolderPlus className="h-4 w-4" />
                            Buat Folder
                        </Button>
                    </div>
                )}
            </header>

            {/* Content */}
            <div className="flex-1 p-4 md:p-6 overflow-auto">
                {isLoadingFolders && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Memuat folder...</span>
                        </div>
                    </div>
                )}

                {foldersError && (
                    <div className="text-center py-12">
                        <div className="text-red-600 text-lg mb-2">Gagal memuat folder</div>
                        <div className="text-muted-foreground/70 text-sm mb-4">
                            {foldersError.message}
                        </div>
                        <Button onClick={() => refetchFolders()} variant="outline">
                            Coba Lagi
                        </Button>
                    </div>
                )}

                {!isLoadingFolders && !foldersError && folders.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-muted-foreground text-lg mb-2">Folder tidak ditemukan</div>
                        <div className="text-muted-foreground/70 text-sm mb-4">
                            {searchTerm
                                ? "Coba sesuaikan kata kunci pencarian Anda"
                                : "Belum ada folder yang dibuat"
                            }
                        </div>
                        {isAdmin && !searchTerm && (
                            <Button onClick={handleCreateFolder} variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Buat Folder Pertama Anda
                            </Button>
                        )}
                    </div>
                )}

                {!isLoadingFolders && !foldersError && folders.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {folders.map((folder) => (
                                <FileCard
                                    key={folder.id}
                                    folder={folder}
                                    isAdmin={isAdmin}
                                    onUpdate={handleEditFolder}
                                    onDelete={(id) => setDeletingFolderId(id)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {foldersResponse && foldersResponse.meta.total_pages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!foldersResponse.meta.has_prev || isLoading}
                                >
                                    Previous
                                </Button>

                                <span className="text-sm text-muted-foreground">
                                    Page {currentPage} of {foldersResponse.meta.total_pages}
                                </span>

                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!foldersResponse.meta.has_next || isLoading}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Folder Modal */}
            <FolderModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSave={handleSaveFolder}
                folder={editingFolder}
                mode={modalMode}
                isLoading={isLoading}
            />

            {/* Delete Confirmation Dialog */}
            {deletingFolderId && (
                <ConfirmationDialog
                    triggerText={<div />}
                    title="Hapus Folder"
                    description="Apakah Anda yakin ingin menghapus folder ini? Tindakan ini tidak dapat dibatalkan."
                    onConfirm={() => handleDeleteFolder(deletingFolderId)}
                    confirmText="Hapus"
                    cancelText="Batal"
                    isLoading={deleteFolderMutation.isPending}
                    variant="destructive"
                />
            )}
        </div>
    )
}