
import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Loader2, Plus, Edit, Trash, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useHero, Hero } from '@/hooks/useHero';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const HeroAdmin = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [currentHeroId, setCurrentHeroId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [heroToDelete, setHeroToDelete] = useState<Hero | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  
  const { 
    heroes, 
    loading, 
    error, 
    fetchAllHeroes, 
    createHero, 
    updateHero, 
    deleteHero,
    uploadImage,
    uploadProgress
  } = useHero();
  
  useEffect(() => {
    fetchAllHeroes();
  }, []);
  
  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setDescription('');
    setBackgroundImage('');
    setProfileImage('');
    setCtaText('');
    setCtaLink('');
    setIsActive(true);
    setCurrentHeroId(null);
    setBackgroundFile(null);
    setProfileFile(null);
  };
  
  const handleHeroEdit = (hero: Hero) => {
    setTitle(hero.title);
    setSubtitle(hero.subtitle);
    setDescription(hero.description);
    setBackgroundImage(hero.background_image || '');
    setProfileImage(hero.profile_image || '');
    setCtaText(hero.cta_text || '');
    setCtaLink(hero.cta_link || '');
    setIsActive(hero.is_active);
    setCurrentHeroId(hero.id);
  };
  
  const handleDeleteClick = (hero: Hero) => {
    setHeroToDelete(hero);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (heroToDelete) {
      await deleteHero(heroToDelete.id);
      setIsDeleteDialogOpen(false);
      setHeroToDelete(null);
    }
  };
  
  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setBackgroundFile(files[0]);
      // Create a temp preview URL
      setBackgroundImage(URL.createObjectURL(files[0]));
    }
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setProfileFile(files[0]);
      // Create a temp preview URL
      setProfileImage(URL.createObjectURL(files[0]));
    }
  };
  
  const saveChanges = async () => {
    try {
      if (!title || !subtitle || !description) {
        alert('Please fill in all required fields: title, subtitle, and description');
        return;
      }
      
      let finalBackgroundImage = backgroundImage;
      let finalProfileImage = profileImage;
      
      // Upload images if files were selected
      if (backgroundFile) {
        const backgroundUrl = await uploadImage(backgroundFile, 'background');
        if (backgroundUrl) {
          finalBackgroundImage = backgroundUrl;
        }
      }
      
      if (profileFile) {
        const profileUrl = await uploadImage(profileFile, 'profile');
        if (profileUrl) {
          finalProfileImage = profileUrl;
        }
      }
      
      const heroData = {
        title,
        subtitle,
        description,
        background_image: finalBackgroundImage || null,
        profile_image: finalProfileImage || null,
        cta_text: ctaText || null,
        cta_link: ctaLink || null,
        is_active: isActive
      };
      
      if (currentHeroId) {
        // Update existing hero
        await updateHero(currentHeroId, heroData);
      } else {
        // Create new hero
        await createHero(heroData);
        resetForm();
      }
    } catch (err) {
      console.error('Error saving hero:', err);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hero Section</h1>
        <div className="flex items-center gap-2">
          <Button onClick={resetForm} variant="outline" className="flex items-center gap-2">
            <Plus size={16} />
            <span>New</span>
          </Button>
          <Button onClick={saveChanges} disabled={loading} className="flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{currentHeroId ? 'Update' : 'Save'}</span>
              </>
            )}
          </Button>
        </div>
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
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is-active" 
                checked={isActive} 
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="is-active">Set as active hero (displayed on homepage)</Label>
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
              <Label htmlFor="background-image">Background Image</Label>
              <div className="flex gap-2">
                <Input 
                  id="background-image-url" 
                  value={backgroundImage}
                  onChange={(e) => setBackgroundImage(e.target.value)}
                  placeholder="/background.jpg"
                  className="flex-1"
                />
                <div className="relative">
                  <Input
                    id="background-image"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleBackgroundImageChange}
                  />
                  <Button variant="outline" className="shrink-0">
                    <ImageIcon size={16} className="mr-2" />
                    Browse
                  </Button>
                </div>
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
              <Label htmlFor="profile-image">Profile Image</Label>
              <div className="flex gap-2">
                <Input 
                  id="profile-image-url" 
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="/profile.jpg"
                  className="flex-1"
                />
                <div className="relative">
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleProfileImageChange}
                  />
                  <Button variant="outline" className="shrink-0">
                    <ImageIcon size={16} className="mr-2" />
                    Browse
                  </Button>
                </div>
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
      
      {loading && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-secondary rounded-full h-2.5 mt-4">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
      
      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        
        <div className="relative h-64 rounded-lg overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${backgroundImage || '/placeholder.svg'})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{title || 'Your Name'}</h1>
            <h2 className="text-xl text-primary mb-4">{subtitle || 'Your Title'}</h2>
            <p className="max-w-md mb-6">{description || 'Your description here'}</p>
            <div>
              <Button>{ctaText || 'Call to Action'}</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subtitle</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {heroes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No hero sections found. Create one using the form above.
                </TableCell>
              </TableRow>
            ) : (
              heroes.map((hero) => (
                <TableRow key={hero.id}>
                  <TableCell className="font-medium">{hero.title}</TableCell>
                  <TableCell>{hero.subtitle}</TableCell>
                  <TableCell>
                    {hero.is_active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleHeroEdit(hero)}>
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(hero)}>
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the hero section "{heroToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash size={16} className="mr-2" />
                  <span>Delete</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroAdmin;
