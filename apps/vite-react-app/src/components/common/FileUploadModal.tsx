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
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import { FileUpload } from "@/services/files/types"
import { FileUploadDto, fileUploadSchema } from "@/pages/Folders/FileDto"
import { formatFileSize } from "@/utils/file"
import { Upload, X, FileIcon } from "lucide-react"

interface FileUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: FileUpload) => void;
    isLoading?: boolean;
}

export function FileUploadModal({
    isOpen,
    onClose,
    onSave,
    isLoading = false
}: FileUploadModalProps) {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<FileUploadDto>({
        resolver: zodResolver(fileUploadSchema),
        defaultValues: {
            name: '',
            description: '',
            file: undefined as any, // Will be set when file is selected
        },
    })

    const selectedFile = form.watch('file')

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            form.reset({
                name: '',
                description: '',
                file: undefined as any,
            })
        }
    }, [isOpen, form])

    const handleFileSelect = (file: File) => {
        form.setValue('file', file, { shouldValidate: true })

        // Auto-fill name if empty
        if (!form.getValues('name')) {
            form.setValue('name', file.name)
        }
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleRemoveFile = () => {
        form.setValue('file', undefined as any, { shouldValidate: true })
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const onSubmit = (data: FileUploadDto) => {
        const uploadData: FileUpload = {
            name: data.name,
            description: data.description,
            file: data.file,
        }
        onSave(uploadData)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>
                        Upload file baru ke folder ini. Maksimal ukuran file 10MB.
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
                                        <FormLabel>Nama File *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan nama file"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* File Field */}
                            <Controller
                                control={form.control}
                                name="file"
                                render={({  fieldState }) => (
                                    <FormItem>
                                        <FormLabel>File *</FormLabel>
                                        <FormControl>
                                            <div
                                                className={`
                                                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                                                    transition-colors
                                                    ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                                                    ${fieldState.error ? 'border-destructive' : ''}
                                                `}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileInputChange}
                                                    accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.zip"
                                                />

                                                {!selectedFile ? (
                                                    <div className="flex flex-col items-center">
                                                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                                        <p className="text-sm text-muted-foreground mb-1">
                                                            Drag & drop file atau klik untuk browse
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            PDF, DOCX, XLSX, Images, ZIP (Max 10MB)
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                                            <FileIcon className="h-5 w-5 text-primary flex-shrink-0" />
                                                            <div className="min-w-0 flex-1 text-left">
                                                                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {formatFileSize(selectedFile.size)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 flex-shrink-0"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleRemoveFile()
                                                            }}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
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
                                                placeholder="Masukkan deskripsi file (opsional)"
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
                        {isLoading ? <>Mengupload...</> : 'Upload File'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
