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
import { FileBase, FileCreateLink, FileUpdateLink } from "@/services/files/types"
import { FileLinkDto, fileLinkSchema } from "@/pages/Folders/FileDto"

interface FileLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: FileCreateLink | FileUpdateLink) => void;
    file?: FileBase | null;
    mode: 'create' | 'edit';
    isLoading?: boolean;
}

export function FileLinkModal({
    isOpen,
    onClose,
    onSave,
    file,
    mode,
    isLoading = false
}: FileLinkModalProps) {
    const form = useForm<FileLinkDto>({
        resolver: zodResolver(fileLinkSchema),
        defaultValues: {
            name: '',
            description: '',
            external_link: '',
        },
    })

    // Reset form when modal opens or file changes
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && file) {
                form.reset({
                    name: file.name,
                    description: file.description || '',
                    external_link: file.external_link || '',
                })
            } else {
                form.reset({
                    name: '',
                    description: '',
                    external_link: '',
                })
            }
        }
    }, [isOpen, mode, file, form])

    const onSubmit = (data: FileLinkDto) => {
        if (mode === 'create') {
            const createData: FileCreateLink = {
                name: data.name,
                description: data.description,
                external_link: data.external_link,
            }
            onSave(createData)
        } else {
            const updateData: FileUpdateLink = {
                name: data.name,
                description: data.description,
                external_link: data.external_link,
            }
            onSave(updateData)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>
                        {mode === 'create' ? 'Tambah Link Eksternal' : 'Edit Link Eksternal'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Tambahkan link eksternal ke folder ini.'
                            : 'Perbarui informasi link eksternal.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-1">
                        <div className="space-y-4 pb-4">
                            {/* Name Field */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Link *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan nama link"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* External Link Field */}
                            <FormField
                                control={form.control}
                                name="external_link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL Link *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="url"
                                                placeholder="https://example.com/document"
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
                                        <FormLabel>Deskripsi</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Masukkan deskripsi link (opsional)"
                                                rows={3}
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
                            mode === 'create' ? 'Tambah Link' : 'Perbarui Link'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
