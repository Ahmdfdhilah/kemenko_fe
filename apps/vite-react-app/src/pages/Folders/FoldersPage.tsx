"use client"

import { FileCard } from "@/components/common/FileCard"
import { FolderModal } from "@/components/common/FolderModal"
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog"
import { FolderBase, FolderCreate, FolderUpdate } from "@/services/folders/types"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import {
    Search,
    FolderPlus,
    Loader2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ArrowUpDown
} from "lucide-react"
import { useState, useEffect } from "react"
import { useFolders, useCreateFolder, useUpdateFolder, useDeleteFolder } from '@/hooks/useFolders'
import { useAuth } from "@/hooks/useAuth"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"

export default function FoldersPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(12)
    const [sortBy, setSortBy] = useState<'title' | 'created_at' | 'updated_at'>('updated_at')
    const [sortType, setSortType] = useState<'asc' | 'desc'>('desc')

    const { user } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [editingFolder, setEditingFolder] = useState<FolderBase | null>(null)
    const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null)

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
            setCurrentPage(1) // Reset to first page on search
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const {
        data: foldersResponse,
        isLoading: isLoadingFolders,
        error: foldersError,
        refetch: refetchFolders
    } = useFolders({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm || null,
        sort_by: sortBy,
        sort_type: sortType
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

    const toggleSortType = () => {
        setSortType(prev => prev === 'asc' ? 'desc' : 'asc')
        setCurrentPage(1)
    }

    const handleSortByChange = (value: string) => {
        setSortBy(value as 'title' | 'created_at' | 'updated_at')
        setCurrentPage(1)
    }

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value))
        setCurrentPage(1)
    }

    const isLoading = isLoadingFolders ||
        createFolderMutation.isPending ||
        updateFolderMutation.isPending ||
        deleteFolderMutation.isPending

    const folders = foldersResponse?.items || []
    const meta = foldersResponse?.meta

    // Calculate total pages
    const totalPages = meta ? Math.ceil(meta.total_pages / itemsPerPage) : 0

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = []
        const maxPagesToShow = 5

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
            } else {
                pages.push(1)
                pages.push('...')
                pages.push(currentPage - 1)
                pages.push(currentPage)
                pages.push(currentPage + 1)
                pages.push('...')
                pages.push(totalPages)
            }
        }

        return pages
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="px-4 md:px-6 lg:px-8 xl:px-12 py-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground">
                                    Semua <span className="text-tertiary">Folder</span>
                                </h1>
                                <p className="text-muted-foreground mt-2">
                                    Berisi semua dokumen inspektorat
                                </p>
                            </div>

                            {user?.role === 'admin' && (
                                <Button
                                    onClick={handleCreateFolder}
                                    className="flex items-center gap-2 w-fit"
                                    disabled={isLoading}
                                >
                                    <FolderPlus className="h-4 w-4" />
                                    Buat Folder Baru
                                </Button>
                            )}
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1 max-w-2xl">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                                <Input
                                    type="search"
                                    placeholder="Cari folder berdasarkan judul atau deskripsi..."
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
                                        <SelectItem value="updated_at">Terakhir Diubah</SelectItem>
                                        <SelectItem value="created_at">Tanggal Dibuat</SelectItem>
                                        <SelectItem value="title">Judul</SelectItem>
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

            {/* Content */}
            <div className="flex-1 px-4 md:px-6 lg:px-8 xl:px-12 py-6">
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
                            {debouncedSearchTerm
                                ? "Coba sesuaikan kata kunci pencarian Anda"
                                : "Belum ada folder yang dibuat"
                            }
                        </div>
                        {user?.role === 'admin' && !debouncedSearchTerm && (
                            <Button onClick={handleCreateFolder} variant="outline">
                                <FolderPlus className="h-4 w-4 mr-2" />
                                Buat Folder Pertama
                            </Button>
                        )}
                    </div>
                )}

                {!isLoadingFolders && !foldersError && folders.length > 0 && (
                    <>
                        {/* Results Info */}
                        <div className="mb-4 text-sm text-muted-foreground">
                            Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, meta?.total_pages || 0)} dari {meta?.total_pages || 0} folder
                        </div>

                        {/* Folders Grid */}
                        <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                                        {getPageNumbers().map((page, index) => (
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