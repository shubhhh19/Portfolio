import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const AdminLogin = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginAsAdmin } = usePortfolio();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const success = await loginAsAdmin(password);
      if (success) {
        onClose();
      } else {
        setError('Invalid admin password');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-terminal-bg border border-terminal-border rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-terminal-text text-xl font-bold">🔐 Admin Authentication</h2>
          <button
            onClick={onClose}
            className="text-terminal-dim hover:text-terminal-text transition-colors"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-terminal-text text-sm mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-text focus:outline-none focus:border-terminal-green"
              placeholder="Enter admin password"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          
          <button
            type="submit"
            className="w-full bg-terminal-green text-black font-semibold py-2 px-4 rounded hover:bg-terminal-green/80 transition-colors"
          >
            Login as Admin
          </button>
        </form>
        
        <div className="mt-4 text-center text-terminal-dim text-sm">
          <p>Contact the portfolio owner for admin access</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
