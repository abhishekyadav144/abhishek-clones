import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-card)', padding: '4rem 0 2rem', marginTop: '4rem', borderTop: '1px solid var(--border-color)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Abhishek Front</h3>
          <p>Your one-stop shop for everything modern and awesome.</p>
        </div>
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/">Home</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Customer Service</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/helpcenter">Contact Us</Link>
            <Link to="/helpcenter">Returns Policy</Link>
            <Link to="/helpcenter">FAQ</Link>
          </div>
        </div>
      </div>
      <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
        <p>&copy; {new Date().getFullYear()} Abhishek Front. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
