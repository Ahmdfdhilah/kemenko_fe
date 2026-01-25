import { useState, useEffect } from "react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import {
    Search,
    UserPlus,
    Loader2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ArrowUpDown,
    Pencil,
    Trash2,
    Mail,
    Shield,
    MoreVertical
} from "lucide-react"
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/useUsers'
import { useAuth } from "@/hooks/useAuth"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Badge } from "@workspace/ui/components/badge"
import { UserModal } from "@/components/common/UserModal"
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog"
import { PageHeader } from "@/components/common/PageHeader"
import { UserBase, UserCreate, UserUpdate, UserRole } from "@/services/users/types"
import { formatDate } from "@/utils/date"
import { getPageNumbers } from "@/utils/pagination"

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | 'created_at'>('created_at')
    const [sortType, setSortType] = useState<'asc' | 'desc'>('desc')
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')

    const { user } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [editingUser, setEditingUser] = useState<UserBase | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const {
        data: usersResponse,
        isLoading: isLoadingUsers,
        error: usersError,
        refetch: refetchUsers
    } = useUsers({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm || null,
        role: roleFilter === 'all' ? null : roleFilter,
        sort_by: sortBy,
        sort_type: sortType
    })

    const createUserMutation = useCreateUser()
    const updateUserMutation = useUpdateUser()
    const deleteUserMutation = useDeleteUser()

    const handleCreateUser = () => {
        setModalMode('create')
        setEditingUser(null)
        setIsModalOpen(true)
    }

    const handleEditUser = (userToEdit: UserBase) => {
        setModalMode('edit')
        setEditingUser(userToEdit)
        setIsModalOpen(true)
    }

    const handleDeleteClick = (userId: string) => {
        setDeletingUserId(userId)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!deletingUserId) return

        deleteUserMutation.mutate(deletingUserId, {
            onSuccess: () => {
                setDeleteDialogOpen(false)
                setDeletingUserId(null)
            },
            onError: () => {
                setDeleteDialogOpen(false)
                setDeletingUserId(null)
            }
        })
    }

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false)
        setDeletingUserId(null)
    }

    const handleSaveUser = async (data: UserCreate | UserUpdate) => {
        if (modalMode === 'create') {
            createUserMutation.mutate(data as UserCreate, {
                onSuccess: () => {
                    setIsModalOpen(false)
                    setEditingUser(null)
                }
            })
        } else if (modalMode === 'edit' && editingUser) {
            updateUserMutation.mutate({
                data: data as UserUpdate,
                id: editingUser.id
            }, {
                onSuccess: () => {
                    setIsModalOpen(false)
                    setEditingUser(null)
                }
            })
        }
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setEditingUser(null)
    }

    const toggleSortType = () => {
        setSortType(prev => prev === 'asc' ? 'desc' : 'asc')
        setCurrentPage(1)
    }

    const handleSortByChange = (value: string) => {
        setSortBy(value as 'name' | 'email' | 'role' | 'created_at')
        setCurrentPage(1)
    }

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value))
        setCurrentPage(1)
    }

    const handleRoleFilterChange = (value: string) => {
        setRoleFilter(value as UserRole | 'all')
        setCurrentPage(1)
    }

    const isLoading = isLoadingUsers ||
        createUserMutation.isPending ||
        updateUserMutation.isPending ||
        deleteUserMutation.isPending

    const users = usersResponse?.items || []
    const meta = usersResponse?.meta

    const totalPages = meta ? Math.ceil(meta.total_pages / itemsPerPage) : 0


    const getRoleBadgeVariant = (role: UserRole) => {
        return role === 'admin' ? 'default' : 'secondary'
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <PageHeader
                title={
                    <>
                        Manajemen <span className="text-tertiary">Pengguna</span>
                    </>
                }
                description="Kelola semua pengguna aplikasi"
                breadcrumbs={[
                    { label: "Manajemen Pengguna" }
                ]}
                actions={
                    user?.role === 'admin' && (
                        <Button
                            onClick={handleCreateUser}
                            className="flex items-center gap-2 w-fit"
                            disabled={isLoading}
                        >
                            <UserPlus className="h-4 w-4" />
                            Tambah Pengguna Baru
                        </Button>
                    )
                }
            >
                <div className="flex flex-col gap-4">
                    {/* Search and Filters */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1 max-w-2xl">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                            <Input
                                type="search"
                                placeholder="Cari pengguna berdasarkan nama atau email..."
                                className="pl-10 border-border focus:border-primary focus:ring-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Filter Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Role</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={handleSortByChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Urutkan berdasarkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at">Tanggal Dibuat</SelectItem>
                                    <SelectItem value="name">Nama</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="role">Role</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={toggleSortType}
                                title={sortType === 'asc' ? 'Urutkan Menurun' : 'Urutkan Menaik'}
                            >
                                <ArrowUpDown className="h-4 w-4" />
                            </Button>

                            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10 per halaman</SelectItem>
                                    <SelectItem value="25">25 per halaman</SelectItem>
                                    <SelectItem value="50">50 per halaman</SelectItem>
                                    <SelectItem value="100">100 per halaman</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </PageHeader>

            {/* Content */}
            <div className="flex-1">
                {isLoadingUsers && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Memuat pengguna...</span>
                        </div>
                    </div>
                )}

                {usersError && (
                    <div className="text-center py-12">
                        <div className="text-red-600 text-lg mb-2">Gagal memuat pengguna</div>
                        <div className="text-muted-foreground/70 text-sm mb-4">
                            {usersError.message}
                        </div>
                        <Button onClick={() => refetchUsers()} variant="outline">
                            Coba Lagi
                        </Button>
                    </div>
                )}

                {!isLoadingUsers && !usersError && users.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-muted-foreground text-lg mb-2">Pengguna tidak ditemukan</div>
                        <div className="text-muted-foreground/70 text-sm mb-4">
                            {debouncedSearchTerm
                                ? "Coba sesuaikan kata kunci pencarian Anda"
                                : "Belum ada user yang terdaftar"
                            }
                        </div>
                        {user?.role === 'admin' && !debouncedSearchTerm && (
                            <Button onClick={handleCreateUser} variant="outline">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Tambah Pengguna Pertama
                            </Button>
                        )}
                    </div>
                )}

                {!isLoadingUsers && !usersError && users.length > 0 && (
                    <>
                        {/* Results Info */}
                        <div className="mb-4 text-sm text-muted-foreground">
                            Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, meta?.total_pages || 0)} dari {meta?.total_pages || 0} pengguna
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Tanggal Dibuat</TableHead>
                                        {user?.role === 'admin' && (
                                            <TableHead className="text-right">Aksi</TableHead>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((userItem) => (
                                        <TableRow key={userItem.id}>
                                            <TableCell className="font-medium">{userItem.name}</TableCell>
                                            <TableCell>{userItem.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={getRoleBadgeVariant(userItem.role)}>
                                                    {userItem.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{formatDate(userItem.created_at)}</TableCell>
                                            {user?.role === 'admin' && (
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                disabled={isLoading}
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => handleEditUser(userItem)}
                                                                disabled={isLoading}
                                                            >
                                                                <Pencil className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteClick(userItem.id)}
                                                                disabled={isLoading || userItem.id === user?.id}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {users.map((userItem) => (
                                <div
                                    key={userItem.id}
                                    className="border rounded-lg p-4 space-y-3 bg-card hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-base truncate">
                                                {userItem.name}
                                            </h3>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                                <Mail className="h-3 w-3 flex-shrink-0" />
                                                <span className="truncate">{userItem.email}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={getRoleBadgeVariant(userItem.role)} className="flex-shrink-0">
                                                <Shield className="h-3 w-3 mr-1" />
                                                {userItem.role}
                                            </Badge>
                                            {user?.role === 'admin' && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={isLoading}
                                                            className="h-8 w-8"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => handleEditUser(userItem)}
                                                            disabled={isLoading}
                                                        >
                                                            <Pencil className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteClick(userItem.id)}
                                                            disabled={isLoading || userItem.id === user?.id}
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        Dibuat: {formatDate(userItem.created_at)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-muted-foreground">
                                    Halaman {currentPage} dari {totalPages}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    <div className="flex gap-1">
                                        {getPageNumbers(totalPages, currentPage).map((page, index) => (
                                            page === '...' ? (
                                                <span key={`ellipsis-${index}`} className="px-3 py-2 text-muted-foreground">
                                                    ...
                                                </span>
                                            ) : (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(page as number)}
                                                    className="min-w-[40px]"
                                                >
                                                    {page}
                                                </Button>
                                            )
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* User Modal */}
            <UserModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSave={handleSaveUser}
                user={editingUser}
                mode={modalMode}
                isLoading={isLoading}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={deleteDialogOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Hapus Pengguna"
                description="Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                cancelText="Batal"
                isLoading={deleteUserMutation.isPending}
                variant="destructive"
            />
        </div>
    )
}