import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Loader2 } from 'lucide-react';
import { apiUrl } from '../../utils/api';

const ManageShopsPage = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalShops: 0,
    activeShops: 0,
    blockedShops: 0,
  });

  useEffect(() => {
    fetchShops();
    fetchStats();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl('/api/master/shops'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setShops(data);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(apiUrl('/api/master/dashboard-stats'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalShops: data.totalShops,
          activeShops: data.activeShops,
          blockedShops: data.blockedShops,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const toggleShopStatus = async (shopId) => {
    try {
      const response = await fetch(apiUrl(`/api/master/shop/${shopId}/toggle-status`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchShops();
        fetchStats();
      }
    } catch (error) {
      console.error('Error toggling shop status:', error);
    }
  };

  const deleteShop = async (shopId) => {
    if (!window.confirm('Are you sure you want to delete this shop? This will also delete all associated admins.')) {
      return;
    }

    try {
      const response = await fetch(apiUrl(`/api/master/shop/${shopId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchShops();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting shop:', error);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Stats */}
      <div className="animate-slideDown">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Manage Shops</h1>
              <p className="text-muted-foreground">View and manage all shops in the system</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/master/create-shop')}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 font-medium flex items-center gap-2 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Create New Shop
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Shops</p>
                <p className="text-3xl font-bold">{stats.totalShops}</p>
              </div>
              <div className="text-5xl opacity-80">🏪</div>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Active Shops</p>
                <p className="text-3xl font-bold">{stats.activeShops}</p>
              </div>
              <div className="text-5xl opacity-80">✅</div>
            </div>
          </div>

          <div className="bg-linear-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium mb-1">Blocked Shops</p>
                <p className="text-3xl font-bold">{stats.blockedShops}</p>
              </div>
              <div className="text-5xl opacity-80">🚫</div>
            </div>
          </div>
        </div>
      </div>

      {/* Shops Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">No shops found</p>
              <button
                onClick={() => navigate('/master/create-shop')}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
              >
                Create Your First Shop
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Shop Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Owner</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shops.map((shop) => (
                  <tr key={shop._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-foreground">{shop.name}</p>
                        <p className="text-sm text-muted-foreground">{shop.address || 'No address'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-foreground">{shop.ownerName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-foreground">{shop.phone}</p>
                        <p className="text-muted-foreground">{shop.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        shop.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {shop.status === 'active' ? '✓ Active' : '✕ Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleShopStatus(shop._id)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            shop.status === 'active'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
                              : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
                          }`}
                        >
                          {shop.status === 'active' ? 'Block' : 'Unblock'}
                        </button>
                        
                        <button
                          onClick={() => deleteShop(shop._id)}
                          className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageShopsPage;
