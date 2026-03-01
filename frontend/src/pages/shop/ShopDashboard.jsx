import { useState, useEffect } from 'react';
import { RefreshCw, FileText, ChevronDown, Check } from 'lucide-react';
import { io } from 'socket.io-client';

const ShopDashboard = () => {
  const shopId = localStorage.getItem('shopId');
  const shopName = localStorage.getItem('userName') || 'Shop Admin';
  
  const [stats, setStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    weeklyRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });

  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchDashboardData();

    // Socket.io Integration
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      if (shopId) {
        socket.emit('joinShop', shopId);
      }
    });

    socket.on('newOrder', (data) => {
      // Play ding sound
      const audio = new Audio('/ding.ogg');
      audio.play().catch(e => console.log('Audio play failed:', e));
      
      // Show short notification
      setSuccess(`New Order Alert! Table ${data.tableNo}`);
      setTimeout(() => setSuccess(''), 5000);

      // Refresh data
      fetchDashboardData();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const statsResponse = await fetch('http://localhost:5000/api/order/dashboard-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      const ordersResponse = await fetch('http://localhost:5000/api/order/shop-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      }

      const menuResponse = await fetch('http://localhost:5000/api/shop/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (menuResponse.ok) {
        const menuData = await menuResponse.json();
        setMenuItems(menuData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      preparing: 'bg-[#f8b400] text-white',
      served: 'bg-[#1e293b] text-white',
      pending: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/order/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to update order status');

      fetchDashboardData(); 
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const filteredMenu = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans">
      {/* Toast Notification for New Orders or Success Messages */}
      {success && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right-4">
          <Check className="w-5 h-5" />
          <span className="font-semibold">{success}</span>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right-4">
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            ��� Shop Admin Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">Hello, {shopName}</p>
            <p className="text-xs text-gray-500">admin@shop.com</p>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl shadow-sm">
            ���‍���
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e293b]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Revenue Today</h3>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-900">₹{stats.todayRevenue.toLocaleString()}</span>
                  <div className="bg-[#59b28b] bg-opacity-20 text-[#2b7153] px-2 py-1 rounded text-sm font-semibold flex items-center gap-1">
                    72 <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm text-gray-500">
                      <th className="pb-3 font-semibold">Order ID</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Order Time</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="py-3 text-sm font-bold text-gray-700">
                          #{order.orderNumber || order._id.slice(-4).toUpperCase()}
                        </td>
                        <td className="py-3 text-sm text-gray-800">
                          {order.tableNo ? `Table ${order.tableNo}` : order.customerPhone}
                        </td>
                        <td className="py-3 text-sm text-gray-500">{formatTime(order.createdAt)}</td>
                        <td className="py-3">
                           <div className="flex items-center gap-2">
                             <select 
                               value={order.status}
                               onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                               className={`text-xs font-semibold px-3 py-1.5 rounded outline-none cursor-pointer appearance-none ${getStatusColor(order.status)}`}
                             >
                                <option value="pending" className="text-black bg-white">Pending</option>
                                <option value="preparing" className="text-black bg-white">Preparing</option>
                                <option value="served" className="text-black bg-white">Ready</option>
                                <option value="cancelled" className="text-black bg-white">Cancelled</option>
                             </select>
                           </div>
                        </td>
                        <td className="py-3 text-sm font-bold text-[#1e293b]">
                          <div className="flex items-center gap-4">
                            ₹{order.totalAmount}
                            {order.status === 'served' && (
                              <button className="bg-[#59b28b] text-white px-3 py-1 rounded text-xs flex items-center gap-1 font-semibold hover:bg-[#439672]">
                                <Check className="w-3 h-3"/> Eat
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">No orders for today</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mock Chart Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">QR Payment</h3>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
               </div>
               <h2 className="text-3xl font-bold text-gray-800 mb-6">₹{stats.weeklyRevenue.toLocaleString()}</h2>
               
               {/* FAKE CHART UI */}
               <div className="h-32 border-b-2 border-l-2 border-gray-100 relative flex items-end justify-between px-2 mb-4">
                 <div className="w-2 h-16 bg-blue-100 rounded-t"></div>
                 <div className="w-2 h-20 bg-blue-100 rounded-t"></div>
                 <div className="w-2 h-24 bg-blue-100 rounded-t"></div>
                 <div className="w-2 h-12 bg-blue-100 rounded-t"></div>
                 <div className="w-2 h-28 bg-[#59b28b] rounded-t relative">
                   <div className="absolute -top-8 -left-6 bg-[#59b28b] text-white text-xs px-2 py-1 rounded">₹{stats.todayRevenue}</div>
                 </div>
                 <div className="w-2 h-16 bg-blue-100 rounded-t"></div>
                 <div className="w-2 h-14 bg-blue-100 rounded-t"></div>
               </div>
               <div className="flex justify-between text-xs text-gray-400 font-semibold px-2">
                 <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
               </div>
               
               <div className="flex justify-center gap-4 mt-6 opacity-60">
                 <div className="font-bold italic text-blue-800 flex items-center">Razorpay</div>
                 <div className="font-bold text-blue-500 flex items-center">Google Pay</div>
                 <div className="font-bold text-purple-600 flex items-center">PhonePe</div>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Menu</h3>
              </div>
              <div className="flex gap-2 text-sm font-semibold mb-6 overflow-x-auto no-scrollbar pb-2">
                {['All', 'Main Course', 'Pizza', 'Drinks'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap ${
                      activeCategory === cat ? 'bg-[#3b4b5e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                {filteredMenu.slice(0, 5).map(item => (
                  <div key={item._id} className="flex gap-3 items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">IMG</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{shopName}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-gray-800">₹{item.price}</span>
                      <button className="bg-[#59b28b] hover:bg-[#439672] text-white text-xs px-4 py-1 rounded font-semibold transition-colors">
                        Add
                      </button>
                    </div>
                  </div>
                ))}
                {filteredMenu.length === 0 && (
                  <div className="text-center text-sm text-gray-500 py-4">No items found</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">A</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Updated info for {shopName}</p>
                  </div>
                  <span className="text-xs text-gray-400">2 hrs</span>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">A</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Added new shop {shopName}</p>
                  </div>
                  <span className="text-xs text-gray-400">1 day</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ShopDashboard;
