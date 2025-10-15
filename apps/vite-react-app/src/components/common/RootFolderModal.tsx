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
import { useState, useEffect } from "react"
import { FolderBase, FolderCreate, FolderUpdate } from "@/services/folders/types"

// Type for form validation errors
interface FormErrors {
    title?: string;
    description?: string;
}

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
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});

    // Initialize form data when modal opens
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && folder) {
                setTitle(folder.title);
                setDescription(folder.description || '');
            } else {
                setTitle('');
                setDescription('');
            }
            setErrors({});
        }
    }, [isOpen, mode, folder]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!title.trim()) {
            newErrors.title = 'Judul wajib diisi';
        } else if (title.trim().length < 3) {
            newErrors.title = 'Judul minimal 3 karakter';
        }

        if (!description.trim()) {
            newErrors.description = 'Deskripsi wajib diisi';
        } else if (description.trim().length < 10) {
            newErrors.description = 'Deskripsi minimal 10 karakter';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            if (mode === 'create') {
                const createData: FolderCreate = {
                    title: title.trim(),
                    description: description.trim(),
                    parent_id: null, // Root folder
                };
                onSave(createData);
            } else {
                const updateData: FolderUpdate = {
                    title: title.trim(),
                    description: description.trim(),
                };
                onSave(updateData);
            }
        }
    };

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

                <div className="flex-1 overflow-y-auto px-1">
                    <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                        {/* Title Field */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (errors.title) {
                                        setErrors(prev => ({ ...prev, title: undefined }));
                                    }
                                }}
                                placeholder="Masukkan judul folder"
                                className={errors.title ? "border-destructive" : ""}
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title}</p>
                            )}
                        </div>

                        {/* Description Field */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi *</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    if (errors.description) {
                                        setErrors(prev => ({ ...prev, description: undefined }));
                                    }
                                }}
                                placeholder="Masukkan deskripsi folder"
                                rows={4}
                                className={`resize-none ${errors.description ? "border-destructive" : ""}`}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description}</p>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer Buttons */}
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