
import { useRef, useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Instagram from '@/components/sections/Instagram';
import Github from '@/components/sections/Github';
import Contact from '@/components/sections/Contact';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const Index = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [resume, setResume] = useState<{fileName: string, url: string} | null>(null);
  
  // In a real app, you'd fetch this data from your API/backend
  useEffect(() => {
    // Simulating data loading
    const resumeData = localStorage.getItem('resumeData');
    if (resumeData) {
      setResume(JSON.parse(resumeData));
    } else {
      // Default resume for demo
      setResume({
        fileName: 'john_doe_resume.pdf',
        url: '/sample-resume.pdf'
      });
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {resume && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button asChild className="shadow-lg flex items-center gap-2">
            <a href={resume.url} download={resume.fileName}>
              <Download size={16} />
              <span>Download CV</span>
            </a>
          </Button>
        </div>
      )}
      
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
