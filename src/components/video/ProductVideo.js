import React from 'react';
import './Video.css';

const ProductVideo = () => {
  return (
    <div className="video-container">
      {/* Embedded YouTube Video */}
      
      <iframe
        width="100%"
        height="400"
        src="https://www.youtube.com/embed/9ckLyN48wLM?autoplay=1&mute=1"
        title="YouTube Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
     <video width="90%" height="450" controls autoPlay muted>
        <source src="https://www.apple.com/105/media/ww/iphone/family/2025/e7ff365a-cb59-4ce9-9cdf-4cb965455b69/anim/welcome3/large.mp4" />
        
      </video>

      {/* Advertisement Section */}
      
      <div className="advertisements">
        <a href="https://www.apple.com/in/iphone/" target="_blank" rel="noopener noreferrer">
          <img src="https://www.apple.com/v/iphone/home/cb/images/overview/select/iphone_16pro__erw9alves2qa_large.png" alt="Apple iPhone " />
        </a>

        <a href="https://www.samsung.com/global/galaxy/" target="_blank" rel="noopener noreferrer">
          <img src="https://images.samsung.com/is/image/samsung/assets/in/home/250212/684x684_Big_Tile_Paradigm.jpg?$684_684_JPG$" alt="Samsung Galaxy S23 Ultra Ad" />
        </a>

        <a href="https://www.oneplus.in/oneplus-12" target="_blank" rel="noopener noreferrer">
          <img src="https://www.oneplus.in/content/dam/oneplus/2025/components/hero-banner/13R_Tablet_0107.jpg" alt="OnePlus 12 Ad" />
        </a>

        <a href="https://www.mi.com/global/mi-13-pro" target="_blank" rel="noopener noreferrer">
          <img src="https://i02.appmifile.com/267_operator_sg/05/01/2025/934ec25b1a78235d51a0582d10b11b67.jpg?f=webp" alt="Xiaomi Mi 13 Pro Ad" />
        </a>
      </div>
    </div>
  );
};

export default ProductVideo;
