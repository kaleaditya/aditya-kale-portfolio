
import React, { useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import AnimatedText from '../ui/AnimatedText';
import AnimatedButton from '../ui/AnimatedButton';
import { Instagram as InstagramIcon } from 'lucide-react';

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  url: string;
  category: string;
}

const instagramPosts: InstagramPost[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1200&auto=format&fit=crop',
    caption: 'How to optimize React component rendering with useMemo and useCallback #ReactTips',
    likes: 245,
    comments: 32,
    url: 'https://instagram.com',
    category: 'react',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop',
    caption: 'Building responsive layouts in React Native: Tips and tricks #ReactNative',
    likes: 189,
    comments: 23,
    url: 'https://instagram.com',
    category: 'react-native',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=1200&auto=format&fit=crop',
    caption: 'Understanding the JavaScript event loop in 60 seconds #JavaScript',
    likes: 320,
    comments: 45,
    url: 'https://instagram.com',
    category: 'javascript',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop',
    caption: 'Creating beautiful animations with React Spring #ReactAnimation',
    likes: 278,
    comments: 37,
    url: 'https://instagram.com',
    category: 'react',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1200&auto=format&fit=crop',
    caption: 'Mastering TypeScript generics for better React components #TypeScript',
    likes: 210,
    comments: 28,
    url: 'https://instagram.com',
    category: 'typescript',
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1200&auto=format&fit=crop',
    caption: '5 React Native performance tips you need to know #ReactNative',
    likes: 265,
    comments: 41,
    url: 'https://instagram.com',
    category: 'react-native',
  },
];

const InstagramSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1, once: true });
  const [activeCategory, setActiveCategory] = React.useState('all');
  
  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'react', name: 'React' },
    { id: 'react-native', name: 'React Native' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
  ];
  
  const filteredPosts = activeCategory === 'all' 
    ? instagramPosts 
    : instagramPosts.filter(post => post.category === activeCategory);

  return (
    <section id="instagram" ref={sectionRef} className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <AnimatedText
            text="Instagram Content"
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
            Educational content I share on Instagram to help other developers learn and grow.
          </AnimatedText>
        </div>

        <div 
          className={`flex justify-center mb-12 overflow-x-auto pb-4 transition-all duration-500 ${
            isInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="inline-flex bg-secondary/80 rounded-full p-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredPosts.map((post, index) => (
            <div 
              key={post.id} 
              className={`group relative overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-500 hover:shadow-md ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} 
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={post.image} 
                  alt={`Instagram post: ${post.caption}`} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <div className="flex items-center justify-between text-white mb-2">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-14a1 1 0 100-2 1 1 0 000 2zm0 12a1 1 0 100-2 1 1 0 000 2z"></path>
                      </svg>
                      {post.likes} likes
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"></path>
                      </svg>
                      {post.comments} comments
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-foreground/90 line-clamp-2 mb-3">
                  {post.caption}
                </p>
                
                <a 
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  View Post
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <AnimatedButton 
            onClick={() => window.open('https://instagram.com', '_blank')}
            size="lg"
          >
            <InstagramIcon className="mr-2 h-4 w-4" />
            Follow Me on Instagram
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
