import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import api from '../services/api';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/products');
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        const { data } = await api.post('/api/products', {});
        navigate(`/admin/product/${data._id}/edit`);
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${id}`);
        fetchProducts(); // refresh the list
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <MainLayout>
      <div className="container" style={{ margin: '3rem auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Admin Dashboard</h1>
          <button className="btn" onClick={createProductHandler}>+ Create Product</button>
        </div>
        
        {loading ? <Loader /> : error ? (
          <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1.5rem', borderRadius: '0.5rem' }}>{error}</div>
        ) : (
          <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem' }}>ID</th>
                  <th style={{ padding: '1rem' }}>Product Name</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Price</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>{product._id}</td>
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      {product.name}
                    </td>
                    <td style={{ padding: '1rem' }}>{product.category}</td>
                    <td style={{ padding: '1rem' }}>${product.price.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>
                      <Link to={`/admin/product/${product._id}/edit`} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', marginRight: '0.5rem', fontSize: '0.8rem', display: 'inline-block', textDecoration: 'none' }}>
                        Edit
                      </Link>
                      <button onClick={() => deleteHandler(product._id)} className="btn" style={{ padding: '0.25rem 0.75rem', background: '#EF4444', fontSize: '0.8rem' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Admin;
