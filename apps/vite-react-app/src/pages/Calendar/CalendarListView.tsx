import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    MapPin,
    Video
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Event } from '@/services/events';

interface CalendarListViewProps {
    events: Event[];
    isAdmin: boolean;
    onEdit: (event: Event) => void;
    onDelete: (id: string) => void;
    onView: (event: Event) => void;
}

export function CalendarListView({
    events,
    isAdmin,
    onEdit,
    onDelete,
    onView
}: CalendarListViewProps) {

    if (events.length === 0) {
        return (
            <div className="text-center py-10 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">Tidak ada agenda pada bulan ini.</p>
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[250px]">Nama Agenda</TableHead>
                        <TableHead className="w-[200px]">Waktu</TableHead>
                        <TableHead className="w-[200px]">Lokasi</TableHead>
                        <TableHead className="w-[150px]">Kategori</TableHead>
                        <TableHead>PIC / Peserta</TableHead>
                        <TableHead className="w-[80px]">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.map((event) => (
                        <TableRow key={event.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onView(event)}>
                            <TableCell className="font-medium">
                                {event.name}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col text-sm">
                                    <span className="font-medium">
                                        {format(parseISO(event.start_time), 'd MMM yyyy', { locale: idLocale })}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                        {format(parseISO(event.start_time), 'HH:mm')} - {format(parseISO(event.end_time), 'HH:mm')}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1 text-sm">
                                    {(event.location_type === 'offline' || event.location_type === 'hybrid') && event.location && (
                                        <div className="flex items-center gap-1.5" title={event.location}>
                                            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                                            <span className="truncate max-w-[180px]">{event.location}</span>
                                        </div>
                                    )}
                                    {(event.location_type === 'online' || event.location_type === 'hybrid') && event.meeting_link && (
                                        <div className="flex items-center gap-1.5 text-blue-600">
                                            <Video className="h-3 w-3 shrink-0" />
                                            <a
                                                href={event.meeting_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="truncate max-w-[180px] hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Link Meeting
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="font-normal">
                                    {event.event_type}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {event.pic && event.pic.length > 0 ? (
                                        event.pic.slice(0, 3).map((p, i) => (
                                            <Badge key={i} variant="outline" className="text-[10px] h-5 px-1.5">
                                                {p}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-muted-foreground text-sm">-</span>
                                    )}
                                    {event.pic && event.pic.length > 3 && (
                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                                            +{event.pic.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(event); }}>
                                            Lihat Detail
                                        </DropdownMenuItem>
                                        {isAdmin && (
                                            <>
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(event); }}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
