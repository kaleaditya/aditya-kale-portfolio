
import React, { useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import AnimatedButton from '../ui/AnimatedButton';
import AnimatedText from '../ui/AnimatedText';
import { ArrowDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { threshold: 0.1, once: true });
  
  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 font-playfair"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent-purple/20 rounded-full blur-3xl opacity-70 animate-float" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-accent-teal/20 rounded-full blur-3xl opacity-60 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-accent-coral/10 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <div className="inline-block mb-4">
              <span 
                className={`inline-block px-4 py-1.5 rounded-full bg-accent-purple/10 text-accent-purple font-medium text-sm transition-all duration-700 ${
                  isInView ? 'opacity-100' : 'opacity-0 -translate-y-4'
                }`}
              >
                React & React Native Developer
              </span>
            </div>
            
            <div className="max-w-2xl space-y-4">
              <AnimatedText
                text="Creating beautiful experiences with code"
                as="h1"
                animation="typing"
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-accent-purple via-accent-teal to-accent-coral bg-clip-text text-transparent"
                speed={50}
              />
              
              <AnimatedText
                text="I'm a passionate frontend developer specializing in React and React Native, crafting beautiful, functional user interfaces that people love to use."
                as="p"
                animation="fade"
                delay={1000}
                className="text-xl text-muted-foreground max-w-xl"
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
                className="bg-accent-purple hover:bg-accent-purple/90"
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
                className="border-accent-teal text-accent-teal hover:bg-accent-teal/10"
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
          
          <div className={`relative flex-1 transition-all duration-1000 delay-300 ${
            isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-purple via-accent-teal to-accent-coral rounded-full opacity-20 blur-md animate-pulse-slow"></div>
              <Avatar className="w-full h-full border-4 border-white/20 shadow-xl">
                <AvatarImage src="https://images.unsplash.com/photo-1618641986557-1ecd230959aa?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Developer Portrait" className="object-cover" />
                <AvatarFallback className="bg-accent-purple/10 text-accent-purple text-4xl">JS</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-background rounded-full border-4 border-white/20 flex items-center justify-center text-accent-purple shadow-lg">
                <span className="font-bold text-xl">5+</span>
                <span className="text-xs ml-1">years<br/>exp</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            className="p-2 rounded-full bg-accent-teal/20 hover:bg-accent-teal/30 transition-colors"
            onClick={() => {
              const aboutSection = document.getElementById('about');
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            aria-label="Scroll to About section"
          >
            <ArrowDown className="h-6 w-6 text-accent-teal" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
