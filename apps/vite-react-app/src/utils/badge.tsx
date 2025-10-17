import { ReactNode } from "react"

export type ItemType = 'folder' | 'link' | 'upload'

interface BadgeConfig {
    label: string
    colorClass: string
    bgClass: string
}

const badgeConfigs: Record<ItemType, BadgeConfig> = {
    folder: {
        label: 'Folder',
        colorClass: 'text-chart-1',
        bgClass: 'bg-chart-1/10'
    },
    link: {
        label: 'Link',
        colorClass: 'text-chart-2',
        bgClass: 'bg-chart-2/10'
    },
    upload: {
        label: 'File',
        colorClass: 'text-chart-3',
        bgClass: 'bg-chart-3/10'
    }
}

export function getItemTypeBadge(type: ItemType): ReactNode {
    const config = badgeConfigs[type]

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${config.colorClass} ${config.bgClass}`}>
            {config.label}
        </span>
    )
}

export function getItemTypeColor(type: ItemType): string {
    return badgeConfigs[type].colorClass
}

export function getItemTypeConfig(type: ItemType): BadgeConfig {
    return badgeConfigs[type]
}
