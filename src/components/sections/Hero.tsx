import React, { useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import AnimatedButton from '../ui/AnimatedButton';
import AnimatedText from '../ui/AnimatedText';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { threshold: 0.1, once: true });
  
  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-70 animate-float" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl opacity-60 animate-float" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-block mb-4">
            <span 
              className={`inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm transition-all duration-700 ${
                isInView ? 'opacity-100' : 'opacity-0 -translate-y-4'
              }`}
            >
              React & React Native Developer
            </span>
          </div>
          
          <div className="max-w-4xl space-y-4">
            <AnimatedText
              text="Creating beautiful experiences with code"
              as="h1"
              animation="typing"
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
              speed={50}
            />
            
            <AnimatedText
              text="I'm a passionate frontend developer specializing in React and React Native, crafting beautiful, functional user interfaces that people love to use."
              as="p"
              animation="fade"
              delay={1000}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mt-6"
            />
          </div>
          
          <div 
            className={`flex flex-col sm:flex-row gap-4 mt-8 transition-all duration-700 delay-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <AnimatedButton 
              size="lg" 
              withArrow
              onClick={() => {
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                  projectsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              View My Work
            </AnimatedButton>
            
            <AnimatedButton 
              variant="outline" 
              size="lg"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Contact Me
            </AnimatedButton>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            onClick={() => {
              const aboutSection = document.getElementById('about');
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            aria-label="Scroll to About section"
          >
            <ArrowDown className="h-6 w-6 text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
