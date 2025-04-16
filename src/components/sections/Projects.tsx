import React, { useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import ProjectCard, { Project } from '../ui/ProjectCard';
import AnimatedText from '../ui/AnimatedText';

const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Mobile App',
    description: 'A full-featured e-commerce mobile app built with React Native, supporting both iOS and Android platforms with a unified shopping experience.',
    image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=1200&auto=format&fit=crop',
    technologies: ['React Native', 'Redux', 'Node.js'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    category: 'mobile',
  },
  {
    id: '2',
    title: 'Task Management Dashboard',
    description: 'A comprehensive task management system with real-time updates, team collaboration features, and detailed analytics.',
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=1200&auto=format&fit=crop',
    technologies: ['React', 'TypeScript', 'Firebase'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    category: 'web',
  },
  {
    id: '3',
    title: 'Fitness Tracking App',
    description: 'A mobile application for tracking workouts, nutrition, and progress with customizable plans and social sharing capabilities.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop',
    technologies: ['React Native', 'GraphQL', 'AWS'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    category: 'mobile',
  },
  {
    id: '4',
    title: 'Real Estate Listing Platform',
    description: 'A property listing website with advanced search, virtual tours, and agent communication tools for streamlined property hunting.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop',
    technologies: ['React', 'Next.js', 'Tailwind'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    category: 'web',
  },
  {
    id: '5',
    title: 'Financial Analytics Dashboard',
    description: 'Interactive data visualization tool for financial metrics with customizable charts, reports, and real-time market data integration.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    technologies: ['React', 'D3.js', 'Express'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    category: 'web',
  },
  {
    id: '6',
    title: 'Social Media Content Creator',
    description: 'Tool for creating, scheduling, and analyzing social media content across multiple platforms with AI-powered suggestions.',
    image: 'https://images.unsplash.com/photo-1579869847557-1f67382cc158?q=80&w=1200&auto=format&fit=crop',
    technologies: ['React', 'Node.js', 'GraphQL'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    category: 'web',
  },
];

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1, once: true });
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web' },
    { id: 'mobile', name: 'Mobile' },
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  return (
    <section id="projects" ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <AnimatedText
            text="My "
            as="h2"
            animation="reveal"
            className="text-3xl md:text-4xl font-bold mb-4"
          />
          <AnimatedText
            text="A selection of my recent work, demonstrating my skills in React, React Native, and frontend development."
            as="p"
            animation="fade"
            delay={300}
            className="text-muted-foreground max-w-2xl mx-auto"
          />
        </div>

        <div 
          className={`flex justify-center mb-12 transition-all duration-500 ${
            isInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="inline-flex bg-secondary/80 rounded-full p-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === category.id 
                    ? 'bg-background text-primary shadow-sm' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
