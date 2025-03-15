import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaCommentDots, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { useChatbot } from '../../context/ChatbotContext';
import './Chatbot.css';

const Chatbot = () => {
  const { 
    suggestedProducts, 
    availableDiscounts, 
    isChatbotOpen, 
    toggleChatbot 
  } = useChatbot();
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your shopping assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Sample product suggestions based on categories
  const productSuggestions = {
    watches: suggestedProducts?.filter(p => p.category === 'Watches')?.slice(0, 3) || [],
    clothing: suggestedProducts?.filter(p => p.category === 'Clothing')?.slice(0, 3) || [],
    perfumes: suggestedProducts?.filter(p => p.category === 'Perfumes')?.slice(0, 3) || [],
    belts: suggestedProducts?.filter(p => p.category === 'Belts')?.slice(0, 3) || []
  };

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Process the message and generate a response
    setTimeout(() => {
      const botResponse = generateResponse(inputText.toLowerCase());
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Generate bot response based on user input
  const generateResponse = (input) => {
    // Check for greetings
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return {
        id: messages.length + 2,
        text: "Hi there! How can I assist you with your shopping today?",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    // Check for discount inquiries
    if (input.includes('discount') || input.includes('coupon') || input.includes('offer') || input.includes('deal')) {
      return {
        id: messages.length + 2,
        text: "We have several discounts available right now! Here are some coupon codes you can use:",
        sender: 'bot',
        timestamp: new Date(),
        discounts: availableDiscounts
      };
    }
    
    // Check for product category inquiries
    if (input.includes('watch') || input.includes('watches')) {
      return {
        id: messages.length + 2,
        text: "Here are some of our popular watches you might like:",
        sender: 'bot',
        timestamp: new Date(),
        products: productSuggestions.watches
      };
    }
    
    if (input.includes('cloth') || input.includes('clothing') || input.includes('dress') || input.includes('shirt') || input.includes('pant')) {
      return {
        id: messages.length + 2,
        text: "Check out these trending clothing items:",
        sender: 'bot',
        timestamp: new Date(),
        products: productSuggestions.clothing
      };
    }
    
    if (input.includes('perfume') || input.includes('fragrance') || input.includes('scent')) {
      return {
        id: messages.length + 2,
        text: "Here are some of our best-selling perfumes:",
        sender: 'bot',
        timestamp: new Date(),
        products: productSuggestions.perfumes
      };
    }
    
    if (input.includes('belt') || input.includes('belts')) {
      return {
        id: messages.length + 2,
        text: "Take a look at these stylish belts:",
        sender: 'bot',
        timestamp: new Date(),
        products: productSuggestions.belts
      };
    }
    
    // Check for shipping inquiries
    if (input.includes('shipping') || input.includes('delivery') || input.includes('ship')) {
      return {
        id: messages.length + 2,
        text: "We offer free shipping on all orders above ₹1500. Standard delivery takes 3-5 business days, and express delivery (additional ₹200) takes 1-2 business days.",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    // Check for return policy inquiries
    if (input.includes('return') || input.includes('refund') || input.includes('exchange')) {
      return {
        id: messages.length + 2,
        text: "Our return policy allows you to return items within 30 days of delivery for a full refund or exchange. The items must be in their original condition with tags attached.",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    // Check for contact inquiries
    if (input.includes('contact') || input.includes('help') || input.includes('support') || input.includes('customer service')) {
      return {
        id: messages.length + 2,
        text: "You can reach our customer support team at support@dikhow.com or call us at +91-1234567890. Our support hours are 9 AM to 6 PM, Monday to Saturday.",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    // Default response for unrecognized queries
    return {
      id: messages.length + 2,
      text: "I'm not sure I understand. Would you like to browse our popular categories? You can ask about watches, clothing, perfumes, or belts. You can also ask about discounts, shipping, or our return policy.",
      sender: 'bot',
      timestamp: new Date()
    };
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot toggle button */}
      <button 
        className={`chatbot-toggle ${isChatbotOpen ? 'open' : ''}`} 
        onClick={toggleChatbot}
        aria-label={isChatbotOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isChatbotOpen ? <FaTimes /> : <FaCommentDots />}
      </button>
      
      {/* Chatbot window */}
      {isChatbotOpen && (
        <div className="chatbot-window">
          {/* Chatbot header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <FaRobot />
              <span>Shopping Assistant</span>
            </div>
            <button 
              className="close-button" 
              onClick={toggleChatbot}
              aria-label="Close chatbot"
            >
              <FaTimes />
            </button>
          </div>
          
          {/* Chatbot messages */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'bot' ? 'bot' : 'user'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  
                  {/* Product suggestions */}
                  {message.products && message.products.length > 0 && (
                    <div className="product-suggestions">
                      {message.products.map((product) => (
                        <div key={product.id || product._id} className="suggested-product">
                          <div className="product-image">
                            {product.image ? (
                              <img src={product.image} alt={product.name} />
                            ) : (
                              <div className="no-image"></div>
                            )}
                          </div>
                          <div className="product-info">
                            <h4>{product.name}</h4>
                            <p className="product-price">₹{product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Discount information */}
                  {message.discounts && (
                    <div className="discount-info">
                      {message.discounts.map((discount, index) => (
                        <div key={index} className="discount-item">
                          <div className="discount-code">{discount.code}</div>
                          <div className="discount-description">
                            {discount.description}
                            {discount.minPurchase > 0 && (
                              <span> (Min. purchase: ₹{discount.minPurchase})</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            ))}
            
            {/* Bot typing indicator */}
            {isTyping && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            {/* Scroll to bottom reference */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chatbot input */}
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={handleInputChange}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || isTyping}
              aria-label="Send message"
            >
              {isTyping ? <FaSpinner className="spinner" /> : <FaPaperPlane />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot; 