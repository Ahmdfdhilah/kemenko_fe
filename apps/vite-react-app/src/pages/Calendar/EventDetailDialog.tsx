import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
    MapPin,
    Clock,
    ExternalLink,
    Users,
    FileText,
    Navigation,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@workspace/ui/components/dialog';
import { Badge } from '@workspace/ui/components/badge';
import { Event } from '@/services/events';

interface EventDetailDialogProps {
    event: Event | null;
    open: boolean;
    onClose: () => void;
}

export function EventDetailDialog({
    event,
    open,
    onClose,
}: EventDetailDialogProps) {
    if (!event) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
                <DialogHeader className="p-6 pb-2 border-b shrink-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant={
                            event.location_type === 'online' ? 'default' :
                                event.location_type === 'offline' ? 'outline' : 'secondary'
                        }>
                            {event.location_type === 'online' ? 'Online' :
                                event.location_type === 'offline' ? 'Offline' : 'Hybrid'}
                        </Badge>
                        <Badge variant="secondary">{event.event_type}</Badge>
                    </div>
                    <div className="flex justify-between items-start">
                        <DialogTitle className="text-xl font-bold leading-tight pr-8">{event.name}</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        Detail agenda kegiatan dan rapat koordinasi
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="space-y-6 px-6 py-4">
                        <div className="grid gap-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 bg-muted p-2 rounded-full">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Waktu</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(parseISO(event.start_time), 'EEEE, d MMMM yyyy', { locale: idLocale })}
                                    </p>
                                    <p className="text-sm text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded inline-block mt-1">
                                        {format(parseISO(event.start_time), 'HH:mm')} - {format(parseISO(event.end_time), 'HH:mm')} WIB
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-1 bg-muted p-2 rounded-full">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Lokasi</p>
                                    <p className="text-sm text-muted-foreground">
                                        {event.location || (event.location_type === 'online' ? 'Pertemuan Virtual' : '-')}
                                    </p>
                                </div>
                            </div>

                            {event.meeting_link && (
                                <div className="flex items-start gap-3 text-primary">
                                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                                        <ExternalLink className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold">Tautan Pertemuan</p>
                                        <a
                                            href={event.meeting_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm hover:underline block truncate"
                                        >
                                            {event.meeting_link}
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                <div className="mt-1 bg-muted p-2 rounded-full">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">PIC </p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {event.pic && event.pic.length > 0 ? (
                                            event.pic.map((p, i) => (
                                                <Badge key={i} variant="secondary" className="font-normal text-[10px]">
                                                    {p}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">-</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {event.description && (
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 bg-muted p-2 rounded-full">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Deskripsi</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line bg-muted/20 p-2 rounded-md border border-dashed text-xs">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-4 border-t shrink-0">
                    {event.documentation_folder_id && (
                        <Button variant="outline" className="gap-2 flex-1 h-9 text-xs" asChild>
                            <a href={`/folders/${event.documentation_folder_id}`}>
                                <Navigation className="h-4 w-4" />
                                Buka Dokumentasi
                            </a>
                        </Button>
                    )}
                    <Button className="flex-1 h-9 text-xs" onClick={onClose}>
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
