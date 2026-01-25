import { format, parseISO } from 'date-fns';
import { Video, Home as HomeIcon } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { Event } from '@/services/events';

interface CalendarCellProps {
    day: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    events: Event[];
    onEventClick: (event: Event) => void;
}

export function CalendarCell({
    day,
    isCurrentMonth,
    isToday,
    events,
    onEventClick
}: CalendarCellProps) {
    const formattedDate = format(day, "d");

    // Sort events by time if needed, though usually they come sorted from API
    const sortedEvents = [...events].sort((a, b) =>
        parseISO(a.start_time).getTime() - parseISO(b.start_time).getTime()
    );

    return (
        <div
            className={cn(
                "min-h-[120px] border-r border-b p-2 transition-colors relative group",
                !isCurrentMonth && "bg-muted/20 text-muted-foreground",
                isToday && "bg-primary/5"
            )}
        >
            <div className="flex justify-between items-start mb-1">
                <span className={cn(
                    "text-sm font-medium flex items-center justify-center w-7 h-7 rounded-full",
                    isToday && "bg-primary text-primary-foreground shadow-sm"
                )}>
                    {formattedDate}
                </span>
            </div>
            <div className="space-y-1">
                {sortedEvents.slice(0, 3).map((event) => (
                    <Tooltip key={event.id}>
                        <TooltipTrigger asChild>
                            <div
                                onClick={() => onEventClick(event)}
                                className={cn(
                                    "text-[10px] leading-tight p-1.5 rounded border-l-2 cursor-pointer transition-all hover:translate-x-1 truncate shadow-sm",
                                    event.location_type === 'online'
                                        ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                                        : event.location_type === 'offline'
                                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                            : "bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                )}
                            >
                                <div className="flex items-center gap-1">
                                    {event.location_type === 'online' ? <Video className="h-2.5 w-2.5 shrink-0" /> : <HomeIcon className="h-2.5 w-2.5 shrink-0" />}
                                    <span className="font-semibold">{format(parseISO(event.start_time), 'HH:mm')}</span>
                                </div>
                                <div className="truncate mt-0.5">{event.name}</div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-[200px] p-2">
                            <p className="font-bold mb-1 text-xs">{event.name}</p>
                            <p className="text-[10px] text-muted-foreground line-clamp-2">{event.description}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
                {sortedEvents.length > 3 && (
                    <div className="text-[10px] font-medium text-muted-foreground px-1 py-0.5 bg-muted/50 rounded inline-block">
                        + {sortedEvents.length - 3} lainnya
                    </div>
                )}
            </div>
        </div>
    );
}
