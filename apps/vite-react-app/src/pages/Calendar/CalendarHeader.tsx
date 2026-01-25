import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Search
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { PageHeader } from '@/components/common/PageHeader';

interface CalendarHeaderProps {
    currentDate: Date;
    searchQuery: string;
    isAdmin: boolean;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
    onSearchChange: (value: string) => void;
    onAddEvent: () => void;
}

export function CalendarHeader({
    currentDate,
    searchQuery,
    isAdmin,
    onPrevMonth,
    onNextMonth,
    onToday,
    onSearchChange,
    onAddEvent
}: CalendarHeaderProps) {
    return (
        <PageHeader
            title={
                <>
                    Agenda <span className="text-primary">Kegiatan</span>
                </>
            }
            description="Jadwal agenda dan rapat koordinasi Kemenko"
            actions={
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari agenda..."
                            className="pl-9 w-full md:w-64"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center bg-muted/30 rounded-lg p-1 border">
                        <Button variant="ghost" size="icon" onClick={onPrevMonth} className="h-8 w-8">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" className="px-4 h-8 font-medium" onClick={onToday}>
                            {format(currentDate, 'MMMM yyyy', { locale: idLocale })}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onNextMonth} className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    {isAdmin && (
                        <Button onClick={onAddEvent} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Agenda
                        </Button>
                    )}
                </div>
            }
        />
    );
}
