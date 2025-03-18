
import React, { useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import { Calendar, GraduationCap, Briefcase, Download } from 'lucide-react';
import SkillBar from '../ui/SkillBar';
import AnimatedButton from '../ui/AnimatedButton';
import AnimatedText from '../ui/AnimatedText';

const About: React.FC = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(aboutRef, { threshold: 0.1, once: true });

  const skills = [
    { name: 'React', percentage: 95 },
    { name: 'React Native', percentage: 90 },
    { name: 'JavaScript', percentage: 92 },
    { name: 'TypeScript', percentage: 85 },
    { name: 'HTML/CSS', percentage: 95 },
    { name: 'Redux', percentage: 88 },
    { name: 'Node.js', percentage: 75 },
    { name: 'UI/UX Design', percentage: 80 },
  ];

  const experiences = [
    {
      title: 'Senior React Developer',
      company: 'Tech Innovations Inc.',
      period: '2020 - Present',
      description: 'Led frontend development for enterprise applications using React and TypeScript.',
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      title: 'React Native Developer',
      company: 'Mobile Solutions Ltd.',
      period: '2018 - 2020',
      description: 'Developed cross-platform mobile applications using React Native and Redux.',
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      title: 'Frontend Developer',
      company: 'Web Creators Co.',
      period: '2016 - 2018',
      description: 'Built responsive websites and web applications using modern JavaScript frameworks.',
      icon: <Briefcase className="h-5 w-5" />,
    },
  ];

  const education = [
    {
      degree: 'MSc in Computer Science',
      institution: 'Tech University',
      period: '2014 - 2016',
      description: 'Specialized in Human-Computer Interaction and Frontend Engineering.',
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      degree: 'BSc in Software Engineering',
      institution: 'Engineering College',
      period: '2010 - 2014',
      description: 'Focused on web technologies and user interface development.',
      icon: <GraduationCap className="h-5 w-5" />,
    },
  ];

  return (
    <section id="about" ref={aboutRef} className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <AnimatedText
            text="About Me"
            as="h2"
            animation="reveal"
            className="text-3xl md:text-4xl font-bold mb-4"
          />
          <AnimatedText
            as="p"
            animation="fade"
            delay={300}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            I combine technical expertise with creative problem-solving
            to build exceptional user experiences.
          </AnimatedText>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div 
              className={`bg-background rounded-2xl p-8 shadow-sm border border-border transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h3 className="text-2xl font-bold mb-4">My Story</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  I'm a passionate frontend developer with over 5 years of experience
                  creating beautiful, intuitive user interfaces. My journey began with
                  a curiosity about how digital experiences shape our daily lives.
                </p>
                <p>
                  Specializing in React and React Native, I've helped businesses transform
                  their ideas into polished, user-friendly applications. I believe in
                  writing clean, maintainable code and staying on top of emerging technologies.
                </p>
                <p>
                  When I'm not coding, you'll find me sharing educational content on Instagram,
                  contributing to open-source projects, or exploring new design trends.
                </p>
              </div>
              
              <div className="mt-6">
                <AnimatedButton 
                  onClick={() => window.open('/resume.pdf', '_blank')}
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </AnimatedButton>
              </div>
            </div>
            
            <div 
              className={`bg-background rounded-2xl p-8 shadow-sm border border-border transition-all duration-700 delay-200 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h3 className="text-2xl font-bold mb-6">Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {skills.map((skill, index) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    percentage={skill.percentage}
                    delay={index * 100}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div 
            className={`space-y-8 transition-all duration-700 delay-300 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="bg-background rounded-2xl p-8 shadow-sm border border-border">
              <h3 className="text-2xl font-bold mb-6">Experience</h3>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="relative pl-8 pb-6 border-l border-border last:pb-0">
                    <div className="absolute left-[-8px] top-0 bg-background p-1 border border-border rounded-full">
                      {exp.icon}
                    </div>
                    <div className="mb-1 flex items-center">
                      <h4 className="text-lg font-semibold">{exp.title}</h4>
                    </div>
                    <div className="text-sm text-primary mb-2 flex items-center">
                      <span>{exp.company}</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-background rounded-2xl p-8 shadow-sm border border-border">
              <h3 className="text-2xl font-bold mb-6">Education</h3>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="relative pl-8 pb-6 border-l border-border last:pb-0">
                    <div className="absolute left-[-8px] top-0 bg-background p-1 border border-border rounded-full">
                      {edu.icon}
                    </div>
                    <div className="mb-1">
                      <h4 className="text-lg font-semibold">{edu.degree}</h4>
                    </div>
                    <div className="text-sm text-primary mb-2 flex items-center">
                      <span>{edu.institution}</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
