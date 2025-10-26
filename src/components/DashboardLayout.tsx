import { ReactNode } from 'react';
import { Leaf, LogOut, Home, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
}

export default function DashboardLayout({ children, activeView, onNavigate }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <nav className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Leaf className="w-8 h-8 text-emerald-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">EcoPlates</span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => onNavigate('home')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                  activeView === 'home'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </button>

              {profile?.role === 'donor' && (
                <button
                  onClick={() => onNavigate('donor')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                    activeView === 'donor'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="hidden sm:inline">My Donations</span>
                </button>
              )}

              {profile?.role === 'ngo' && (
                <button
                  onClick={() => onNavigate('ngo')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                    activeView === 'ngo'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="hidden sm:inline">Find Food</span>
                </button>
              )}

              {profile?.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                    activeView === 'admin'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}

              <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">{profile?.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">{children}</main>
    </div>
  );
}
