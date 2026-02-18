import { formatInWIB } from '@/utils/date';
import {
    MapPin,
    Clock,
    ExternalLink,
    Users,
    FileText,
    Navigation,
    Mail,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
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
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Event } from '@/services/events';
import { eventService } from '@/services/events';

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
    const { data: detailEvent, isLoading } = useQuery({
        queryKey: ['event', event?.id],
        queryFn: () => eventService.eventGetById(event!.id),
        enabled: open && !!event?.id,
    });

    const displayEvent = detailEvent ?? event;

    if (!displayEvent) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
                <DialogHeader className="p-6 pb-2 border-b shrink-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant={
                            displayEvent.location_type === 'online' ? 'default' :
                                displayEvent.location_type === 'offline' ? 'outline' : 'secondary'
                        }>
                            {displayEvent.location_type === 'online' ? 'Online' :
                                displayEvent.location_type === 'offline' ? 'Offline' : 'Hybrid'}
                        </Badge>
                        <Badge variant="secondary">{displayEvent.event_type}</Badge>
                    </div>
                    <div className="flex justify-between items-start">
                        <DialogTitle className="text-xl font-bold leading-tight pr-8">{displayEvent.name}</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        Detail agenda kegiatan dan rapat koordinasi
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0">
                    {isLoading ? (
                        <div className="space-y-4 px-6 py-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-3/4" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    ) : (
                        <div className="space-y-6 px-6 py-4">
                            <div className="grid gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 bg-muted p-2 rounded-full">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Waktu</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatInWIB(displayEvent.start_time, 'EEEE, d MMMM yyyy')}
                                        </p>
                                        <p className="text-sm text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded inline-block mt-1">
                                            {formatInWIB(displayEvent.start_time, 'HH:mm')} - {formatInWIB(displayEvent.end_time, 'HH:mm')} WIB
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
                                            {displayEvent.location || (displayEvent.location_type === 'online' ? 'Pertemuan Virtual' : '-')}
                                        </p>
                                    </div>
                                </div>

                                {displayEvent.meeting_link && (
                                    <div className="flex items-start gap-3 text-primary">
                                        <div className="mt-1 bg-primary/10 p-2 rounded-full">
                                            <ExternalLink className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold">Tautan Pertemuan</p>
                                            <a
                                                href={displayEvent.meeting_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm hover:underline block truncate"
                                            >
                                                {displayEvent.meeting_link}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <div className="mt-1 bg-muted p-2 rounded-full">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">PIC</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {displayEvent.pic && displayEvent.pic.length > 0 ? (
                                                displayEvent.pic.map((p, i) => (
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

                                <div className="flex items-start gap-3">
                                    <div className="mt-1 bg-muted p-2 rounded-full">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Peserta</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {displayEvent.participants && displayEvent.participants.length > 0 ? (
                                                displayEvent.participants.map((p, i) => (
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

                                {displayEvent.email_recipients && displayEvent.email_recipients.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-muted p-2 rounded-full">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">Penerima Email</p>
                                            <div className="mt-2 space-y-1.5">
                                                {displayEvent.email_recipients.map((recipient, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm">
                                                        {recipient.name ? (
                                                            <div className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-md">
                                                                <span className="font-medium text-foreground">{recipient.name}</span>
                                                                <span className="text-muted-foreground">•</span>
                                                                <span className="text-muted-foreground text-xs">{recipient.email}</span>
                                                            </div>
                                                        ) : (
                                                            <Badge variant="outline" className="font-normal text-[10px]">
                                                                {recipient.email}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {displayEvent.description && (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-muted p-2 rounded-full">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">Deskripsi</p>
                                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line bg-muted/20 p-2 rounded-md border border-dashed text-xs">
                                                {displayEvent.description}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 pt-4 border-t shrink-0">
                    {displayEvent.documentation_folder_id && (
                        <Button variant="outline" className="gap-2 flex-1 h-9 text-xs" asChild>
                            <a href={`/folders/${displayEvent.documentation_folder_id}`}>
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