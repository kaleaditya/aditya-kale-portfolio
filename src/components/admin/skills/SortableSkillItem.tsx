
import React from 'react';
import { Pencil, Trash, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { Skill } from '@/hooks/useSkills';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

export const SortableSkillItem = ({ id, skill, onEdit, onDelete }: SortableItemProps) => {
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
