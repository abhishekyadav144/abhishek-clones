import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';

/* ─── mock data ─── */
const VALID_COUPON = 'ABHISHEK150';
const COUPON_POINTS = 150;

const INITIAL_POINTS = 1240;
const EXPIRING_POINTS = 200;

const INITIAL_HISTORY = [
  { id: 1, desc: 'Order #A8F3C2 delivered',       points: +120, date: '25 May 2026', type: 'credit' },
  { id: 2, desc: 'Welcome bonus',                  points: +500, date: '10 May 2026', type: 'credit' },
  { id: 3, desc: 'Redeemed on Order #B2D1A9',      points: -300, date: '5 May 2026',  type: 'debit'  },
  { id: 4, desc: 'Order #C9E4F1 delivered',        points: +250, date: '1 May 2026',  type: 'credit' },
  { id: 5, desc: 'Referral bonus',                 points: +100, date: '20 Apr 2026', type: 'credit' },
  { id: 6, desc: 'Redeemed on Order #D3A2B8',     points: -200, date: '15 Apr 2026', type: 'debit'  },
  { id: 7, desc: 'Birthday bonus',                 points: +770, date: '14 Apr 2026', type: 'credit' },
];

const OFFERS = [
  { id: 1, title: 'Flat ₹100 off',      desc: 'On orders above ₹999',  points: 200, icon: '🛍️' },
  { id: 2, title: 'Free Delivery',       desc: 'On your next 3 orders', points: 150, icon: '🚚' },
  { id: 3, title: '5% Extra Cashback',  desc: 'On Electronics',         points: 500, icon: '💻' },
  { id: 4, title: 'Flat ₹250 off',      desc: 'On orders above ₹2499', points: 400, icon: '🎁' },
];

const REVIEWS_LIST = [
  { id: 'r1', product: 'boAt Rockerz 450 Headphones', img: '🎧', reviewed: false },
  { id: 'r2', product: 'Samsung 65" 4K QLED TV',      img: '📺', reviewed: false },
  { id: 'r3', product: 'Nike Air Max 270',             img: '👟', reviewed: false },
];

