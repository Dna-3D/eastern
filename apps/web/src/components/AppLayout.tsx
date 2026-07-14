import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if logout API fails, clear local state
    }
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-primary">E</span>astern Gist
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Feed
            </Link>
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {user.profile?.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}