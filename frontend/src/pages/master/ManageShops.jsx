import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../utils/api';

const ManageShops = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, blocked

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        navigate('/master/login');
        return;
      }

      const response = await fetch(apiUrl('/api/master/shops'), {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      const data = await response.json();
      console.log('Shops API Response:', response.status, data);
      
      if (response.ok) {
        setShops(data);
        setError('');
      } else {
        console.error('Error response:', data);
        if (response.status === 401 || response.status === 403) {
          setError('Authentication failed. Please login again.');
          setTimeout(() => navigate('/master/login'), 2000);
        } else {
          setError(data.msg || 'Failed to fetch shops');
        }
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (shopId, currentStatus) => {
    try {
      const response = await fetch(apiUrl(`/api/master/shop/${shopId}/toggle-status`), {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setShops(shops.map(shop => 
          shop._id === shopId ? data.shop : shop
        ));
      }
    } catch (error) {
      console.error('Error toggling shop status:', error);
    }
  };

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || shop.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Shops</h1>
          <p className="text-muted-foreground mt-1">View and manage all registered shops</p>
        </div>
        <button
          onClick={() => navigate('/master/create-shop')}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          + Create Shop
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search shops by name, owner, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {['all', 'active', 'blocked'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-colors capitalize ${
                  filterStatus === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-2xl font-bold text-foreground">{shops.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600">{shops.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Blocked</p>
          <p className="text-2xl font-bold text-destructive">{shops.filter(s => s.status === 'blocked').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Filtered</p>
          <p className="text-2xl font-bold text-foreground">{filteredShops.length}</p>
        </div>
      </div>

      {/* Shops Table/List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-4">Loading shops...</p>
        </div>
      ) : filteredShops.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-xl text-muted-foreground">No shops found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Shop Name</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Owner</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Contact</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Created</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredShops.map((shop) => (
                    <tr key={shop._id} className="hover:bg-accent transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{shop.name}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{shop.ownerName}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground">{shop.email}</p>
                        <p className="text-sm text-muted-foreground">{shop.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          shop.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {shop.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(shop.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusToggle(shop._id, shop.status)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              shop.status === 'active'
                                ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                            }`}
                          >
                            {shop.status === 'active' ? 'Block' : 'Activate'}
                          </button>
                          <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors text-sm font-medium">
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredShops.map((shop) => (
              <div key={shop._id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-foreground">{shop.name}</h3>
                    <p className="text-sm text-muted-foreground">{shop.ownerName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    shop.status === 'active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {shop.status}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  <p className="text-sm text-muted-foreground">{shop.email}</p>
                  <p className="text-sm text-muted-foreground">{shop.phone}</p>
                  <p className="text-xs text-muted-foreground">Created: {new Date(shop.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusToggle(shop._id, shop.status)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      shop.status === 'active'
                        ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                    }`}
                  >
                    {shop.status === 'active' ? 'Block' : 'Activate'}
                  </button>
                  <button className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageShops;
