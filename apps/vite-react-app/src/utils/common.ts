export const getLinkClass = (href: string, isMobile = false) => {
    const isActive = location.pathname === href
    if (isMobile) {
        return `flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium ${isActive
                ? 'text-primary'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`
    }
    return `transition-colors ${isActive ? 'text-primary' : 'text-foreground/60 hover:text-foreground/80'
        }`
}

export const getAmountColor = (type: 'PAYMENT' | 'TOPUP') => {
    return type === 'TOPUP' ? 'text-green-600' : 'text-red-600'
}

export const getAmountPrefix = (type: 'PAYMENT' | 'TOPUP') => {
    return type === 'TOPUP' ? '+' : '-'
}