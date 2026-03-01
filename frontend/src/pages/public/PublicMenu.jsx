import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, X, Loader2, AlertCircle, Minus, Plus, Trash2 } from 'lucide-react';
import { apiUrl } from '../../utils/api';

const PublicMenu = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, [shopId]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl(`/api/shop/menu/${shopId}`));
      
      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }

      const data = await response.json();
      setMenuItems(data);
      setError('');
    } catch (err) {
      setError('Unable to load menu. Please try again.');
      console.error('Fetch menu error:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'drink', 'starter', 'main', 'dessert', 'snack', 'combo', 'other'];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem._id === item._id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, change) => {
    setCart(cart.map(item => {
      if (item._id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item._id !== itemId));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const proceedToOrder = () => {
    if (cart.length === 0) {
      alert('Please add items to cart');
      return;
    }
    navigate(`/order/${shopId}`, { state: { cart, shopId } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground text-lg">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Oops!</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={fetchMenu}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Header */}
      <div className="bg-[#1e293b] sticky top-0 z-40 shadow-sm text-white">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button className="text-white hover:opacity-80">
              <div className="w-6 h-6 flex flex-col justify-center gap-1.5 pt-1">
                <span className="block w-6 h-0.5 bg-white"></span>
                <span className="block w-6 h-0.5 bg-white"></span>
                <span className="block w-6 h-0.5 bg-white"></span>
              </div>
            </button>
            <h1 className="text-xl font-bold flex-1 text-center">Your Shop</h1>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm font-bold">👤</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm pb-24">
        {/* Category Filter */}
        <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[60px] z-30">
          <div className="px-4 py-3">
            <div className="flex gap-2 justify-between overflow-x-auto no-scrollbar pb-1">
              {['All', 'Main Course', 'Pizza', 'Drinks'].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category.toLowerCase())}
                  className={`px-4 py-1.5 text-sm rounded-md font-medium whitespace-nowrap transition-all ${
                    (selectedCategory === category.toLowerCase() || (selectedCategory === 'all' && category === 'All'))
                      ? 'bg-[#3b4b5e] text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories / Menu Items */}
        <div className="px-4 py-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4 capitalize">
            {selectedCategory === 'all' ? 'Menu' : selectedCategory}
          </h2>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No items available in this category</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map(item => {
                const cartItem = cart.find(c => c._id === item._id);
                return (
                  <div key={item._id} className="flex gap-4 items-center bg-white p-2 border-b border-gray-100 pb-4">
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <BookOpen className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 py-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800 text-[15px] leading-tight">{item.name}</h3>
                        <span className="font-bold text-gray-900 px-2 rounded text-sm shrink-0 ml-1">
                          ₹ {item.price}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description || 'Delicious meal prepared fresh'}</p>
                      
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          {item.isVeg ? (
                            <span className="w-3.5 h-3.5 border border-green-600 flex items-center justify-center p-[2px]">
                              <span className="w-full h-full bg-green-600 rounded-full"></span>
                            </span>
                          ) : (
                            <span className="w-3.5 h-3.5 border border-red-600 flex items-center justify-center p-[2px]">
                              <span className="w-full h-full bg-red-600 rounded-full"></span>
                            </span>
                          )}
                        </div>

                        {cartItem ? (
                          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md p-1 h-8">
                            <button onClick={() => updateQuantity(item._id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-600">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold text-sm w-4 text-center">{cartItem.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, 1)} className="w-6 h-6 flex items-center justify-center text-gray-600">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-[#3b4b5e] text-white px-5 py-1.5 rounded-md text-sm font-medium hover:bg-[#2c394b] transition-colors"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={proceedToOrder}
              className="w-full bg-[#3b4b5e] hover:bg-[#2c394b] text-white rounded-xl p-4 flex justify-between items-center shadow-lg transition-transform hover:scale-[1.02]"
            >
              <span className="font-medium text-lg">View Cart</span>
              <span className="font-bold text-lg">₹ {getTotalAmount()}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicMenu;
