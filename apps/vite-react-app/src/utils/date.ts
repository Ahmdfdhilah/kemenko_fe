import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

/**
 * Utility method to format date in local Indonesian format
 */
export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

/**
 * Formats a date string or Date object specifically in WIB (Asia/Jakarta) timezone.
 * This ensures consistency even if the user's browser is in a different timezone.
 */
export const formatInWIB = (date: string | Date, formatStr: string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const parts = formatter.formatToParts(d);
    const partMap: Record<string, string> = {};
    parts.forEach(p => {
        partMap[p.type] = p.value;
    });

    const wibDate = new Date(
        parseInt(partMap.year),
        parseInt(partMap.month) - 1,
        parseInt(partMap.day),
        parseInt(partMap.hour),
        parseInt(partMap.minute),
        parseInt(partMap.second)
    );

    return format(wibDate, formatStr, { locale: idLocale });
};

/**
 * Parses a date string from a datetime-local input (assumed to be WIB) 
 * and returns a UTC Date object for the backend.
 */
export const parseFromWIB = (wibDateStr: string): Date => {
    return new Date(`${wibDateStr}:00+07:00`);
};