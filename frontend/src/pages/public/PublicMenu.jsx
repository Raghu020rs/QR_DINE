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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Our Menu</h1>
                <p className="text-sm text-muted-foreground">Choose your favorites</p>
              </div>
            </div>
            
            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
              Cart
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-card border-b border-border sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all capitalize ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No items available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div
                key={item._id}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      {item.isVeg ? (
                        <span className="w-4 h-4 border-2 border-green-600 flex items-center justify-center">
                          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        </span>
                      ) : (
                        <span className="w-4 h-4 border-2 border-red-600 flex items-center justify-center">
                          <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    )}
                    <p className="text-sm font-medium text-muted-foreground capitalize">{item.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all text-sm font-medium"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={() => setShowCart(false)}>
          <div 
            className="bg-card w-full max-w-md h-full shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cart Header */}
            <div className="border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item._id} className="bg-muted/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-foreground">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">${item.price.toFixed(2)}</span>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="w-7 h-7 bg-background border border-border rounded flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="font-semibold text-foreground w-8 text-center">{item.quantity}</span>
                          
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            className="w-7 h-7 bg-background border border-border rounded flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm font-semibold text-foreground mt-2">
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Total:</span>
                  <span className="text-2xl font-bold text-primary">${getTotalAmount()}</span>
                </div>
                
                <button
                  onClick={proceedToOrder}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-semibold"
                >
                  Proceed to Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicMenu;
