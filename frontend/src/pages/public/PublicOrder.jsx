import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ShoppingCart, FileText, ArrowLeft, Check, Loader2, Info } from 'lucide-react';

const PublicOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { shopId } = useParams();
  
  const cart = location.state?.cart || [];
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    customerPhone: '',
    tableNo: '',
  });

  const [errors, setErrors] = useState({});

  // Redirect if cart is empty
  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">Please add items to your cart first</p>
          <button
            onClick={() => navigate(`/menu/${shopId}`)}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
          >
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.customerPhone.replace(/\D/g, ''))) {
      newErrors.customerPhone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.tableNo.trim()) {
      newErrors.tableNo = 'Table number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        shopId,
        tableNo: formData.tableNo,
        customerPhone: formData.customerPhone,
        items: cart.map(item => ({
          productId: item._id,
          quantity: item.quantity
        }))
      };

      const response = await fetch('http://localhost:5000/api/order/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to create order');
      }

      setOrderDetails(data);
      setOrderSuccess(true);

    } catch (err) {
      alert(err.message || 'Failed to place order. Please try again.');
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (orderSuccess && orderDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full text-center animate-fadeIn">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully!</h2>
          <p className="text-muted-foreground mb-6">Your order has been received</p>
          
          <div className="bg-muted/50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number:</span>
              <span className="font-semibold text-foreground">{orderDetails.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-semibold text-primary text-xl">${orderDetails.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6">
            Your order is being prepared. Please wait at your table.
          </p>
          
          <button
            onClick={() => navigate(`/menu/${shopId}`)}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-semibold"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // Order Form
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/menu/${shopId}`)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Menu
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Complete Your Order</h1>
              <p className="text-sm text-muted-foreground">Enter your details below</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Form */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Your Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={`w-full px-4 py-2.5 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                    errors.customerPhone ? 'border-destructive' : 'border-border'
                  }`}
                />
                {errors.customerPhone && (
                  <p className="text-sm text-destructive mt-1">{errors.customerPhone}</p>
                )}
              </div>

              <div>
                <label htmlFor="tableNo" className="block text-sm font-medium text-foreground mb-2">
                  Table Number *
                </label>
                <input
                  id="tableNo"
                  name="tableNo"
                  type="text"
                  required
                  value={formData.tableNo}
                  onChange={handleChange}
                  placeholder="e.g., 12, A5, etc."
                  className={`w-full px-4 py-2.5 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                    errors.tableNo ? 'border-destructive' : 'border-border'
                  }`}
                />
                {errors.tableNo && (
                  <p className="text-sm text-destructive mt-1">{errors.tableNo}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between items-start py-2 border-b border-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      {item.isVeg ? (
                        <span className="w-3 h-3 border border-green-600 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                        </span>
                      ) : (
                        <span className="w-3 h-3 border border-red-600 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold text-foreground">${getTotalAmount()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tax (0%):</span>
                <span className="font-semibold text-foreground">$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-lg font-bold text-foreground">Total:</span>
                <span className="text-2xl font-bold text-primary">${getTotalAmount()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Payment Information</h3>
              <p className="text-sm text-muted-foreground">
                Payment is currently set to <span className="font-medium text-foreground">Pending</span>. 
                Please pay at the counter after your meal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicOrder;
