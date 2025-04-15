
import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash, Grip, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from "@/hooks/use-toast";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSocialLinks, SocialLink } from '@/hooks/useSocialLinks';

// Sortable item component
const SortableItem = ({ link, updateSocialLink, removeSocialLink }: {
  link: SocialLink;
  updateSocialLink: (id: string, field: string, value: string | boolean) => void;
  removeSocialLink: (id: string) => void;
}) => {
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
  const { 
    socialLinks, 
    loading, 
    error, 
    fetchSocialLinks, 
    addSocialLink, 
    updateSocialLink: updateLink, 
    deleteSocialLink,
    updateSocialLinkOrder 
  } = useSocialLinks();
  
  const [newLink, setNewLink] = useState<Omit<SocialLink, 'id' | 'created_at' | 'updated_at' | 'display_order'>>({
    platform: '',
    url: '',
    icon: null,
    enabled: true,
  });

  useEffect(() => {
    fetchSocialLinks();
  }, []);
  
  // Set up DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const updateSocialLink = (id: string, field: string, value: string | boolean) => {
    updateLink(id, { [field]: value });
  };
  
  const addNewSocialLink = async () => {
    if (newLink.platform.trim() && newLink.url.trim()) {
      // Find highest display order and increment by 1
      const highestOrder = socialLinks.length > 0 
        ? Math.max(...socialLinks.map(link => link.display_order)) 
        : -1;
        
      await addSocialLink({
        ...newLink,
        display_order: highestOrder + 1,
      });
      
      setNewLink({
        platform: '',
        url: '',
        icon: null,
        enabled: true,
      });
    }
  };
  
  const removeSocialLink = async (id: string) => {
    await deleteSocialLink(id);
  };
  
  const saveChanges = () => {
    // This is now automatically saved on each update
    toast({
      title: "Changes saved",
      description: "All changes are automatically saved",
    });
  };
  
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Find the current items
      const oldIndex = socialLinks.findIndex(item => item.id === active.id);
      const newIndex = socialLinks.findIndex(item => item.id === over.id);
      
      // Update local state first for immediate UI feedback
      const newOrder = arrayMove(socialLinks, oldIndex, newIndex);
      
      // Create updates with new display order values
      const updates = newOrder.map((link, index) => ({
        id: link.id,
        display_order: index
      }));
      
      // Send the updates to the database
      await updateSocialLinkOrder(updates);
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
      
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="bg-destructive/20 text-destructive p-4 rounded-md mb-6">
          <p>Error loading social links: {error}</p>
          <Button variant="outline" onClick={fetchSocialLinks} className="mt-2">
            Try Again
          </Button>
        </div>
      )}
      
      {!loading && !error && (
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
                  onClick={addNewSocialLink}
                  disabled={!newLink.platform.trim() || !newLink.url.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : 'Add'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
