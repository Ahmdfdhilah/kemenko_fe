import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@workspace/ui/components/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { FolderBase, FolderCreate, FolderUpdate } from "@/services/folders/types"
import { RootFolderDto, rootFolderSchema } from "@/pages/Folders/FolderDto"

interface RootFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: FolderCreate | FolderUpdate) => void;
    folder?: FolderBase | null;
    mode: 'create' | 'edit';
    isLoading?: boolean;
}

export function RootFolderModal({
    isOpen,
    onClose,
    onSave,
    folder,
    mode,
    isLoading = false
}: RootFolderModalProps) {
    const form = useForm<RootFolderDto>({
        resolver: zodResolver(rootFolderSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    })

    // Reset form when modal opens or folder changes
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && folder) {
                form.reset({
                    title: folder.title,
                    description: folder.description || '',
                })
            } else {
                form.reset({
                    title: '',
                    description: '',
                })
            }
        }
    }, [isOpen, mode, folder, form])

    const onSubmit = (data: RootFolderDto) => {
        if (mode === 'create') {
            const createData: FolderCreate = {
                title: data.title,
                description: data.description,
                parent_id: null, // Root folder has no parent
            }
            onSave(createData)
        } else {
            const updateData: FolderUpdate = {
                title: data.title,
                description: data.description,
            }
            onSave(updateData)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>
                        {mode === 'create' ? 'Buat Folder Baru' : 'Edit Folder'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Tambahkan folder root baru untuk mengorganisir dokumen Anda.'
                            : 'Perbarui informasi folder.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-1">
                        <div className="space-y-4 pb-4">
                            {/* Title Field */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Judul *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan judul folder"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description Field */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Masukkan deskripsi folder"
                                                rows={4}
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>

                <DialogFooter className="flex-shrink-0 gap-2 sm:gap-0 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>Memproses...</>
                        ) : (
                            mode === 'create' ? 'Buat Folder' : 'Perbarui Folder'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
