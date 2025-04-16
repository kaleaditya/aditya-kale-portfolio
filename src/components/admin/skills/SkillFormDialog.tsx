
import React from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';
import { Skill } from '@/hooks/useSkills';

interface SkillFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<Skill>;
  currentSkill: Skill | null;
  loading: boolean;
  onFormChange: (name: string, value: any) => void;
  onCategoryChange: (value: string) => void;
  onLevelChange: (value: number[]) => void;
  onSave: () => void;
}

export const SkillFormDialog = ({
  open,
  onOpenChange,
  formData,
  currentSkill,
  loading,
  onFormChange,
  onCategoryChange,
  onLevelChange,
  onSave
}: SkillFormDialogProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onValueChange={onCategoryChange}
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
              onValueChange={onLevelChange}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={loading}>
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
  );
};
