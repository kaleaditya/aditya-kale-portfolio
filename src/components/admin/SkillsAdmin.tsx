
import React, { useState, useEffect } from 'react';
import { Plus, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useSkills, Skill } from '@/hooks/useSkills';
import { arrayMove } from '@dnd-kit/sortable';
import { SkillsTable } from './skills/SkillsTable';
import { SkillFormDialog } from './skills/SkillFormDialog';
import { SkillDeleteDialog } from './skills/SkillDeleteDialog';

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

  const handleFormChange = (name: string, value: any) => {
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
      
      // Update in the database
      await updateSkillOrder(updatedSkills);
    }
  };

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

      {error && (
        <div className="bg-destructive/20 text-destructive p-4 rounded-md mb-6">
          <p>Error loading skills: {error}</p>
          <Button variant="outline" onClick={fetchSkills} className="mt-2">
            Try Again
          </Button>
        </div>
      )}

      <SkillsTable
        skills={skills}
        loading={loading}
        onEdit={handleEditSkill}
        onDelete={handleDeleteClick}
        onDragEnd={handleDragEnd}
      />

      <SkillFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formData={formData}
        currentSkill={currentSkill}
        loading={loading}
        onFormChange={handleFormChange}
        onCategoryChange={handleCategoryChange}
        onLevelChange={handleLevelChange}
        onSave={handleSaveSkill}
      />

      <SkillDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        skill={currentSkill}
        loading={loading}
        onDelete={handleDeleteSkill}
      />
    </div>
  );
};

export default SkillsAdmin;
