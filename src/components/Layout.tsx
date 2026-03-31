import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

const PROGRAMMER_NAME = "Reyno Nawfal Ghaisan";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Universal Background */}
      <div className="fixed inset-0 -z-20 bg-brand-midnight" />
      <div 
        className="fixed inset-0 -z-10 opacity-30" 
        style={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' 
        }} 
      />
      
      {/* Ambient background elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-pink/5 blur-[120px] -z-10 animate-pulse-glow" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[120px] -z-10 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 lg:p-12 max-w-7xl mx-auto w-full">
        <header className="text-center mb-8 md:mb-12">
          <Link to="/">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-blue cursor-pointer transition-opacity hover:opacity-80"
            >
              LoveConnect
            </motion.h1>
          </Link>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-2 md:mt-4 tracking-[0.1em] md:tracking-[0.2em] uppercase text-[10px] md:text-xs font-medium"
          >
            The App for Deeper Connections
          </motion.p>
        </header>

        <div className="flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500">
          <div className="flex flex-col gap-1">
            <p className="text-xs tracking-wider uppercase font-bold text-gray-400">
              {PROGRAMMER_NAME} Studios.
            </p>
            <p className="text-[10px] italic">
              Created with love by the world's greatest developer to build special moments.
            </p>
          </div>
          
          <nav className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-bold" aria-label="Footer Navigation">
            <Link to="/about" className={`transition-colors hover:text-brand-pink ${location.pathname === '/about' ? 'text-brand-pink' : ''}`}>About Us</Link>
            <Link to="/faq" className={`transition-colors hover:text-brand-pink ${location.pathname === '/faq' ? 'text-brand-pink' : ''}`}>FAQ</Link>
            <Link to="/contact" className={`transition-colors hover:text-brand-pink ${location.pathname === '/contact' ? 'text-brand-pink' : ''}`}>Contact</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="Github Repository" className="hover:text-brand-pink transition-colors">Github</a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
