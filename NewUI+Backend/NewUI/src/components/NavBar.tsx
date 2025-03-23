"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-0 right-0 p-4 z-50">
      {/* Hamburger Icon (on the right side) */}
      <button 
        onClick={toggleMenu} 
        className="p-2 text-[#48d1cc] rounded-lg focus:outline-none"
      >
        <svg 
          className="w-12 h-12" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Slide-Out Menu */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-8 flex flex-col gap-6"
      >
        <button 
          onClick={toggleMenu} 
          className="self-end text-gray-600 hover:text-[#48d1cc]"
        >
          ✕
        </button>

        <nav className="flex flex-col gap-4 text-xl">
          <Link href="/" className="text-gray-700 hover:text-[#48d1cc]" onClick={toggleMenu}>
            Home
          </Link>
          <Link href="/profile" className="text-gray-700 hover:text-[#48d1cc]" onClick={toggleMenu}>
            Profile
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-[#48d1cc]" onClick={toggleMenu}>
            About
          </Link>
        </nav>
      </motion.div>
    </div>
  );
};

export default NavBar;
