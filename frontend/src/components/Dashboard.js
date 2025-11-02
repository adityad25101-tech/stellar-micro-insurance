import React, { useState, useEffect } from 'react';
import { StellarService } from '../services/StellarService';

const Dashboard = ({ account }) => {
  const [stats, setStats] = useState({
    totalPolicies: 0,
    totalPremiums: 0,
    activeClaims: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await StellarService.getDashboardStats(account);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h2>
      
      {loading ? (
        <p className="text-gray-600">Loading statistics...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <p className="text-blue-100 text-sm font-semibold mb-2">Total Policies</p>
            <p className="text-4xl font-bold">{stats.totalPolicies}</p>
            <p className="text-blue-100 text-xs mt-2">Active insurance plans</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <p className="text-green-100 text-sm font-semibold mb-2">Total Premiums</p>
            <p className="text-4xl font-bold">${stats.totalPremiums}</p>
            <p className="text-green-100 text-xs mt-2">Amount invested</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <p className="text-purple-100 text-sm font-semibold mb-2">Active Claims</p>
            <p className="text-4xl font-bold">{stats.activeClaims}</p>
            <p className="text-purple-100 text-xs mt-2">Pending payouts</p>
          </div>
        </div>
      )}

      <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
        <h3 className="font-bold text-blue-900 mb-3">How It Works</h3>
        <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
          <li>Choose an insurance type and set your premium amount</li>
          <li>Pay a micro-premium to activate your coverage</li>
          <li>If a qualifying event occurs, file a claim</li>
          <li>Smart contracts automatically verify and process your payout</li>
          <li>Receive your coverage amount instantly on-chain</li>
        </ol>
      </div>
    </div>
  );
};

export default Dashboard;
