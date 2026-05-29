import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const HelpCenter = () => {
  const [activeTopic, setActiveTopic] = useState('top-queries');
  const [expandedQuery, setExpandedQuery] = useState(null);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const helpTopics = [
    { id: 'top-queries', title: 'Top Queries', icon: '❓' },
    { id: 'orders', title: 'Order Related Queries', icon: '📦' },
    { id: 'returns', title: 'Cancellations and Returns', icon: '🔄' },
    { id: 'payments', title: 'Payment and Refunds', icon: '💳' },
    { id: 'plus', title: 'Abhishek Plus', icon: '⭐' },
    { id: 'contact', title: 'Contact Us (Call / Email)', icon: '📞' },
  ];

  return (
    <MainLayout>
      <div className="bg-[#f1f3f6] min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-2">
          
          <div className="bg-white rounded-sm shadow-sm p-8 text-center mb-4">
            <h1 className="text-[24px] font-bold text-[#212121] mb-2">Abhishek Front Help Center | 24x7 Customer Care</h1>
            <p className="text-[#878787] text-[16px]">How can we help you today?</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Sidebar */}
            <div className="w-full md:w-[300px] shrink-0 bg-white rounded-sm shadow-sm flex flex-col h-fit">
              <div className="p-4 border-b border-gray-100 bg-[#f8f8f8]">
                <h2 className="font-bold text-[#212121] uppercase text-[14px]">Help Topics</h2>
              </div>
              {helpTopics.map(topic => (
                <div 
                  key={topic.id} 
                  onClick={() => setActiveTopic(topic.id)}
                  className={`p-4 border-b border-gray-100 hover:bg-[#f1f3f6] cursor-pointer flex items-center gap-3 transition-colors ${activeTopic === topic.id ? 'bg-[#f1f3f6] border-l-4 border-l-[#2874f0]' : ''}`}
                >
                  <span className="text-[20px]">{topic.icon}</span>
                  <span className={`font-medium text-[15px] ${activeTopic === topic.id ? 'text-[#2874f0]' : 'text-[#212121]'}`}>{topic.title}</span>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-grow bg-white rounded-sm shadow-sm p-8">
              {activeTopic === 'top-queries' && (
                <>
                  <h2 className="text-[20px] font-bold text-[#212121] mb-6 border-b border-gray-100 pb-4">Top Queries</h2>
                  <div className="flex flex-col gap-4">
                    <div 
                      className="border border-gray-200 rounded-sm p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                      onClick={() => setExpandedQuery(expandedQuery === 1 ? null : 1)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-[#2874f0] text-[16px]">I want to track my order</h3>
                        <span className="text-[#878787] font-bold">{expandedQuery === 1 ? '−' : '+'}</span>
                      </div>
                      {expandedQuery === 1 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 text-[#212121] text-[14px] leading-relaxed">
                          <p>To track your order, please follow these steps:</p>
                          <ol className="list-decimal ml-5 mt-2 space-y-1">
                            <li>Log in to your Abhishek Front account.</li>
                            <li>Go to the <Link to="/orders" className="text-[#2874f0] hover:underline font-medium">My Orders</Link> section.</li>
                            <li>Select the order you wish to track.</li>
                            <li>Click on 'Track Order' to see the real-time status.</li>
                          </ol>
                        </div>
                      )}
                    </div>

                    <div 
                      className="border border-gray-200 rounded-sm p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                      onClick={() => setExpandedQuery(expandedQuery === 2 ? null : 2)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-[#2874f0] text-[16px]">I want to cancel my order</h3>
                        <span className="text-[#878787] font-bold">{expandedQuery === 2 ? '−' : '+'}</span>
                      </div>
                      {expandedQuery === 2 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 text-[#212121] text-[14px] leading-relaxed">
                          <p>You can cancel your order before it has been shipped:</p>
                          <ol className="list-decimal ml-5 mt-2 space-y-1">
                            <li>Go to <Link to="/orders" className="text-[#2874f0] hover:underline font-medium">My Orders</Link>.</li>
                            <li>Find the order you wish to cancel and click 'Cancel'.</li>
                            <li>Select the reason for cancellation and submit.</li>
                          </ol>
                          <p className="mt-2 text-[#878787] italic">Note: Once an order is shipped, the Cancel button will be disabled.</p>
                        </div>
                      )}
                    </div>

                    <div 
                      className="border border-gray-200 rounded-sm p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                      onClick={() => setExpandedQuery(expandedQuery === 3 ? null : 3)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-[#2874f0] text-[16px]">I want to return an item</h3>
                        <span className="text-[#878787] font-bold">{expandedQuery === 3 ? '−' : '+'}</span>
                      </div>
                      {expandedQuery === 3 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 text-[#212121] text-[14px] leading-relaxed">
                          <p>We offer a hassle-free return policy. If you're not satisfied with the product:</p>
                          <ol className="list-decimal ml-5 mt-2 space-y-1">
                            <li>Go to <Link to="/orders" className="text-[#2874f0] hover:underline font-medium">My Orders</Link>.</li>
                            <li>Select the delivered order.</li>
                            <li>Click on 'Return', choose a reason, and select pickup or drop-off.</li>
                          </ol>
                        </div>
                      )}
                    </div>

                    <div 
                      className="border border-gray-200 rounded-sm p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                      onClick={() => setExpandedQuery(expandedQuery === 4 ? null : 4)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-[#2874f0] text-[16px]">My payment was deducted but order was not placed</h3>
                        <span className="text-[#878787] font-bold">{expandedQuery === 4 ? '−' : '+'}</span>
                      </div>
                      {expandedQuery === 4 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 text-[#212121] text-[14px] leading-relaxed">
                          <p>Don't worry, your money is completely safe.</p>
                          <p className="mt-2">Usually, failed transactions are automatically refunded to your original payment method within <strong>3-5 business days</strong> depending on your bank.</p>
                          <p className="mt-2">If you don't receive the refund after 5 days, please contact your bank or reach out to us using the Contact Us option below.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTopic === 'orders' && (
                <>
                  <h2 className="text-[20px] font-bold text-[#212121] mb-6 border-b border-gray-100 pb-4">Order Related Queries</h2>
                  <div className="flex flex-col gap-4">
                    <div 
                      className="border border-gray-200 rounded-sm p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                      onClick={() => setExpandedQuery(expandedQuery === 5 ? null : 5)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-[#2874f0] text-[16px]">Track an order</h3>
                        <span className="text-[#878787] font-bold">{expandedQuery === 5 ? '−' : '+'}</span>
                      </div>
                      {expandedQuery === 5 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 text-[#212121] text-[14px] leading-relaxed">
                          <p>To view the current status of your order:</p>
                          <ol className="list-decimal ml-5 mt-2 space-y-1">
                            <li>Visit the <Link to="/orders" className="text-[#2874f0] hover:underline font-medium">My Orders</Link> page.</li>
                            <li>Locate the specific order from the list.</li>
                            <li>You will see a timeline indicating whether the order is Confirmed, Shipped, Out for Delivery, or Delivered.</li>
                          </ol>
                        </div>
                      )}
                    </div>

                    <div 
                      className="border border-gray-200 rounded-sm p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                      onClick={() => setExpandedQuery(expandedQuery === 6 ? null : 6)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-[#2874f0] text-[16px]">Report a missing item</h3>
                        <span className="text-[#878787] font-bold">{expandedQuery === 6 ? '−' : '+'}</span>
                      </div>
                      {expandedQuery === 6 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 text-[#212121] text-[14px] leading-relaxed">
                          <p>If an item is missing from your delivered package:</p>
                          <ol className="list-decimal ml-5 mt-2 space-y-1">
                            <li>Check if the order was split into multiple shipments on the <Link to="/orders" className="text-[#2874f0] hover:underline font-medium">My Orders</Link> page.</li>
                            <li>If all packages show as delivered, click on the order.</li>
                            <li>Select the 'Report an Issue' or 'Return' option and select 'Item missing from package'.</li>
                          </ol>
                          <p className="mt-2 text-[#878787] italic">Note: Please report missing items within 24-48 hours of delivery.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTopic === 'contact' && (
                <>
                  <h2 className="text-[20px] font-bold text-[#212121] mb-6 border-b border-gray-100 pb-4">Contact Us</h2>
                  <div className="bg-[#f4f8ff] border border-[#2874f0] rounded-sm p-8 text-center shadow-sm">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#2874f0]">
                      <span className="text-2xl">📞</span>
                    </div>
                    <h3 className="font-bold text-[#212121] text-[22px] mb-2">Call our 24x7 Helpline</h3>
                    <p className="text-[#878787] text-[16px] mb-4">We're here to help you around the clock.</p>
                    
                    <div className="bg-white inline-block px-8 py-3 rounded-md shadow-sm border border-gray-200">
                      <a href="tel:9801593198" className="font-black text-[#2874f0] text-[28px] tracking-wide">
                        +91 98015 93198
                      </a>
                    </div>
                    
                    <p className="text-[#878787] text-[14px] mt-6">You can also email us at: <a href="mailto:abhishekaryan14042006@gmail.com" className="text-[#2874f0] hover:underline font-medium">abhishekaryan14042006@gmail.com</a></p>
                  </div>
                </>
              )}
              
              {(activeTopic === 'returns' || activeTopic === 'payments' || activeTopic === 'plus') && (
                <>
                  <h2 className="text-[20px] font-bold text-[#212121] mb-6 border-b border-gray-100 pb-4">
                    {helpTopics.find(t => t.id === activeTopic)?.title}
                  </h2>
                  <div className="p-8 text-center text-gray-500">
                    <p>Information for this topic will be available soon.</p>
                    <button onClick={() => setActiveTopic('contact')} className="mt-4 text-[#2874f0] hover:underline font-medium">Contact Customer Support</button>
                  </div>
                </>
              )}

              <div className="mt-10 bg-[#f4f8ff] border border-[#2874f0] rounded-sm p-6 text-center">
                <h3 className="text-[18px] font-bold text-[#212121] mb-2">Need more help?</h3>
                <p className="text-[#878787] text-[14px] mb-4">Our customer care executives are available 24x7 to assist you.</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <a 
                    href="https://wa.me/919801593198?text=Hi%2C%20I%20need%20help%20with%20my%20Abhishek%20Front%20account." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white border border-[#2874f0] text-[#2874f0] px-6 py-2 rounded-sm font-medium hover:bg-[#2874f0] hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span className="text-[18px]">💬</span> Chat with us on WhatsApp
                  </a>
                  <button className="bg-white border border-[#2874f0] text-[#2874f0] px-6 py-2 rounded-sm font-medium hover:bg-[#2874f0] hover:text-white transition-colors">
                    Call me back
                  </button>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpCenter;
