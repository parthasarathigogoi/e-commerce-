import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import '../styles/globals.css';
 // Import global styles

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      


      {/* Main Content */}
      <main className="flex-grow">
        {Component ? <component {...pageProps} /> :<p>loading....</p>}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
