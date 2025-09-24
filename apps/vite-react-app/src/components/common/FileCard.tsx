import { Button } from "@workspace/ui/components/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@workspace/ui/components/dropdown-menu"
import { ExternalLink, Copy, Trash2, Edit, MoreVertical, Folder } from "lucide-react"
import { useState } from "react"

interface FileCardProps {
    id: string;
    title: string;
    thumbnail: string;
    link: string;
    category?: string;
    lastModified?: string;
    isAdmin?: boolean;
    onUpdate?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function FileCard({
    id,
    title,
    thumbnail,
    link,
    category,
    lastModified,
    isAdmin = false,
    onUpdate,
    onDelete
}: FileCardProps) {
    const [copied, setCopied] = useState(false)

    const handleOpenLink = () => {
        window.open(link, '_blank', 'noopener,noreferrer')
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Gagal menyalin tautan:', err)
        }
    }

    const handleUpdate = () => {
        if (onUpdate) {
            onUpdate(id);
        }
    }

    const handleDelete = () => {
        if (onDelete) {
            onDelete(id);
        }
    }

    return (
        <div className="group relative overflow-hidden rounded-xl border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-200 hover:border-accent">
            {/* Thumbnail Section */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
                <img
                    src={thumbnail || "https://placehold.co/600x400"}
                    alt={title}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />

                {/* Admin Menu */}
                {isAdmin && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm hover:bg-background"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-40">
                                <DropdownMenuItem onClick={handleUpdate} className="cursor-pointer">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Perbarui
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleDelete}
                                    className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Hapus
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

                {/* Category Badge */}
                {category && (
                    <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-background/90 backdrop-blur-sm text-xs font-medium text-foreground rounded-full">
                            <Folder className="h-3 w-3" />
                            {category}
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4">
                <div className="mb-3">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2 leading-tight">
                        {title}
                    </h3>
                    {lastModified && (
                        <p className="text-xs text-muted-foreground">
                            Diperbarui {lastModified}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleOpenLink}
                        className="flex-1 text-xs"
                    >
                        <ExternalLink className="h-3 w-3 mr-1.5" />
                        Buka
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyLink}
                        className="flex-1 text-xs"
                    >
                        <Copy className="h-3 w-3 mr-1.5" />
                        {copied ? 'Tersalin!' : 'Salin'}
                    </Button>
                </div>
            </div>
        </div>
    )
}