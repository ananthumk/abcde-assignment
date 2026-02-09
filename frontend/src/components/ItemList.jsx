import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Package, CreditCard, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ItemList = () => {
  const { logout } = useAuth();
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState('items'); // 'items', 'cart', 'orders'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('/items');
      setItems(res.data);
    } catch (err) {
      setError('Error fetching items. Please try again.');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId) => {
    try {
      await axios.post('/carts', { itemId });
      // Refresh cart to show updated count
      await fetchCart();
      alert('✓ Item added to cart successfully!');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        await logout();
      } else {
        alert('Error adding item to cart');
      }
      console.error('Error adding to cart:', err);
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('/carts');
      setCart(res.data.items || []);
      setView('cart');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        await logout();
      } else {
        setError('Error fetching cart. Please try again.');
      }
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Add items before placing an order.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/orders');
      alert('✓ Order placed successfully!');
      setCart([]);
      setView('items');
      await fetchOrders();
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        await logout();
      } else {
        alert('Error placing order: ' + (err.response?.data || 'Unknown error'));
      }
      console.error('Error placing order:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('/orders');
      setOrders(res.data || []);
      setView('orders');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        await logout();
      } else {
        setError('Error fetching orders. Please try again.');
      }
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Buttons */}
      <div className="bg-white shadow-md border-b">
        <div className="container mx-auto p-4 flex gap-3 flex-wrap">
          <button
            onClick={() => setView('items')}
            className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
              view === 'items'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Browse Items
          </button>
          <button
            onClick={fetchCart}
            className={`px-6 py-2 rounded-lg font-semibold transition duration-200 flex items-center ${
              view === 'cart'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <ShoppingCart className="mr-2" size={20} />
            Cart ({cart.length})
          </button>
          <button
            onClick={fetchOrders}
            className={`px-6 py-2 rounded-lg font-semibold transition duration-200 flex items-center ${
              view === 'orders'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <Package className="mr-2" size={20} />
            Order History
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto p-4">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-start">
            <AlertCircle className="mr-3 mt-0.5" size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Items View */}
        {view === 'items' && !loading && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Available Items</h2>
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No items available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-200 flex flex-col"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-green-600">${item.price}</span>
                    </div>
                    <button
                      onClick={() => addToCart(item._id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                    >
                      <ShoppingCart className="mr-2" size={20} />
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cart View */}
        {view === 'cart' && !loading && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Shopping Cart</h2>
            {cart.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty. Start shopping!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    {cart.map((item) => (
                      <div key={item._id} className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center">
                        <div className="flex-grow">
                          <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                          <p className="text-gray-600">{item.description}</p>
                          <p className="text-green-600 font-bold mt-2">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>${getTotalPrice()}</span>
                      </div>
                      <div className="flex justify-between mb-4 text-gray-500 text-sm">
                        <span>Shipping:</span>
                        <span>Free</span>
                      </div>
                      <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
                        <span>Total:</span>
                        <span className="text-green-600">${getTotalPrice()}</span>
                      </div>
                      <button
                        onClick={placeOrder}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                      >
                        <CreditCard className="mr-2" size={20} />
                        Place Order
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Orders View */}
        {view === 'orders' && !loading && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Order History</h2>
            {orders.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No orders yet. Start shopping now!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 border-b pb-4">
                      <div>
                        <p className="text-gray-500 text-sm">Order ID</p>
                        <p className="font-mono text-sm">{order._id?.substring(0, 8)}...</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Date</p>
                        <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Items</p>
                        <p className="font-bold">{order.items?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Total</p>
                        <p className="font-bold text-green-600">${order.total}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold mb-2">Items:</p>
                      <ul className="space-y-1">
                        {order.items?.map((item) => (
                          <li key={item._id} className="text-gray-600">
                            • {item.name} <span className="text-green-600 font-semibold">${item.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemList;