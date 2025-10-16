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
import { FileBase, FileCreateLink, FileUpdateLink } from "@/services/files/types"

interface FormErrors {
    name?: string;
    description?: string;
    external_link?: string;
}

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
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [externalLink, setExternalLink] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && file) {
                setName(file.name);
                setDescription(file.description || '');
                setExternalLink(file.external_link || '');
            } else {
                setName('');
                setDescription('');
                setExternalLink('');
            }
            setErrors({});
        }
    }, [isOpen, mode, file]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Nama link wajib diisi';
        } else if (name.trim().length < 3) {
            newErrors.name = 'Nama link minimal 3 karakter';
        }

        if (!externalLink.trim()) {
            newErrors.external_link = 'URL link wajib diisi';
        } else {
            try {
                new URL(externalLink.trim());
            } catch {
                newErrors.external_link = 'URL tidak valid';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            if (mode === 'create') {
                const createData: FileCreateLink = {
                    name: name.trim(),
                    description: description.trim(),
                    external_link: externalLink.trim(),
                };
                onSave(createData);
            } else {
                const updateData: FileUpdateLink = {
                    name: name.trim(),
                    description: description.trim(),
                    external_link: externalLink.trim(),
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
                        {mode === 'create' ? 'Tambah Link Eksternal' : 'Edit Link Eksternal'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Tambahkan link eksternal ke folder ini.'
                            : 'Perbarui informasi link eksternal.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-1">
                    <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Link *</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) {
                                        setErrors(prev => ({ ...prev, name: undefined }));
                                    }
                                }}
                                placeholder="Masukkan nama link"
                                className={errors.name ? "border-destructive" : ""}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="external_link">URL Link *</Label>
                            <Input
                                id="external_link"
                                type="url"
                                value={externalLink}
                                onChange={(e) => {
                                    setExternalLink(e.target.value);
                                    if (errors.external_link) {
                                        setErrors(prev => ({ ...prev, external_link: undefined }));
                                    }
                                }}
                                placeholder="https://example.com/document"
                                className={errors.external_link ? "border-destructive" : ""}
                            />
                            {errors.external_link && (
                                <p className="text-sm text-destructive">{errors.external_link}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    if (errors.description) {
                                        setErrors(prev => ({ ...prev, description: undefined }));
                                    }
                                }}
                                placeholder="Masukkan deskripsi link (opsional)"
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
