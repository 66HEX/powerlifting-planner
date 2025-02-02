import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import ExerciseTable from '@/components/exercise-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Plan, type Week } from '@/types/plan-types';
import { useToast } from '@/hooks/use-toast';

const PlanDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Omit<Plan, 'id' | 'createdAt' | 'weeks'>) => Promise<number>;
  selectedPlan: Plan | null;
  onPlanSaved?: () => void;
}> = ({ isOpen, onClose, onSave, selectedPlan, onPlanSaved }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState(selectedPlan?.name || '');
  const [clientName, setClientName] = useState(selectedPlan?.clientName || '');
  const [durationWeeks, setDurationWeeks] = useState(String(selectedPlan?.durationWeeks || ''));
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(String(selectedPlan?.workoutsPerWeek || ''));
  const [weeks, setWeeks] = useState<Week[]>(selectedPlan?.weeks || []);
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 1 + (Number(durationWeeks) || 0) * (Number(workoutsPerWeek) || 0) + 1;
  const progressValue = (currentStep / totalSteps) * 100;

  const getCurrentWorkout = () => {
    if (currentStep === 1 || currentStep === totalSteps) return null;

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

  const currentWorkout = getCurrentWorkout();

  useEffect(() => {
    if (!currentWorkout) return;

    const { weekIndex, workoutIndex, workout } = currentWorkout;

    if (weekIndex > 0 && workout.exercises.length === 0) {
      const prevWeek = weeks[weekIndex - 1];
      const prevWorkout = prevWeek.workouts[workoutIndex];

      if (prevWorkout && prevWorkout.exercises.length > 0) {
        const copiedExercises = prevWorkout.exercises.map((exercise) => ({
          ...exercise,
          id: Date.now() + Math.random(),
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

      const newWeeks = Array.from({ length: numberOfWeeks }, (_outer, weekIndex) => ({
        weekNumber: weekIndex + 1,
        workouts: Array.from({ length: workoutsPerWeekCount }, (_inner, workoutIndex) => ({
          id: Date.now() + weekIndex * 1000 + workoutIndex,
          exercises: []
        }))
      }));

      setWeeks(newWeeks);
    }
  }, [durationWeeks, workoutsPerWeek, isOpen, selectedPlan]);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (selectedPlan) {
        setName(selectedPlan.name);
        setClientName(selectedPlan.clientName);
        setDurationWeeks(String(selectedPlan.durationWeeks));
        setWorkoutsPerWeek(String(selectedPlan.workoutsPerWeek));
        setWeeks(selectedPlan.weeks);
      } else {
        setName('');
        setClientName('');
        setDurationWeeks('');
        setWorkoutsPerWeek('');
        setWeeks([]);
      }
      setCurrentStep(1);
    }
  }, [isOpen, selectedPlan]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const planData = {
        name,
        clientName,
        durationWeeks: Number(durationWeeks),
        workoutsPerWeek: Number(workoutsPerWeek)
      };

      const planId = await onSave(planData);

      if (!selectedPlan && planId) {
        for (let i = 0; i < weeks.length; i++) {
          const weekId = await window.Main.db.weeks.create(planId, i + 1);

          for (const workout of weeks[i].workouts) {
            const workoutId = await window.Main.db.workouts.create(weekId);

            for (const exercise of workout.exercises) {
              const exerciseId = await window.Main.db.exercises.create(workoutId, {
                name: exercise.name,
                comment: exercise.comment
              });

              for (const set of exercise.sets) {
                await window.Main.db.sets.create(exerciseId, {
                  weight: set.weight,
                  reps: set.reps,
                  rawInput: set.rawInput
                });
              }
            }
          }
        }
      }

      toast({
        title: 'Success',
        description: selectedPlan ? 'Plan updated successfully' : 'Plan created successfully'
      });

      // Wywołanie callbacka po pomyślnym zapisaniu
      if (onPlanSaved) {
        onPlanSaved();
      }

      onClose();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save plan. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const maxSets = Math.max(
    ...weeks.flatMap((week) =>
      week.workouts.flatMap((workout) => workout.exercises.map((exercise) => exercise.sets.length))
    )
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`bg-gradient-to-tr from-transparent to-gray-300/5 border border-white/10 overflow-y-auto ${
          currentStep === 1 ? 'w-[600px] h-auto' : 'w-[65vw] max-w-[1000px]'
        }`}
      >
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

        {currentStep > 1 && currentStep < totalSteps && currentWorkout && (
          <ScrollArea className="space-y-4 max-h-[70vh]">
            <h3 className="text-xl font-semibold text-gray-300">
              Week {currentWorkout.weekIndex + 1} - Workout {currentWorkout.workoutIndex + 1}
            </h3>
            <ExerciseTable
              exercises={currentWorkout.workout.exercises}
              workoutId={currentWorkout.workout.id}
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
          </ScrollArea>
        )}

        {currentStep === totalSteps && (
          <ScrollArea className="w-full max-h-[70vh]">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-300">Plan Summary</h3>
                <div className="flex gap-4 text-gray-400">
                  <p>Client: {clientName}</p>
                  <p>Duration: {durationWeeks} weeks</p>
                  <p>{workoutsPerWeek} workouts/week</p>
                </div>
              </div>

              {weeks.map((week) => {
                const hasExercises = week.workouts.some((workout) => workout.exercises.length > 0);

                return (
                  <div key={week.weekNumber} className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-300">Week {week.weekNumber}</h4>
                    {week.workouts.map((workout, workoutIndex) => (
                      <div key={workout.id} className="space-y-2">
                        <p className="text-gray-400 font-medium">Workout {workoutIndex + 1}</p>
                        <div className="border rounded-lg border-white/10 overflow-hidden">
                          <Table className="table-fixed">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-40 text-gray-400">Exercise</TableHead>
                                {Array.from({ length: maxSets }).map((_, setIdx) => (
                                  <TableHead key={`set-header-${setIdx + 1}`} className="text-gray-400">
                                    Set {setIdx + 1}
                                  </TableHead>
                                ))}
                                {hasExercises && <TableHead className="w-40 text-gray-400">Comment</TableHead>}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {workout.exercises.map((exercise) => (
                                <TableRow key={exercise.id} className="hover:bg-gray-300/5">
                                  <TableCell className="font-medium text-gray-300">{exercise.name}</TableCell>
                                  {Array.from({ length: maxSets }).map((_, setIdx) => {
                                    const set = exercise.sets[setIdx];
                                    return (
                                      <TableCell
                                        key={`exercise-${exercise.id}-set-${setIdx}`}
                                        className="text-gray-400"
                                      >
                                        {set ? `${set.reps}x${set.weight}kg` : '-'}
                                      </TableCell>
                                    );
                                  })}
                                  {hasExercises && (
                                    <TableCell className="text-gray-400">{exercise.comment || '-'}</TableCell>
                                  )}
                                </TableRow>
                              ))}
                              {workout.exercises.length === 0 && (
                                <TableRow>
                                  <TableCell
                                    colSpan={hasExercises ? 1 + maxSets + 1 : 1 + maxSets}
                                    className="text-gray-400 text-center h-24"
                                  >
                                    No exercises
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <div className="flex gap-2 w-full justify-end">
            {currentStep > 1 && (
              <Button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="bg-transparent border border-white/10 text-gray-300 hover:bg-gray-300/5 mr-auto"
                disabled={isSaving}
              >
                Previous
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="bg-emerald-800/50 backdrop-blur-md border border-white/10 hover:bg-emerald-800/60 text-gray-300"
                disabled={
                  (currentStep === 1 && (!name || !clientName || !durationWeeks || !workoutsPerWeek)) || isSaving
                }
              >
                {currentStep === 1 ? 'Start Configuration' : 'Next'}
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="bg-emerald-800/50 backdrop-blur-md border border-white/10 hover:bg-emerald-800/60 text-gray-300"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Plan'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDialog;
