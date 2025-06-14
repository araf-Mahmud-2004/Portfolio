import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/admin/login');
    } else {
      navigate('/admin/dashboard');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-charcoal/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-neon">
            Araf<span className="text-off-white">.</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('hero')}
              className="hover:text-neon transition-colors duration-200"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('skills')}
              className="hover:text-neon transition-colors duration-200"
            >
              Skills
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="hover:text-neon transition-colors duration-200"
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="hover:text-neon transition-colors duration-200"
            >
              Contact
            </button>
            <button
              onClick={handleAdminClick}
              className="text-muted-gray hover:text-neon transition-colors duration-200 flex items-center"
              title={user ? 'Admin Dashboard' : 'Admin Login'}
              aria-label="Admin"
            >
              <User size={20} />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-neon hover:text-off-white transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-olive/95 backdrop-blur-md rounded-lg mt-2 p-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('hero')}
                className="text-left hover:text-neon transition-colors duration-200"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('skills')}
                className="text-left hover:text-neon transition-colors duration-200"
              >
                Skills
              </button>
              <button 
                onClick={() => scrollToSection('projects')}
                className="text-left hover:text-neon transition-colors duration-200"
              >
                Projects
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left hover:text-neon transition-colors duration-200"
              >
                Contact
              </button>
              <button
                onClick={handleAdminClick}
                className="text-left text-muted-gray hover:text-neon transition-colors duration-200 w-full text-left"
              >
                {user ? 'Admin Dashboard' : 'Admin Login'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;