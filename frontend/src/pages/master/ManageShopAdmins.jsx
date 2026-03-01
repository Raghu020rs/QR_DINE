import { useState, useEffect } from 'react';
import { apiUrl } from '../../utils/api';

const ManageShopAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShop, setFilterShop] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch shops
      const shopsResponse = await fetch(apiUrl('/api/master/shops'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch admins
      const adminsResponse = await fetch(apiUrl('/api/master/shop-admins'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (shopsResponse.ok && adminsResponse.ok) {
        const shopsData = await shopsResponse.json();
        const adminsData = await adminsResponse.json();
        
        setShops(shopsData);
        setAdmins(adminsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (adminId, currentStatus) => {
    try {
      const response = await fetch(apiUrl(`/api/master/shop-admin/${adminId}/toggle-status`), {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdmins(admins.map(admin => 
          admin._id === adminId ? data.admin : admin
        ));
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShop = filterShop === 'all' || admin.shopId._id === filterShop;
    return matchesSearch && matchesShop;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Shop Admins</h1>
          <p className="text-muted-foreground mt-1">View and manage all shop administrators</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          + Add Shop Admin
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          {/* Shop Filter */}
          <select
            value={filterShop}
            onChange={(e) => setFilterShop(e.target.value)}
            className="px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            <option value="all">All Shops</option>
            {shops.map(shop => (
              <option key={shop._id} value={shop._id}>{shop.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Admins</p>
          <p className="text-2xl font-bold text-foreground">{admins.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600">{admins.filter(a => a.isActive).length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Inactive</p>
          <p className="text-2xl font-bold text-destructive">{admins.filter(a => !a.isActive).length}</p>
        </div>
      </div>

      {/* Admins List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-4">Loading admins...</p>
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-xl text-muted-foreground">No shop admins found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Name</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Email</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Phone</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Shop</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Status</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-accent transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{admin.name}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{admin.email}</td>
                      <td className="px-6 py-4 text-muted-foreground">{admin.phone}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                          {admin.shopId.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          admin.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(admin._id, admin.isActive)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              admin.isActive
                                ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                            }`}
                          >
                            {admin.isActive ? 'Deactivate' : 'Activate'}
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
            {filteredAdmins.map((admin) => (
              <div key={admin._id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-foreground">{admin.name}</h3>
                    <p className="text-sm text-muted-foreground">{admin.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    admin.isActive
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  <p className="text-sm text-muted-foreground">📞 {admin.phone}</p>
                  <p className="text-sm">
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium">
                      {admin.shopId.name}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleToggleStatus(admin._id, admin.isActive)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    admin.isActive
                      ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                      : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                  }`}
                >
                  {admin.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-foreground mb-4">Add Shop Admin</h2>
            <p className="text-muted-foreground mb-4">
              This form will use the backend API endpoint: /api/master/add-shop-admin
            </p>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageShopAdmins;
