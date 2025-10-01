import { Button } from "@workspace/ui/components/button"
import { ExternalLink, Copy, Trash2, Edit } from "lucide-react"
import { useState } from "react"

interface FolderBase {
    id: string;
    title: string;
    description: string;
    link: string;
    image_url: string;
    updated_at: string;
}

interface FileCardProps {
    folder: FolderBase;
    isAdmin?: boolean;
    onUpdate?: (id: string) => void;
    onDelete?: (id: string) => void;
}


export function FileCard({
    folder,
    isAdmin = false,
    onUpdate,
    onDelete
}: FileCardProps) {
    const [copied, setCopied] = useState(false)


    const handleOpenLink = () => {
        window.open(folder.link, '_blank', 'noopener,noreferrer')
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(folder.link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Gagal menyalin tautan:', err)
        }
    }

    const handleUpdate = () => {
        if (onUpdate) {
            onUpdate(folder.id);
        }
    }

    const handleDelete = () => {
        if (onDelete) {
            onDelete(folder.id);
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID')
    }

    return (
        <div className={`group relative overflow-hidden rounded-xl border shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:border-primary/50`}>
            {/* Decorative Background Pattern */}
            <svg
                className={`absolute bottom-0 left-0 mb-8 opacity-5 text-chart-1`}
                viewBox="0 0 375 283"
                fill="none"
                style={{ transform: 'scale(1.5)' }}
            >
                <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="currentColor" />
                <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="currentColor" />
            </svg>

            {/* Image Section with Gradient Overlay */}
            <div className="relative aspect-[4/3] overflow-hidden flex items-center justify-center p-4">
                <img
                    src={folder.image_url}
                    alt={folder.title}
                    className="max-h-72 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                />

                {/* Hover Action Buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleOpenLink}
                        className="bg-white/90 hover:bg-white text-foreground backdrop-blur-sm shadow-lg"
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Buka
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCopyLink}
                        className="bg-white/90 hover:bg-white text-foreground backdrop-blur-sm shadow-lg"
                    >
                        <Copy className="h-4 w-4 mr-2" />
                        {copied ? 'Tersalin!' : 'Salin'}
                    </Button>

                    {/* Admin Actions */}
                    {isAdmin && (
                        <>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleUpdate}
                                className="bg-blue-500/90 hover:bg-blue-500 text-white backdrop-blur-sm shadow-lg"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleDelete}
                                className="bg-destructive/90 hover:bg-destructive text-destructive-foreground backdrop-blur-sm shadow-lg"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="relative p-6">
                <div className="mb-1">
                    <p className={`text-xs uppercase tracking-wide font-medium opacity-60 text-chart-1`}>
                        Diperbarui {formatDate(folder.updated_at)}
                    </p>
                </div>

                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xl text-foreground mb-2 line-clamp-2 leading-tight">
                            {folder.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {folder.description}
                        </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                        <div className={`bg-chart-1/20 text-chart-1 rounded-full px-3 py-1.5 text-xs font-bold leading-none flex items-center`}>
                            {isAdmin ? 'Admin' : 'Aktif'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}