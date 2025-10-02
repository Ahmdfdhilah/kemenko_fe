import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost";

interface ConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description: string
    onConfirm: () => Promise<void> | void
    confirmText?: string
    cancelText?: string
    isLoading?: boolean
    variant?: ButtonVariant
}

export function ConfirmationDialog({
    isOpen,
    onClose,
    title,
    description,
    onConfirm,
    confirmText = "Konfirmasi",
    cancelText = "Batal",
    isLoading = false,
    variant = "default"
}: ConfirmationDialogProps) {
    const handleConfirm = async () => {
        await onConfirm();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel 
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
                    >
                        {isLoading ? "Memproses..." : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}