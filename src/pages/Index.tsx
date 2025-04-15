
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
import { Download, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [resume, setResume] = useState<{fileName: string, url: string} | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch active resume from Supabase
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('is_active', true)
          .single();
        
        if (error) {
          console.error("Error fetching resume:", error);
          setResume(null);
        } else if (data) {
          setResume({
            fileName: data.file_name,
            url: data.file_path
          });
        } else {
          setResume(null);
        }
      } catch (err) {
        console.error("Failed to fetch resume:", err);
        setResume(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResume();
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {!loading && resume && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button asChild className="shadow-lg flex items-center gap-2">
            <a href={resume.url} download={resume.fileName}>
              <Download size={16} />
              <span>Download CV</span>
            </a>
          </Button>
        </div>
      )}
      
      {loading && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button disabled className="shadow-lg flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span>Loading...</span>
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
