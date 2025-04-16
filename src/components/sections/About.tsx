
import React, { useRef, useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import SkillBar from '@/components/ui/SkillBar';
import { Tally5, GraduationCap, Award, Briefcase, Loader2 } from 'lucide-react';
import { useSkills, Skill } from '@/hooks/useSkills';

const About = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(aboutRef, { threshold: 0.1, once: true });
  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, Skill[]>>({});
  const [loading, setLoading] = useState(true);
  const { skills, fetchSkills } = useSkills();
  
  useEffect(() => {
    const loadSkills = async () => {
      setLoading(true);
      await fetchSkills();
      setLoading(false);
    };
    
    loadSkills();
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
  
  return (
    <section id="about" ref={aboutRef} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I'm a passionate developer specializing in building exceptional digital experiences. My current focus is on building accessible, responsive web applications.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-2xl font-semibold mb-6">About Me</h3>
            
            <div className="prose prose-lg">
              <p>
                I started my journey as a web developer over 5 years ago. Since then, I've continued to grow and evolve as a developer, taking on various challenges and learning new technologies along the way.
              </p>
              <p className="mt-4">
                I'm quietly confident, naturally curious, and perpetually working on improving my skills one problem at a time. I design and develop sites that are responsive, accessible, user-friendly, and aesthetically pleasing.
              </p>
              <p className="mt-4">
                When I'm not coding, you can find me exploring new technologies, writing technical articles, or enjoying outdoor activities.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-card p-4 rounded-lg border border-border text-center">
                <div className="bg-primary/10 text-primary p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <GraduationCap size={24} />
                </div>
                <h4 className="text-xl font-semibold">Education</h4>
                <p className="text-muted-foreground mt-2">Master's Degree in Computer Science</p>
              </div>
              
              <div className="bg-card p-4 rounded-lg border border-border text-center">
                <div className="bg-accent-teal/10 text-accent-teal p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Tally5 size={24} />
                </div>
                <h4 className="text-xl font-semibold">Experience</h4>
                <p className="text-muted-foreground mt-2">5+ Years in Web Development</p>
              </div>
              
              <div className="bg-card p-4 rounded-lg border border-border text-center">
                <div className="bg-accent-purple/10 text-accent-purple p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Award size={24} />
                </div>
                <h4 className="text-xl font-semibold">Awards</h4>
                <p className="text-muted-foreground mt-2">Best Web Design 2023</p>
              </div>
              
              <div className="bg-card p-4 rounded-lg border border-border text-center">
                <div className="bg-accent-coral/10 text-accent-coral p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Briefcase size={24} />
                </div>
                <h4 className="text-xl font-semibold">Projects</h4>
                <p className="text-muted-foreground mt-2">50+ Complete Projects</p>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 lg:col-span-3">
            <h3 className="text-2xl font-semibold mb-6">My Skills</h3>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <span>Loading skills...</span>
              </div>
            ) : (
              <div 
                className={`transition-opacity duration-1000 ${
                  isInView ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {Object.entries(skillsByCategory).map(([category, categorySkills], index) => (
                  <div key={category} className="mb-8">
                    <h4 className="text-xl font-medium mb-4">{category}</h4>
                    <div>
                      {categorySkills.map((skill, skillIndex) => {
                        // Determine color based on category
                        let color = 'bg-primary';
                        switch (category) {
                          case 'Frontend':
                            color = 'bg-accent-purple';
                            break;
                          case 'Backend':
                            color = 'bg-accent-teal';
                            break;
                          case 'Database':
                            color = 'bg-accent-coral';
                            break;
                          // Add more categories and colors as needed
                        }
                        
                        return (
                          <SkillBar
                            key={skill.id}
                            name={skill.name}
                            percentage={skill.level}
                            color={color}
                            delay={skillIndex * 100}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
