
import React from 'react';
import { cn } from '@/lib/utils';
import { Github, Instagram, Linkedin, Twitter, Mail, Globe } from 'lucide-react';

type SocialIconProps = {
  platform: 'github' | 'instagram' | 'linkedin' | 'twitter' | 'email' | 'website';
  url: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SocialIcon: React.FC<SocialIconProps> = ({
  platform,
  url,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const getIcon = () => {
    switch (platform) {
      case 'github':
        return <Github size={iconSize[size]} />;
      case 'instagram':
        return <Instagram size={iconSize[size]} />;
      case 'linkedin':
        return <Linkedin size={iconSize[size]} />;
      case 'twitter':
        return <Twitter size={iconSize[size]} />;
      case 'email':
        return <Mail size={iconSize[size]} />;
      case 'website':
        return <Globe size={iconSize[size]} />;
      default:
        return null;
    }
  };

  return (
    <a
      href={platform === 'email' ? `mailto:${url}` : url}
      target={platform === 'email' ? '_self' : '_blank'}
      rel="noopener noreferrer"
      className={cn(
        'flex items-center justify-center rounded-full bg-secondary hover:bg-primary/10 transition-colors duration-300',
        'border border-border hover:border-primary/30 hover:text-primary',
        'focus:outline-none focus:ring-2 focus:ring-primary/30',
        sizeClasses[size],
        className
      )}
      data-magnetic="true"
    >
      {getIcon()}
      <span className="sr-only">{platform}</span>
    </a>
  );
};

export default SocialIcon;
