"use client"

import { FileCard } from "@/components/common/FileCard"
import { FolderModal } from "@/components/common/FolderModal"
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog"
import { FolderBase, FolderCreate, FolderUpdate } from "@/services/folders/types"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Search, Plus, FolderPlus, Loader2 } from "lucide-react"
import { useState } from "react"
import { useFolders, useCreateFolder, useUpdateFolder, useDeleteFolder } from '@/hooks/useFolders'
import { useAuth } from "@/hooks/useAuth"
import HeroSection from "@/components/common/HeroSection"
import Gallery from "@/components/common/Gallery"
import { ScrollToTopLink } from "@/components/common/ScrollToTopLink"

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState("")
    const { user } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [editingFolder, setEditingFolder] = useState<FolderBase | null>(null)
    const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null)

    const {
        data: foldersResponse,
        isLoading: isLoadingFolders,
        error: foldersError,
        refetch: refetchFolders
    } = useFolders({
        page: 1,
        limit: 20,
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

    const handleSaveFolder = async (data: FolderCreate | FolderUpdate) => {
        if (modalMode === 'create') {
            createFolderMutation.mutate(data as FolderCreate, {
                onSuccess: () => {
                    setIsModalOpen(false)
                    setEditingFolder(null)
                }
            })
        } else if (modalMode === 'edit' && editingFolder) {
            updateFolderMutation.mutate({
                data: data as FolderUpdate,
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

    const isLoading = isLoadingFolders ||
        createFolderMutation.isPending ||
        updateFolderMutation.isPending ||
        deleteFolderMutation.isPending

    const folders = foldersResponse?.items || []

    return (
        <div className="flex flex-col h-full">
            <HeroSection
                title={
                    <div className='md:max-w-2xl lg:max-w-3xl'>
                        <p className='uppercase text-sm sm:text-base lg:text-xl font-thin my-1 sm:my-2 tracking-wide'>KEMENKO PANGAN</p>
                        Kelola Dokumen Lebih
                        <span className='text-tertiary'>  Mudah <span className="text-popover"> dan</span> Terintegrasi</span>
                    </div>
                }
                subtitle='SIMF adalah aplikasi resmi Kemenko Pangan untuk manajemen folder digital yang aman, cepat, dan efisien dalam mendukung pengelolaan dokumen organisasi.' />

            <div className="px-4 md:px-6 lg:px-8 xl:px-12">
                <Gallery />
                <div className="flex flex-col lg:flex-row gap-4 justify-between  px-4 md:px-6 py-4">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl lg:text-5xl font-extrabold text-foreground mb-4">
                            Dokumen<span className="text-tertiary"> Terbaru</span>
                        </h2>
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
                    {user?.role === 'admin' && (
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
                </div>

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
                            {user?.role === 'admin' && !searchTerm && (
                                <Button onClick={handleCreateFolder} variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Buat Folder Pertama Anda
                                </Button>
                            )}
                        </div>
                    )}

                    {!isLoadingFolders && !foldersError && folders.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-8">
                                {folders.map((folder) => (
                                    <FileCard
                                        key={folder.id}
                                        folder={folder}
                                        isAdmin={user?.role === 'admin'}
                                        onUpdate={handleEditFolder}
                                        onDelete={(id) => setDeletingFolderId(id)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                    {
                        foldersResponse?.meta.has_next ? (
                            <>
                                <ScrollToTopLink to='/folders'>
                                    <p className="p-3 rounded-lg bg-primary text-popover font-bold w-fit hover:bg-primary/80">Lihat lebih banyak</p>
                                </ScrollToTopLink>
                            </>
                        ) : (
                            null
                        )
                    }
                </div>
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