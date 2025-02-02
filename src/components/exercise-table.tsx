import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Exercise } from '@/types/plan-types';
import { Trash, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Poprawiona ścieżka importu

const ExerciseTable: React.FC<{
  exercises: Exercise[];
  onUpdate: (updatedExercises: Exercise[]) => void;
  workoutId: number;
}> = ({ exercises, onUpdate, workoutId }) => {
  console.log('ExerciseTable workoutId:', workoutId); // Dodane logowanie

  const { toast } = useToast();

  const handleExerciseChange = async (index: number, field: keyof Exercise, value: any) => {
    try {
      const exercise = exercises[index];
      const updatedExercise = { ...exercise, [field]: value };
      await window.Main.db.exercises.update(updatedExercise);
      const updated = exercises.map((ex, i) => (i === index ? updatedExercise : ex));
      onUpdate(updated);
    } catch (error) {
      console.error('Error updating exercise:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update exercise. Please try again.'
      });
    }
  };

  const handleSetChange = async (exerciseIndex: number, setIndex: number, value: string) => {
    try {
      const exercise = exercises[exerciseIndex];
      const set = exercise.sets[setIndex];

      const parts = value.split('x');
      const reps = parts[0] ? parseInt(parts[0], 10) || 0 : 0;
      const weight = parts[1] ? parseInt(parts[1], 10) || 0 : 0;

      const updatedSet = {
        ...set,
        rawInput: value,
        reps,
        weight
      };

      await window.Main.db.sets.update(updatedSet);

      const updated = exercises.map((ex, i) => {
        if (i !== exerciseIndex) return ex;
        const newSets = ex.sets.map((s, si) => (si === setIndex ? updatedSet : s));
        return { ...ex, sets: newSets };
      });

      onUpdate(updated);
    } catch (error) {
      console.error('Error updating set:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update set. Please try again.'
      });
    }
  };

  const handleSetCountChange = async (exerciseIndex: number, count: number) => {
    try {
      const newCount = Math.max(1, count);
      const exercise = exercises[exerciseIndex];
      const currentSetsCount = exercise.sets.length;

      if (newCount > currentSetsCount) {
        // Dodawanie nowych serii
        const newSets = [];
        for (let i = currentSetsCount; i < newCount; i++) {
          const newSet = {
            weight: 0,
            reps: 0,
            rawInput: '0x0'
          };
          const setId = await window.Main.db.sets.create(exercise.id, newSet);
          newSets.push({ ...newSet, id: setId });
        }

        const updatedSets = [...exercise.sets, ...newSets];
        const updatedExercises = exercises.map((ex, i) => (i === exerciseIndex ? { ...ex, sets: updatedSets } : ex));
        onUpdate(updatedExercises);
      } else if (newCount < currentSetsCount) {
        // Usuwanie nadmiarowych serii
        const setsToDelete = exercise.sets.slice(newCount);
        await Promise.all(setsToDelete.map((set) => window.Main.db.sets.delete(set.id)));

        const updatedSets = exercise.sets.slice(0, newCount);
        const updatedExercises = exercises.map((ex, i) => (i === exerciseIndex ? { ...ex, sets: updatedSets } : ex));
        onUpdate(updatedExercises);
      }
    } catch (error) {
      console.error('Error updating sets count:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update sets count. Please try again.'
      });
    }
  };

  const addExercise = async () => {
    try {
      console.log('Adding exercise to workout:', workoutId); // Dodane logowanie

      const newExercise = {
        name: 'New Exercise',
        comment: ''
      };

      const exerciseId = await window.Main.db.exercises.create(workoutId, newExercise);
      console.log('Created exercise with ID:', exerciseId); // Dodane logowanie

      const initialSet = {
        weight: 0,
        reps: 0,
        rawInput: '0x0'
      };

      const setId = await window.Main.db.sets.create(exerciseId, initialSet);
      console.log('Created set with ID:', setId); // Dodane logowanie

      const createdExercise = {
        ...newExercise,
        id: exerciseId,
        sets: [
          {
            ...initialSet,
            id: setId
          }
        ]
      };

      onUpdate([...exercises, createdExercise]);
    } catch (error) {
      console.error('Error adding exercise:', error); // Dodane logowanie błędu
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add exercise. Please try again.'
      });
    }
  };

  const deleteExercise = async (index: number) => {
    try {
      const exercise = exercises[index];
      await window.Main.db.exercises.delete(exercise.id);
      onUpdate(exercises.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete exercise. Please try again.'
      });
    }
  };

  const maxSets = Math.max(...(exercises.length ? exercises.map((ex) => ex.sets.length) : [0]));

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
            <TableHead className="w-40 text-gray-400">Exercise</TableHead>
            {exercises.length > 0 && (
              <>
                <TableHead className="w-16 text-gray-400">Sets</TableHead>
                {Array.from({ length: maxSets }).map((_, setIdx) => (
                  <TableHead key={`set-header-${setIdx + 1}`} className="text-gray-400">
                    Set {setIdx + 1}
                  </TableHead>
                ))}
                <TableHead className="w-40 text-gray-400">Comment</TableHead>
              </>
            )}
            <TableHead className="w-24 text-gray-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exercises.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>
                <Button variant="ghost" size="sm" onClick={addExercise} className="text-gray-400 hover:text-gray-300">
                  <Plus className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            exercises.map((exercise, exerciseIndex) => (
              <TableRow key={exercise.id}>
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
                  <TableCell key={`set-${setIdx}`}>
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
                  <Button variant="ghost" size="sm" onClick={addExercise} className="text-gray-400 hover:text-gray-300">
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
