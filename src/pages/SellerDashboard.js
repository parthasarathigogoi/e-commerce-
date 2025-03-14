import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaUpload, FaImage, FaCheck, FaTimes, FaSignOutAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useSeller } from '../context/SellerContext';
import { useNavigate } from 'react-router-dom';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { isSellerAuthenticated, sellerData, getSellerProducts, addProduct, updateProduct, deleteProduct, sellerProducts, logoutSeller } = useSeller();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    image: null,
    imagePreview: null,
    isNew: false,
    isTrending: false,
    discount: '0'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Handle seller logout
  const handleLogout = () => {
    logoutSeller();
    navigate('/');
  };

  // Component did mount - check authentication
  useEffect(() => {
    // Check if user is logged in but not as a seller
    const userToken = localStorage.getItem('token');
    const sellerToken = localStorage.getItem('sellerToken');
    
    if (userToken && !sellerToken) {
      // User is logged in as a regular user, redirect to home
      navigate('/');
      return;
    }
    
    if (!isSellerAuthenticated) {
      // Not authenticated as a seller, redirect to seller login
      navigate('/seller/login');
      return;
    }
    
    // Load products if authenticated
    loadProducts();
  }, [isSellerAuthenticated, navigate]);

  // Function to load products
  const loadProducts = async () => {
    setLoading(true);
    try {
      // Check if seller is authenticated before loading products
      if (!isSellerAuthenticated) {
        setLoading(false);
        return;
      }
      
      // Get products from context first
      const result = await getSellerProducts();
      
      if (result.success && Array.isArray(result.products)) {
        setProducts(result.products);
      } else {
        // Fallback to localStorage if context method fails
        const storedProducts = localStorage.getItem('sellerProducts');
        if (storedProducts) {
          const parsedProducts = JSON.parse(storedProducts);
          if (Array.isArray(parsedProducts)) {
            setProducts(parsedProducts);
          } else {
            setProducts([]);
          }
        } else {
          setProducts([]);
        }
      }
      setError('');
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Use sellerProducts from context when it changes
  useEffect(() => {
    if (Array.isArray(sellerProducts)) {
      setProducts(sellerProducts);
    }
  }, [sellerProducts]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            image: file,
            imagePreview: reader.result
          }));
        };
        reader.readAsDataURL(file);
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'price' || name === 'stock' || name === 'discount') {
      // Only allow numbers for price, stock, and discount
      const numValue = value.replace(/[^0-9.]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      image: null,
      imagePreview: null,
      isNew: false,
      isTrending: false,
      discount: '0'
    });
    setError('');
    setSuccess('');
    setIsAddingProduct(false);
    setIsEditingProduct(false);
    setCurrentProduct(null);
  };

  // Handle add product form submission
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.name || !formData.price || !formData.description || !formData.category || !formData.stock) {
      setError('All fields are required');
      return;
    }

    // Validate stock is a positive number
    const stockQuantity = parseInt(formData.stock);
    if (isNaN(stockQuantity) || stockQuantity < 0) {
      setError('Stock quantity must be a positive number');
      return;
    }

    try {
      // Create new product object
      const newProduct = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        stock: stockQuantity,
        image: formData.imagePreview || '/images/placeholder.jpg', // Use placeholder if no image
        isNew: formData.isNew,
        isTrending: formData.isTrending,
        discount: parseInt(formData.discount) || 0,
        inStock: stockQuantity > 0 // Explicitly set inStock based on stock quantity
      };

      console.log('Submitting new product:', newProduct);

      // Add product
      const result = await addProduct(newProduct);
      
      if (result.success) {
        console.log('Product added successfully:', result.product);
        
        // Reset form fields but stay in add product mode
        setFormData({
          name: '',
          price: '',
          description: '',
          category: '',
          stock: '',
          image: null,
          imagePreview: null,
          isNew: false,
          isTrending: false,
          discount: '0'
        });
        
        // Refresh products list to ensure we have the latest data
        loadProducts();
        
        setSuccess('Product added successfully! You can add another product or go back.');
        
        // Show success message for 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        console.error('Failed to add product:', result.error);
        setError(result.error || 'Failed to add product');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product');
    }
  };

  // Handle edit product
  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      category: product.category || '',
      stock: product.stock.toString(),
      image: null,
      imagePreview: product.image,
      isNew: product.isNew || false,
      isTrending: product.isTrending || false,
      discount: (product.discount || 0).toString()
    });
    setIsEditingProduct(true);
  };

  // Handle update product form submission
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.name || !formData.price || !formData.description || !formData.category || !formData.stock) {
      setError('All fields are required');
      return;
    }

    // Validate stock is a positive number
    const stockQuantity = parseInt(formData.stock);
    if (isNaN(stockQuantity) || stockQuantity < 0) {
      setError('Stock quantity must be a positive number');
      return;
    }

    try {
      // Create updated product object
      const updatedProduct = {
        ...currentProduct,
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        stock: stockQuantity,
        image: formData.imagePreview || currentProduct.image,
        isNew: formData.isNew,
        isTrending: formData.isTrending,
        discount: parseInt(formData.discount) || 0,
        inStock: stockQuantity > 0 // Explicitly set inStock based on stock quantity
      };

      console.log('Updating product:', updatedProduct);

      // Update product
      const result = await updateProduct(currentProduct.id, updatedProduct);
      
      if (result.success) {
        console.log('Product updated successfully');
        setSuccess('Product updated successfully');
        
        // Refresh products list to ensure we have the latest data
        loadProducts();
        
        resetForm();
        setIsEditingProduct(false);
      } else {
        console.error('Failed to update product:', result.error);
        setError(result.error || 'Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
    }
  };

  // Handle delete product
  const handleDeleteClick = (product) => {
    console.log('Delete clicked for product:', product.name, 'ID:', product.id || product._id);
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Confirm delete product
  const confirmDelete = async () => {
    if (!productToDelete) {
      console.error('No product to delete');
      setShowDeleteModal(false);
      return;
    }
    
    try {
      // Get the product ID, handling both id and _id properties
      const productId = productToDelete.id || productToDelete._id;
      
      console.log('Confirming delete for product:', productId);
      
      if (!productId) {
        setError('Invalid product ID');
        setShowDeleteModal(false);
        setProductToDelete(null);
        return;
      }
      
      // Call the delete function from context
      const result = deleteProduct(productId);
      
      if (result.success) {
        console.log('Delete successful, updating UI');
        
        // Update the local products state to reflect the deletion
        setProducts(prevProducts => {
          return prevProducts.filter(product => 
            (product.id !== productId) && (product._id !== productId)
          );
        });
        
        // Refresh products from localStorage to ensure consistency
        loadProducts();
        
        setSuccess('Product deleted successfully');
        
        // Show success message for 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        console.error('Delete failed:', result.error);
        setError(result.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Format price
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  // Trigger file input click
  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  // Remove image
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  // Categories options - limited to specified categories only
  const categories = [
    'Watches',
    'Clothing',
    'Perfumes',
    'Belts'
  ];

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <h1>Seller Dashboard</h1>
        <p>Welcome, {sellerData?.storeName || 'Seller'}</p>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
      
      {error && <div className="dashboard-error">{error}</div>}
      {success && <div className="dashboard-success">{success}</div>}
      
      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <>
          {!isAddingProduct && !isEditingProduct && (
            <div className="dashboard-actions">
              <button className="add-product-btn" onClick={() => setIsAddingProduct(true)}>
                <FaPlus /> Add New Product
              </button>
            </div>
          )}
          
          {isAddingProduct && (
            <div className="product-form-container">
              <div className="form-header">
                <h2>Add New Product</h2>
                <button className="back-btn" onClick={resetForm}>
                  <FaArrowLeft /> Back
                </button>
              </div>
              
              <form className="product-form" onSubmit={handleAddProduct}>
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price (₹) *</label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="stock">Stock Quantity *</label>
                    <input
                      type="text"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="Enter stock quantity"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="discount">Discount (%)</label>
                    <input
                      type="text"
                      id="discount"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      placeholder="Enter discount percentage"
                    />
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="isNew"
                        name="isNew"
                        checked={formData.isNew}
                        onChange={handleChange}
                      />
                      <label htmlFor="isNew">Mark as New</label>
                    </div>
                    
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="isTrending"
                        name="isTrending"
                        checked={formData.isTrending}
                        onChange={handleChange}
                      />
                      <label htmlFor="isTrending">Mark as Trending</label>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Product Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    
                    {formData.imagePreview ? (
                      <div className="image-preview-container">
                        <img
                          src={formData.imagePreview}
                          alt="Product preview"
                          className="image-preview"
                        />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={handleRemoveImage}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="image-upload-btn"
                        onClick={handleImageButtonClick}
                      >
                        <FaUpload /> Upload Image
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    <FaPlus /> Add Product
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {isEditingProduct && currentProduct && (
            <div className="product-form-container">
              <div className="form-header">
                <h2>Edit Product</h2>
                <button className="back-btn" onClick={resetForm}>
                  <FaArrowLeft /> Back
                </button>
              </div>
              
              <form className="product-form" onSubmit={handleUpdateProduct}>
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price (₹) *</label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="stock">Stock Quantity *</label>
                    <input
                      type="text"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="Enter stock quantity"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="discount">Discount (%)</label>
                    <input
                      type="text"
                      id="discount"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      placeholder="Enter discount percentage"
                    />
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="isNew"
                        name="isNew"
                        checked={formData.isNew}
                        onChange={handleChange}
                      />
                      <label htmlFor="isNew">Mark as New</label>
                    </div>
                    
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="isTrending"
                        name="isTrending"
                        checked={formData.isTrending}
                        onChange={handleChange}
                      />
                      <label htmlFor="isTrending">Mark as Trending</label>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Product Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    
                    {formData.imagePreview ? (
                      <div className="image-preview-container">
                        <img
                          src={formData.imagePreview}
                          alt="Product preview"
                          className="image-preview"
                        />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={handleRemoveImage}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="image-upload-btn"
                        onClick={handleImageButtonClick}
                      >
                        <FaUpload /> Upload Image
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    <FaCheck /> Update Product
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {!isAddingProduct && !isEditingProduct && (
            <div className="products-section">
              <h2>Your Products</h2>
              
              {products.length === 0 ? (
                <div className="no-products">
                  <p>You don't have any products yet.</p>
                  <button className="add-product-btn" onClick={() => setIsAddingProduct(true)}>
                    <FaPlus /> Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="products-table-container">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th width="70">Image</th>
                        <th>Name</th>
                        <th width="100">Price</th>
                        <th width="120">Category</th>
                        <th width="70">Stock</th>
                        <th width="100">Status</th>
                        <th width="170">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id || product._id}>
                          <td>
                            <div className="product-image">
                              {product.image ? (
                                <img src={product.image} alt={product.name} />
                              ) : (
                                <div className="no-image">
                                  <FaImage />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="product-name-cell">{product.name}</td>
                          <td>{formatPrice(product.price)}</td>
                          <td>{product.category || 'N/A'}</td>
                          <td>{product.stock}</td>
                          <td>
                            <span className={`status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td>
                            <div className="product-actions">
                              <button
                                className="edit-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClick(product);
                                }}
                                title="Edit Product"
                              >
                                <FaEdit /> <span>Edit</span>
                              </button>
                              <button
                                className="delete-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(product);
                                }}
                                title="Delete Product"
                              >
                                <FaTrash /> <span>Delete</span>
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
          
          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="modal-overlay">
              <div className="modal-container">
                <div className="modal-header">
                  <h3>Confirm Delete</h3>
                </div>
                <div className="modal-body">
                  <div className="warning-icon">
                    <FaExclamationTriangle />
                  </div>
                  <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>?</p>
                  <p className="warning-text">This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={cancelDelete}>
                    Cancel
                  </button>
                  <button className="delete-confirm-btn" onClick={confirmDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SellerDashboard; 