import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { 
  FaUsers, FaBoxOpen, FaStore, FaShoppingCart, 
  FaMoneyBillWave, FaSearch, FaEdit, FaTrash, 
  FaSignOutAlt, FaTachometerAlt, FaList, FaUsersCog
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { 
    isAdminAuthenticated, 
    adminData, 
    stats, 
    logoutAdmin,
    getAllSellers,
    getAllProducts,
    deleteProduct,
    updateProduct,
    deleteSeller
  } = useAdmin();
  
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/auth');
    }
  }, [isAdminAuthenticated, navigate]);
  
  // Load sellers and products
  useEffect(() => {
    if (isAdminAuthenticated) {
      loadSellers();
      loadProducts();
    }
  }, [isAdminAuthenticated]);
  
  const loadSellers = async () => {
    const result = await getAllSellers();
    if (result.success) {
      setSellers(result.sellers);
    }
  };
  
  const loadProducts = async () => {
    const result = await getAllProducts();
    if (result.success) {
      setProducts(result.products);
    }
  };
  
  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };
  
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(productId);
      if (result.success) {
        setSuccess('Product deleted successfully');
        loadProducts(); // Refresh products
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError(result.error || 'Failed to delete product');
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    }
  };
  
  const handleDeleteSeller = async (sellerId) => {
    if (window.confirm('Are you sure you want to delete this seller? This will also delete all their products.')) {
      const result = await deleteSeller(sellerId);
      if (result.success) {
        setSuccess('Seller deleted successfully');
        loadSellers(); // Refresh sellers
        loadProducts(); // Refresh products
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError(result.error || 'Failed to delete seller');
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    }
  };
  
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      category: product.category || '',
      stock: product.stock.toString()
    });
  };
  
  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    if (!productFormData.name || !productFormData.price || !productFormData.stock) {
      setError('Name, price, and stock are required');
      return;
    }
    
    // Create updated product object
    const updatedProduct = {
      ...editingProduct,
      name: productFormData.name,
      price: parseFloat(productFormData.price),
      description: productFormData.description,
      category: productFormData.category,
      stock: parseInt(productFormData.stock),
      inStock: parseInt(productFormData.stock) > 0
    };
    
    // Update product
    const result = await updateProduct(editingProduct.id || editingProduct._id, updatedProduct);
    
    if (result.success) {
      setSuccess('Product updated successfully');
      loadProducts(); // Refresh products
      setEditingProduct(null); // Close edit form
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } else {
      setError(result.error || 'Failed to update product');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };
  
  const cancelEdit = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: ''
    });
  };
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower)) ||
      (product.category && product.category.toLowerCase().includes(searchLower))
    );
  });
  
  // Format price
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };
  
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        
        <div className="admin-sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaTachometerAlt /> Dashboard
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <FaBoxOpen /> Products
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'sellers' ? 'active' : ''}`}
            onClick={() => setActiveTab('sellers')}
          >
            <FaUsersCog /> Sellers
          </button>
          
          <button className="menu-item logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="admin-content">
        <div className="admin-header">
          <h1>
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'products' && 'Product Management'}
            {activeTab === 'sellers' && 'Seller Management'}
          </h1>
          <div className="admin-user">
            <span>Welcome, {adminData?.name || 'Admin'}</span>
          </div>
        </div>
        
        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon seller-icon">
                  <FaStore />
                </div>
                <div className="stat-details">
                  <h3>Total Sellers</h3>
                  <p className="stat-value">{stats.totalSellers}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon product-icon">
                  <FaBoxOpen />
                </div>
                <div className="stat-details">
                  <h3>Total Products</h3>
                  <p className="stat-value">{stats.totalProducts}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon user-icon">
                  <FaUsers />
                </div>
                <div className="stat-details">
                  <h3>Total Users</h3>
                  <p className="stat-value">{stats.totalUsers}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon order-icon">
                  <FaShoppingCart />
                </div>
                <div className="stat-details">
                  <h3>Total Orders</h3>
                  <p className="stat-value">{stats.totalOrders}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon revenue-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="stat-details">
                  <h3>Total Revenue</h3>
                  <p className="stat-value">₹{stats.revenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="recent-section">
              <h2>Recent Products</h2>
              {products.length === 0 ? (
                <p className="no-data">No products available</p>
              ) : (
                <div className="recent-list">
                  {products.slice(0, 5).map(product => (
                    <div key={product.id || product._id} className="recent-item">
                      <div className="recent-item-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="recent-item-details">
                        <h3>{product.name}</h3>
                        <p>{formatPrice(product.price)}</p>
                        <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="products-content">
            <div className="products-header">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            {editingProduct && (
              <div className="edit-product-form">
                <h2>Edit Product</h2>
                <form onSubmit={handleUpdateProduct}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Product Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={productFormData.name}
                        onChange={handleProductFormChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="price">Price</label>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={productFormData.price}
                        onChange={handleProductFormChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={productFormData.category}
                        onChange={handleProductFormChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="stock">Stock</label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={productFormData.stock}
                        onChange={handleProductFormChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={productFormData.description}
                      onChange={handleProductFormChange}
                      rows="4"
                    ></textarea>
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={cancelEdit}>
                      Cancel
                    </button>
                    <button type="submit" className="save-button">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {filteredProducts.length === 0 ? (
              <p className="no-data">No products found</p>
            ) : (
              <div className="products-table-container">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id || product._id}>
                        <td>
                          <div className="product-image">
                            <img src={product.image} alt={product.name} />
                          </div>
                        </td>
                        <td>{product.name}</td>
                        <td>{formatPrice(product.price)}</td>
                        <td>{product.category || 'N/A'}</td>
                        <td>{product.stock}</td>
                        <td>
                          <span className={`status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="edit-button"
                              onClick={() => handleEditProduct(product)}
                              title="Edit Product"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="delete-button"
                              onClick={() => handleDeleteProduct(product.id || product._id)}
                              title="Delete Product"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Sellers Tab */}
        {activeTab === 'sellers' && (
          <div className="sellers-content">
            {sellers.length === 0 ? (
              <p className="no-data">No sellers found</p>
            ) : (
              <div className="sellers-table-container">
                <table className="sellers-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Store Name</th>
                      <th>Products</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.map(seller => (
                      <tr key={seller.id}>
                        <td>{seller.name}</td>
                        <td>{seller.email}</td>
                        <td>{seller.storeName || 'N/A'}</td>
                        <td>
                          {products.filter(p => p.sellerId === seller.id).length}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="delete-button"
                              onClick={() => handleDeleteSeller(seller.id)}
                              title="Delete Seller"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 