import { useState, useEffect } from 'react';
import { Users, Package, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Profile } from '../lib/supabase';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [pendingNGOs, setPendingNGOs] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadData();
    }
  }, [profile]);

  const loadData = async () => {
    const { data: ngos } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'ngo')
      .eq('is_approved', false)
      .order('created_at', { ascending: false });

    if (ngos) setPendingNGOs(ngos);
    setLoading(false);
  };

  const handleApproveNGO = async (ngoId: string) => {
    await supabase
      .from('profiles')
      .update({ is_approved: true })
      .eq('id', ngoId);
    loadData();
  };

  const handleRejectNGO = async (ngoId: string) => {
    if (confirm('Are you sure you want to reject this NGO application?')) {
      await supabase.from('profiles').delete().eq('id', ngoId);
      loadData();
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h2>
          <p className="text-red-800">You do not have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage pending NGO approvals</p>
      </div>

      <div className="grid gap-6">
        {pendingNGOs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No pending NGO approvals</p>
          </div>
        ) : (
          pendingNGOs.map((ngo) => (
            <div key={ngo.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {ngo.organization_name || 'Unnamed Organization'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium text-gray-700">Contact Person:</span>{' '}
                      <span className="text-gray-600">{ngo.full_name}</span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Email:</span>{' '}
                      <span className="text-gray-600">{ngo.email}</span>
                    </p>
                    {ngo.phone && (
                      <p>
                        <span className="font-medium text-gray-700">Phone:</span>{' '}
                        <span className="text-gray-600">{ngo.phone}</span>
                      </p>
                    )}
                    {ngo.address && (
                      <p>
                        <span className="font-medium text-gray-700">Address:</span>{' '}
                        <span className="text-gray-600">{ngo.address}</span>
                      </p>
                    )}
                    <p>
                      <span className="font-medium text-gray-700">Applied:</span>{' '}
                      <span className="text-gray-600">
                        {new Date(ngo.created_at).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleApproveNGO(ngo.id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectNGO(ngo.id)}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