/* ─── helpers ─── */
const todayStr = () => {
  const d = new Date();
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const levelInfo = (pts) => {
  if (pts >= 2000) return { label: 'Platinum', next: null, min: 1500, max: 2000, icon: '💎' };
  if (pts >= 1000) return { label: 'Gold',     next: 'Platinum', min: 1000, max: 1500, icon: '🥇' };
  if (pts >= 500)  return { label: 'Silver',   next: 'Gold',     min: 500,  max: 1000, icon: '🥈' };
  return               { label: 'Bronze',   next: 'Silver',   min: 0,    max: 500,  icon: '🥉' };
};

/* ─── Toast ─── */
const Toast = ({ msg, type }) => (
  <div
    style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      background: type === 'success' ? '#388e3c' : type === 'error' ? '#c62828' : '#2874f0',
      color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700,
      fontSize: 15, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,.25)',
      whiteSpace: 'nowrap', pointerEvents: 'none',
    }}
  >
    {type === 'success' ? '✅ ' : type === 'error' ? '❌ ' : 'ℹ️ '}{msg}
  </div>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const Rewards = () => {
  const [activeTab, setActiveTab]     = useState('overview');
  const [points, setPoints]           = useState(INITIAL_POINTS);
  const [history, setHistory]         = useState(INITIAL_HISTORY);
  const [toast, setToast]             = useState(null);

  /* ── refer ── */
  const [referEmail, setReferEmail]   = useState('');
  const [referSent, setReferSent]     = useState([]);

  /* ── reviews ── */
  const [reviews, setReviews]         = useState(REVIEWS_LIST);
  const [activeReview, setActiveReview] = useState(null);
  const [reviewText, setReviewText]   = useState('');
  const [reviewStars, setReviewStars] = useState(0);

  /* ── birthday ── */
  const [dob, setDob]                 = useState('');
  const [dobSaved, setDobSaved]       = useState(false);
  const [birthdayClaimed, setBirthdayClaimed] = useState(false);

  /* ── coupon ── */
  const [couponCode, setCouponCode]   = useState('');
  const [couponUsed, setCouponUsed]   = useState(false);

  /* ── redeem ── */
  const [redeemedOffers, setRedeemedOffers] = useState([]);

  /* ─── utils ─── */
  const showToast = (msg, type = 'success', dur = 2800) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), dur);
  };

  const addPoints = (amount, desc) => {
    setPoints(p => p + amount);
    setHistory(h => [
      { id: Date.now(), desc, points: amount, date: todayStr(), type: 'credit' },
      ...h,
    ]);
  };

  const deductPoints = (amount, desc) => {
    setPoints(p => p - amount);
    setHistory(h => [
      { id: Date.now(), desc, points: -amount, date: todayStr(), type: 'debit' },
      ...h,
    ]);
  };

  /* ─── handlers ─── */
  const handleRefer = (e) => {
    e.preventDefault();
    const email = referEmail.trim().toLowerCase();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showToast('Enter a valid email address', 'error'); return;
    }
    if (referSent.includes(email)) {
      showToast('Invite already sent to this email', 'error'); return;
    }
    setReferSent(s => [...s, email]);
    setReferEmail('');
    addPoints(100, `Referral invite sent to ${email}`);
    showToast('Invite sent! +100 pts credited 🎉');
  };

  const handleReviewSubmit = (productId) => {
    if (reviewStars === 0) { showToast('Please select a star rating', 'error'); return; }
    if (reviewText.trim().length < 10) { showToast('Write at least 10 characters', 'error'); return; }
    const product = reviews.find(r => r.id === productId);
    setReviews(rs => rs.map(r => r.id === productId ? { ...r, reviewed: true } : r));
    setActiveReview(null);
    setReviewText('');
    setReviewStars(0);
    addPoints(20, `Review submitted for ${product.product}`);
    showToast('Review submitted! +20 pts credited ⭐');
  };

  const handleSaveDob = () => {
    if (!dob) { showToast('Please pick your date of birth', 'error'); return; }
    setDobSaved(true);
    showToast('Birthday saved! 🎂 Bonus will be credited on your birthday.', 'success', 3500);
  };

  const handleClaimBirthday = () => {
    if (birthdayClaimed) return;
    setBirthdayClaimed(true);
    addPoints(500, 'Birthday bonus 🎂');
    showToast('Happy Birthday! +500 pts credited 🎂🎉', 'success', 3500);
  };

  const handleCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) { showToast('Enter a coupon code', 'error'); return; }
    if (couponUsed) { showToast('Coupon already applied!', 'error'); return; }
    if (code === VALID_COUPON) {
      setCouponUsed(true);
      setCouponCode('');
      addPoints(COUPON_POINTS, `Coupon ${code} applied`);
      showToast(`Coupon applied! +${COUPON_POINTS} pts credited 🎟️`);
    } else {
      showToast('Invalid or expired coupon code', 'error');
    }
  };

  const handleRedeem = (offer) => {
    if (points < offer.points) { showToast('Not enough points', 'error'); return; }
    if (redeemedOffers.includes(offer.id)) { showToast('Already redeemed!', 'error'); return; }
    setRedeemedOffers(r => [...r, offer.id]);
    deductPoints(offer.points, `Redeemed: ${offer.title}`);
    showToast(`${offer.title} redeemed! 🎉`);
  };

  const lvl = levelInfo(points);
  const progress = Math.min(100, Math.round(((points - lvl.min) / (lvl.max - lvl.min)) * 100));

  /* ─── EARN TAB ─── */
  const EarnTab = () => (
    <div className="space-y-4">

      {/* ── Refer a Friend ── */}
      <div className="bg-white shadow-sm rounded-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">👥</span>
          <div>
            <h2 className="font-bold text-[16px] text-[#212121]">Refer a Friend</h2>
            <p className="text-[13px] text-[#878787]">Earn <span className="text-[#2874f0] font-bold">+100 pts</span> for each friend you invite</p>
          </div>
        </div>
        <form onSubmit={handleRefer} className="flex gap-2">
          <input
            type="email"
            placeholder="Friend's email address"
            value={referEmail}
            onChange={e => setReferEmail(e.target.value)}
            className="flex-1 border border-gray-200 rounded-sm px-4 py-2 text-[14px] outline-none focus:border-[#2874f0]"
          />
          <button
            type="submit"
            className="bg-[#2874f0] text-white px-5 py-2 rounded-sm font-bold text-[14px] hover:bg-[#1c5dcc] transition-colors"
          >
            Send Invite
          </button>
        </form>
        {referSent.length > 0 && (
          <div className="mt-4 space-y-1">
            <p className="text-[12px] font-bold text-[#878787] uppercase tracking-wide mb-2">Invites Sent</p>
            {referSent.map((email, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px] text-[#212121] bg-[#f0f7ff] px-3 py-2 rounded">
                <span className="text-green-500 font-bold">✓</span> {email}
                <span className="ml-auto text-[#2874f0] font-bold">+100 pts</span>
              </div>
            ))}
          </div>
        )}
        {/* share link */}
        <div className="mt-4 p-3 bg-[#f8faff] rounded-lg border border-blue-100 flex items-center justify-between">
          <p className="text-[13px] text-[#878787]">Your referral link:</p>
          <button
            onClick={() => {
              navigator.clipboard?.writeText('https://abhishekcart.in/ref/USER123');
              showToast('Link copied!', 'success', 1800);
            }}
            className="text-[#2874f0] font-bold text-[13px] hover:underline"
          >
            Copy Link 🔗
          </button>
        </div>
      </div>

      {/* ── Write Reviews ── */}
      <div className="bg-white shadow-sm rounded-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">⭐</span>
          <div>
            <h2 className="font-bold text-[16px] text-[#212121]">Write Reviews</h2>
            <p className="text-[13px] text-[#878787]">Earn <span className="text-[#2874f0] font-bold">+20 pts</span> per verified product review</p>
          </div>
        </div>
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{r.img}</span>
                  <p className="font-medium text-[14px] text-[#212121]">{r.product}</p>
                </div>
                {r.reviewed ? (
                  <span className="text-green-600 font-bold text-[13px] bg-green-50 px-3 py-1 rounded-full">Reviewed ✓ +20 pts</span>
                ) : (
                  <button
                    onClick={() => { setActiveReview(r.id); setReviewStars(0); setReviewText(''); }}
                    className="bg-[#2874f0] text-white px-4 py-1.5 rounded-sm font-bold text-[13px] hover:bg-[#1c5dcc] transition-colors"
                  >
                    Write Review
                  </button>
                )}
              </div>

              {/* inline review form */}
              {activeReview === r.id && !r.reviewed && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {/* stars */}
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setReviewStars(s)} className="text-2xl">
                        {s <= reviewStars ? '⭐' : '☆'}
                      </button>
                    ))}
                    <span className="ml-2 text-[13px] text-[#878787] self-center">
                      {reviewStars > 0 ? ['','Poor','Fair','Good','Very Good','Excellent'][reviewStars] : 'Tap to rate'}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Share your experience (min 10 chars)..."
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-[14px] outline-none focus:border-[#2874f0] resize-none"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleReviewSubmit(r.id)}
                      className="bg-[#2874f0] text-white px-5 py-2 rounded-sm font-bold text-[14px] hover:bg-[#1c5dcc] transition-colors"
                    >
                      Submit & Earn +20 pts
                    </button>
                    <button
                      onClick={() => setActiveReview(null)}
                      className="text-[#878787] px-4 py-2 text-[14px] hover:text-[#212121]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Birthday Bonus ── */}
      <div className="bg-white shadow-sm rounded-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🎂</span>
          <div>
            <h2 className="font-bold text-[16px] text-[#212121]">Birthday Bonus</h2>
            <p className="text-[13px] text-[#878787]">Get <span className="text-[#2874f0] font-bold">+500 pts</span> credited on your birthday</p>
          </div>
        </div>
        {!dobSaved ? (
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              className="flex-1 border border-gray-200 rounded-sm px-4 py-2 text-[14px] outline-none focus:border-[#2874f0]"
            />
            <button
              onClick={handleSaveDob}
              className="bg-[#2874f0] text-white px-5 py-2 rounded-sm font-bold text-[14px] hover:bg-[#1c5dcc] transition-colors"
            >
              Save Birthday
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-[#f0f7ff] rounded-lg border border-blue-100">
              <span className="text-green-500 text-xl font-bold">✓</span>
              <p className="text-[14px] text-[#212121]">
                Birthday saved: <span className="font-bold">{new Date(dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long' })}</span>
              </p>
            </div>
            {/* Demo: let user claim bonus right now for demo purposes */}
            {!birthdayClaimed ? (
              <button
                onClick={handleClaimBirthday}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-bold text-[15px] hover:opacity-90 transition-opacity"
              >
                🎉 Claim Birthday Bonus (+500 pts)
              </button>
            ) : (
              <div className="text-center py-3 text-green-600 font-bold text-[15px] bg-green-50 rounded-lg">
                🎂 Birthday bonus claimed! +500 pts added
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Coupon ── */}
      <div className="bg-white shadow-sm rounded-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🎟️</span>
          <div>
            <h2 className="font-bold text-[16px] text-[#212121]">Redeem Coupon</h2>
            <p className="text-[13px] text-[#878787]">Enter a coupon code to earn bonus points</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon code (e.g. ABHISHEK150)"
            value={couponCode}
            onChange={e => setCouponCode(e.target.value.toUpperCase())}
            disabled={couponUsed}
            className="flex-1 border border-gray-200 rounded-sm px-4 py-2 text-[14px] outline-none focus:border-[#2874f0] font-mono tracking-widest uppercase disabled:bg-gray-50 disabled:text-gray-400"
          />
          <button
            onClick={handleCoupon}
            disabled={couponUsed}
            className={`px-5 py-2 rounded-sm font-bold text-[14px] transition-colors ${couponUsed ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#fb641b] text-white hover:bg-[#e05a18]'}`}
          >
            Apply
          </button>
        </div>
        {couponUsed && (
          <div className="mt-3 flex items-center gap-2 text-green-600 font-bold text-[14px] bg-green-50 px-4 py-2 rounded-lg">
            <span>✅</span> ABHISHEK150 applied — +{COUPON_POINTS} pts credited!
          </div>
        )}
        <p className="text-[12px] text-[#878787] mt-3">💡 Try code: <span className="font-mono font-bold text-[#212121]">ABHISHEK150</span> for +{COUPON_POINTS} bonus points</p>
      </div>
    </div>
  );

  /* ─── OVERVIEW TAB ─── */
  const OverviewTab = () => (
    <div className="space-y-4">
      <div className="bg-white shadow-sm rounded-sm p-6">
        <h2 className="font-bold text-[16px] text-[#212121] mb-4">How to Earn Points</h2>
        <div className="space-y-3">
          {[
            { icon: '🛒', title: 'Shop & Earn',    desc: 'Earn 1 point for every ₹10 spent' },
            { icon: '👥', title: 'Refer Friends',  desc: 'Get 100 points for each successful referral' },
            { icon: '⭐', title: 'Write Reviews',  desc: 'Earn 20 points per verified review' },
            { icon: '🎂', title: 'Birthday Bonus', desc: 'Get 500 bonus points on your birthday' },
            { icon: '🎟️', title: 'Use Coupons',   desc: 'Apply special codes to earn bonus points instantly' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-[#f8faff] rounded-lg border border-blue-50">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="font-bold text-[#212121] text-[15px]">{item.title}</p>
                <p className="text-[#878787] text-[13px]">{item.desc}</p>
              </div>
              <button
                onClick={() => setActiveTab('earn')}
                className="ml-auto text-[#2874f0] font-bold text-[13px] hover:underline shrink-0"
              >
                Earn →
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-sm p-6">
        <h2 className="font-bold text-[16px] text-[#212121] mb-3">Your Level</h2>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-3xl">{lvl.icon}</span>
          <div>
            <p className="font-bold text-[#2874f0] text-[18px]">{lvl.label} Member</p>
            <p className="text-[#878787] text-[13px]">
              {lvl.next ? `${Math.max(0, lvl.max - points)} pts more to reach ${lvl.next}` : '🏆 Max level reached!'}
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-[#2874f0] h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[12px] text-[#878787] mt-1">
          <span>{lvl.label} ({lvl.min} pts)</span>
          {lvl.next && <span>{lvl.next} ({lvl.max} pts)</span>}
        </div>
      </div>
    </div>
  );

  /* ─── REDEEM TAB ─── */
  const RedeemTab = () => (
    <div className="space-y-3">
      <p className="text-[#878787] text-[14px] px-1">
        Available Points: <span className="text-[#2874f0] font-bold">{points.toLocaleString()} pts</span>
      </p>
      {OFFERS.map((offer) => (
        <div key={offer.id} className="bg-white shadow-sm rounded-sm p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{offer.icon}</span>
            <div>
              <p className="font-bold text-[#212121] text-[16px]">{offer.title}</p>
              <p className="text-[#878787] text-[13px]">{offer.desc}</p>
              <p className="text-[#2874f0] font-bold text-[13px] mt-1">{offer.points} pts required</p>
            </div>
          </div>
          {redeemedOffers.includes(offer.id) ? (
            <span className="text-green-600 font-bold text-[13px] bg-green-50 px-3 py-2 rounded-full">Redeemed ✓</span>
          ) : (
            <button
              onClick={() => handleRedeem(offer)}
              disabled={points < offer.points}
              className={`px-5 py-2 rounded-sm font-bold text-[14px] transition-colors ${points >= offer.points ? 'bg-[#2874f0] text-white hover:bg-[#1c5dcc]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              Redeem
            </button>
          )}
        </div>
      ))}
    </div>
  );

  /* ─── HISTORY TAB ─── */
  const HistoryTab = () => (
    <div className="bg-white shadow-sm rounded-sm divide-y divide-gray-50">
      {history.length === 0 && (
        <p className="text-center text-[#878787] py-10">No transactions yet</p>
      )}
      {history.map((item) => (
        <div key={item.id} className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="font-medium text-[#212121] text-[15px]">{item.desc}</p>
            <p className="text-[#878787] text-[13px] mt-0.5">{item.date}</p>
          </div>
          <span className={`font-bold text-[16px] ${item.type === 'credit' ? 'text-[#388e3c]' : 'text-red-500'}`}>
            {item.type === 'credit' ? '+' : ''}{item.points} pts
          </span>
        </div>
      ))}
    </div>
  );

  /* ─── RENDER ─── */
  return (
    <MainLayout>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div className="bg-[#f1f3f6] min-h-screen py-6 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Points Card */}
          <div className="bg-gradient-to-r from-[#2874f0] to-[#1a56c4] rounded-xl p-6 mb-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100 text-[14px] font-medium">AbhishekCart Rewards</p>
                <h1 className="text-[36px] font-black mt-1">
                  {points.toLocaleString()} <span className="text-[20px] font-bold">pts</span>
                </h1>
                <p className="text-blue-200 text-[13px] mt-1">
                  ⚠️ {EXPIRING_POINTS} pts expiring on 30 Jun 2026
                </p>
              </div>
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-5xl">
                {lvl.icon}
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setActiveTab('redeem')}
                className="flex-1 bg-white text-[#2874f0] py-2 rounded-lg font-bold text-[15px] hover:bg-blue-50 transition-colors"
              >
                Redeem Points
              </button>
              <button
                onClick={() => setActiveTab('earn')}
                className="flex-1 bg-white/10 border border-white/30 text-white py-2 rounded-lg font-bold text-[15px] hover:bg-white/20 transition-colors"
              >
                Earn More
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white shadow-sm rounded-sm mb-4 overflow-hidden">
            {['overview', 'earn', 'redeem', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 font-bold text-[13px] capitalize transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-[#2874f0] text-[#2874f0]'
                    : 'border-transparent text-[#878787] hover:text-[#212121]'
                }`}
              >
                {tab === 'overview' ? 'Overview' : tab === 'earn' ? 'Earn' : tab === 'redeem' ? 'Redeem' : 'History'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'earn'     && <EarnTab />}
          {activeTab === 'redeem'   && <RedeemTab />}
          {activeTab === 'history'  && <HistoryTab />}

        </div>
      </div>
    </MainLayout>
  );
};

export default Rewards;
