import React, { useState, useEffect } from 'react';
import InsuranceForm from './components/InsuranceForm';
import PolicyList from './components/PolicyList';
import Dashboard from './components/Dashboard';
import { StellarService } from './services/StellarService';

function App() {
  const [account, setAccount] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Small delay to let Freighter extension inject before attempting connection
    const timer = setTimeout(() => {
      connectWallet();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const connectWallet = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Check if wallet is installed
      if (!StellarService.isFreighterInstalled()) {
        console.log('💾 Wallet not installed, prompting download...');
        setError('WALLET_NOT_INSTALLED');
        setLoading(false);
        return;
      }
      
      // Try to open the wallet extension first
      StellarService.openFreighterExtension();
      
      // Give the wallet UI time to appear, then connect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const accountInfo = await StellarService.connectWallet();
      setAccount(accountInfo);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // Check if it's a not installed error
      if (error.isNotInstalled || error.message === 'WALLET_NOT_INSTALLED') {
        setError('WALLET_NOT_INSTALLED');
      } else {
        setError(error.message || 'Failed to connect wallet');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuyInsurance = async (formData) => {
    try {
      setLoading(true);
      const result = await StellarService.buyInsurance(
        account,
        formData.premium,
        formData.coverage,
        formData.policyType
      );
      
      // Fetch updated policies
      const userPolicies = await StellarService.getPolicies(account);
      setPolicies(userPolicies);
      
      alert('Insurance purchased successfully! Policy ID: ' + result.policyId);
    } catch (error) {
      console.error('Failed to buy insurance:', error);
      alert('Failed to purchase insurance');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimInsurance = async (policyId) => {
    try {
      setLoading(true);
      await StellarService.claimInsurance(account, policyId);
      
      // Fetch updated policies
      const userPolicies = await StellarService.getPolicies(account);
      setPolicies(userPolicies);
      
      alert('Insurance claimed successfully!');
    } catch (error) {
      console.error('Failed to claim insurance:', error);
      alert('Failed to claim insurance');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Stellar Micro Insurance</h1>
          <p className="text-gray-600 mb-6">Affordable, transparent insurance for everyone</p>
          
          {error === 'WALLET_NOT_INSTALLED' && (
            <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-4 py-4 rounded mb-6">
              <p className="font-bold mb-3">📥 Freighter Wallet Not Found</p>
              <p className="text-sm mb-4">The Freighter wallet extension is not installed on your browser. Install it to continue.</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => StellarService.downloadFreighter()}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded font-semibold transition"
                >
                  📥 Download & Install Freighter
                </button>
                <p className="text-xs text-gray-600 mt-2">After installation, refresh this page and click Connect again</p>
              </div>
            </div>
          )}
          
          {error && error !== 'WALLET_NOT_INSTALLED' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm text-left">
              <p className="font-bold mb-2">❌ Connection Error</p>
              <p className="text-xs mb-3 font-mono break-all">{error}</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => StellarService.openFreighterExtension()}
                  className="text-left bg-red-200 hover:bg-red-300 px-2 py-1 rounded text-xs font-semibold transition"
                >
                  � Open Freighter Extension
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="text-left bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded text-xs font-semibold transition"
                >
                  🔄 Refresh Page
                </button>
              </div>
            </div>
          )}
          
          {!error && (
            <p className="text-blue-600 text-sm mb-4">🔌 Click below to connect your wallet...</p>
          )}
          
          <button
            onClick={connectWallet}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Connecting...' : '🔗 Connect Wallet'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Stellar Micro Insurance</h1>
          <p className="text-gray-600 mt-2">Connected Account: {account?.address?.slice(0, 20)}...</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('buy')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'buy'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border border-gray-300'
            }`}
          >
            Buy Insurance
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'policies'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border border-gray-300'
            }`}
          >
            My Policies
          </button>
        </div>

        {activeTab === 'dashboard' && <Dashboard account={account} />}
        {activeTab === 'buy' && (
          <InsuranceForm
            onSubmit={handleBuyInsurance}
            loading={loading}
          />
        )}
        {activeTab === 'policies' && (
          <PolicyList
            policies={policies}
            onClaim={handleClaimInsurance}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}

export default App;
