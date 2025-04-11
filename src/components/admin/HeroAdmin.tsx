
import React, { useState } from 'react';
import { Save, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const HeroAdmin = () => {
  const [title, setTitle] = useState('John Doe');
  const [subtitle, setSubtitle] = useState('Full Stack Developer');
  const [description, setDescription] = useState('I build modern web applications with React, Node.js and cutting-edge technologies.');
  const [backgroundImage, setBackgroundImage] = useState('/placeholder.svg');
  const [profileImage, setProfileImage] = useState('/placeholder.svg');
  const [ctaText, setCtaText] = useState('View Projects');
  const [ctaLink, setCtaLink] = useState('#projects');
  
  const saveChanges = () => {
    // Here we would save to a database or local storage
    console.log('Saving hero changes:', { 
      title, 
      subtitle, 
      description,
      backgroundImage,
      profileImage,
      ctaText,
      ctaLink
    });
    // Show success message
    alert('Hero section updated successfully!');
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hero Section</h1>
        <Button onClick={saveChanges} className="flex items-center gap-2">
          <Save size={16} />
          <span>Save Changes</span>
        </Button>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-6 p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold">Content</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Name/Title</Label>
              <Input 
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Your name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input 
                id="subtitle" 
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Your role or tagline"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description about yourself"
                rows={4}
              />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold pt-4 border-t border-border">Call to Action</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cta-text">Button Text</Label>
              <Input 
                id="cta-text" 
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g., View Projects"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cta-link">Button Link</Label>
              <Input 
                id="cta-link" 
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="e.g., #projects or /contact"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-6 p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold">Images</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="background-image">Background Image URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="background-image" 
                  value={backgroundImage}
                  onChange={(e) => setBackgroundImage(e.target.value)}
                  placeholder="/background.jpg"
                  className="flex-1"
                />
                <Button variant="outline" className="shrink-0">
                  <ImageIcon size={16} className="mr-2" />
                  Browse
                </Button>
              </div>
              
              {backgroundImage && (
                <div className="mt-4 aspect-video bg-black/20 rounded-md overflow-hidden flex items-center justify-center">
                  <img 
                    src={backgroundImage} 
                    alt="Background preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile-image">Profile Image URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="profile-image" 
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="/profile.jpg"
                  className="flex-1"
                />
                <Button variant="outline" className="shrink-0">
                  <ImageIcon size={16} className="mr-2" />
                  Browse
                </Button>
              </div>
              
              {profileImage && (
                <div className="mt-4 w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-primary">
                  <img 
                    src={profileImage} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        
        <div className="relative h-64 rounded-lg overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <h2 className="text-xl text-primary mb-4">{subtitle}</h2>
            <p className="max-w-md mb-6">{description}</p>
            <div>
              <Button>{ctaText}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAdmin;
