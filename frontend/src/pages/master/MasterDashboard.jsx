import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../utils/api';

const MasterDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalShops: 0,
    activeShops: 0,
    blockedShops: 0,
    totalAdmins: 0,
  });
  const [recentShops, setRecentShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentShops();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(apiUrl('/api/master/dashboard-stats'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentShops = async () => {
    try {
      const response = await fetch(apiUrl('/api/master/shops'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentShops(data.slice(0, 5)); // Get latest 5 shops
      }
    } catch (error) {
      console.error('Error fetching recent shops:', error);
    }
  };

  const StatCard = ({ icon, label, value, color = 'primary' }) => (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">{loading ? '...' : value}</p>
        </div>
        <div className={`text-4xl opacity-80`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your system overview</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon="🏪" label="Total Shops" value={stats.totalShops} />
        <StatCard icon="✅" label="Active Shops" value={stats.activeShops} />
        <StatCard icon="🚫" label="Blocked Shops" value={stats.blockedShops} />
        <StatCard icon="👥" label="Shop Admins" value={stats.totalAdmins} />
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/master/create-shop')}
            className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left group"
          >
            <div className="text-2xl mb-2">➕</div>
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">Create New Shop</h3>
            <p className="text-sm text-muted-foreground mt-1">Add a new restaurant or shop</p>
          </button>
          
          <button 
            onClick={() => navigate('/master/create-admin')}
            className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left group"
          >
            <div className="text-2xl mb-2">👤</div>
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">Create Admin</h3>
            <p className="text-sm text-muted-foreground mt-1">Add new master admin</p>
          </button>
          
          <button 
            onClick={() => navigate('/master/shops')}
            className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left group"
          >
            <div className="text-2xl mb-2">🏪</div>
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">Manage Shops</h3>
            <p className="text-sm text-muted-foreground mt-1">View and edit all shops</p>
          </button>
        </div>
      </div>

      {/* Recent Shops */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Recent Shops</h2>
          <button 
            onClick={() => navigate('/master/shops')}
            className="text-sm text-primary hover:underline"
          >
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : recentShops.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No shops created yet</p>
              <button 
                onClick={() => navigate('/master/create-shop')}
                className="mt-2 text-primary hover:underline text-sm"
              >
                Create your first shop
              </button>
            </div>
          ) : (
            recentShops.map((shop) => (
              <div key={shop._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer" onClick={() => navigate('/master/shops')}>
                <span className="text-xl">🏪</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{shop.name}</p>
                  <p className="text-sm text-muted-foreground">{shop.ownerName} • {shop.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    shop.status === 'active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {shop.status}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(shop.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterDashboard;
