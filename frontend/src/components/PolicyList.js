import React from 'react';

const PolicyList = ({ policies, onClaim, loading }) => {
  if (!policies || policies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-600 text-lg">No active policies yet. Buy insurance to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Insurance Policies</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.map(policy => (
          <div key={policy.id} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{policy.type}</h3>
                <p className="text-sm text-gray-600">Policy #{policy.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                policy.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {policy.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-sm text-gray-700"><strong>Premium:</strong> ${policy.premium}</p>
              <p className="text-sm text-gray-700"><strong>Coverage:</strong> ${policy.coverage}</p>
              <p className="text-sm text-gray-700"><strong>Status:</strong> {policy.claimed ? 'Claimed' : 'Not Claimed'}</p>
              <p className="text-sm text-gray-700"><strong>Date:</strong> {new Date(policy.timestamp * 1000).toLocaleDateString()}</p>
            </div>

            {policy.active && !policy.claimed && (
              <button
                onClick={() => onClaim(policy.id)}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'File Claim'}
              </button>
            )}
            {policy.claimed && (
              <p className="text-center text-green-600 font-semibold">✓ Claim Processed</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicyList;
