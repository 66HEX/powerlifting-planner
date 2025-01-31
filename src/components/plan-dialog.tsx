import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

type Set = {
  id: number;
  weight: number;
  reps: number;
};

type Exercise = {
  id: number;
  name: string;
  sets: Set[];
  comment?: string;
};

type Workout = {
  id: number;
  exercises: Exercise[];
};

type Week = {
  weekNumber: number;
  workouts: Workout[];
};

type Plan = {
  id: number;
  name: string;
  clientName: string;
  durationWeeks: number;
  workoutsPerWeek: number;
  createdAt: Date;
  weeks: Week[];
};

const ExerciseTable: React.FC<{
  exercises: Exercise[];
  onUpdate: (updatedExercises: Exercise[]) => void;
}> = ({ exercises, onUpdate }) => {
  const [expandedExercises, setExpandedExercises] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const newExpanded: Record<number, boolean> = {};
    exercises.forEach((ex) => {
      newExpanded[ex.id] = expandedExercises[ex.id] ?? false;
    });
    setExpandedExercises(newExpanded);
  }, [exercises]);
  const handleExerciseChange = (index: number, field: string, value: any) => {
    const updated = exercises.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex));
    onUpdate(updated);
  };

  const handleSetChange = (exerciseIndex: number, setIndex: number, field: string, value: number) => {
    const updated = exercises.map((ex, i) => {
      if (i !== exerciseIndex) return ex;
      const newSets = ex.sets.map((set, si) => (si === setIndex ? { ...set, [field]: value } : set));
      return { ...ex, sets: newSets };
    });
    onUpdate(updated);
  };

  const addExercise = () => {
    onUpdate([
      ...exercises,
      {
        id: Date.now(),
        name: '',
        sets: [],
        comment: ''
      }
    ]);
  };

  const deleteExercise = (index: number) => {
    onUpdate(exercises.filter((_, i) => i !== index));
  };

  return (
    <div className="border rounded-lg border-white/10">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[200px] text-gray-400">Exercise</TableHead>
            <TableHead className="text-gray-400">Sets</TableHead>
            <TableHead className="text-gray-400">Reps</TableHead>
            <TableHead className="text-gray-400">Weight</TableHead>
            <TableHead className="text-gray-400">Comment</TableHead>
            <TableHead className="w-[100px] text-gray-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exercises.map((exercise, exerciseIndex) => {
            const isExpanded = expandedExercises[exercise.id] || false;
            return (
              <TableRow key={exercise.id} className="hover:bg-gray-300/5">
                <TableCell className="align-top">
                  <div className="flex items-center gap-2">
                    <Input
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(exerciseIndex, 'name', e.target.value)}
                      placeholder="Exercise name"
                      className="border-white/10 flex-grow"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedExercises((prev) => ({
                          ...prev,
                          [exercise.id]: !prev[exercise.id]
                        }))
                      }
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  {isExpanded && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={exercise.sets.length}
                        onChange={(e) => {
                          const count = parseInt(e.target.value);
                          const newSets = Array.from({ length: count }, (_, i) => ({
                            id: Date.now() + i,
                            weight: exercise.sets[i]?.weight || 0,
                            reps: exercise.sets[i]?.reps || 0
                          }));
                          handleExerciseChange(exerciseIndex, 'sets', newSets);
                        }}
                        min="1"
                        className="w-20 border-white/10"
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {isExpanded && (
                    <div className="flex flex-col gap-2 align-top">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={set.id} className="flex gap-2 items-center">
                          <Input
                            type="number"
                            value={set.reps}
                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', Number(e.target.value))}
                            placeholder="Reps"
                            className="w-24 border-white/10"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {isExpanded && (
                    <div className="flex flex-col gap-2 align-top">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={set.id} className="flex gap-2 items-center">
                          <Input
                            type="number"
                            value={set.weight}
                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', Number(e.target.value))}
                            placeholder="Weight"
                            className="w-24 border-white/10"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell className="align-top">
                  {isExpanded && (
                    <Input
                      value={exercise.comment || ''}
                      onChange={(e) => handleExerciseChange(exerciseIndex, 'comment', e.target.value)}
                      placeholder="Comment"
                      className="border-white/10"
                    />
                  )}
                </TableCell>
                <TableCell className="align-top">
                  <Button
                    onClick={() => deleteExercise(exerciseIndex)}
                    className="bg-red-400/40 hover:bg-red-400/50 text-gray-300"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex justify-end p-2">
        <Button
          onClick={addExercise}
          className="bg-transparent border border-white/10 text-gray-300 hover:bg-gray-300/5"
        >
          Add Exercise
        </Button>
      </div>
    </div>
  );
};

const PlanDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Plan) => void;
  selectedPlan: Plan | null;
}> = ({ isOpen, onClose, onSave, selectedPlan }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState(selectedPlan?.name || '');
  const [clientName, setClientName] = useState(selectedPlan?.clientName || '');
  const [durationWeeks, setDurationWeeks] = useState(String(selectedPlan?.durationWeeks || ''));
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(String(selectedPlan?.workoutsPerWeek || ''));
  const [weeks, setWeeks] = useState<Week[]>(selectedPlan?.weeks || []);

  const totalSteps = 1 + (Number(durationWeeks) || 0) * (Number(workoutsPerWeek) || 0);
  const progressValue = (currentStep / totalSteps) * 100;

  const getCurrentWorkout = () => {
    if (currentStep === 1) return null;

    const step = currentStep - 2;
    const weekIndex = Math.floor(step / Number(workoutsPerWeek));
    const workoutIndex = step % Number(workoutsPerWeek);

    return {
      week: weeks[weekIndex],
      weekIndex,
      workout: weeks[weekIndex]?.workouts[workoutIndex],
      workoutIndex
    };
  };

  useEffect(() => {
    if (!currentWorkout) return;

    const { weekIndex, workoutIndex, workout } = currentWorkout;

    // Sprawdź czy to nie pierwszy tydzień i czy ćwiczenia są puste
    if (weekIndex > 0 && workout.exercises.length === 0) {
      const prevWeek = weeks[weekIndex - 1];
      const prevWorkout = prevWeek.workouts[workoutIndex];

      if (prevWorkout && prevWorkout.exercises.length > 0) {
        // Głęboka kopia ćwiczeń z poprzedniego tygodnia
        const copiedExercises = prevWorkout.exercises.map((exercise) => ({
          ...exercise,
          id: Date.now() + Math.random(), // Nowe ID dla unikalności
          sets: exercise.sets.map((set) => ({
            ...set,
            id: Date.now() + Math.random()
          }))
        }));

        const updatedWeeks = weeks.map((week, wIdx) => {
          if (wIdx !== weekIndex) return week;
          return {
            ...week,
            workouts: week.workouts.map((w, woIdx) => {
              if (woIdx !== workoutIndex) return w;
              return { ...w, exercises: copiedExercises };
            })
          };
        });

        setWeeks(updatedWeeks);
      }
    }
  }, [currentStep]);

  useEffect(() => {
    if (!selectedPlan && isOpen) {
      const numberOfWeeks = Number(durationWeeks) || 0;
      const workoutsPerWeekCount = Number(workoutsPerWeek) || 0;

      const newWeeks = Array.from({ length: numberOfWeeks }, (_, weekIndex) => ({
        weekNumber: weekIndex + 1,
        workouts: Array.from({ length: workoutsPerWeekCount }, (_, workoutIndex) => ({
          id: Date.now() + weekIndex * 1000 + workoutIndex,
          exercises: []
        }))
      }));

      setWeeks(newWeeks);
    }
  }, [durationWeeks, workoutsPerWeek, isOpen]);

  const handleSave = () => {
    onSave({
      id: selectedPlan?.id || 0,
      name,
      clientName,
      durationWeeks: Number(durationWeeks),
      workoutsPerWeek: Number(workoutsPerWeek),
      weeks,
      createdAt: selectedPlan?.createdAt || new Date()
    });
    onClose();
  };

  const currentWorkout = getCurrentWorkout();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`bg-gradient-to-tr from-transparent to-gray-300/5 border border-white/10 overflow-y-auto ${
          currentStep === 1 ? 'w-[600px] h-auto' : 'w-[65vw] max-w-[1800px]'
        }`}
      >
        {' '}
        <DialogHeader>
          <DialogTitle className="text-gray-300">{selectedPlan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
          <Progress value={progressValue} className="h-2 bg-gray-800/50" />
        </DialogHeader>
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="text-gray-400">Client Name</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} className="border-white/10" />
            </div>
            <div>
              <Label className="text-gray-400">Plan Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="border-white/10" />
            </div>
            <div>
              <Label className="text-gray-400">Duration (weeks)</Label>
              <Input
                type="number"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(e.target.value)}
                min="1"
                className="border-white/10"
                disabled={!!selectedPlan}
              />
            </div>
            <div>
              <Label className="text-gray-400">Workouts per Week</Label>
              <Input
                type="number"
                value={workoutsPerWeek}
                onChange={(e) => setWorkoutsPerWeek(e.target.value)}
                min="1"
                className="border-white/10"
                disabled={!!selectedPlan}
              />
            </div>
          </div>
        )}
        {currentStep > 1 && currentWorkout && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-300">
              Week {currentWorkout.weekIndex + 1} - Workout {currentWorkout.workoutIndex + 1}
            </h3>

            <ExerciseTable
              exercises={currentWorkout.workout.exercises}
              onUpdate={(updatedExercises) => {
                const updatedWeeks = weeks.map((week, wIndex) => {
                  if (wIndex !== currentWorkout.weekIndex) return week;
                  return {
                    ...week,
                    workouts: week.workouts.map((workout, woIndex) => {
                      if (woIndex !== currentWorkout.workoutIndex) return workout;
                      return { ...workout, exercises: updatedExercises };
                    })
                  };
                });
                setWeeks(updatedWeeks);
              }}
            />
          </div>
        )}
        <DialogFooter>
          <div className="flex gap-2 w-full justify-between">
            {currentStep > 1 && (
              <Button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="bg-transparent border border-white/10 text-gray-300 hover:bg-gray-300/5"
              >
                Previous
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="bg-emerald-400/40 backdrop-blur-md border border-white/10 hover:bg-emerald-400/50 text-gray-300 ml-auto"
                disabled={currentStep === 1 && (!name || !clientName || !durationWeeks || !workoutsPerWeek)}
              >
                {currentStep === 1 ? 'Start Configuration' : 'Next Workout'}
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="bg-emerald-400/40 backdrop-blur-md border border-white/10 hover:bg-emerald-400/50 text-gray-300 ml-auto"
              >
                Save Plan
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDialog;
