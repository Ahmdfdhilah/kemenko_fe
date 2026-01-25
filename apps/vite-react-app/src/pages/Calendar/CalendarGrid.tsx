import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';
import { CalendarCell } from './CalendarCell';
import { Event } from '@/services/events';

interface CalendarGridProps {
    currentDate: Date;
    events: Event[];
    onEventClick: (event: Event) => void;
}

export function CalendarGrid({
    currentDate,
    events,
    onEventClick
}: CalendarGridProps) {
    const daysArr = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const renderHeader = () => (
        <div className="grid grid-cols-7 mb-2">
            {daysArr.map((day, i) => (
                <div key={i} className="text-center text-sm font-semibold text-muted-foreground py-2 border-b">
                    {day}
                </div>
            ))}
        </div>
    );

    const renderCells = () => {
        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;

                // Find events for this day
                const dayEvents = events.filter(event => {
                    const eventStart = parseISO(event.start_time);
                    const eventEnd = parseISO(event.end_time);
                    return isSameDay(cloneDay, eventStart) ||
                        isSameDay(cloneDay, eventEnd) ||
                        (cloneDay > eventStart && cloneDay < eventEnd);
                });

                days.push(
                    <CalendarCell
                        key={day.toString()}
                        day={day}
                        isCurrentMonth={isSameMonth(day, monthStart)}
                        isToday={isSameDay(day, new Date())}
                        events={dayEvents}
                        onEventClick={onEventClick}
                    />
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="border-l border-t rounded-lg overflow-hidden border-border bg-card shadow-sm">{rows}</div>;
    };

    return (
        <div className="calendar-grid">
            {renderHeader()}
            {renderCells()}
        </div>
    );
}
