import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Truck, CheckCircle2, MapPin, Clock, ArrowRight, CheckCircle, X, Navigation } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import useOrderStore from '../store/useOrderStore';

const DeliveryTimeline = ({ status }) => {
  const steps = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentIndex = steps.indexOf(status) === -1 ? 0 : steps.indexOf(status);

  return (
    <div className="relative pt-6 pb-2">
      <div className="absolute top-8 left-0 w-full h-1 bg-gray-200 rounded-full z-0"></div>
      <div 
        className="absolute top-8 left-0 h-1 bg-[#2874f0] rounded-full z-0 transition-all duration-1000" 
        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
      ></div>
      
      <div className="relative z-10 flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${isCompleted ? 'bg-[#2874f0] ring-4 ring-[#2874f0]/20' : 'bg-gray-300'}`}>
                {isCompleted && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <span className={`text-xs md:text-sm font-medium ${isCurrent ? 'text-[#2874f0]' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Orders = () => {
  const location = useLocation();
  const { orders, getMyOrders, loading } = useOrderStore();
  const successToast = location.state?.success;
  const [trackingOrder, setTrackingOrder] = React.useState(null);

  useEffect(() => {
    getMyOrders();
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#f8fafc] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          {successToast && (
            <div className="mb-8 bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm animate-fade-in-down">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-green-800">Order Placed Successfully!</h3>
                <p className="text-sm text-green-600">Your order has been confirmed and is being processed.</p>
              </div>
            </div>
          )}

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
              <p className="text-gray-500 text-sm mt-1">Track and manage your recent purchases</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-24 bg-gray-100 rounded-xl mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded-full w-full"></div>
                </div>
              ))}
            </div>
          ) : orders?.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Package className="w-12 h-12 text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
              <p className="text-gray-500 mb-8">Looks like you haven't placed any orders yet.</p>
              <Link to="/" className="bg-[#2874f0] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order Placed</p>
                        <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
                        <p className="text-sm font-medium text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Payment</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.paymentMethod} • {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order ID</p>
                      <p className="text-sm font-mono text-gray-900">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Items */}
                    <div className="space-y-4 mb-8">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <Link to={`/product/${item.product}`} className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 p-2 shrink-0 group">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                          </Link>
                          <div className="flex-1">
                            <Link to={`/product/${item.product}`} className="text-base font-medium text-gray-900 hover:text-[#2874f0] line-clamp-1">{item.name}</Link>
                            <p className="text-sm text-gray-500 mt-1">Qty: {item.qty}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-gray-900">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Timeline */}
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#2874f0]" /> Delivery Status
                        </h4>
                        <span className="text-sm font-medium text-gray-600">
                          Expected by: <span className="font-bold text-gray-900">{new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </span>
                      </div>
                      <DeliveryTimeline status={order.status} />
                    </div>
                  </div>
                  
                  {/* Footer Actions */}
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
                    <button className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Download Invoice</button>
                    <button 
                      onClick={() => setTrackingOrder(order)}
                      className="px-4 py-2 text-sm font-bold text-[#2874f0] bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" /> Track Live Location
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Live Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#2874f0] text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Navigation className="w-5 h-5 animate-pulse" /> Live Tracking
              </h3>
              <button 
                onClick={() => setTrackingOrder(null)}
                className="p-1 hover:bg-blue-600 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col md:flex-row gap-6">
              
              {/* Map Section (Simulated Iframe) */}
              <div className="w-full md:w-2/3 h-[250px] bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200 shadow-inner">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115454.0847250686!2d77.0185854655458!3d28.535516086702334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1d9c4228944f%3A0x527146b280387532!2sDelhi!5e0!3m2!1sen!2sin!4v1716382092144!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Live Tracking Map"
                ></iframe>
                
                {/* Overlay badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md py-2 px-4 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full relative z-10"></div>
                    <span className="font-bold text-sm text-gray-800">Arriving in 15 mins</span>
                  </div>
                  <span className="text-xs font-bold text-gray-500">1.2 km away</span>
                </div>
              </div>

              {/* Delivery Partner Details */}
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-800 font-bold uppercase tracking-wider mb-2">Delivery Partner</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh" alt="Driver" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Ramesh Kumar</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">⭐ 4.8 (120+ deliveries)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-grow flex flex-col justify-center">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Vehicle Details</p>
                  <p className="font-bold text-gray-900 mb-4">Honda Activa • DL 8S AB 1234</p>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#2874f0] text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                      <span className="text-lg">📞</span> Call
                    </button>
                    <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors">
                      Message
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Orders;
