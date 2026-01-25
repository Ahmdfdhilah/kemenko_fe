import { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { BreadcrumbItem, Breadcrumbs } from "./Breadcrumbs"

interface PageHeaderProps {
    title: ReactNode | string
    description?: string
    icon?: ReactNode
    actions?: ReactNode
    breadcrumbs?: BreadcrumbItem[]
    className?: string
    children?: ReactNode
}

export function PageHeader({
    title,
    description,
    icon,
    actions,
    breadcrumbs,
    className,
    children
}: PageHeaderProps) {
    return (
        <div className={cn("w-full mb-6", className)}>
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                    {icon && (
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            {icon}
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-muted-foreground text-sm mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {actions && (
                    <div className="flex flex-wrap gap-2 items-center">
                        {actions}
                    </div>
                )}
            </div>

            {children && (
                <div className="mt-6">
                    {children}
                </div>
            )}
        </div>
    )
}
