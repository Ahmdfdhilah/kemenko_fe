"use client"

import { FileCard } from "@/components/common/FileCard"
import { FolderModal, FolderData } from "@/components/common/FolderModal"
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog"
import { documents, Document } from "@/lib/mocks/documents"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Search, Plus, FolderPlus } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardContent() {
    const [documentsData, setDocumentsData] = useState<Document[]>(documents)
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [editingFolder, setEditingFolder] = useState<Document | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null)

    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    }; 

    // Set to true if user is admin
    const isAdmin = true

    const handleCreateFolder = () => {
        setModalMode('create')
        setEditingFolder(null)
        setIsModalOpen(true)
    }

    const handleEditFolder = (id: string) => {
        const folder = documentsData.find(doc => doc.id === id)
        if (folder) {
            setModalMode('edit')
            setEditingFolder(folder)
            setIsModalOpen(true)
        }
    }

    const handleDeleteFolder = async (id: string) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            setDocumentsData(prev => prev.filter(doc => doc.id !== id))
            console.log(`Folder dengan ID ${id} telah dihapus`)
        } catch (error) {
            console.error('Gagal menghapus folder:', error)
        } finally {
            setIsLoading(false)
            setDeletingFolderId(null)
        }
    }

    const handleSaveFolder = async (folderData: FolderData) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            if (modalMode === 'create') {
                const newFolder: Document = {
                    id: Date.now().toString(),
                    title: folderData.title,
                    thumbnail: folderData.thumbnail || "https://placehold.co/600x400",
                    link: folderData.link,
                    category: folderData.category,
                    lastModified: "baru saja"
                }
                setDocumentsData(prev => [newFolder, ...prev])
                console.log('Folder baru telah dibuat:', newFolder)
            } else if (modalMode === 'edit' && editingFolder) {
                setDocumentsData(prev =>
                    prev.map(doc =>
                        doc.id === editingFolder.id
                            ? {
                                ...doc,
                                title: folderData.title,
                                thumbnail: folderData.thumbnail || doc.thumbnail,
                                link: folderData.link,
                                category: folderData.category,
                                lastModified: "baru saja"
                            }
                            : doc
                    )
                )
                console.log('Folder telah diperbarui:', editingFolder.id)
            }

            setIsModalOpen(false)
        } catch (error) {
            console.error('Gagal menyimpan folder:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setEditingFolder(null)
    }

    // Filter documents based on search term
    const filteredDocuments = documentsData.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

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
                    <Button
                        onClick={handleLogout}
                        className="ml-4 flex items-center gap-2"
                    >
                        <FolderPlus className="h-4 w-4" />
                        Buat Folder
                    </Button>
                )}
            </header>

            {/* Content */}
            <div className="flex-1 p-4 md:p-6 overflow-auto">
                {filteredDocuments.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-muted-foreground text-lg mb-2">Dokumen tidak ditemukan</div>
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
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredDocuments.map((doc) => (
                            <FileCard
                                key={doc.id}
                                id={doc.id}
                                title={doc.title}
                                thumbnail={doc.thumbnail}
                                link={doc.link}
                                category={doc.category}
                                lastModified={doc.lastModified}
                                isAdmin={isAdmin}
                                onUpdate={handleEditFolder}
                                onDelete={(id) => setDeletingFolderId(id)}
                            />
                        ))}
                    </div>
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
                    isLoading={isLoading}
                    variant="destructive"
                />
            )}
        </div>
    )
}