import { Button } from "@workspace/ui/components/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"
import { ExternalLink, Copy, Trash2, Edit, Star, MoreVertical, Folder } from "lucide-react"
import { useState } from "react"

interface FileCardProps {
    title: string
    thumbnail: string
    link: string
    category?: string
    isStarred?: boolean
    lastModified?: string
    isAdmin?: boolean
    onUpdate?: () => void
    onDelete?: () => void
    onToggleStar?: () => void
}

export function FileCard({
    title,
    thumbnail,
    link,
    category,
    isStarred = false,
    lastModified,
    isAdmin = false,
    onUpdate,
    onDelete,
    onToggleStar
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
            console.error('Failed to copy link:', err)
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

                {/* Star Button */}
                <button
                    onClick={onToggleStar}
                    className={cn(
                        "absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200",
                        "opacity-0 group-hover:opacity-100",
                        isStarred
                            ? "bg-yellow-500 text-primary-foreground shadow-lg"
                            : "bg-background/80 text-muted-foreground hover:bg-background hover:text-yellow-500"
                    )}
                >
                    <Star className={cn("h-4 w-4", isStarred && "fill-current")} />
                </button>

                {/* Admin Menu */}
                {isAdmin && (
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                <DropdownMenuItem onClick={onUpdate} className="cursor-pointer">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Update
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={onDelete}
                                    className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
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
                            Updated {lastModified}
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
                        Open
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyLink}
                        className="flex-1 text-xs"
                    >
                        <Copy className="h-3 w-3 mr-1.5" />
                        {copied ? 'Copied!' : 'Copy'}
                    </Button>
                </div>
            </div>

            {/* Starred Indicator */}
            {isStarred && (
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-yellow-400">
                    <Star className="absolute -top-4 -right-1 h-3 w-3 text-primary-foreground fill-current" />
                </div>
            )}
        </div>
    )
}