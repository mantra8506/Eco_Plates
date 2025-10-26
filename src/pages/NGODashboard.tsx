import { useState, useEffect } from 'react';
import { MapPin, Clock, Package, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Donation } from '../lib/supabase';

export default function NGODashboard() {
  const { profile } = useAuth();
  const [availableDonations, setAvailableDonations] = useState<Donation[]>([]);
  const [requestedDonations, setRequestedDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'requested'>('available');

  useEffect(() => {
    loadDonations();
  }, [profile]);

  const loadDonations = async () => {
    if (!profile) return;

    const { data: available } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    const { data: requested } = await supabase
      .from('donations')
      .select('*')
      .eq('ngo_id', profile.id)
      .in('status', ['requested', 'completed'])
      .order('created_at', { ascending: false });

    if (available) setAvailableDonations(available);
    if (requested) setRequestedDonations(requested);
    setLoading(false);
  };

  const handleRequest = async (donationId: string) => {
    if (!profile) return;

    await supabase
      .from('donations')
      .update({ status: 'requested', ngo_id: profile.id })
      .eq('id', donationId);

    loadDonations();
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!profile?.is_approved) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Pending Approval</h2>
          <p className="text-amber-800">
            Your NGO account is awaiting admin approval. You will be able to request donations once your account is approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">NGO Dashboard</h1>
        <p className="text-gray-600 mt-1">Browse and request available food donations</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'available'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Available Donations ({availableDonations.length})
        </button>
        <button
          onClick={() => setActiveTab('requested')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'requested'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          My Requests ({requestedDonations.length})
        </button>
      </div>

      {activeTab === 'available' && (
        <div className="grid gap-6">
          {availableDonations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-500 text-lg">No available donations at the moment. Check back later!</p>
            </div>
          ) : (
            availableDonations.map((donation) => (
              <div key={donation.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{donation.food_type}</h3>
                    <p className="text-gray-600 mb-4">{donation.description}</p>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-2">
                        <Package className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Quantity</div>
                          <div className="text-gray-900">{donation.quantity}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Pickup Location</div>
                          <div className="text-gray-900">{donation.pickup_location}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Clock className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Pickup Time</div>
                          <div className="text-gray-900">{donation.pickup_time}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRequest(donation.id)}
                    className="ml-4 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium whitespace-nowrap"
                  >
                    Request Pickup
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'requested' && (
        <div className="grid gap-6">
          {requestedDonations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-500 text-lg">You haven't requested any donations yet.</p>
            </div>
          ) : (
            requestedDonations.map((donation) => (
              <div key={donation.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-semibold text-gray-800">{donation.food_type}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          donation.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {donation.status === 'completed' ? 'Completed' : 'Pending Pickup'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{donation.description}</p>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-2">
                        <Package className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Quantity</div>
                          <div className="text-gray-900">{donation.quantity}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Pickup Location</div>
                          <div className="text-gray-900">{donation.pickup_location}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Clock className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Pickup Time</div>
                          <div className="text-gray-900">{donation.pickup_time}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
