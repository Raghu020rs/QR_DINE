import { useState, useEffect } from 'react';
import { BookOpen, Plus, Check, X, Edit, Trash2, Sliders } from 'lucide-react';

const ManageMenu = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'main',
    description: '',
    image: '',
    isVeg: true,
  });

  // Fetch menu items on mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/shop/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }

      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const url = editingItem 
        ? `http://localhost:5000/api/shop/${editingItem._id}`
        : 'http://localhost:5000/api/shop/';
      
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to save item');
      }

      setSuccess(data.msg);
      setFormData({ 
        name: '', 
        price: '', 
        category: 'main', 
        description: '', 
        image: '',
        isVeg: true 
      });
      setShowAddForm(false);
      setEditingItem(null);
      fetchMenuItems();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      description: item.description || '',
      image: item.image || '',
      isVeg: item.isVeg,
    });
    setShowAddForm(true);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData({ 
      name: '', 
      price: '', 
      category: 'main', 
      description: '', 
      image: '',
      isVeg: true 
    });
    setShowAddForm(false);
  };

  const toggleAvailability = async (item) => {
    try {
      const response = await fetch(`http://localhost:5000/api/shop/${item._id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to toggle availability');
      }

      setSuccess(data.msg);
      fetchMenuItems();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/shop/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to delete item');
      }

      setSuccess(data.msg);
      fetchMenuItems();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="animate-slideDown flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Menu Items</h1>
            <p className="text-muted-foreground">Manage your restaurant menu</p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (showAddForm) handleCancelEdit();
          }}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          {showAddForm ? 'Cancel' : 'Add Menu Item'}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg animate-slideDown">
          <p className="font-medium">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg animate-slideDown">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-6 animate-slideDown hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-bold text-foreground">
            {editingItem ? 'Edit Menu Item' : 'New Menu Item'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Item Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Margherita Pizza"
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
                Price (₹) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="250"
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              >
                <option value="drink">Drink</option>
                <option value="starter">Starter</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="snack">Snack</option>
                <option value="combo">Combo</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-foreground mb-2">
                Image URL
              </label>
              <input
                id="image"
                name="image"
                type="text"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

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
                placeholder="Describe your dish..."
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isVeg"
                  checked={formData.isVeg}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 bg-input-background border-border rounded focus:ring-2 focus:ring-ring"
                />
                <span className="text-sm font-medium text-foreground">Vegetarian</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-8 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 font-medium flex items-center gap-2 hover:scale-105"
            >
              <Check className="w-5 h-5" />
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
            {editingItem && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Menu Items List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden animate-slideUp">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Current Menu ({menuItems.length} items)</h2>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading menu items...</p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">No menu items</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by adding your first menu item.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Add Menu Item
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {menuItems.map((item, index) => (
              <div
                key={item._id}
                className="p-6 hover:bg-accent transition-colors duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                      {item.isVeg && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded">
                          🌱 Veg
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.isAvailable
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">
                      Category: {item.category}
                    </p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    )}
                    <p className="text-lg font-bold text-primary mt-2">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all font-medium flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleAvailability(item)}
                      className="px-4 py-2 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all font-medium flex items-center gap-2"
                    >
                      <Sliders className="w-4 h-4" />
                      Toggle
                    </button>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-all font-medium flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="font-bold text-foreground mb-2">💡 Menu Management Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Use clear, appetizing names for your dishes</li>
          <li>• Keep prices up to date to avoid customer confusion</li>
          <li>• Toggle availability when items are out of stock</li>
          <li>• Organize items into categories for easy browsing</li>
          <li>• Add detailed descriptions to help customers make choices</li>
        </ul>
      </div>
    </div>
  );
};

export default ManageMenu;
