
import React from 'react';
import { Skill } from '@/hooks/useSkills';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { SortableSkillItem } from './SortableSkillItem';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface SkillsTableProps {
  skills: Skill[];
  loading: boolean;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
  onDragEnd: (event: any) => void;
}

export const SkillsTable = ({ skills, loading, onEdit, onDelete, onDragEnd }: SkillsTableProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
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
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={skills.map(skill => skill.id)}
                strategy={verticalListSortingStrategy}
              >
                {skills.map((skill) => (
                  <SortableSkillItem
                    key={skill.id}
                    id={skill.id}
                    skill={skill}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
