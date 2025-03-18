
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';
import { Github, ExternalLink } from 'lucide-react';
import AnimatedButton from './AnimatedButton';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  className?: string;
}

const ProjectCard = ({ project, index, className }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { threshold: 0.1, once: true });
  
  return (
    <div 
      ref={cardRef}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border shadow-sm transition-all duration-500',
        'hover:shadow-lg hover:border-primary/20 h-full',
        isInView ? 'opacity-100' : 'opacity-0 translate-y-10',
        className
      )}
      style={{ 
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
      
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
      </div>
      
      <div className="p-6 flex flex-col space-y-4 relative z-20">
        <div className="flex flex-wrap gap-2 mb-2">
          {project.technologies.slice(0, 3).map((tech, i) => (
            <span 
              key={i} 
              className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        
        <p className="text-muted-foreground line-clamp-3">
          {project.description}
        </p>
        
        <div className="flex items-center gap-3 mt-4 pt-2">
          {project.githubUrl && (
            <AnimatedButton 
              size="sm" 
              variant="ghost"
              onClick={() => window.open(project.githubUrl, '_blank')}
              className="p-2"
            >
              <Github className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </AnimatedButton>
          )}
          
          {project.liveUrl && (
            <AnimatedButton 
              size="sm"
              withArrow
              onClick={() => window.open(project.liveUrl, '_blank')}
            >
              <span>View Project</span>
            </AnimatedButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
