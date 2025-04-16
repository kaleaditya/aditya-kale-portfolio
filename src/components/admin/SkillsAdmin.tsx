
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash, Save, Move, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { useSkills, Skill } from '@/hooks/useSkills';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

const SortableItem = ({ id, skill, onEdit, onDelete }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <TableRow ref={setNodeRef} style={style} {...attributes}>
      <TableCell>
        <div className="flex items-center justify-center cursor-grab" {...listeners}>
          <Move size={16} />
        </div>
      </TableCell>
      <TableCell className="font-medium">{skill.name}</TableCell>
      <TableCell>{skill.category}</TableCell>
      <TableCell>
        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full" 
            style={{ width: `${skill.level}%` }}
          ></div>
        </div>
        <span className="text-xs text-muted-foreground mt-1">{skill.level}%</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(skill)}
          >
            <Pencil size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(skill)}
          >
            <Trash size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

const SkillsAdmin = () => {
  const { skills, loading, error, fetchSkills, addSkill, updateSkill, deleteSkill, updateSkillOrder } = useSkills();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    category: 'Frontend',
    level: 50,
    display_order: 0
  });

  // DnD setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleNewSkill = () => {
    setFormData({
      name: '',
      category: 'Frontend',
      level: 50,
      display_order: skills.length
    });
    setCurrentSkill(null);
    setIsDialogOpen(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      display_order: skill.display_order
    });
    setCurrentSkill(skill);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (skill: Skill) => {
    setCurrentSkill(skill);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSkill = async () => {
    if (currentSkill) {
      const success = await deleteSkill(currentSkill.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        setCurrentSkill(null);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleLevelChange = (value: number[]) => {
    setFormData(prev => ({
      ...prev,
      level: value[0]
    }));
  };

  const handleSaveSkill = async () => {
    if (!formData.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (currentSkill) {
        await updateSkill(currentSkill.id, formData);
      } else {
        await addSkill(formData as Omit<Skill, 'id' | 'created_at' | 'updated_at'>);
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error saving skill:', err);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = skills.findIndex(skill => skill.id === active.id);
      const newIndex = skills.findIndex(skill => skill.id === over.id);
      
      const newSkills = arrayMove(skills, oldIndex, newIndex);
      
      // Update display_order for all affected skills
      const updatedSkills = newSkills.map((skill, index) => ({
        id: skill.id,
        display_order: index
      }));
      
      // Optimistically update the UI
      setSkills(newSkills);
      
      // Update in the database
      await updateSkillOrder(updatedSkills);
    }
  };

  // Need to add this setSkills function as it's used by handleDragEnd
  const [setSkills] = useState<React.Dispatch<React.SetStateAction<Skill[]>>>(() => {
    return (newSkills) => {
      // This is just a placeholder function that will be overwritten by the real setSkills
      // from the useSkills hook
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Skills</h1>
        <div className="flex gap-2">
          <Button onClick={fetchSkills} className="flex items-center gap-2" variant="outline">
            <Save size={16} />
            <span>Refresh</span>
          </Button>
          <Button onClick={handleNewSkill} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add Skill</span>
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="bg-destructive/20 text-destructive p-4 rounded-md mb-6">
          <p>Error loading skills: {error}</p>
          <Button variant="outline" onClick={fetchSkills} className="mt-2">
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No skills found. Click "Add Skill" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={skills.map(skill => skill.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {skills.map((skill) => (
                      <SortableItem
                        key={skill.id}
                        id={skill.id}
                        skill={skill}
                        onEdit={handleEditSkill}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Skill Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentSkill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Skill Name</Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="e.g., React, TypeScript, UI/UX Design"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category || 'Frontend'} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Backend">Backend</SelectItem>
                  <SelectItem value="Database">Database</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="level">Skill Level</Label>
                <span className="text-sm text-muted-foreground">{formData.level || 0}%</span>
              </div>
              <Slider 
                id="level"
                defaultValue={[formData.level || 50]} 
                max={100} 
                step={1}
                onValueChange={handleLevelChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSkill} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : currentSkill ? 'Update Skill' : 'Add Skill'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <p className="text-muted-foreground">
            Are you sure you want to delete the skill "{currentSkill?.name}"? 
            This action cannot be undone.
          </p>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteSkill}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillsAdmin;
