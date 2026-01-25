import { ChevronRight, Home } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@workspace/ui/lib/utils"

export interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    if (!items.length) return null

    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("flex items-center text-sm text-muted-foreground mb-1", className)}
        >
            <ol className="flex items-center gap-2">
                <li>
                    <Link
                        to="/"
                        className="flex items-center hover:text-foreground transition-colors"
                        title="Home"
                    >
                        <Home className="h-4 w-4" />
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        {item.href ? (
                            <Link
                                to={item.href}
                                className="hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-foreground font-medium">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
