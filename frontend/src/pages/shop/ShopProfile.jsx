import { useState, useEffect } from 'react';
import { Building2, Loader2, Check } from 'lucide-react';
import { apiUrl } from '../../utils/api';

const ShopProfile = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    openingTime: '',
    closingTime: '',
  });

  useEffect(() => {
    fetchShopProfile();
  }, []);

  const fetchShopProfile = async () => {
    try {
      setFetchingData(true);
      const response = await fetch(apiUrl('/api/shop/profile'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shop profile');
      }

      const data = await response.json();
      setFormData({
        name: data.name || '',
        ownerName: data.ownerName || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        description: data.description || '',
        openingTime: data.openingTime || '',
        closingTime: data.closingTime || '',
      });
    } catch (err) {
      console.error('Error fetching shop profile:', err);
      setError('Failed to load shop profile');
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/api/shop/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to update shop profile');
      }

      setSuccess(data.msg);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="animate-slideDown">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Shop Profile</h1>
            <p className="text-muted-foreground">Manage your shop information and settings</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-slideDown">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 border border-green-200 rounded-lg dark:bg-green-900/30 dark:border-green-800 animate-slideDown">
          <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}

      {/* Loading State */}
      {fetchingData ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        </div>
      ) : (
        <>
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 md:p-8 space-y-6 animate-slideUp hover:shadow-lg transition-shadow duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shop Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Shop Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Pizza Paradise"
              className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          {/* Owner Name */}
          <div>
            <label htmlFor="ownerName" className="block text-sm font-medium text-foreground mb-2">
              Owner Name *
            </label>
            <input
              id="ownerName"
              name="ownerName"
              type="text"
              required
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Phone Number *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              readOnly
              disabled
              placeholder="shop@example.com"
              className="w-full px-4 py-2.5 bg-gray-100 border border-border rounded-lg text-gray-500 cursor-not-allowed"
              title="Email cannot be changed"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street, City, State, ZIP"
              className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell customers about your shop..."
              className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
            />
          </div>

          {/* Opening Time */}
          <div>
            <label htmlFor="openingTime" className="block text-sm font-medium text-foreground mb-2">
              Opening Time
            </label>
            <input
              id="openingTime"
              name="openingTime"
              type="time"
              value={formData.openingTime}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          {/* Closing Time */}
          <div>
            <label htmlFor="closingTime" className="block text-sm font-medium text-foreground mb-2">
              Closing Time
            </label>
            <input
              id="closingTime"
              name="closingTime"
              type="time"
              value={formData.closingTime}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-initial px-8 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Updating...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          * Required fields
        </p>
      </form>

      {/* Info Card */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="font-bold text-foreground mb-2">ℹ️ Profile Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Keep your contact information up to date for customer inquiries</li>
          <li>• Add a compelling description to attract more customers</li>
          <li>• Set accurate business hours so customers know when you're open</li>
          <li>• Your profile information will be visible to customers scanning your QR code</li>
        </ul>
      </div>
      </>
      )}
    </div>
  );
};

export default ShopProfile;
