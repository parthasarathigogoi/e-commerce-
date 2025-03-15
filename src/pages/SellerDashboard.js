import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaUpload, FaImage, FaCheck, FaTimes, FaSignOutAlt, FaExclamationTriangle, FaChartLine, FaBoxOpen, FaUser, FaTachometerAlt, FaShoppingBag, FaTag, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSeller } from '../context/SellerContext';
import './SellerDashboard.css';
import SellerStatistics from '../components/seller/SellerStatistics';
import InventoryManagement from '../components/seller/InventoryManagement';

const SellerDashboard = () => {
  const { 
    isSellerAuthenticated, 
    sellerInfo, 
    sellerProducts, 
    handleSellerLogout,
    loadSellerProducts,
    deleteProduct,
    loading,
    error 
  } = useSeller();
  
  const [activeTab, setActiveTab] = useState('products');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Load seller products from the SellerContext
        if (isSellerAuthenticated) {
          await loadSellerProducts();
        }
      } catch (err) {
        console.error('Error loading seller data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isSellerAuthenticated, loadSellerProducts]);

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct.id);
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const stats = [
    { name: 'Total Products', value: sellerProducts?.length || 0, icon: <FaBoxOpen /> },
    { name: 'Active Listings', value: sellerProducts?.filter(p => p.stock > 0)?.length || 0, icon: <FaTag /> },
    { name: 'Out of Stock', value: sellerProducts?.filter(p => p.stock === 0)?.length || 0, icon: <FaShoppingBag /> },
    { name: 'Total Sales', value: '$0', icon: <FaChartLine /> }, // This would be calculated from orders in a real app
  ];

  if (!isSellerAuthenticated) {
    return (
      <div className="seller-dashboard">
        <div className="dashboard-section">
          <div className="no-products">
            <h2>Please login as a seller to view dashboard</h2>
            <p>You need to be logged in as a seller to access this page</p>
            <Link to="/" className="add-first-product">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-sidebar">
        <div className="seller-profile">
          <div className="seller-avatar">
            <FaUser />
          </div>
          <div className="seller-info">
            <h3>{sellerInfo?.shopName || 'My Shop'}</h3>
            <p>{sellerInfo?.email || 'seller@example.com'}</p>
          </div>
        </div>
        
        <div className="dashboard-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaTachometerAlt /> Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <FaBoxOpen /> Products
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> Settings
          </button>
          <button className="nav-item logout" onClick={handleSellerLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        
        {activeTab === 'dashboard' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Dashboard Overview</h2>
            </div>
            
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div className="stat-card" key={index}>
                  <h3>{stat.name}</h3>
                  <p className="stat-value">{stat.value}</p>
                </div>
              ))}
            </div>
            
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <p>No recent activity to display.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'products' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Products</h2>
              <Link to="/add-product" className="add-product-btn">
                <FaPlus /> Add Product
              </Link>
            </div>
            
            {sellerProducts && sellerProducts.length > 0 ? (
              <div className="products-table-container">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="product-image-cell">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="product-thumbnail" 
                            />
                          ) : (
                            <div className="product-thumbnail">No image</div>
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>
                          {product.stock > 0 ? (
                            <span className="status-badge in-stock">In Stock</span>
                          ) : (
                            <span className="status-badge out-of-stock">Out of Stock</span>
                          )}
                        </td>
                        <td className="actions-cell">
                          <Link to={`/edit-product/${product.id}`} className="action-btn edit">
                            <FaEdit />
                          </Link>
                          <button 
                            className="action-btn delete" 
                            onClick={() => handleDeleteClick(product)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-products">
                <p>You don't have any products yet.</p>
                <Link to="/add-product" className="add-first-product">
                  <FaPlus /> Add Your First Product
                </Link>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Account Settings</h2>
            </div>
            <div className="form-container">
              <h3>Shop Information</h3>
              <div className="form-group">
                <label>Shop Name</label>
                <input 
                  type="text" 
                  value={sellerInfo?.shopName || ''} 
                  readOnly 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={sellerInfo?.email || ''} 
                    readOnly 
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="text" 
                    value={sellerInfo?.phone || ''} 
                    readOnly 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {deleteModalOpen && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Delete Product</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete "{selectedProduct.name}"?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn" 
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-confirm-btn" 
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard; 