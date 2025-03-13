import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaHeart, FaEye, FaFilter, FaSort } from 'react-icons/fa';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All',
    sort: '',
    minPrice: '',
    maxPrice: ''
  });

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      let url = '/api/products?';
      if (filters.category !== 'All') {
        url += `category=${filters.category}&`;
      }
      if (filters.sort) {
        url += `sort=${filters.sort}&`;
      }
      if (filters.minPrice) {
        url += `minPrice=${filters.minPrice}&`;
      }
      if (filters.maxPrice) {
        url += `maxPrice=${filters.maxPrice}&`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="shop-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1 className="shop-title elegant-font">Shop Collection</h1>
        <p className="shop-subtitle">Discover our curated selection of premium products</p>
      </div>

      <div className="shop-controls">
        <button 
          className="filter-toggle"
        >
          <FaFilter /> Filters
        </button>

        <div className="sort-container">
          <FaSort />
          <select 
            value={filters.sort} 
            onChange={handleFilterChange}
            className="sort-select"
          >
            <option value="">Sort By</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Most Popular">Most Popular</option>
            <option value="Highest Rated">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="shop-layout">
        <aside className="shop-filters">
          <div className="filter-section">
            <h3>Categories</h3>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="category-filter"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home</option>
              <option value="Beauty">Beauty</option>
              <option value="Groceries">Groceries</option>
            </select>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min Price"
                className="price-input"
              />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max Price"
                className="price-input"
              />
            </div>
          </div>
        </aside>

        <div className="products-grid">
          {products.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-actions">
                    <button className="action-button wishlist-button">
                      <FaHeart />
                    </button>
                    <button 
                      className="action-button cart-button"
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                    >
                      <FaShoppingCart />
                    </button>
                    <button className="action-button view-button">
                      <FaEye />
                    </button>
                  </div>
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  <div className="product-rating">
                    <span className="stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
                    <span className="reviews">({product.reviews})</span>
                  </div>
                  <p className="product-description">{product.description}</p>
                  {!product.inStock && <span className="out-of-stock">Out of Stock</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop; 