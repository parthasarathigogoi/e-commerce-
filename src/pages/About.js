import React from 'react';
import { FaCheckCircle, FaTrophy, FaUsers, FaStore } from 'react-icons/fa';
import './About.css';

const About = () => {
  const stats = [
    { icon: <FaStore />, number: '50K+', label: 'Products' },
    { icon: <FaUsers />, number: '100K+', label: 'Happy Customers' },
    { icon: <FaTrophy />, number: '15+', label: 'Awards' },
    { icon: <FaCheckCircle />, number: '99%', label: 'Satisfaction Rate' }
  ];

  const team = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
      bio: 'With over 15 years of experience in retail and e-commerce.'
    },
    {
      name: 'Sarah Johnson',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      bio: 'Leading our creative vision and brand strategy.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      bio: 'Ensuring smooth operations and customer satisfaction.'
    }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="about-title elegant-font">Our Story</h1>
          <p className="about-subtitle">Crafting excellence in every detail</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-content">
          <h2 className="section-title elegant-font">Our Mission</h2>
          <p className="mission-text">
            We strive to provide the finest quality products while maintaining the highest standards
            of customer service. Our commitment to excellence drives everything we do, from product
            selection to delivery.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <h2 className="section-title elegant-font">Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Quality</h3>
            <p>We never compromise on the quality of our products and services.</p>
          </div>
          <div className="value-card">
            <h3>Innovation</h3>
            <p>Constantly evolving and adapting to meet customer needs.</p>
          </div>
          <div className="value-card">
            <h3>Integrity</h3>
            <p>Honest and transparent in all our business practices.</p>
          </div>
          <div className="value-card">
            <h3>Customer Focus</h3>
            <p>Your satisfaction is our top priority.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2 className="section-title elegant-font">Meet Our Team</h2>
        <div className="team-grid">
          {team.map((member, index) => (
            <div key={index} className="team-card">
              <div className="member-image-container">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* History Timeline */}
      <section className="history-section">
        <h2 className="section-title elegant-font">Our Journey</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="year">2018</div>
            <div className="event">
              <h3>Company Founded</h3>
              <p>Started with a vision to revolutionize online shopping.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="year">2020</div>
            <div className="event">
              <h3>Expansion</h3>
              <p>Expanded our product range and reached 50K+ customers.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="year">2023</div>
            <div className="event">
              <h3>Global Presence</h3>
              <p>Established presence in multiple countries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <h2>Join Our Journey</h2>
        <p>Be part of our growing community of satisfied customers</p>
        <button className="cta-button">Shop Now</button>
      </section>
    </div>
  );
};

export default About; 