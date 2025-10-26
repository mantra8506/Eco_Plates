import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import AdminDashboard from './pages/AdminDashboard';
import DashboardLayout from './components/DashboardLayout';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [authView, setAuthView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [dashboardView, setDashboardView] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    if (authView === 'login') {
      return <Login onSwitchToSignup={() => setAuthView('signup')} />;
    }
    if (authView === 'signup') {
      return <Signup onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Landing onGetStarted={() => setAuthView('login')} />;
  }

  const renderDashboard = () => {
    if (dashboardView === 'home') {
      return <Landing onGetStarted={() => {}} />;
    }

    if (profile.role === 'donor' && dashboardView === 'donor') {
      return <DonorDashboard />;
    }

    if (profile.role === 'ngo' && dashboardView === 'ngo') {
      return <NGODashboard />;
    }

    if (profile.role === 'admin' && dashboardView === 'admin') {
      return <AdminDashboard />;
    }

    return <Landing onGetStarted={() => {}} />;
  };

  return (
    <DashboardLayout activeView={dashboardView} onNavigate={setDashboardView}>
      {renderDashboard()}
    </DashboardLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
