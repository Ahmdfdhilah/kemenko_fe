import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { AlertCircle } from 'lucide-react';

import { Skeleton } from '@workspace/ui/components/skeleton';
import { toast } from "@workspace/ui/components/sonner";

import { eventService, Event } from '@/services/events';
import { useAuth } from '@/hooks/useAuth';

// Modular Components
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { EventDetailDialog } from './EventDetailDialog';
import { EventFormDialog } from './EventFormDialog';

export default function CalendarPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

    const isAdmin = user?.role === 'admin';

    // Queries
    const { data, isLoading, error } = useQuery({
        queryKey: ['events', format(currentDate, 'yyyy-MM'), searchQuery],
        queryFn: async () => {
            const startStr = startOfMonth(currentDate).toISOString();
            const endStr = endOfMonth(currentDate).toISOString();
            return eventService.eventGetAll({
                page: 1,
                limit: 1000,
                start_date: startStr,
                end_date: endStr,
                search: searchQuery || undefined
            });
        }
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: (newEvent: any) => eventService.eventCreate(newEvent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success("Berhasil membuat agenda baru");
        },
        onError: (err: any) => {
            toast.error("Gagal membuat agenda", { description: err.message });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => eventService.eventUpdate(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success("Berhasil memperbarui agenda");
        },
        onError: (err: any) => {
            toast.error("Gagal memperbarui agenda", { description: err.message });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => eventService.eventDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success("Agenda berhasil dihapus");
            setIsDetailOpen(false);
        },
        onError: (err: any) => {
            toast.error("Gagal menghapus agenda", { description: err.message });
        }
    });

    // Handlers
    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const handleToday = () => setCurrentDate(new Date());

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setIsDetailOpen(true);
    };

    const handleAddEvent = () => {
        setEventToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditEvent = (event: Event) => {
        setEventToEdit(event);
        setIsDetailOpen(false);
        setIsFormOpen(true);
    };

    const handleDeleteEvent = (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus agenda ini?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleFormSubmit = async (values: any) => {
        if (eventToEdit) {
            await updateMutation.mutateAsync({ id: eventToEdit.id, data: values });
        } else {
            await createMutation.mutateAsync(values);
        }
    };

    const events = data?.items || [];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CalendarHeader
                    currentDate={currentDate}
                    searchQuery={searchQuery}
                    isAdmin={isAdmin}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    onToday={handleToday}
                    onSearchChange={setSearchQuery}
                    onAddEvent={handleAddEvent}
                />
            </div>

            <div className="flex-1 py-6">
                {error && (
                    <div className="bg-destructive/15 text-destructive p-4 rounded-lg flex items-center gap-3 mb-6">
                        <AlertCircle className="h-5 w-5" />
                        <p>Gagal memuat agenda: {(error as any).message || 'Terjadi kesalahan sistem'}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 35 }).map((_, i) => (
                                <Skeleton key={i} className="h-32 w-full" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <CalendarGrid
                        currentDate={currentDate}
                        events={events}
                        onEventClick={handleEventClick}
                    />
                )}

                {/* View Modal */}
                <EventDetailDialog
                    event={selectedEvent}
                    open={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    isAdmin={isAdmin}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                />

                {/* Create/Edit Modal */}
                <EventFormDialog
                    event={eventToEdit}
                    open={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            </div>
        </div>
    );
}
