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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"
import { useState, useEffect } from "react"
import { UserBase, UserCreate, UserUpdate, UserRole } from "@/services/users/types"

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: UserCreate | UserUpdate) => void;
    user?: UserBase | null;
    mode: 'create' | 'edit';
    isLoading?: boolean;
}

export function UserModal({
    isOpen,
    onClose,
    onSave,
    user,
    mode,
    isLoading = false
}: UserModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('user');
    const [errors, setErrors] = useState<FormErrors>({});

    // Initialize form data when modal opens
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && user) {
                setName(user.name);
                setEmail(user.email);
                setRole(user.role);
                setPassword('');
            } else {
                setName('');
                setEmail('');
                setPassword('');
                setRole('user');
            }
            setErrors({});
        }
    }, [isOpen, mode, user]);

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Nama wajib diisi';
        }

        if (!email.trim()) {
            newErrors.email = 'Email wajib diisi';
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Format email tidak valid';
        }

        // Password validation
        if (mode === 'create') {
            if (!password) {
                newErrors.password = 'Password wajib diisi';
            } else if (password.length < 6) {
                newErrors.password = 'Password minimal 6 karakter';
            }
        } else if (mode === 'edit' && password) {
            // Optional password update on edit
            if (password.length < 6) {
                newErrors.password = 'Password minimal 6 karakter';
            }
        }

        if (!role) {
            newErrors.role = 'Role wajib dipilih';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            if (mode === 'create') {
                const createData: UserCreate = {
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    password,
                    role,
                };
                onSave(createData);
            } else {
                const updateData: UserUpdate = {
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    password: password? password : null,
                    role,
                };
                onSave(updateData);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>
                        {mode === 'create' ? 'Tambah User Baru' : 'Edit User'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Tambahkan user baru ke sistem.'
                            : 'Perbarui informasi user. Kosongkan password jika tidak ingin mengubahnya.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-1">
                    <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap *</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) {
                                        setErrors(prev => ({ ...prev, name: undefined }));
                                    }
                                }}
                                placeholder="Masukkan nama lengkap"
                                className={errors.name ? "border-destructive" : ""}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) {
                                        setErrors(prev => ({ ...prev, email: undefined }));
                                    }
                                }}
                                placeholder="contoh@email.com"
                                className={errors.email ? "border-destructive" : ""}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password {mode === 'create' ? '*' : '(opsional)'}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) {
                                        setErrors(prev => ({ ...prev, password: undefined }));
                                    }
                                }}
                                placeholder={mode === 'create' ? "Minimal 6 karakter" : "Kosongkan jika tidak ingin mengubah"}
                                className={errors.password ? "border-destructive" : ""}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password}</p>
                            )}
                            {mode === 'edit' && !password && (
                                <p className="text-xs text-muted-foreground">
                                    Password saat ini akan tetap digunakan
                                </p>
                            )}
                        </div>

                        {/* Role Field */}
                        <div className="space-y-2">
                            <Label htmlFor="role">Role *</Label>
                            <Select
                                value={role}
                                onValueChange={(value: UserRole) => {
                                    setRole(value);
                                    if (errors.role) {
                                        setErrors(prev => ({ ...prev, role: undefined }));
                                    }
                                }}
                            >
                                <SelectTrigger
                                    id="role"
                                    className={errors.role ? "border-destructive" : ""}
                                >
                                    <SelectValue placeholder="Pilih role user" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && (
                                <p className="text-sm text-destructive">{errors.role}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Admin memiliki akses penuh ke sistem, termasuk manajemen user dan folder
                            </p>
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
                            mode === 'create' ? 'Tambah User' : 'Perbarui User'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}