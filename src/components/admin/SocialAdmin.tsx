
import React, { useState } from 'react';
import { Save, Plus, Trash, Grip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from "@/hooks/use-toast";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sample social link type
interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  enabled: boolean;
}

// Sortable item component
const SortableItem = ({ link, updateSocialLink, removeSocialLink }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="grid gap-4 sm:grid-cols-[auto,1fr,1fr,auto,auto] items-end border-b border-border pb-4"
    >
      <div 
        className="flex items-center justify-center w-8 h-8 bg-secondary rounded-md cursor-grab" 
        {...attributes} 
        {...listeners}
      >
        <Grip size={16} className="text-muted-foreground" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`platform-${link.id}`}>Platform</Label>
        <Input 
          id={`platform-${link.id}`}
          value={link.platform}
          onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
          placeholder="e.g., GitHub"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`url-${link.id}`}>URL</Label>
        <Input 
          id={`url-${link.id}`}
          value={link.url}
          onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
          placeholder="https://..."
        />
      </div>
      
      <div className="flex items-center justify-center">
        <Switch 
          checked={link.enabled}
          onCheckedChange={(checked) => updateSocialLink(link.id, 'enabled', checked)}
        />
      </div>
      
      <div>
        <Button 
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => removeSocialLink(link.id)}
        >
          <Trash size={16} />
        </Button>
      </div>
    </div>
  );
};

const SocialAdmin = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: '1',
      platform: 'GitHub',
      url: 'https://github.com/username',
      icon: 'github',
      enabled: true,
    },
    {
      id: '2',
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/username',
      icon: 'linkedin',
      enabled: true,
    },
    {
      id: '3',
      platform: 'Twitter',
      url: 'https://twitter.com/username',
      icon: 'twitter',
      enabled: true,
    },
    {
      id: '4',
      platform: 'Instagram',
      url: 'https://instagram.com/username',
      icon: 'instagram',
      enabled: false,
    },
  ]);
  
  const [newLink, setNewLink] = useState<Omit<SocialLink, 'id'>>({
    platform: '',
    url: '',
    icon: '',
    enabled: true,
  });
  
  // Set up DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const updateSocialLink = (id: string, field: string, value: string | boolean) => {
    setSocialLinks(socialLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };
  
  const addSocialLink = () => {
    if (newLink.platform.trim() && newLink.url.trim()) {
      setSocialLinks([
        ...socialLinks,
        {
          ...newLink,
          id: Date.now().toString(),
        },
      ]);
      setNewLink({
        platform: '',
        url: '',
        icon: '',
        enabled: true,
      });
      toast({
        title: "Social link added",
        description: `${newLink.platform} has been added to your social links`,
      });
    }
  };
  
  const removeSocialLink = (id: string) => {
    const linkToRemove = socialLinks.find(link => link.id === id);
    setSocialLinks(socialLinks.filter(link => link.id !== id));
    
    if (linkToRemove) {
      toast({
        title: "Social link removed",
        description: `${linkToRemove.platform} has been removed from your social links`,
        variant: "destructive",
      });
    }
  };
  
  const saveChanges = () => {
    console.log('Saving social links:', socialLinks);
    toast({
      title: "Changes saved",
      description: "Your social links have been updated successfully",
    });
  };
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSocialLinks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
      
      toast({
        title: "Order updated",
        description: "Social links order has been updated",
      });
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Social Media</h1>
        <Button onClick={saveChanges} className="flex items-center gap-2">
          <Save size={16} />
          <span>Save Changes</span>
        </Button>
      </div>
      
      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-6">Social Links</h2>
        
        <div className="space-y-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={socialLinks.map(link => link.id)} 
              strategy={verticalListSortingStrategy}
            >
              {socialLinks.map((link) => (
                <SortableItem 
                  key={link.id} 
                  link={link} 
                  updateSocialLink={updateSocialLink} 
                  removeSocialLink={removeSocialLink} 
                />
              ))}
            </SortableContext>
          </DndContext>
          
          <div className="grid gap-4 sm:grid-cols-[auto,1fr,1fr,auto,auto] items-end pt-2">
            <div className="flex items-center justify-center w-8 h-8">
              <Plus size={18} className="text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-platform">New Platform</Label>
              <Input 
                id="new-platform"
                value={newLink.platform}
                onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                placeholder="e.g., GitHub"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-url">URL</Label>
              <Input 
                id="new-url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            
            <div className="flex items-center justify-center">
              <Switch 
                checked={newLink.enabled}
                onCheckedChange={(checked) => setNewLink({ ...newLink, enabled: checked })}
              />
            </div>
            
            <div>
              <Button 
                variant="outline"
                onClick={addSocialLink}
                disabled={!newLink.platform.trim() || !newLink.url.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {socialLinks.filter(link => link.enabled).map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <span className="text-lg font-bold">{link.platform.charAt(0)}</span>
            </a>
          ))}
        </div>
        
        {socialLinks.filter(link => link.enabled).length === 0 && (
          <p className="text-center text-muted-foreground">No active social links to display.</p>
        )}
      </div>
    </div>
  );
};

export default SocialAdmin;
