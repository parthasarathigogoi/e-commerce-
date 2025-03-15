import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaArrowUp, FaArrowDown, FaSearch, FaFilter, FaBoxOpen, FaBox } from 'react-icons/fa';
import './InventoryManagement.css';

const InventoryManagement = ({ products, onUpdateStock }) => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newStockValue, setNewStockValue] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  // Process products into inventory items
  useEffect(() => {
    if (products && products.length > 0) {
      const processedInventory = products.map(product => ({
        id: product.id || product._id,
        name: product.name,
        sku: product.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
        category: product.category || 'Uncategorized',
        stock: parseInt(product.stock) || 0,
        price: parseFloat(product.price) || 0,
        lastUpdated: product.updatedAt || new Date().toISOString(),
        isLowStock: (parseInt(product.stock) || 0) <= lowStockThreshold,
        image: product.image
      }));
      
      setInventory(processedInventory);
    }
  }, [products, lowStockThreshold]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Handle stock update
  const handleStockUpdate = (id) => {
    if (newStockValue === '' || isNaN(parseInt(newStockValue))) {
      return;
    }
    
    const updatedStock = parseInt(newStockValue);
    
    // Call the parent component's update function
    if (onUpdateStock) {
      onUpdateStock(id, updatedStock);
    }
    
    // Update local state
    setInventory(inventory.map(item => {
      if (item.id === id) {
        return {
          ...item,
          stock: updatedStock,
          lastUpdated: new Date().toISOString(),
          isLowStock: updatedStock <= lowStockThreshold
        };
      }
      return item;
    }));
    
    // Reset editing state
    setEditingProduct(null);
    setNewStockValue('');
  };

  // Start editing a product's stock
  const startEditing = (product) => {
    setEditingProduct(product.id);
    setNewStockValue(product.stock.toString());
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingProduct(null);
    setNewStockValue('');
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Filter and sort inventory
  const filteredInventory = inventory
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterLowStock) {
        return matchesSearch && item.isLowStock;
      }
      
      return matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'stock') {
        comparison = a.stock - b.stock;
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (sortBy === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (sortBy === 'lastUpdated') {
        comparison = new Date(a.lastUpdated) - new Date(b.lastUpdated);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Count low stock items
  const lowStockCount = inventory.filter(item => item.isLowStock).length;

  return (
    <div className="inventory-management">
      <div className="inventory-header">
        <h2><FaBoxOpen /> Inventory Management</h2>
        <div className="inventory-summary">
          <div className="summary-item">
            <span className="summary-label">Total Products:</span>
            <span className="summary-value">{inventory.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Low Stock Items:</span>
            <span className={`summary-value ${lowStockCount > 0 ? 'warning' : ''}`}>
              {lowStockCount}
            </span>
          </div>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="search-container">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-container">
          <label className="filter-label">
            <input
              type="checkbox"
              checked={filterLowStock}
              onChange={() => setFilterLowStock(!filterLowStock)}
            />
            <span>Show Low Stock Only</span>
          </label>
          
          <div className="threshold-container">
            <span>Low Stock Threshold:</span>
            <input
              type="number"
              min="1"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 1)}
              className="threshold-input"
            />
          </div>
        </div>
      </div>

      {filteredInventory.length === 0 ? (
        <div className="no-inventory">
          <FaBox />
          <p>No inventory items found matching your criteria.</p>
        </div>
      ) : (
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th className="image-column">Image</th>
                <th 
                  className={`sortable ${sortBy === 'name' ? 'sorted' : ''}`}
                  onClick={() => handleSort('name')}
                >
                  Product Name
                  {sortBy === 'name' && (
                    <span className="sort-icon">
                      {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
                    </span>
                  )}
                </th>
                <th>SKU</th>
                <th 
                  className={`sortable ${sortBy === 'category' ? 'sorted' : ''}`}
                  onClick={() => handleSort('category')}
                >
                  Category
                  {sortBy === 'category' && (
                    <span className="sort-icon">
                      {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
                    </span>
                  )}
                </th>
                <th 
                  className={`sortable ${sortBy === 'stock' ? 'sorted' : ''}`}
                  onClick={() => handleSort('stock')}
                >
                  Stock
                  {sortBy === 'stock' && (
                    <span className="sort-icon">
                      {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
                    </span>
                  )}
                </th>
                <th 
                  className={`sortable ${sortBy === 'price' ? 'sorted' : ''}`}
                  onClick={() => handleSort('price')}
                >
                  Price
                  {sortBy === 'price' && (
                    <span className="sort-icon">
                      {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
                    </span>
                  )}
                </th>
                <th 
                  className={`sortable ${sortBy === 'lastUpdated' ? 'sorted' : ''}`}
                  onClick={() => handleSort('lastUpdated')}
                >
                  Last Updated
                  {sortBy === 'lastUpdated' && (
                    <span className="sort-icon">
                      {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
                    </span>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(item => (
                <tr key={item.id} className={item.isLowStock ? 'low-stock-row' : ''}>
                  <td>
                    <div className="inventory-product-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="no-image">
                          <FaBox />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.sku}</td>
                  <td>{item.category}</td>
                  <td className={item.isLowStock ? 'low-stock' : ''}>
                    {editingProduct === item.id ? (
                      <div className="stock-edit">
                        <input
                          type="number"
                          min="0"
                          value={newStockValue}
                          onChange={(e) => setNewStockValue(e.target.value)}
                          className="stock-input"
                        />
                        <div className="stock-actions">
                          <button 
                            className="save-btn" 
                            onClick={() => handleStockUpdate(item.id)}
                            title="Save"
                          >
                            ✓
                          </button>
                          <button 
                            className="cancel-btn" 
                            onClick={cancelEditing}
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="stock-display">
                        <span>{item.stock}</span>
                        {item.isLowStock && (
                          <span className="low-stock-icon" title="Low Stock">
                            <FaExclamationTriangle />
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{formatDate(item.lastUpdated)}</td>
                  <td>
                    <button 
                      className="update-stock-btn"
                      onClick={() => startEditing(item)}
                      disabled={editingProduct === item.id}
                    >
                      Update Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement; 