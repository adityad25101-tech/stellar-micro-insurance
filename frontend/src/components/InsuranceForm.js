import React, { useState } from 'react';

const InsuranceForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    policyType: 'crop_failure',
    premium: '0.50',
    coverage: '5',
  });

  const policyTypes = [
    { id: 'crop_failure', name: 'Crop Failure Insurance', description: 'Protection against crop loss due to weather' },
    { id: 'flood_protection', name: 'Flood Protection', description: 'Coverage for flood damage' },
    { id: 'accident', name: 'Accident Insurance', description: 'Personal accident and injury coverage' },
    { id: 'device', name: 'Device Insurance', description: 'Phone and device damage protection' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Buy Micro Insurance</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Insurance Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {policyTypes.map(type => (
              <label key={type.id} className="flex items-start p-3 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition" style={{borderColor: formData.policyType === type.id ? '#2563eb' : '#e5e7eb'}}>
                <input
                  type="radio"
                  name="policyType"
                  value={type.id}
                  checked={formData.policyType === type.id}
                  onChange={handleChange}
                  className="mt-1 mr-3"
                />
                <div>
                  <p className="font-semibold text-gray-800">{type.name}</p>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="premium" className="block text-sm font-semibold text-gray-700 mb-2">
              Premium Amount (USDC)
            </label>
            <input
              type="number"
              id="premium"
              name="premium"
              value={formData.premium}
              onChange={handleChange}
              step="0.01"
              min="0.10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.50"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum $0.10</p>
          </div>

          <div>
            <label htmlFor="coverage" className="block text-sm font-semibold text-gray-700 mb-2">
              Coverage Amount (USDC)
            </label>
            <input
              type="number"
              id="coverage"
              name="coverage"
              value={formData.coverage}
              onChange={handleChange}
              step="0.01"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5"
            />
            <p className="text-xs text-gray-500 mt-1">Payout amount if claim approved</p>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>Policy Type: <strong>{policyTypes.find(t => t.id === formData.policyType)?.name}</strong></p>
            <p>Premium: <strong>${formData.premium}</strong></p>
            <p>Coverage: <strong>${formData.coverage}</strong></p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Buy Insurance Now'}
        </button>
      </form>
    </div>
  );
};

export default InsuranceForm;
