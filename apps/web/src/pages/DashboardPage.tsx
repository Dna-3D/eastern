import { useAuthStore } from '@/stores/auth';

export function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.profile?.displayName || 'User'}!
        </h1>
        <p className="text-muted-foreground">This is your campus feed. More features coming soon.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">XP</h3>
          <p className="text-2xl font-bold">{user?.profile?.xp || 0}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Level</h3>
          <p className="text-2xl font-bold">{user?.profile?.level || 1}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Streak</h3>
          <p className="text-2xl font-bold">{user?.profile?.streak || 0} days</p>
        </div>
      </div>

      {/* Placeholder Feed */}
      <div className="rounded-lg border p-8 text-center">
        <h2 className="text-lg font-semibold">Feed Coming Soon</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Phase 2 will bring you posts, reactions, comments, stories, and trending content.
        </p>
      </div>
    </div>
  );
}