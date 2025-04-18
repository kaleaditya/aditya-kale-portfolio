import React, { useRef, useEffect, useState } from 'react';
import { useInView as useInViewHook } from '@/hooks/useInView';
import SkillBar from '@/components/ui/SkillBar';
import CircleProgressBar from '@/components/ui/CircleProgressBar';
import { Tally5, GraduationCap, Award, Briefcase, Loader2 } from 'lucide-react';
import { useSkills as fetchSkillsHook, Skill } from '@/hooks/useSkills';
import { useAbout as useAboutHook, AboutData } from '@/hooks/useAbout';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const About = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const isInView = useInViewHook(aboutRef, { threshold: 0.1, once: true });
  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, Skill[]>>({});
  const [loading, setLoading] = useState(true);
  const { skills, fetchSkills } = fetchSkillsHook();
  const { aboutData, fetchActiveAbout } = useAboutHook();
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSkills(),
        fetchActiveAbout()
      ]);
      setLoading(false);
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    // Group skills by category
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
    
    setSkillsByCategory(grouped);
  }, [skills]);
  
  // Calculate average skill levels by category for circle chart
  const getSkillCategories = () => {
    const categories = Object.keys(skillsByCategory);
    const result = categories.map(category => {
      const skills = skillsByCategory[category];
      const avgLevel = skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length;
      
      // Assign different colors based on category
      let color = '#9b87f5'; // default purple
      switch (category) {
        case 'Frontend':
          color = '#ff6b6b'; // coral
          break;
        case 'Backend':
          color = '#4ecdc4'; // teal
          break;
        case 'Database':
          color = '#45b7d1'; // blue
          break;
        case 'Design':
          color = '#ffa726'; // orange
          break;
        case 'DevOps':
          color = '#66bb6a'; // green
          break;
      }
      
      return {
        category,
        value: avgLevel,
        color
      };
    });
    
    return result;
  };
  
  return (
    <section id="about" ref={aboutRef} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Separator className="w-32" />
            <h2 className="text-3xl md:text-4xl font-bold text-rose-400">Skills</h2>
            <Separator className="w-32" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {aboutData?.subtitle || 'Web Developer & Designer'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="prose prose-lg max-w-none">
              <p className="text-balance text-muted-foreground">
                {aboutData?.bio || 
                  "Although highly skilled in numerous design disciplines I'm a dynamic and versatile designer with a proven track record and passion for creating innovative designs, regardless of the brief."}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-8">
              <div className="bg-card p-4 rounded-lg border border-border text-center">
                <div className="bg-primary/10 text-primary p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <GraduationCap size={24} />
                </div>
                <h4 className="text-xl font-semibold">Education</h4>
                <p className="text-muted-foreground mt-2">{aboutData?.education || 'Master\'s Degree in Computer Science'}</p>
              </div>
              
              <div className="bg-card p-4 rounded-lg border border-border text-center">
                <div className="bg-accent-teal/10 text-accent-teal p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Tally5 size={24} />
                </div>
                <h4 className="text-xl font-semibold">Experience</h4>
                <p className="text-muted-foreground mt-2">{aboutData?.experience_years || 5}+ Years in Web Development</p>
              </div>
              
              <div className="bg-card p-4 rounded-lg border border-border text-center">
                <div className="bg-accent-purple/10 text-accent-purple p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Award size={24} />
                </div>
                <h4 className="text-xl font-semibold">Awards</h4>
                <p className="text-muted-foreground mt-2">{aboutData?.awards || 'Best Web Design 2023'}</p>
              </div>
              
              <div className="bg-card p-4 rounded-lg border border-border text-center">
                <div className="bg-accent-coral/10 text-accent-coral p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Briefcase size={24} />
                </div>
                <h4 className="text-xl font-semibold">Projects</h4>
                <p className="text-muted-foreground mt-2">{aboutData?.project_count || 50}+ Complete Projects</p>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 flex items-center justify-center">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <span>Loading skills...</span>
              </div>
            ) : (
              <div className="relative w-64 h-64">
                <CircleProgressBar 
                  categories={getSkillCategories()}
                  isVisible={isInView}
                />
              </div>
            )}
          </div>
          
          <div className="col-span-1">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <span>Loading skills...</span>
              </div>
            ) : (
              <div 
                className={cn(
                  "space-y-6 transition-opacity duration-1000",
                  isInView ? "opacity-100" : "opacity-0"
                )}
              >
                {Object.entries(skillsByCategory).slice(0, 3).map(([category, categorySkills]) => {
                  // Determine color based on category
                  let color;
                  switch (category) {
                    case 'Frontend':
                      color = 'bg-rose-400';
                      break;
                    case 'Backend':
                      color = 'bg-cyan-400';
                      break;
                    case 'Database':
                      color = 'bg-blue-400';
                      break;
                    case 'Design':
                      color = 'bg-amber-400';
                      break;
                    case 'DevOps':
                      color = 'bg-green-400';
                      break;
                    default:
                      color = 'bg-primary';
                  }
                  
                  return categorySkills.slice(0, 5).map((skill, skillIndex) => (
                    <SkillBar
                      key={skill.id}
                      name={skill.name}
                      percentage={skill.level}
                      color={color}
                      delay={skillIndex * 100}
                      showLabel={true}
                    />
                  ));
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center mt-24">
        <Separator className="w-32" />
        <h2 className="text-3xl md:text-4xl font-bold text-rose-400 mx-4">Contact</h2>
        <Separator className="w-32" />
      </div>
    </section>
  );
};

export default About;

// Correct export in useInView.js
export function useInView(ref: React.RefObject<HTMLElement>, options: IntersectionObserverInit): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
}

// Correct export in useSkills.js
export function useSkills() {
  // Implementation
}

// Correct export in useAbout.js
export function useAbout() {
  // Implementation
}
