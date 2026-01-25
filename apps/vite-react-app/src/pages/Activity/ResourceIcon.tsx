import { ActivityResourceType } from '@/services/activities/types';
import { cn } from '@workspace/ui/lib/utils';
import { Folder, File } from 'lucide-react';

interface ResourceIconProps {
  resourceType: ActivityResourceType;
  className?: string;
}

const resourceConfig: Record<ActivityResourceType, {
  icon: typeof Folder;
  className: string;
}> = {
  folder: {
    icon: Folder,
    className: 'bg-amber-500/10 text-amber-600',
  },
  file: {
    icon: File,
    className: 'bg-blue-500/10 text-blue-600',
  },
};

export const ResourceIcon = ({ resourceType, className }: ResourceIconProps) => {
  const config = resourceConfig[resourceType];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <div
      className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
        config.className,
        className
      )}
    >
      <Icon className="w-5 h-5" />
    </div>
  );
};
