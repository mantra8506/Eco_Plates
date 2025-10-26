import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'donor' | 'ngo' | 'admin';
  phone?: string;
  address?: string;
  organization_name?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
};

export type Donation = {
  id: string;
  donor_id: string;
  food_type: string;
  quantity: string;
  description: string;
  pickup_location: string;
  pickup_time: string;
  status: 'available' | 'requested' | 'completed' | 'cancelled';
  ngo_id?: string;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'donation_posted' | 'donation_requested' | 'donation_completed' | 'ngo_approved' | 'general';
  is_read: boolean;
  created_at: string;
};
