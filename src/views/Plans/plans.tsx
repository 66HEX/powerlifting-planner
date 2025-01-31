import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash, ClipboardList } from 'lucide-react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel
} from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import PlanDialog from '@/components/plan-dialog';

type Set = {
  id: number;
  weight: number;
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

type Plan = {
  id: number;
  name: string;
  clientName: string;
  durationWeeks: number;
  workoutsPerWeek: number;
  createdAt: Date;
  workouts: Workout[];
};

// Przykładowe dane z nową strukturą
const initialPlans: Plan[] = [
  {
    id: 1,
    name: 'Mass Gain Plan',
    clientName: 'John Doe',
    durationWeeks: 8,
    workoutsPerWeek: 4,
    createdAt: new Date(2024, 0, 15),
    workouts: [
      {
        id: 1,
        exercises: [
          {
            id: 1,
            name: 'Bench Press',
            sets: [
              { id: 1, weight: 60 },
              { id: 2, weight: 65 },
              { id: 3, weight: 70 }
            ],
            comment: 'Focus on proper form'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Gain Muscle Plan',
    clientName: 'Jane Doe',
    durationWeeks: 12,
    workoutsPerWeek: 3,
    createdAt: new Date(2023, 1, 15),
    workouts: [
      {
        id: 1,
        exercises: [
          {
            id: 1,
            name: 'Hip Thrust',
            sets: [
              { id: 1, weight: 60 },
              { id: 2, weight: 65 },
              { id: 3, weight: 70 }
            ],
            comment: 'Focus on proper form'
          }
        ]
      }
    ]
  }
];

const Plans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [filterClientName, setFilterClientName] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => plan.clientName.toLowerCase().includes(filterClientName.toLowerCase()));
  }, [plans, filterClientName]);

  const columns: ColumnDef<Plan>[] = [
    {
      accessorKey: 'clientName',
      header: 'Client Name'
    },
    {
      accessorKey: 'name',
      header: 'Plan Name'
    },
    {
      accessorKey: 'durationWeeks',
      header: 'Duration (weeks)'
    },
    {
      accessorKey: 'workoutsPerWeek',
      header: 'Workouts per Week'
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'dd/MM/yyyy')
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const plan = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditPlan(plan)}
              className="text-gray-400 hover:text-gray-300"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeletePlan(plan.id)}
              className="text-gray-400 hover:text-gray-300"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const table = useReactTable({
    data: filteredPlans,
    columns,
    state: {
      sorting,
      columnVisibility
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const handleAddPlan = () => {
    setSelectedPlan(null);
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const handleDeletePlan = (planId: number) => {
    setPlans(plans.filter((plan) => plan.id !== planId));
  };

  const handleSavePlan = (plan: Plan) => {
    if (selectedPlan) {
      setPlans(plans.map((p) => (p.id === selectedPlan.id ? plan : p)));
    } else {
      setPlans([
        ...plans,
        {
          ...plan,
          id: plans.length + 1,
          createdAt: new Date(),
          workouts: plan.workouts || []
        }
      ]);
    }
    setIsDialogOpen(false);
  };

  const columnDisplayNames: Record<string, string> = {
    clientName: 'Client Name',
    name: 'Plan Name',
    durationWeeks: 'Duration (weeks)',
    workoutsPerWeek: 'Workouts per Week',
    createdAt: 'Created At'
  };

  return (
    <div className="absolute inset-0 px-4 pt-4 pb-12 overflow-auto bg-black">
      <div className="space-y-4">
        {/* Header Stats Card */}
        <Card className="bg-gradient-to-tr from-transparent to-gray-300/5 border border-white/10">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-full">
                <ClipboardList className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{plans.length}</h3>
                <p className="text-sm font-medium text-gray-400">Total Plans</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Filter by client name..."
                value={filterClientName}
                onChange={(e) => setFilterClientName(e.target.value)}
                className="max-w-sm border border-white/10"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-transparent border border-white/10 text-gray-300 hover:bg-gray-300/5"
                  >
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-white/10">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize text-gray-300"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {columnDisplayNames[column.id] || column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={handleAddPlan}
                className="bg-emerald-400/40 backdrop-blur-md border border-white/10 hover:bg-emerald-400/50 text-gray-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plans Table Card */}
        <Card className="bg-gradient-to-tr from-transparent to-gray-300/5 border border-white/10">
          <CardHeader className="pb-8">
            <CardTitle className="text-lg font-medium text-gray-300">Training Plans</CardTitle>
            <p className="text-sm text-gray-400">Manage and view all your training plans in one place.</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-white/10 hover:bg-gray-300/5">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-gray-400">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="border-b border-white/5 hover:bg-gray-300/5">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-gray-300">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                      No plans found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <PlanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSavePlan}
        selectedPlan={selectedPlan}
      />
    </div>
  );
};

export default Plans;
