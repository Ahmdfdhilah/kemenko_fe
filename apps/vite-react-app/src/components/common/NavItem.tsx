import { cn } from "@workspace/ui/lib/utils"
import { Link } from "react-router-dom"

export interface NavItemProps {
    href: string
    icon: React.ReactNode
    children: React.ReactNode
    active?: boolean
}

export function NavItem({ href, icon, children, active }: NavItemProps) {
    return (
        <Link
            to={href}
            className={cn("flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg", active && "bg-gray-100")}
        >
            {icon}
            <span>{children}</span>
        </Link>
    )
}