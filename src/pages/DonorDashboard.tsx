import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Donation } from '../lib/supabase';

export default function DonorDashboard() {
  const { profile } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    food_type: '',
    quantity: '',
    description: '',
    pickup_location: '',
    pickup_time: '',
  });

  useEffect(() => {
    loadDonations();
  }, [profile]);

  const loadDonations = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('donor_id', profile.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDonations(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    if (editingDonation) {
      await supabase
        .from('donations')
        .update(formData)
        .eq('id', editingDonation.id);
    } else {
      await supabase.from('donations').insert({
        donor_id: profile.id,
        ...formData,
        status: 'available',
      });
    }

    setFormData({ food_type: '', quantity: '', description: '', pickup_location: '', pickup_time: '' });
    setShowForm(false);
    setEditingDonation(null);
    loadDonations();
  };

  const handleEdit = (donation: Donation) => {
    setEditingDonation(donation);
    setFormData({
      food_type: donation.food_type,
      quantity: donation.quantity,
      description: donation.description,
      pickup_location: donation.pickup_location,
      pickup_time: donation.pickup_time,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this donation?')) {
      await supabase.from('donations').delete().eq('id', id);
      loadDonations();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Donations</h1>
          <p className="text-gray-600 mt-1">Manage your food donation listings</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingDonation(null);
            setFormData({ food_type: '', quantity: '', description: '', pickup_location: '', pickup_time: '' });
          }}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          New Donation
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingDonation ? 'Edit Donation' : 'Post New Donation'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
                <input
                  type="text"
                  value={formData.food_type}
                  onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Cooked rice, Fresh vegetables"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., 20 servings, 5 kg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe the food condition, packaging, etc."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                <input
                  type="text"
                  value={formData.pickup_location}
                  onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Full address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                <input
                  type="text"
                  value={formData.pickup_time}
                  onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Today 6-8 PM"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                {editingDonation ? 'Update' : 'Post'} Donation
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingDonation(null);
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {donations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No donations yet. Create your first donation above!</p>
          </div>
        ) : (
          donations.map((donation) => (
            <div key={donation.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{donation.food_type}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      donation.status === 'completed' ? 'bg-green-100 text-green-700' :
                      donation.status === 'requested' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {donation.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{donation.description}</p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Quantity:</span>
                      <span className="text-gray-600 ml-2">{donation.quantity}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <span className="text-gray-600 ml-2">{donation.pickup_location}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Pickup Time:</span>
                      <span className="text-gray-600 ml-2">{donation.pickup_time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {donation.status === 'available' && (
                    <button
                      onClick={() => handleEdit(donation)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(donation.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
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
