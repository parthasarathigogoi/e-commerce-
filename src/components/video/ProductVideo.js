import React, { useRef, useState, useEffect } from 'react';
import './ProductVideo.css';

const ProductVideo = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="product-video-container">
      <div className="video-wrapper">
        <video 
          ref={videoRef}
          className="product-video"
          poster="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
          onClick={togglePlay}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-with-a-black-and-white-outfit-39880-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="video-controls">
          <button 
            className="play-button" 
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          
          <div className="progress-bar">
            <div 
              className="progress-filled"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="video-overlay">
          <div className="overlay-content">
            <h3>Elegance in Motion</h3>
            <p>Discover our timeless collection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductVideo;
