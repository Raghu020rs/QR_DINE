import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ShoppingCart, FileText, ArrowLeft, Check, Loader2, Info } from 'lucide-react';
import { apiUrl } from '../../utils/api';

const PublicOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { shopId } = useParams();
  
  const initialCart = location.state?.cart || [];
  const [cart, setCart] = useState(initialCart);
  
  // Wizard steps: 'cart' -> 'checkout' -> 'success'
  const [step, setStep] = useState('cart');

  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    customerPhone: '',
    tableNo: '',
  });

  const [errors, setErrors] = useState({});

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md w-full text-center shadow-sm">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Please add items to your cart first</p>
          <button
            onClick={() => navigate(`/menu/${shopId}`)}
            className="px-6 py-2.5 bg-[#3b4b5e] text-white rounded-lg hover:bg-[#2c394b] transition-all font-medium"
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

  const updateQuantity = (itemId, change) => {
    setCart(cart.map(item => {
      if (item._id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleProceedToCheckout = () => setStep('checkout');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Required';
    else if (!/^[0-9]{10}$/.test(formData.customerPhone.replace(/\D/g, ''))) newErrors.customerPhone = 'Invalid format';
    
    if (!formData.tableNo.trim()) newErrors.tableNo = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const orderData = {
        shopId,
        tableNo: formData.tableNo,
        customerPhone: formData.customerPhone,
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          isVeg: item.isVeg
        }))
      };

      const response = await fetch(apiUrl('/api/order/qr'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to create order');

      setOrderDetails(data);
      setStep('success');

    } catch (err) {
      alert(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Header = ({ title, showBack }) => (
    <div className="bg-[#1e293b] sticky top-0 z-40 shadow-sm text-white py-4 px-4 flex items-center">
      {showBack ? (
        <button onClick={() => step === 'cart' ? navigate(-1) : setStep('cart')} className="text-white p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
      ) : (
        <div className="w-8"></div>
      )}
      <h1 className="text-xl font-bold flex-1 text-center">{title}</h1>
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
        <span className="text-sm font-bold">���</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      {step === 'cart' && (
        <>
          <Header title="Your Shop" showBack={true} />
          <div className="max-w-md mx-auto bg-white min-h-[calc(100vh-64px)] p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 tracking-tight">Cart</h2>
            <div className="space-y-4 border-b border-dashed border-gray-200 pb-4">
              {cart.map(item => (
                <div key={item._id} className="flex gap-4 items-center bg-white p-2">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-gray-800 text-[15px] truncate">{item.name}</h3>
                    <p className="font-bold text-gray-700 mt-1">₹ {item.price}</p>
                    <div className="mt-2 flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-md w-max px-2 py-1">
                      <button onClick={() => updateQuantity(item._id, -1)} className="text-gray-600">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, 1)} className="text-gray-600">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="py-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Item Total</span>
                <span>₹ {getTotalAmount()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t mt-2">
                <span>Total</span>
                <span>₹ {getTotalAmount()}</span>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50">
              <div className="max-w-md mx-auto">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-[#3b4b5e] text-white rounded-xl py-3.5 font-bold text-lg hover:bg-[#2c394b] transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {step === 'checkout' && (
        <>
          <Header title="Your Shop" showBack={true} />
          <div className="max-w-md mx-auto bg-white min-h-[calc(100vh-64px)] p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 tracking-tight">Checkout</h2>
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between text-sm py-1 font-medium text-gray-700">
                  <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                  <span>₹ {item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-gray-900">
                <span>Total Amount</span>
                <span>₹ {getTotalAmount()}</span>
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Table No.</label>
                <input
                  type="text"
                  name="tableNo"
                  value={formData.tableNo}
                  onChange={handleChange}
                  placeholder="e.g. 17"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.tableNo ? 'border-red-500' : 'border-gray-300'} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#3b4b5e]`}
                />
                {errors.tableNo && <p className="text-red-500 text-xs mt-1">{errors.tableNo}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#3b4b5e]`}
                />
                {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>}
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3 bg-blue-50/50 mb-6 mt-6">
              <CreditCard className="text-[#3b4b5e] w-6 h-6" />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Payment Methods</p>
                <p className="text-xs text-gray-500">UPI, Cards, Netbanking (Mocked for now)</p>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50">
              <div className="max-w-md mx-auto">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-[#3b4b5e] text-white rounded-xl py-3.5 font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#2c394b] transition-colors disabled:opacity-70"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    `Pay ₹ ${getTotalAmount()}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {step === 'success' && orderDetails && (
        <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative flex items-center justify-center p-4">
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center relative z-10">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <Check className="w-8 h-8 text-white stroke-[3]" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Payment Successful!</h2>
            <p className="text-sm font-medium text-gray-500 mb-6 border-b border-dashed pb-4">
              Order is confirmed.
            </p>
            
            <div className="space-y-4 mb-6 text-left border-b border-dashed pb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Table No.:</span>
                <span className="font-bold text-gray-800">{orderDetails.tableNo}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Order ID:</span>
                <span className="font-bold text-gray-800">#{orderDetails.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Paid:</span>
                <span className="font-bold text-gray-800">₹{orderDetails.totalAmount} <span className="text-xs text-gray-400 font-normal">via UPI</span></span>
              </div>
            </div>

            <div className="text-left space-y-2 mb-8">
              {orderDetails.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm font-medium text-gray-700">
                  <span>{item.quantity}x {item.name}</span>
                  <span>₹ {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => navigate(`/menu/${shopId}`)}
              className="w-full bg-[#3b4b5e] text-white rounded-xl py-3.5 font-bold mb-3 hover:bg-[#2c394b] transition-colors"
            >
              Order More
            </button>
            <button
              className="w-full bg-white text-[#3b4b5e] border-2 border-[#3b4b5e] rounded-xl py-3 font-bold hover:bg-gray-50 transition-colors"
            >
              View Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicOrder;
