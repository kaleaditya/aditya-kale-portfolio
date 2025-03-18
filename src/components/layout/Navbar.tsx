
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AnimatedButton from '../ui/AnimatedButton';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '#hero' },
  { name: 'About', path: '#about' },
  { name: 'Projects', path: '#projects' },
  { name: 'Instagram', path: '#instagram' },
  { name: 'GitHub', path: '#github' },
  { name: 'Contact', path: '#contact' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Find active section based on scroll position
      const sections = navLinks.map((link) => link.path.replace('#', ''));
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled ? 'py-3 bg-background/80 backdrop-blur-lg shadow-sm' : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-bold relative z-20 group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Developer
          </span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all duration-300',
                activeSection === link.path.replace('#', '') 
                  ? 'text-primary' 
                  : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
              )}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(link.path.replace('#', ''));
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <AnimatedButton 
            variant="default" 
            size="sm" 
            withArrow
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Let's Talk
          </AnimatedButton>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 z-20 text-foreground/80 hover:text-primary transition-colors"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile navigation */}
        <div
          className={cn(
            'fixed inset-0 bg-background/95 backdrop-blur-lg z-10 flex flex-col justify-center items-center transition-all duration-300 md:hidden',
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
        >
          <nav className="flex flex-col items-center space-y-6 py-8">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.path}
                className={cn(
                  'text-2xl font-medium transition-all duration-300',
                  'opacity-0 translate-y-4 transition-transform',
                  isMenuOpen && 'animate-slide-up opacity-100 translate-y-0',
                  activeSection === link.path.replace('#', '') ? 'text-primary' : 'text-foreground/70'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={(e) => {
                  e.preventDefault();
                  closeMenu();
                  const element = document.getElementById(link.path.replace('#', ''));
                  if (element) {
                    setTimeout(() => {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }
                }}
              >
                {link.name}
              </a>
            ))}
          </nav>
          
          <AnimatedButton 
            variant="default" 
            size="md" 
            withArrow
            className="mt-8"
            onClick={() => {
              closeMenu();
              setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 300);
            }}
          >
            Let's Talk
          </AnimatedButton>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
