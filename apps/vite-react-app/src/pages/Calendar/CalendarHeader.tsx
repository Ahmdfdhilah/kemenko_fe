import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    ListFilter
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { PageHeader } from '@/components/common/PageHeader';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@workspace/ui/components/popover"

interface CalendarHeaderProps {
    currentDate: Date;
    isAdmin: boolean;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
    onAddEvent: () => void;
}

export function CalendarHeader({
    currentDate,
    isAdmin,
    onPrevMonth,
    onNextMonth,
    onToday,
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
            breadcrumbs={[
                { label: "Agenda Kegiatan" }
            ]}
            actions={
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center bg-muted/30 rounded-lg p-1 border">
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

                    {/* Mobile Navigation Popover */}
                    <div className="md:hidden">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="shrink-0">
                                    <ListFilter className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2" align="end">
                                <div className="flex items-center gap-1 justify-between">
                                    <Button variant="ghost" size="icon" onClick={onPrevMonth} className="h-8 w-8">
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm font-medium px-2">
                                        {format(currentDate, 'MMMM yyyy', { locale: idLocale })}
                                    </span>
                                    <Button variant="ghost" size="icon" onClick={onNextMonth} className="h-8 w-8">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="mt-2 border-t pt-2 w-full">
                                    <Button variant="secondary" size="sm" className="w-full" onClick={onToday}>
                                        Hari Ini
                                    </Button>
                                    {isAdmin && (
                                        <Button size="sm" onClick={onAddEvent} className="w-full mt-2 gap-2">
                                            <Plus className="h-4 w-4" />
                                            Tambah Agenda
                                        </Button>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {isAdmin && (
                        <div className="hidden md:block">
                            <Button onClick={onAddEvent} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Tambah Agenda
                            </Button>
                        </div>
                    )}
                </div>
            }
        />
    );
}
