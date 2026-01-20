"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Search, Loader2, UserCheck, X } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"
import { useUsers } from "@/hooks/useUsers"
import { useFolderPermissions, useGrantPermission, useRevokePermission } from "@/hooks/useFolderPermissions"
import { UserBase } from "@/services/users/types"

interface FolderPermissionModalProps {
    isOpen: boolean
    onClose: () => void
    folderId: string
    folderTitle: string
}

export function FolderPermissionModal({
    isOpen,
    onClose,
    folderId,
    folderTitle
}: FolderPermissionModalProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearch = useDebounce(searchTerm, 500)

    // Fetch users with search - only when modal is open
    const { data: usersResponse, isLoading: isLoadingUsers } = useUsers({
        page: 1,
        limit: 50,
        search: debouncedSearch || null,
        role: 'user', // Only show regular users (not admins)
        sort_by: 'name',
        sort_type: 'asc'
    }, isOpen)

    // Fetch current folder permissions
    const {
        data: permissionsResponse,
        isLoading: isLoadingPermissions
    } = useFolderPermissions(folderId, isOpen)

    const grantMutation = useGrantPermission()
    const revokeMutation = useRevokePermission()

    // Get user IDs that have permission
    const permittedUserIds = new Set(
        permissionsResponse?.data?.map(p => p.user_id) || []
    )

    const users = usersResponse?.items || []
    const isLoading = isLoadingUsers || isLoadingPermissions
    const isMutating = grantMutation.isPending || revokeMutation.isPending

    const handleTogglePermission = async (userId: string, hasPermission: boolean) => {
        if (hasPermission) {
            // Revoke permission
            revokeMutation.mutate({ folderId, userId })
        } else {
            // Grant permission
            grantMutation.mutate({ folderId, data: { user_id: userId } })
        }
    }

    const handleClose = () => {
        if (!isMutating) {
            setSearchTerm("")
            onClose()
        }
    }

    // Reset search when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm("")
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5" />
                        Kelola Hak Akses Folder
                    </DialogTitle>
                    <DialogDescription>
                        Atur pengguna yang memiliki akses ke folder <strong>{folderTitle}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                        <Input
                            type="search"
                            placeholder="Cari pengguna berdasarkan nama atau email..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={isMutating}
                        />
                    </div>

                    {/* Current Permissions Summary */}
                    <div className="text-sm text-muted-foreground">
                        {isLoadingPermissions ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Memuat data hak akses...
                            </div>
                        ) : (
                            <div>
                                {permittedUserIds.size === 0 ? (
                                    "Belum ada pengguna dengan hak akses edit"
                                ) : (
                                    `${permittedUserIds.size} pengguna memiliki hak akses edit`
                                )}
                            </div>
                        )}
                    </div>

                    {/* Users List */}
                    <ScrollArea className="h-[400px] border rounded-lg">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Memuat pengguna...</span>
                                </div>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="text-muted-foreground mb-2">
                                    {searchTerm ? "Pengguna tidak ditemukan" : "Tidak ada pengguna"}
                                </div>
                                {searchTerm && (
                                    <div className="text-sm text-muted-foreground/70">
                                        Coba sesuaikan kata kunci pencarian
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 space-y-2">
                                {users.map((user: UserBase) => {
                                    const hasPermission = permittedUserIds.has(user.id)
                                    const isProcessing =
                                        (grantMutation.isPending && grantMutation.variables?.data.user_id === user.id) ||
                                        (revokeMutation.isPending && revokeMutation.variables?.userId === user.id)

                                    return (
                                        <div
                                            key={user.id}
                                            className={`
                                                flex items-start gap-3 p-3 rounded-lg border
                                                ${hasPermission ? 'bg-primary/5 border-primary/20' : 'bg-background'}
                                                ${isProcessing ? 'opacity-50' : 'hover:bg-accent/50'}
                                                transition-colors
                                            `}
                                        >
                                            <Checkbox
                                                id={`user-${user.id}`}
                                                checked={hasPermission}
                                                onCheckedChange={() => handleTogglePermission(user.id, hasPermission)}
                                                disabled={isMutating}
                                                className="mt-1"
                                            />

                                            <label
                                                htmlFor={`user-${user.id}`}
                                                className="flex-1 cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-foreground">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground truncate">
                                                            {user.email}
                                                        </div>
                                                    </div>

                                                    {isProcessing && (
                                                        <Loader2 className="h-4 w-4 animate-spin text-primary ml-2" />
                                                    )}
                                                </div>

                                                {hasPermission && (
                                                    <div className="mt-1 text-xs text-primary font-medium">
                                                        Memiliki akses
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </ScrollArea>

                    {/* Footer Info */}
                    <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        <strong>Catatan:</strong> Pengguna dengan hak akses membuat, mengedit, memindahkan, dan
                        menghapus folder serta file dalam folder ini dan semua subfolder di dalamnya. Admin selalu memiliki
                        akses penuh ke semua folder.
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={isMutating}
                        >
                            {isMutating ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <X className="h-4 w-4 mr-2" />
                                    Tutup
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
