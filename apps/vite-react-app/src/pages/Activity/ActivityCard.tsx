import { Activity } from '@/services/activities/types';
import { ActivityBadge } from './ActivityBadge';
import { ResourceIcon } from './ResourceIcon';
import { UserAvatar } from './UserAvatar';
import { formatDistanceToNow } from 'date-fns';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(activity.created_at), { addSuffix: true });

  return (
    <div className="relative pl-12 pb-8 group">
      {/* Timeline dot */}
      <div className="absolute left-0 top-1 w-[46px] flex justify-center">
        <div className="w-3 h-3 rounded-full bg-border group-hover:bg-primary transition-colors duration-300 ring-4 ring-background" />
      </div>

      {/* Timeline line */}
      <div className="timeline-line group-last:hidden" />

      {/* Card */}
      <div className="glass rounded-xl p-4 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border">
        <div className="flex items-start gap-4">
          <ResourceIcon resourceType={activity.resource_type} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground truncate">
                  {activity.resource_name}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {activity.description}
                </p>
              </div>
              <ActivityBadge actionType={activity.action_type} />
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2">
                <UserAvatar name={activity.performed_by_name} />
                <span className="text-sm text-muted-foreground">
                  {activity.performed_by_name}
                </span>
              </div>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-sm text-muted-foreground/70">
                {timeAgo}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
