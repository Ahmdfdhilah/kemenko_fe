import { ActivityActionType } from '@/services/activities/types';
import { cn } from '@workspace/ui/lib/utils';
import {
  Plus,
  Pencil,
  Trash2,
  Move
} from 'lucide-react';

interface ActivityBadgeProps {
  actionType: ActivityActionType
}

const actionConfig: Record<ActivityActionType, {
  label: string;
  icon: typeof Plus;
  className: string;
}> = {
  created: {
    label: 'Dibuat',
    icon: Plus,
    className: 'bg-green-500/15 text-green-600 border-green-500/30',
  },
  updated: {
    label: 'Diperbarui',
    icon: Pencil,
    className: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
  },
  deleted: {
    label: 'Dihapus',
    icon: Trash2,
    className: 'bg-red-500/15 text-red-600 border-red-500/30',
  },
  moved: {
    label: 'Dipindahkan',
    icon: Move,
    className: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/30',
  },
};

export const ActivityBadge = ({ actionType }: ActivityBadgeProps) => {
  const config = actionConfig[actionType];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-300',
        config.className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};
