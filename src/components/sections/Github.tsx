import React, { useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { Github as GithubIcon, Star, GitFork, Code, ExternalLink } from 'lucide-react';
import AnimatedText from '../ui/AnimatedText';
import AnimatedButton from '../ui/AnimatedButton';

interface Repository {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  category: string;
}

const repositories: Repository[] = [
  {
    id: '1',
    name: 'react-performance-toolkit',
    description: 'A collection of tools, hooks, and utilities to optimize React applications for better performance.',
    stars: 278,
    forks: 45,
    language: 'TypeScript',
    url: 'https://github.com',
    category: 'react',
  },
  {
    id: '2',
    name: 'react-native-ui-library',
    description: 'A comprehensive UI library for React Native with fully customizable components and animations.',
    stars: 342,
    forks: 76,
    language: 'JavaScript',
    url: 'https://github.com',
    category: 'react-native',
  },
  {
    id: '3',
    name: 'typescript-design-patterns',
    description: 'Implementations of common design patterns in TypeScript with React examples.',
    stars: 165,
    forks: 32,
    language: 'TypeScript',
    url: 'https://github.com',
    category: 'typescript',
  },
  {
    id: '4',
    name: 'react-hooks-collection',
    description: 'A collection of custom React hooks for common UI patterns and functionality.',
    stars: 214,
    forks: 41,
    language: 'JavaScript',
    url: 'https://github.com',
    category: 'react',
  },
  {
    id: '5',
    name: 'react-native-animation-examples',
    description: 'Examples of advanced animations and transitions in React Native using Reanimated.',
    stars: 189,
    forks: 35,
    language: 'TypeScript',
    url: 'https://github.com',
    category: 'react-native',
  },
  {
    id: '6',
    name: 'state-management-comparison',
    description: 'Comparison of different state management solutions for React with performance benchmarks.',
    stars: 122,
    forks: 24,
    language: 'JavaScript',
    url: 'https://github.com',
    category: 'react',
  },
];

const languageColors: Record<string, string> = {
  JavaScript: 'bg-yellow-300',
  TypeScript: 'bg-blue-500',
  Python: 'bg-green-500',
  Java: 'bg-red-500',
  'C#': 'bg-purple-500',
  Go: 'bg-cyan-500',
  Ruby: 'bg-red-600',
  PHP: 'bg-indigo-400',
  Swift: 'bg-orange-500',
  Kotlin: 'bg-purple-400',
};

const GithubSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1, once: true });
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Repositories' },
    { id: 'react', name: 'React' },
    { id: 'react-native', name: 'React Native' },
    { id: 'typescript', name: 'TypeScript' },
  ];
  
  const filteredRepos = activeCategory === 'all' 
    ? repositories 
    : repositories.filter(repo => repo.category === activeCategory);

  return (
    <section id="github" ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <AnimatedText
            text="GitHub Projects"
            as="h2"
            animation="reveal"
            className="text-3xl md:text-4xl font-bold mb-4"
          />
          <AnimatedText
            text="Open-source contributions and personal projects I've developed and shared with the community."
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
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id 
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
          {filteredRepos.map((repo, index) => (
            <div 
              key={repo.id} 
              className={`bg-background rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-500 hover:border-primary/20 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} 
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <GithubIcon className="h-5 w-5 text-foreground" />
                  <h3 className="ml-2 text-lg font-medium line-clamp-1">{repo.name}</h3>
                </div>
                <a 
                  href={repo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <p className="mt-3 text-muted-foreground line-clamp-2 min-h-[48px]">
                {repo.description}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-foreground/70">
                    <Star className="h-4 w-4 mr-1" />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center text-sm text-foreground/70">
                    <GitFork className="h-4 w-4 mr-1" />
                    <span>{repo.forks}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span 
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      languageColors[repo.language] || 'bg-gray-400'
                    }`}
                  />
                  <span className="text-sm text-foreground/70">{repo.language}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <AnimatedButton 
            onClick={() => window.open('https://github.com', '_blank')}
            size="lg"
          >
            <GithubIcon className="mr-2 h-4 w-4" />
            View All Repositories
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
};

export default GithubSection;
