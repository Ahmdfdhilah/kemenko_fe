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
import { Upload, X, Image } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { FolderBase, FolderCreate, FolderUpdate } from "@/services/folders/types"

// Type for form validation errors
interface FormErrors {
    title?: string;
    description?: string;
    link?: string;
    image?: string;
}

interface FolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: FolderCreate | FolderUpdate) => void;
    folder?: FolderBase | null;
    mode: 'create' | 'edit';
    isLoading?: boolean;
}

export function FolderModal({
    isOpen,
    onClose,
    onSave,
    folder,
    mode,
    isLoading = false
}: FolderModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [willRemoveImage, setWillRemoveImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize form data when modal opens
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && folder) {
                setTitle(folder.title);
                setDescription(folder.description || '');
                setLink(folder.link);
                setPreviewUrl(folder.image_url || '');
                setWillRemoveImage(false);
            } else {
                setTitle('');
                setDescription('');
                setLink('');
                setPreviewUrl('');
                setWillRemoveImage(false);
            }
            setErrors({});
            setUploadedFile(null);
        }
    }, [isOpen, mode, folder]);

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!title.trim()) {
            newErrors.title = 'Judul wajib diisi';
        }

        if (!description.trim()) {
            newErrors.description = 'Deskripsi wajib diisi';
        }

        if (!link.trim()) {
            newErrors.link = 'Link wajib diisi';
        } else if (!isValidUrl(link)) {
            newErrors.link = 'Harap masukkan URL yang valid';
        }

        // Check if image is required for create mode or if removing existing image
        if (mode === 'create' && !uploadedFile) {
            newErrors.image = 'Gambar thumbnail wajib diisi';
        } else if (mode === 'edit' && willRemoveImage && !uploadedFile && !folder?.has_image) {
            newErrors.image = 'Gambar thumbnail wajib diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            if (mode === 'create') {
                const createData: FolderCreate = {
                    title,
                    description,
                    link,
                    image: uploadedFile || undefined,
                };
                onSave(createData);
            } else {
                const updateData: FolderUpdate = {
                    title,
                    description,
                    link,
                    image: uploadedFile || undefined,
                    remove_image: willRemoveImage
                };
                onSave(updateData);
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({
                ...prev,
                image: 'Harap pilih file gambar'
            }));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                image: 'Ukuran file harus kurang dari 5MB'
            }));
            return;
        }

        setUploadedFile(file);
        setWillRemoveImage(false);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            setPreviewUrl(result);
        };
        reader.readAsDataURL(file);

        // Clear any previous errors
        setErrors(prev => ({
            ...prev,
            image: undefined
        }));
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);

        if (mode === 'edit' && folder?.has_image) {
            setWillRemoveImage(true);
            setPreviewUrl('');
        } else {
            setPreviewUrl('');
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const showImageRequired = mode === 'create' || (mode === 'edit' && (!folder?.has_image || willRemoveImage));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>
                        {mode === 'create' ? 'Buat Folder Baru' : 'Edit Folder'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Tambahkan folder baru untuk mengorganisir dokumen Anda.'
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
                                rows={2}
                                className={`resize-none ${errors.description ? "border-destructive" : ""}`}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description}</p>
                            )}
                        </div>

                        {/* Link Field */}
                        <div className="space-y-2">
                            <Label htmlFor="link">Link Google Drive *</Label>
                            <Textarea
                                id="link"
                                value={link}
                                onChange={(e) => {
                                    setLink(e.target.value);
                                    if (errors.link) {
                                        setErrors(prev => ({ ...prev, link: undefined }));
                                    }
                                }}
                                placeholder="https://drive.google.com/drive/folders/..."
                                rows={3}
                                className={`resize-none ${errors.link ? "border-destructive" : ""}`}
                            />
                            {errors.link && (
                                <p className="text-sm text-destructive">{errors.link}</p>
                            )}
                        </div>

                        {/* Thumbnail Upload Section */}
                        <div className="space-y-3">
                            <Label>Gambar Thumbnail {showImageRequired && '*'}</Label>

                            {/* Current Image Info for Edit Mode */}
                            {mode === 'edit' && folder?.has_image && !willRemoveImage && !uploadedFile && (
                                <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                                    <p>Gambar saat ini akan tetap digunakan</p>
                                </div>
                            )}

                            {/* Remove Current Image Option for Edit Mode */}
                            {mode === 'edit' && folder?.has_image && !uploadedFile && (
                                <div className="flex items-center space-x-2">
                                    <Button
                                        type="button"
                                        variant={willRemoveImage ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setWillRemoveImage(!willRemoveImage)}
                                    >
                                        {willRemoveImage ? 'Batal Hapus Gambar' : 'Hapus Gambar Saat Ini'}
                                    </Button>
                                </div>
                            )}

                            {/* File Upload Area */}
                            <div className="space-y-2">
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${uploadedFile
                                            ? 'border-primary bg-primary/5'
                                            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
                                        } ${errors.image ? 'border-destructive' : ''}`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />

                                    {uploadedFile ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-center gap-2">
                                                <Image className="h-5 w-5 text-primary" />
                                                <span className="text-sm font-medium text-primary truncate max-w-[200px]">
                                                    {uploadedFile.name}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveFile();
                                                    }}
                                                    className="h-6 w-6 p-0 hover:bg-destructive/10 flex-shrink-0"
                                                >
                                                    <X className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Klik untuk mengganti atau seret file baru
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {mode === 'create' ? 'Klik untuk mengunggah gambar' : 'Klik untuk mengunggah gambar baru'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    PNG, JPG, GIF maksimal 5MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Error Message */}
                            {errors.image && (
                                <p className="text-sm text-destructive">{errors.image}</p>
                            )}

                            {/* Preview */}
                            {previewUrl && !willRemoveImage && (
                                <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">
                                        {uploadedFile ? 'Pratinjau Gambar Baru' : 'Gambar Saat Ini'}
                                    </Label>
                                    <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
                                        <img
                                            src={previewUrl}
                                            alt="Pratinjau thumbnail"
                                            className="w-full h-full object-cover"
                                            onError={() => {
                                                setPreviewUrl('');
                                                setErrors(prev => ({
                                                    ...prev,
                                                    image: 'Gagal memuat pratinjau gambar'
                                                }));
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {willRemoveImage && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded p-3">
                                    <p className="text-sm text-destructive">
                                        Gambar akan dihapus saat folder diperbarui
                                    </p>
                                </div>
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