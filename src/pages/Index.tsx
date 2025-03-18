
import { useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Instagram from '@/components/sections/Instagram';
import Github from '@/components/sections/Github';
import Contact from '@/components/sections/Contact';

const Index = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Projects />
        <Instagram />
        <Github />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
