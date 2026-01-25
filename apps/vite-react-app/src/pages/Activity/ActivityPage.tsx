"use client"

import { useState } from "react"
import { useActivities } from "@/hooks/useActivities"
import { ActivityFeed } from "./ActivityFeed"
import { ActivityActionType, ActivityResourceType } from "@/services/activities/types"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"
import { Search, Loader2, RefreshCw, X } from "lucide-react"

export default function ActivityPage() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [resourceType, setResourceType] = useState<ActivityResourceType | "all">("all")
    const [actionType, setActionType] = useState<ActivityActionType | "all">("all")
    const limit = 20

    const {
        data: activitiesResponse,
        isLoading,
        error,
        refetch,
        isFetching
    } = useActivities({
        page,
        limit,
        search: search || undefined,
        resource_type: resourceType === "all" ? undefined : resourceType,
        action_type: actionType === "all" ? undefined : actionType,
        sort_by: 'created_at',
        sort_type: 'desc'
    })

    const activities = activitiesResponse?.items || []
    const meta = activitiesResponse?.meta

    const handleClearFilters = () => {
        setSearch("")
        setResourceType("all")
        setActionType("all")
        setPage(1)
    }

    const hasFilters = search || resourceType !== "all" || actionType !== "all"

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-2">
                        Log <span className="text-primary">Aktivitas</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Pantau semua aktivitas pada folder dan file Anda
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 py-6">
                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                        <Input
                            type="search"
                            placeholder="Cari aktivitas..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Select
                            value={resourceType}
                            onValueChange={(value) => {
                                setResourceType(value as ActivityResourceType | "all")
                                setPage(1)
                            }}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Sumber" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Sumber</SelectItem>
                                <SelectItem value="folder">Folder</SelectItem>
                                <SelectItem value="file">File</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={actionType}
                            onValueChange={(value) => {
                                setActionType(value as ActivityActionType | "all")
                                setPage(1)
                            }}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Aksi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Aksi</SelectItem>
                                <SelectItem value="created">Dibuat</SelectItem>
                                <SelectItem value="updated">Diperbarui</SelectItem>
                                <SelectItem value="deleted">Dihapus</SelectItem>
                                <SelectItem value="moved">Dipindahkan</SelectItem>
                            </SelectContent>
                        </Select>

                        {hasFilters && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleClearFilters}
                                title="Hapus filter"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            title="Muat ulang"
                        >
                            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                {/* State Content */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Memuat aktivitas...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12">
                        <div className="text-red-600 text-lg mb-2">Gagal memuat aktivitas</div>
                        <div className="text-muted-foreground/70 text-sm mb-4">
                            {error.message}
                        </div>
                        <Button onClick={() => refetch()} variant="outline">
                            Coba Lagi
                        </Button>
                    </div>
                )}

                {!isLoading && !error && (
                    <>
                        <ActivityFeed activities={activities} />

                        {/* Pagination */}
                        {meta && (meta.has_prev || meta.has_next) && (
                            <div className="flex items-center justify-between mt-8 pt-6 border-t">
                                <div className="text-sm text-muted-foreground">
                                    Halaman {meta.page} dari {meta.total_pages} ({meta.total_items} total)
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={!meta.has_prev}
                                    >
                                        Sebelumnya
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={!meta.has_next}
                                    >
                                        Selanjutnya
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
