import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaHeart, FaStar, FaStarHalfAlt, FaRegStar, FaCheck, FaShippingFast, FaShieldAlt, FaInfoCircle, FaTag } from 'react-icons/fa';
import { useSeller } from '../context/SellerContext';
import './ProductDetail.css';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getSellerProducts } = useSeller();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [recommendations, setRecommendations] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Get all products
        const result = getSellerProducts();
        if (result.success && Array.isArray(result.products)) {
          // Find the specific product
          const foundProduct = result.products.find(p => p.id === productId);
          if (foundProduct) {
            setProduct(foundProduct);
            
            // Get recommendations (products in the same category)
            const similarProducts = result.products
              .filter(p => p.category === foundProduct.category && p.id !== productId)
              .slice(0, 4); // Limit to 4 recommendations
            
            setRecommendations(similarProducts);
          } else {
            setError('Product not found');
          }
        } else {
          setError('Failed to load product');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId, getSellerProducts]);

  const handleAddToCart = () => {
    // Add to cart functionality would go here
    console.log(`Added ${quantity} of ${product.name} to cart`);
    // Show success message or redirect to cart
  };

  const handleBuyNow = () => {
    // Buy now functionality would go here
    console.log(`Buying ${quantity} of ${product.name}`);
    // Redirect to checkout
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star-filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star-half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star-empty" />);
      }
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-loading">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-error">
          <FaInfoCircle />
          <p>{error || 'Product not found'}</p>
          <button onClick={() => navigate('/shop')} className="back-to-shop-btn">
            <FaArrowLeft /> Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-breadcrumb">
        <Link to="/shop">Shop</Link> / 
        <Link to={`/categories/${product.category.toLowerCase()}`}>{product.category}</Link> / 
        <span>{product.name}</span>
      </div>
      
      <div className="product-detail-content">
        <div className="product-detail-left">
          <button onClick={() => navigate(-1)} className="back-btn">
            <FaArrowLeft /> Back
          </button>
          
          <div className="product-image-container">
            {product.image ? (
              <img src={product.image} alt={product.name} className="product-detail-image" />
            ) : (
              <div className="product-detail-no-image">
                <p>No image available</p>
              </div>
            )}
          </div>
          
          <div className="product-thumbnails">
            {/* Thumbnails would go here in a real implementation */}
            <div className="thumbnail active">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="no-thumbnail"></div>
              )}
            </div>
            {/* Additional thumbnails would be added here */}
          </div>
        </div>
        
        <div className="product-detail-right">
          <h1 className="product-detail-name">{product.name}</h1>
          
          <div className="product-detail-meta">
            <div className="product-detail-rating">
              {renderRatingStars(4.5)}
              <span className="rating-count">(24 reviews)</span>
            </div>
            <div className="product-detail-id">
              <span>Product ID: {product.id}</span>
            </div>
          </div>
          
          <div className="product-detail-price">
            <span className="current-price">${product.price.toFixed(2)}</span>
            <span className="original-price">${(product.price * 1.2).toFixed(2)}</span>
            <span className="discount-badge">20% OFF</span>
          </div>
          
          <div className="product-detail-availability">
            <span className={`availability-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {product.inStock ? (
                <>
                  <FaCheck /> In Stock ({product.stock} available)
                </>
              ) : (
                'Out of Stock'
              )}
            </span>
          </div>
          
          <div className="product-detail-shipping">
            <FaShippingFast />
            <span>Free shipping</span>
          </div>
          
          <div className="product-detail-actions">
            <div className="quantity-selector">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stock}
              />
              <button 
                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            
            <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={!product.inStock}>
              <FaShoppingCart /> Add to Cart
            </button>
            
            <button className="buy-now-btn" onClick={handleBuyNow} disabled={!product.inStock}>
              Buy Now
            </button>
            
            <button className="wishlist-btn">
              <FaHeart /> Add to Wishlist
            </button>
          </div>
          
          <div className="product-detail-guarantee">
            <div className="guarantee-item">
              <FaShieldAlt />
              <span>30-Day Money-Back Guarantee</span>
            </div>
            <div className="guarantee-item">
              <FaShippingFast />
              <span>Fast Delivery</span>
            </div>
            <div className="guarantee-item">
              <FaTag />
              <span>Authentic Products</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="product-detail-tabs">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
          <button 
            className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping & Returns
          </button>
        </div>
        
        <div className="tabs-content">
          {activeTab === 'description' && (
            <div className="tab-content description-content">
              <h3>Product Description</h3>
              <p>{product.description}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
              <ul>
                <li>High-quality materials</li>
                <li>Durable construction</li>
                <li>Elegant design</li>
                <li>Perfect for everyday use</li>
              </ul>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div className="tab-content specifications-content">
              <h3>Product Specifications</h3>
              <table className="specifications-table">
                <tbody>
                  <tr>
                    <td>Brand</td>
                    <td>Elegant</td>
                  </tr>
                  <tr>
                    <td>Model</td>
                    <td>{product.name}</td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td>{product.category}</td>
                  </tr>
                  <tr>
                    <td>Material</td>
                    <td>Premium Quality</td>
                  </tr>
                  <tr>
                    <td>Weight</td>
                    <td>0.5 kg</td>
                  </tr>
                  <tr>
                    <td>Dimensions</td>
                    <td>30 x 20 x 10 cm</td>
                  </tr>
                  <tr>
                    <td>Warranty</td>
                    <td>1 Year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="tab-content reviews-content">
              <h3>Customer Reviews</h3>
              <div className="reviews-summary">
                <div className="average-rating">
                  <span className="rating-number">4.5</span>
                  <div className="rating-stars">
                    {renderRatingStars(4.5)}
                  </div>
                  <span className="total-reviews">Based on 24 reviews</span>
                </div>
                <div className="rating-bars">
                  <div className="rating-bar">
                    <span>5 Stars</span>
                    <div className="bar-container">
                      <div className="bar" style={{ width: '70%' }}></div>
                    </div>
                    <span>70%</span>
                  </div>
                  <div className="rating-bar">
                    <span>4 Stars</span>
                    <div className="bar-container">
                      <div className="bar" style={{ width: '20%' }}></div>
                    </div>
                    <span>20%</span>
                  </div>
                  <div className="rating-bar">
                    <span>3 Stars</span>
                    <div className="bar-container">
                      <div className="bar" style={{ width: '5%' }}></div>
                    </div>
                    <span>5%</span>
                  </div>
                  <div className="rating-bar">
                    <span>2 Stars</span>
                    <div className="bar-container">
                      <div className="bar" style={{ width: '3%' }}></div>
                    </div>
                    <span>3%</span>
                  </div>
                  <div className="rating-bar">
                    <span>1 Star</span>
                    <div className="bar-container">
                      <div className="bar" style={{ width: '2%' }}></div>
                    </div>
                    <span>2%</span>
                  </div>
                </div>
              </div>
              
              <div className="review-list">
                <div className="review-item">
                  <div className="reviewer-info">
                    <span className="reviewer-name">John D.</span>
                    <div className="review-rating">
                      {renderRatingStars(5)}
                    </div>
                    <span className="review-date">March 10, 2023</span>
                  </div>
                  <div className="review-content">
                    <p>Excellent product! Exactly as described and arrived quickly. Would definitely buy again.</p>
                  </div>
                </div>
                
                <div className="review-item">
                  <div className="reviewer-info">
                    <span className="reviewer-name">Sarah M.</span>
                    <div className="review-rating">
                      {renderRatingStars(4)}
                    </div>
                    <span className="review-date">February 28, 2023</span>
                  </div>
                  <div className="review-content">
                    <p>Good quality and fast shipping. The only reason I'm giving 4 stars is because the color was slightly different than in the pictures.</p>
                  </div>
                </div>
                
                <div className="review-item">
                  <div className="reviewer-info">
                    <span className="reviewer-name">Michael T.</span>
                    <div className="review-rating">
                      {renderRatingStars(5)}
                    </div>
                    <span className="review-date">February 15, 2023</span>
                  </div>
                  <div className="review-content">
                    <p>Perfect! Exceeded my expectations in every way. The quality is outstanding.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'shipping' && (
            <div className="tab-content shipping-content">
              <h3>Shipping & Returns</h3>
              <div className="shipping-info">
                <h4>Shipping Information</h4>
                <ul>
                  <li>Free standard shipping on all orders</li>
                  <li>Standard shipping: 3-5 business days</li>
                  <li>Express shipping: 1-2 business days (additional fee)</li>
                  <li>International shipping available to select countries</li>
                </ul>
              </div>
              
              <div className="returns-info">
                <h4>Returns Policy</h4>
                <p>We offer a 30-day return policy for most items. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
                <p>To initiate a return, please contact our customer service team with your order number and reason for return.</p>
                <p>Refunds will be issued to the original payment method once we receive and inspect the returned item.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="product-recommendations">
        <h2>You May Also Like</h2>
        <div className="recommendations-grid">
          {recommendations.length > 0 ? (
            recommendations.map(rec => (
              <div key={rec.id} className="recommendation-item">
                <ProductCard 
                  product={{
                    _id: rec.id,
                    name: rec.name,
                    price: rec.price,
                    image: rec.image || '/images/placeholder.jpg',
                    rating: rec.rating || 5,
                    reviews: rec.reviews || 0,
                    category: rec.category,
                    isNew: rec.isNew || false,
                    isTrending: rec.isTrending || false,
                    discount: rec.discount || 0,
                    inStock: rec.stock > 0
                  }} 
                />
              </div>
            ))
          ) : (
            <p className="no-recommendations">No similar products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 