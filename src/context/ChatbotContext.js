import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Chatbot Context
const ChatbotContext = createContext();

// Custom hook to use the chatbot context
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  // State for products to suggest
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  
  // State for available discounts
  const [availableDiscounts, setAvailableDiscounts] = useState([
    { code: 'WELCOME10', description: '10% off your first order', minPurchase: 500 },
    { code: 'SUMMER25', description: '25% off on summer collection', minPurchase: 1000 },
    { code: 'FREESHIP', description: 'Free shipping on all orders', minPurchase: 1500 }
  ]);
  
  // State for chatbot visibility
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  // Load products from localStorage on mount
  useEffect(() => {
    const loadProducts = () => {
      try {
        // Try to get products from localStorage
        const allProducts = [];
        
        // Get seller products
        const sellerProducts = localStorage.getItem('sellerProducts');
        if (sellerProducts) {
          const parsedSellerProducts = JSON.parse(sellerProducts);
          if (Array.isArray(parsedSellerProducts)) {
            allProducts.push(...parsedSellerProducts);
          }
        }
        
        // Get mock products (if you have them stored)
        const mockProducts = localStorage.getItem('mockProducts');
        if (mockProducts) {
          const parsedMockProducts = JSON.parse(mockProducts);
          if (Array.isArray(parsedMockProducts)) {
            allProducts.push(...parsedMockProducts);
          }
        }
        
        // Set suggested products
        if (allProducts.length > 0) {
          setSuggestedProducts(allProducts);
        }
      } catch (error) {
        console.error('Error loading products for chatbot:', error);
      }
    };
    
    loadProducts();
  }, []);
  
  // Add a new discount
  const addDiscount = (discount) => {
    setAvailableDiscounts(prev => [...prev, discount]);
  };
  
  // Remove a discount
  const removeDiscount = (discountCode) => {
    setAvailableDiscounts(prev => 
      prev.filter(discount => discount.code !== discountCode)
    );
  };
  
  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsChatbotOpen(prev => !prev);
  };
  
  // Open chatbot
  const openChatbot = () => {
    setIsChatbotOpen(true);
  };
  
  // Close chatbot
  const closeChatbot = () => {
    setIsChatbotOpen(false);
  };
  
  // Update suggested products
  const updateSuggestedProducts = (products) => {
    setSuggestedProducts(products);
  };
  
  return (
    <ChatbotContext.Provider
      value={{
        suggestedProducts,
        availableDiscounts,
        isChatbotOpen,
        toggleChatbot,
        openChatbot,
        closeChatbot,
        addDiscount,
        removeDiscount,
        updateSuggestedProducts
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export { ChatbotContext }; 