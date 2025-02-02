import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Exercise } from '@/types/plan-types';
import { Trash, Plus } from 'lucide-react';

const ExerciseTable: React.FC<{
  exercises: Exercise[];
  onUpdate: (updatedExercises: Exercise[]) => void;
}> = ({ exercises, onUpdate }) => {
  const handleExerciseChange = (index: number, field: keyof Exercise, value: any) => {
    const updated = exercises.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex));
    onUpdate(updated);
  };

  const handleSetChange = (exerciseIndex: number, setIndex: number, value: string) => {
    const updated = exercises.map((ex, i) => {
      if (i !== exerciseIndex) return ex;
      const newSets = ex.sets.map((set, si) => {
        if (si !== setIndex) return set;

        const parts = value.split('x');
        const reps = parts[0] ? parseInt(parts[0], 10) || 0 : 0;
        const weight = parts[1] ? parseInt(parts[1], 10) || 0 : 0;

        return {
          ...set,
          rawInput: value,
          reps,
          weight
        };
      });
      return { ...ex, sets: newSets };
    });
    onUpdate(updated);
  };

  const handleSetCountChange = (exerciseIndex: number, count: number) => {
    const newCount = Math.max(1, count);
    const exercise = exercises[exerciseIndex];
    const generateId = () => Date.now() + Math.random();

    const newSets = Array.from({ length: newCount }, (_, idx) => ({
      id: exercise.sets[idx]?.id || generateId(),
      weight: exercise.sets[idx]?.weight || 0,
      reps: exercise.sets[idx]?.reps || 0,
      rawInput: exercise.sets[idx]?.rawInput || '0x0'
    }));

    handleExerciseChange(exerciseIndex, 'sets', newSets);
  };

  const addExercise = () => {
    onUpdate([
      ...exercises,
      {
        id: Date.now(),
        name: 'New Exercise',
        sets: [{ id: Date.now(), weight: 0, reps: 0 }],
        comment: ''
      }
    ]);
  };

  const deleteExercise = (index: number) => {
    onUpdate(exercises.filter((_, i) => i !== index));
  };

  const maxSets = Math.max(...exercises.map((ex) => ex.sets.length));

  const renderSetInput = (exerciseIndex: number, setIndex: number, set: Exercise['sets'][number]) => (
    <Input
      value={set.rawInput || `${set.reps}x${set.weight}`}
      onChange={(e) => handleSetChange(exerciseIndex, setIndex, e.target.value)}
      placeholder="8x60"
      className="border-white/10"
    />
  );

  return (
    <div className="border rounded-lg border-white/10 overflow-auto">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            {exercises.length === 0 ? (
              <TableHead className="w-40 text-gray-400">Exercise</TableHead>
            ) : (
              <>
                <TableHead className="w-40 text-gray-400">Exercise</TableHead>
                <TableHead className="w-16 text-gray-400">Sets</TableHead>
                {Array.from({ length: maxSets }).map((_, setIdx) => (
                  <TableHead key={`set-header-${setIdx + 1}`} className="text-gray-400">
                    Set {setIdx + 1}
                  </TableHead>
                ))}
                <TableHead className="w-40 text-gray-400">Comment</TableHead>
                <TableHead className="w-24 text-gray-400">Actions</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {exercises.length === 0 ? (
            <TableRow className="hover:bg-gray-300/5">
              <TableCell colSpan={4 + maxSets}>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={addExercise} className="text-gray-400 hover:text-gray-300">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            exercises.map((exercise, exerciseIndex) => (
              <TableRow key={exercise.id} className="hover:bg-gray-300/5">
                <TableCell>
                  <Input
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(exerciseIndex, 'name', e.target.value)}
                    placeholder="Exercise name"
                    className="border-white/10"
                  />
                </TableCell>

                <TableCell>
                  <Input
                    type="number"
                    value={exercise.sets.length}
                    onChange={(e) => handleSetCountChange(exerciseIndex, parseInt(e.target.value, 10))}
                    min="1"
                    className="border-white/10"
                  />
                </TableCell>

                {Array.from({ length: maxSets }).map((_, setIdx) => (
                  <TableCell key={`exercise-${exercise.id}-set-${exercise.sets[setIdx].id}`}>
                    {setIdx < exercise.sets.length && renderSetInput(exerciseIndex, setIdx, exercise.sets[setIdx])}
                  </TableCell>
                ))}

                <TableCell>
                  <Input
                    value={exercise.comment || ''}
                    onChange={(e) => handleExerciseChange(exerciseIndex, 'comment', e.target.value)}
                    placeholder="Comment"
                    className="border-white/10"
                  />
                </TableCell>

                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addExercise()}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteExercise(exerciseIndex)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExerciseTable;
