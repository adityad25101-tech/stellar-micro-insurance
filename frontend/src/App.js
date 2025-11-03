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
      // Auto-connect on load
      checkAndConnect();
    }, 1000); // Increased delay to 1 second for extension injection
    
    return () => clearTimeout(timer);
  }, []);

  const checkAndConnect = async () => {
    try {
      setError(null);
      
      // Check if wallet is installed first
      if (!StellarService.isFreighterInstalled()) {
        console.log('💾 Freighter not installed');
        setError('WALLET_NOT_INSTALLED');
        return;
      }
      
      console.log('✅ Freighter detected, attempting connection...');
      await connectWallet();
    } catch (error) {
      console.error('Auto-connection failed:', error);
      // Don't set error here, let user click connect button
    }
  };

  const connectWallet = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('🔌 Connecting wallet...');
      
      // Check if wallet is installed
      if (!StellarService.isFreighterInstalled()) {
        console.log('💾 Wallet not installed');
        setError('WALLET_NOT_INSTALLED');
        setLoading(false);
        return;
      }
      
      console.log('✅ Freighter found, opening extension...');
      // Try to open the wallet extension
      StellarService.openFreighterExtension();
      
      console.log('⏳ Waiting for wallet response...');
      // Give the wallet UI time to appear and user time to confirm
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('📲 Requesting wallet connection...');
      const accountInfo = await StellarService.connectWallet();
      
      console.log('✅ Wallet connected:', accountInfo);
      setAccount(accountInfo);
      setError(null);
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      
      // Check if it's a not installed error
      if (error.isNotInstalled || error.message.includes('WALLET_NOT_INSTALLED')) {
        setError('WALLET_NOT_INSTALLED');
      } else {
        setError(error.message || 'Failed to connect wallet. Please try again.');
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
              <p className="font-bold mb-3">📥 Freighter Wallet Required</p>
              <p className="text-sm mb-4">Freighter wallet extension is required to use this app. Download and install it from the official website.</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    window.open('https://www.freighter.app/', '_blank');
                  }}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded font-semibold transition flex items-center justify-center gap-2"
                >
                  � Visit https://www.freighter.app/
                </button>
                <div className="bg-yellow-50 p-3 rounded text-xs text-gray-700">
                  <p className="font-semibold mb-2">After installation:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Click the Freighter icon in your browser</li>
                    <li>Create or import a wallet</li>
                    <li>Set network to <strong>Testnet</strong></li>
                    <li>Return here and click "Connect Wallet"</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
          
          {error && error !== 'WALLET_NOT_INSTALLED' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm text-left">
              <p className="font-bold mb-2">❌ Connection Error</p>
              <p className="text-xs mb-3 font-mono break-all bg-red-50 p-2 rounded">{error}</p>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-gray-700">Try these steps:</p>
                <ol className="list-decimal list-inside text-xs space-y-1 text-gray-700">
                  <li>Ensure Freighter extension is installed</li>
                  <li>Click Freighter icon to open wallet</li>
                  <li>Check network is set to <strong>Testnet</strong></li>
                  <li>Ensure you are logged in to Freighter</li>
                  <li>Open browser DevTools (F12) → Console to see detailed errors</li>
                </ol>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => StellarService.openFreighterExtension()}
                    className="flex-1 bg-red-200 hover:bg-red-300 px-2 py-1 rounded text-xs font-semibold transition"
                  >
                    🔓 Open Freighter
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded text-xs font-semibold transition"
                  >
                    🔄 Refresh Page
                  </button>
                </div>
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
