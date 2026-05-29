import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import api from '../services/api';

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setUpdateError(null);
      await api.put(`/api/products/${id}`, {
        name,
        price,
        image,
        category,
        countInStock,
        description,
      });
      navigate('/admin');
    } catch (err) {
      setUpdateError(err.response?.data?.message || err.message);
    }
  };

  return (
    <MainLayout>
      <div className="container" style={{ margin: '3rem auto', maxWidth: '600px' }}>
        <Link to="/admin" style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'inline-block' }}>&larr; Back to Admin Dashboard</Link>
        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Edit Product</h2>
          
          {loading ? <Loader /> : error ? (
            <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '0.5rem' }}>{error}</div>
          ) : (
            <form onSubmit={submitHandler}>
              {updateError && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{updateError}</div>}
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
                <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              
              <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Price ($)</label>
                  <input type="number" step="0.01" className="input" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Count In Stock</label>
                  <input type="number" className="input" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Image URL</label>
                <input type="text" className="input" value={image} onChange={(e) => setImage(e.target.value)} required />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
                <input type="text" className="input" value={category} onChange={(e) => setCategory(e.target.value)} required />
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                <textarea className="input" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
              </div>

              <button type="submit" className="btn" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}>Update Product</button>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminProductEdit;
