import { cn } from '@workspace/ui/lib/utils';

interface UserAvatarProps {
  name: string;
  className?: string;
}

export const UserAvatar = ({ name, className }: UserAvatarProps) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        'w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground',
        className
      )}
    >
      {initials}
    </div>
  );
};
