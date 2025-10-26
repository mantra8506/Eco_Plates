import { useState, useEffect } from 'react';
import { Leaf, Heart, Users, TrendingUp, ArrowRight, Utensils, HandHeart, Shield, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LandingProps {
  onGetStarted: () => void;
}

export default function Landing({ onGetStarted }: LandingProps) {
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeDonors: 0,
    registeredNGOs: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { count: donationsCount } = await supabase
      .from('donations')
      .select('*', { count: 'exact', head: true });

    const { count: donorsCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'donor');

    const { count: ngosCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'ngo')
      .eq('is_approved', true);

    setStats({
      totalDonations: donationsCount || 0,
      activeDonors: donorsCount || 0,
      registeredNGOs: ngosCount || 0,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 rounded-xl shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  EcoPlates
                </span>
                <p className="text-xs text-gray-500 -mt-1">Save Food, Save Lives</p>
              </div>
            </div>
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <span className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full text-sm font-semibold shadow-sm">
                Together We Can Make a Difference
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
              Share Food,
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Spread Kindness
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Join our simple platform connecting people who have extra food with those who need it.
              Every meal shared is a step toward a better world.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="group bg-gradient-to-r from-emerald-600 to-green-600 text-white px-10 py-5 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold text-xl shadow-xl flex items-center gap-3"
              >
                Start Sharing Food
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onGetStarted}
                className="bg-white text-emerald-600 px-10 py-5 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold text-xl shadow-lg border-2 border-emerald-200"
              >
                Find Food Near You
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-16 animate-bounce">
            <ChevronDown className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact Together</h2>
            <p className="text-xl text-gray-600">Real numbers, real change</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-10 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-emerald-100">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div className="text-6xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
                {stats.totalDonations}
              </div>
              <div className="text-gray-700 font-semibold text-xl">Meals Shared</div>
              <p className="text-gray-500 mt-2">Every donation helps someone in need</p>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-10 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-rose-100">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div className="text-6xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-3">
                {stats.activeDonors}
              </div>
              <div className="text-gray-700 font-semibold text-xl">Kind Donors</div>
              <p className="text-gray-500 mt-2">People making a difference daily</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-10 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-100">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                {stats.registeredNGOs}
              </div>
              <div className="text-gray-700 font-semibold text-xl">Partner Organizations</div>
              <p className="text-gray-500 mt-2">Trusted groups helping communities</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to make a difference</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8 inline-block">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 w-32 h-32 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <Utensils className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 bg-white text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg border-4 border-emerald-100">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Share Your Food</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Have extra food? Post it on our platform with simple details like what it is, how much, and when to pick it up
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8 inline-block">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-32 h-32 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <HandHeart className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg border-4 border-blue-100">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Organizations Request</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Trusted local organizations browse available food and request what they need to help people in their community
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8 inline-block">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-32 h-32 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <Heart className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 bg-white text-amber-600 w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg border-4 border-amber-100">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Feed Those in Need</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Food gets picked up and delivered to people who need it, reducing waste and fighting hunger together
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose EcoPlates?</h2>
            <p className="text-xl text-gray-600">Simple, safe, and makes a real impact</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-gray-200">
              <div className="bg-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safe & Secure</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                All organizations are verified by our team before they can receive donations
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-gray-200">
              <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy to Use</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Simple design that anyone can use, whether you're tech-savvy or not
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-gray-200">
              <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Help Environment</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Every meal shared means less food waste and a healthier planet for all of us
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-gray-200">
              <div className="bg-rose-600 w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Make a Difference</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Your donation directly helps families and individuals in your community
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-gray-200">
              <div className="bg-amber-600 w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Your Impact</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                See how many meals you've shared and the lives you've touched
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-gray-200">
              <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                <Utensils className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Any Amount Helps</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Whether it's one meal or many, every contribution makes someone's day better
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-emerald-600 to-green-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-2xl mb-10 text-emerald-100 max-w-3xl mx-auto">
            Join thousands of people sharing food and fighting hunger in their communities
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-emerald-600 px-12 py-6 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold text-2xl shadow-xl inline-flex items-center gap-3"
          >
            Get Started Today
            <ArrowRight className="w-7 h-7" />
          </button>
          <p className="mt-8 text-emerald-100 text-lg">No fees, no hassle. Just kindness.</p>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 rounded-xl shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-white">EcoPlates</span>
            </div>
            <p className="text-lg mb-4">Reducing food waste, one meal at a time</p>
            <p className="text-gray-400">Together, we can create a world with less waste and more kindness</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
