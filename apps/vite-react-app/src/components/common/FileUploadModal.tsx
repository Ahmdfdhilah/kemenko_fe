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
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { useState, useEffect, useRef } from "react"
import { FileUpload } from "@/services/files/types"
import { validateFile, formatFileSize } from "@/utils/file"
import { Upload, X, FileIcon } from "lucide-react"

interface FormErrors {
    name?: string;
    file?: string;
}

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
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setDescription('');
            setSelectedFile(null);
            setErrors({});
        }
    }, [isOpen]);

    const handleFileSelect = (file: File) => {
        const validation = validateFile(file);

        if (!validation.isValid) {
            setErrors(prev => ({ ...prev, file: validation.error }));
            return;
        }

        setSelectedFile(file);
        if (!name) {
            setName(file.name);
        }
        setErrors(prev => ({ ...prev, file: undefined }));
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Nama file wajib diisi';
        } else if (name.trim().length < 3) {
            newErrors.name = 'Nama file minimal 3 karakter';
        }

        if (!selectedFile) {
            newErrors.file = 'File wajib dipilih';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm() && selectedFile) {
            const uploadData: FileUpload = {
                name: name.trim(),
                description: description.trim(),
                file: selectedFile,
            };
            onSave(uploadData);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>
                        Upload file baru ke folder ini. Maksimal ukuran file 10MB.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-1">
                    <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama File *</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) {
                                        setErrors(prev => ({ ...prev, name: undefined }));
                                    }
                                }}
                                placeholder="Masukkan nama file"
                                className={errors.name ? "border-destructive" : ""}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>File *</Label>
                            <div
                                className={`
                                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                                    transition-colors
                                    ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                                    ${errors.file ? 'border-destructive' : ''}
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
                                                e.stopPropagation();
                                                handleRemoveFile();
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {errors.file && (
                                <p className="text-sm text-destructive">{errors.file}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Masukkan deskripsi file (opsional)"
                                rows={3}
                                className="resize-none"
                            />
                        </div>
                    </form>
                </div>

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
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? <>Mengupload...</> : 'Upload File'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
