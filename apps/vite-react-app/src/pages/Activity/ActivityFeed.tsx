import { Activity } from '@/services/activities/types';
import { ActivityCard } from './ActivityCard';
import { Activity as ActivityIcon } from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <ActivityIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Belum Ada Aktivitas</h3>
        <p className="text-muted-foreground">Aktivitas akan muncul di sini setelah Anda mulai bekerja</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
};
