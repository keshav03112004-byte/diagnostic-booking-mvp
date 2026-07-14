import { useState } from 'react';
import { bookingAPI } from '../api/api';
import './PincodeChecker.css';

export default function PincodeChecker({ onResult, variant = 'default' }) {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setResult({ serviceable: false, message: 'Enter a valid 6-digit pincode' });
      return;
    }

    setLoading(true);
    try {
      const res = await bookingAPI.checkPincode(pincode);
      setResult(res.data);
      onResult?.(res.data);
    } catch {
      setResult({ serviceable: false, message: 'Could not check pincode' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`pincode-checker ${variant}`}>
      <form onSubmit={handleCheck} className="pincode-form">
        <input
          type="text"
          placeholder="Enter 6-digit pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '...' : 'Check'}
        </button>
      </form>
      {result && (
        <div className={`pincode-result ${result.serviceable ? 'success' : 'error'}`}>
          {result.serviceable ? '✓' : '✗'} {result.message}
        </div>
      )}
    </div>
  );
}
