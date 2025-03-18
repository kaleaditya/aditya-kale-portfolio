
import React from 'react';
import { Heart } from 'lucide-react';
import SocialIcon from '../ui/SocialIcon';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Developer</h3>
            <p className="text-muted-foreground max-w-md">
              I'm a passionate React and React Native developer creating beautiful, functional user interfaces.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Projects', 'Instagram', 'GitHub', 'Contact'].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase()}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      const section = document.getElementById(link.toLowerCase());
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="flex space-x-3">
              <SocialIcon platform="github" url="https://github.com" size="sm" />
              <SocialIcon platform="instagram" url="https://instagram.com" size="sm" />
              <SocialIcon platform="linkedin" url="https://linkedin.com" size="sm" />
              <SocialIcon platform="twitter" url="https://twitter.com" size="sm" />
              <SocialIcon platform="email" url="hello@example.com" size="sm" />
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Developer. All rights reserved.
          </p>
          
          <p className="text-sm text-muted-foreground flex items-center mt-4 md:mt-0">
            Made with 
            <Heart className="h-4 w-4 mx-1 text-red-500 animate-pulse" /> 
            and React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
