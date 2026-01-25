"use client"

import { RootFolderCard } from "@/components/common/RootFolderCard"
import { RootFolderModal } from "@/components/common/RootFolderModal"
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog"
import { FolderBase, FolderCreate, FolderUpdate } from "@/services/folders/types"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Search, Plus, FolderPlus, Loader2 } from "lucide-react"
import { useState } from "react"
import { useCreateFolder, useUpdateFolder, useDeleteFolder, useRootFolders } from '@/hooks/useFolders'
import { useActivities } from '@/hooks/useActivities'
import { useAuth } from "@/hooks/useAuth"
import { ScrollToTopLink } from "@/components/common/ScrollToTopLink"
import { ActivityFeed } from "@/pages/Activity/ActivityFeed"
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { CalendarGrid } from '../Calendar/CalendarGrid';
import { EventDetailDialog } from '../Calendar/EventDetailDialog';
import { eventService, Event } from '@/services/events';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState("")
    const { user } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [editingFolder, setEditingFolder] = useState<FolderBase | null>(null)
    const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null)
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const {
        data: foldersResponse,
        isLoading: isLoadingFolders,
        error: foldersError,
        refetch: refetchFolders
    } = useRootFolders({
        page: 1,
        limit: 6,
        search: searchTerm || null,
        parent_id: null,
        sort_by: 'updated_at',
        sort_type: 'desc'
    })

    const {
        data: activitiesResponse,
        isLoading: isLoadingActivities,
    } = useActivities({
        page: 1,
        limit: 5,
        sort_by: 'created_at',
        sort_type: 'desc'
    })

    const { data: eventsData, isLoading: isLoadingEvents } = useQuery({
        queryKey: ['events', format(currentDate, 'yyyy-MM')],
        queryFn: async () => {
            const startStr = startOfMonth(currentDate).toISOString();
            const endStr = endOfMonth(currentDate).toISOString();
            return eventService.eventGetAll({
                page: 1,
                limit: 1000,
                start_date: startStr,
                end_date: endStr,
            });
        }
    });

    const calendarEvents = eventsData?.items || [];

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const handleToday = () => setCurrentDate(new Date());
    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setIsDetailOpen(true);
    };

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
    const activities = activitiesResponse?.items || []

    return (
        <div className="flex flex-col h-full">
            <div>
                {/* Latest Folders Section */}
                <div>
                    <div className="flex flex-col lg:flex-row gap-4 justify-between mb-6">
                        <div className="w-full max-w-md">
                            <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground mb-4">
                                Folder <span className="text-primary">Terbaru</span>
                            </h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                                <Input
                                    type="search"
                                    placeholder="Cari folder..."
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
                    <div className="flex-1">
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
                                        <RootFolderCard
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
                                        <Button variant="default" className="font-bold">
                                            Lihat Lebih Banyak
                                        </Button>
                                    </ScrollToTopLink>
                                </>
                            ) : (
                                null
                            )
                        }
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="my-12">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground">
                                Agenda <span className="text-primary">Kegiatan</span>
                            </h2>
                            <p className="text-muted-foreground text-sm mt-1">
                                Jadwal agenda dan rapat koordinasi
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border">
                            <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleToday} className="font-medium px-4">
                                {format(currentDate, 'MMMM yyyy', { locale: idLocale })}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl border shadow-sm p-4">
                        {isLoadingEvents ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <CalendarGrid
                                currentDate={currentDate}
                                events={calendarEvents}
                                onEventClick={handleEventClick}
                            />
                        )}
                    </div>
                </div>


                {/* Recent Activities Section */}
                <div className="my-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground">
                                Aktivitas <span className="text-primary">Terbaru</span>
                            </h2>
                            <p className="text-muted-foreground text-sm mt-1">
                                Pembaruan terkini dari ruang kerja Anda
                            </p>
                        </div>
                        <ScrollToTopLink to='/activities'>
                            <Button variant="outline" size="sm">
                                Lihat Semua
                            </Button>
                        </ScrollToTopLink>
                    </div>

                    {isLoadingActivities ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : (
                        <ActivityFeed activities={activities} />
                    )}
                </div>


            </div>

            {/* Event Detail Dialog (Read Only) */}
            <EventDetailDialog
                event={selectedEvent}
                open={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
            />

            {/* Folder Modal */}
            <RootFolderModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSave={handleSaveFolder}
                folder={editingFolder}
                mode={modalMode}
                isLoading={isLoading}
            />
            {deletingFolderId && (
                < ConfirmationDialog
                    isOpen={!!deletingFolderId}
                    onClose={() => setDeletingFolderId(null)}
                    title="Hapus Folder"
                    description="Apakah Anda yakin ingin menghapus folder ini? Tindakan ini tidak dapat dibatalkan."
                    onConfirm={() => handleDeleteFolder(deletingFolderId)}
                    confirmText="Hapus"
                    cancelText="Batal"
                    isLoading={deleteFolderMutation.isPending}
                    variant="destructive"
                />
            )
            }
        </div>
    )
}
