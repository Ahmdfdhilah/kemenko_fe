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

export interface FolderData {
    id?: string;
    title: string;
    category: string;
    link: string;
    thumbnail: string;
}

interface FolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: FolderData) => void;
    folder?: FolderData | null;
    mode: 'create' | 'edit';
    isLoading?: boolean;
}

const DEFAULT_PLACEHOLDER = 'https://placehold.co/600x400';

export function FolderModal({
    isOpen,
    onClose,
    onSave,
    folder,
    mode,
    isLoading = false
}: FolderModalProps) {
    const [formData, setFormData] = useState<FolderData>({
        title: '',
        category: '',
        link: '',
        thumbnail: ''
    });
    const [errors, setErrors] = useState<Partial<FolderData>>({});
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize form data when modal opens
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && folder) {
                setFormData({
                    id: folder.id,
                    title: folder.title,
                    category: folder.category,
                    link: folder.link,
                    thumbnail: folder.thumbnail
                });
                setPreviewUrl(folder.thumbnail || DEFAULT_PLACEHOLDER);
            } else {
                setFormData({
                    title: '',
                    category: '',
                    link: '',
                    thumbnail: ''
                });
                setPreviewUrl('');
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
        const newErrors: Partial<FolderData> = {};
        
        if (!formData.title.trim()) {
            newErrors.title = 'Judul wajib diisi';
        }
        
        if (!formData.category.trim()) {
            newErrors.category = 'Kategori wajib diisi';
        }
        
        if (!formData.link.trim()) {
            newErrors.link = 'Link wajib diisi';
        } else if (!isValidUrl(formData.link)) {
            newErrors.link = 'Harap masukkan URL yang valid';
        }

        if (!formData.thumbnail && !uploadedFile) {
            newErrors.thumbnail = 'Gambar thumbnail wajib diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FolderData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            onSave(formData);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({
                ...prev,
                thumbnail: 'Harap pilih file gambar'
            }));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                thumbnail: 'Ukuran file harus kurang dari 5MB'
            }));
            return;
        }

        setUploadedFile(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            setPreviewUrl(result);
            setFormData(prev => ({
                ...prev,
                thumbnail: result // Store base64 data URL
            }));
        };
        reader.readAsDataURL(file);

        // Clear any previous errors
        setErrors(prev => ({
            ...prev,
            thumbnail: undefined
        }));
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
        setPreviewUrl('');
        setFormData(prev => ({
            ...prev,
            thumbnail: ''
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
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
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Masukkan judul folder"
                                className={errors.title ? "border-destructive" : ""}
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title}</p>
                            )}
                        </div>

                        {/* Category Field */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori *</Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                                placeholder="Masukkan kategori"
                                className={errors.category ? "border-destructive" : ""}
                            />
                            {errors.category && (
                                <p className="text-sm text-destructive">{errors.category}</p>
                            )}
                        </div>

                        {/* Link Field */}
                        <div className="space-y-2">
                            <Label htmlFor="link">Link Google Drive *</Label>
                            <Textarea
                                id="link"
                                value={formData.link}
                                onChange={(e) => handleInputChange('link', e.target.value)}
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
                            <Label>Gambar Thumbnail *</Label>
                            
                            {/* File Upload Area */}
                            <div className="space-y-2">
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                                        uploadedFile || previewUrl
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
                                    } ${errors.thumbnail ? 'border-destructive' : ''}`}
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
                                                <p className="text-sm font-medium">Klik untuk mengunggah gambar</p>
                                                <p className="text-xs text-muted-foreground">
                                                    PNG, JPG, GIF maksimal 5MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Error Message */}
                            {errors.thumbnail && (
                                <p className="text-sm text-destructive">{errors.thumbnail}</p>
                            )}

                            {/* Preview */}
                            {previewUrl && (
                                <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">Pratinjau</Label>
                                    <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
                                        <img
                                            src={previewUrl}
                                            alt="Pratinjau thumbnail"
                                            className="w-full h-full object-cover"
                                            onError={() => {
                                                setPreviewUrl('');
                                                setErrors(prev => ({
                                                    ...prev,
                                                    thumbnail: 'Gagal memuat pratinjau gambar'
                                                }));
                                            }}
                                        />
                                    </div>
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