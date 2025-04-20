
import React, { useRef, useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import SkillBar from '@/components/ui/SkillBar';
import { Tally5, GraduationCap, Award, Briefcase, Loader2 } from 'lucide-react';
import { useSkills, Skill } from '@/hooks/useSkills';
import { useAbout, AboutData } from '@/hooks/useAbout';

const About = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(aboutRef, { threshold: 0.1, once: true });
  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, Skill[]>>({});
  const [loading, setLoading] = useState(true);
  const { skills, fetchSkills } = useSkills();
  const { aboutData, fetchActiveAbout } = useAbout();
  
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
  
  return (
    <section id="about" ref={aboutRef} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{aboutData?.title || 'About Me'}</h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {aboutData?.subtitle || 'Web Developer & Designer'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-0">
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-2xl font-semibold mb-6">About Me</h3>
            
            <div className="prose prose-lg">
              <p>
                {aboutData?.bio || 
                  'I started my journey as a web developer over 5 years ago. Since then, I\'ve continued to grow and evolve as a developer, taking on various challenges and learning new technologies along the way.'}
              </p>
            </div>
            
            <div className="grid grid-cols-4 gap-3 mt-8">
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
          
          <div className="col-span-1 lg:col-span-3">
            <h3 className="text-2xl font-semibold mt-16 mb-6">My Skills</h3>
            
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
<div className="flex flex-col lg:flex-row gap-8">
  {/* Left side: Frontend */}
  <div className="flex-1">
    {skillsByCategory['Frontend'] && (
      <div className="mb-8 p-10 bg-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.07)] backdrop-blur-sm rounded-xl border border-white/18">
        <h4 className="text-xl font-medium mb-4">Frontend</h4>
        <div>
          {skillsByCategory['Frontend'].map((skill, skillIndex) => (
            <SkillBar
              key={skill.id}
              name={skill.name}
              percentage={skill.level}
              color="bg-accent-purple"
              delay={skillIndex * 100}
            />
          ))}
        </div>
      </div>
    )}
  </div>

  {/* Right side: Other categories */}
  <div className="flex-1 space-y-8">
    {Object.entries(skillsByCategory)
      .filter(([category]) => category !== 'Frontend')
      .map(([category, categorySkills]) => (
        <div key={category} className="p-10 py-5 bg-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.07)] backdrop-blur-sm rounded-xl border border-white/18">
          <h4 className="text-xl font-medium mb-4">{category}</h4>
          <div>
            {categorySkills.map((skill, skillIndex) => {
              let color = 'bg-primary';
              switch (category) {
                case 'Backend':
                  color = 'bg-accent-teal';
                  break;
                case 'Database':
                  color = 'bg-accent-coral';
                  break;
                
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
</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
