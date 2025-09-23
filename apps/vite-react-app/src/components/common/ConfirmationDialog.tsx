import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button";
import React, { ReactNode } from 'react';

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost";

interface ConfirmationDialogProps {
    triggerText: ReactNode
    title: string
    description: string
    onConfirm: () => Promise<void> | void
    confirmText?: string
    cancelText?: string
    isLoading?: boolean
    variant?: ButtonVariant;
}

export function ConfirmationDialog({
    triggerText,
    title,
    description,
    onConfirm,
    confirmText = "Konfirmasi",
    cancelText = "Batal",
    isLoading = false,
    variant
}: ConfirmationDialogProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleConfirm = async () => {
        await onConfirm();
        setIsOpen(false);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                {triggerText}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        {/* Teruskan varian ke AlertDialogCancel */}
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            {cancelText}
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        {/* Teruskan varian ke AlertDialogAction */}
                        <Button variant={variant || "default"} onClick={handleConfirm} disabled={isLoading}>
                            {isLoading ? "Memproses..." : confirmText}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}