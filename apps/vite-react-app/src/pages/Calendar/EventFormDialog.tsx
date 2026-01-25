import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import {
    CalendarIcon,
    Link,
    MapPin,
    User,
    Type,
    FileText,
    FolderOpen,
    Loader2,
    X
} from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@workspace/ui/components/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@workspace/ui/components/form";
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@workspace/ui/components/select';
import { Badge } from '@workspace/ui/components/badge';
import { Event, LocationType } from '@/services/events';
import { folderService } from '@/services/folders';
import { useQuery } from '@tanstack/react-query';

const formSchema = z.object({
    name: z.string().min(1, "Nama agenda wajib diisi"),
    start_time: z.string().min(1, "Waktu mulai wajib diisi"),
    end_time: z.string().min(1, "Waktu selesai wajib diisi"),
    location_type: z.enum(['offline', 'online', 'hybrid']),
    location: z.string().optional(),
    meeting_link: z.string().url("Format tautan tidak valid").optional().or(z.literal("")),
    pic: z.array(z.string()).min(1, "Minimal pilih 1 PIC"),
    event_type: z.string().min(1, "Tipe agenda wajib diisi"),
    description: z.string().optional(),
    documentation_folder_id: z.string().optional().nullable(),
});

interface EventFormDialogProps {
    event: Event | null; // null means create mode
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}

export function EventFormDialog({
    event,
    open,
    onClose,
    onSubmit
}: EventFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [picInput, setPicInput] = useState("");

    const isEditMode = !!event;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            start_time: "",
            end_time: "",
            location_type: "offline" as LocationType,
            location: "",
            meeting_link: "",
            pic: [],
            event_type: "Meeting",
            description: "",
            documentation_folder_id: null,
        },
    });

    useEffect(() => {
        if (open) {
            if (event) {
                form.reset({
                    name: event.name,
                    start_time: format(parseISO(event.start_time), "yyyy-MM-dd'T'HH:mm"),
                    end_time: format(parseISO(event.end_time), "yyyy-MM-dd'T'HH:mm"),
                    location_type: event.location_type,
                    location: event.location || "",
                    meeting_link: event.meeting_link || "",
                    pic: event.pic || [],
                    event_type: event.event_type,
                    description: event.description || "",
                    documentation_folder_id: event.documentation_folder_id || null,
                });
            } else {
                form.reset({
                    name: "",
                    start_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
                    end_time: format(new Date(Date.now() + 3600000), "yyyy-MM-dd'T'HH:mm"),
                    location_type: "offline",
                    location: "",
                    meeting_link: "",
                    pic: [],
                    event_type: "Meeting",
                    description: "",
                    documentation_folder_id: null,
                });
            }
        }
    }, [event, open, form]);

    // Fetch folders for documentation linkage
    const { data: folderData } = useQuery({
        queryKey: ['folders-simple'],
        queryFn: () => folderService.folderGetAll({ page: 1, limit: 100 }),
        enabled: open
    });

    const folders = folderData?.items || [];

    const handleAddPic = () => {
        if (picInput.trim()) {
            const currentPics = form.getValues("pic");
            if (!currentPics.includes(picInput.trim())) {
                form.setValue("pic", [...currentPics, picInput.trim()]);
            }
            setPicInput("");
        }
    };

    const handleRemovePic = (pic: string) => {
        const currentPics = form.getValues("pic");
        form.setValue("pic", currentPics.filter(p => p !== pic));
    };

    const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            // Convert to ISO 8601 strings
            const formattedValues = {
                ...values,
                start_time: new Date(values.start_time).toISOString(),
                end_time: new Date(values.end_time).toISOString(),
                documentation_folder_id: (values.documentation_folder_id === "none" || !values.documentation_folder_id) ? null : values.documentation_folder_id
            };
            await onSubmit(formattedValues);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
                <DialogHeader className="p-6 pb-2 border-b shrink-0">
                    <DialogTitle className="text-xl font-bold">
                        {isEditMode ? "Sunting Agenda" : "Tambah Agenda Baru"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onFormSubmit)} className="flex-1 overflow-y-auto min-h-0">
                        <div className="space-y-4 px-6 py-4">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Agenda</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Type className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input placeholder="Contoh: Rapat Koordinasi Anggaran" className="pl-9" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="start_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Waktu Mulai</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input type="datetime-local" className="pl-9" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="end_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Waktu Selesai</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input type="datetime-local" className="pl-9" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="location_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tipe Lokasi</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih tipe" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="offline">Offline</SelectItem>
                                                        <SelectItem value="online">Online</SelectItem>
                                                        <SelectItem value="hybrid">Hybrid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="event_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kategori Agenda</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Contoh: Rapat, Workshop, dll." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {(form.watch("location_type") === "offline" || form.watch("location_type") === "hybrid") && (
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ruangan / Alamat</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="Contoh: Ruang Rapat Lt. 1" className="pl-9" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {(form.watch("location_type") === "online" || form.watch("location_type") === "hybrid") && (
                                    <FormField
                                        control={form.control}
                                        name="meeting_link"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tautan Virtual {form.watch("location_type") === "hybrid" && "(Opsional)"}</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Link className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="https://zoom.us/j/..." className="pl-9" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <FormItem>
                                    <FormLabel>PIC </FormLabel>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Tambah nama peserta..."
                                                className="pl-9"
                                                value={picInput}
                                                onChange={(e) => setPicInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddPic();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <Button type="button" variant="outline" onClick={handleAddPic}>Tambah</Button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        <FormField
                                            control={form.control}
                                            name="pic"
                                            render={({ field }) => (
                                                <>
                                                    {field.value.map((p) => (
                                                        <Badge key={p} variant="secondary" className="gap-1 pr-1 py-1">
                                                            {p}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemovePic(p)}
                                                                className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </>
                                            )}
                                        />
                                    </div>
                                    <FormMessage />
                                </FormItem>

                                <FormField
                                    control={form.control}
                                    name="documentation_folder_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hubungkan ke Folder Dokumentasi</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || undefined}
                                                value={field.value || "none"}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <div className="flex items-center gap-2">
                                                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                                            <SelectValue placeholder="Pilih folder (opsional)" />
                                                        </div>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">Tanpa Folder</SelectItem>
                                                    {folders.map((folder) => (
                                                        <SelectItem key={folder.id} value={folder.id}>{folder.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Deskripsi / Catatan</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Textarea
                                                        placeholder="Rincian agenda..."
                                                        className="pl-9 min-h-[100px] resize-none"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </form>
                </Form>

                <DialogFooter className="p-6 pt-4 border-t shrink-0">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        onClick={form.handleSubmit(onFormSubmit)}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditMode ? "Simpan Perubahan" : "Buat Agenda"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
