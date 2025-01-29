import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash } from 'lucide-react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnVisibility
} from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Komponent dialogu do dodawania/edycji planu
const PlanDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Plan) => void;
  selectedPlan: Plan | null;
}> = ({ isOpen, onClose, onSave, selectedPlan }) => {
  const [name, setName] = useState<string>(selectedPlan?.name || '');
  const [clientName, setClientName] = useState<string>(selectedPlan?.clientName || '');
  const [durationWeeks, setDurationWeeks] = useState<number>(selectedPlan?.durationWeeks || 4);
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState<number>(selectedPlan?.workoutsPerWeek || 3);

  const handleSave = () => {
    onSave({
      id: selectedPlan?.id || 0,
      name,
      clientName,
      durationWeeks,
      workoutsPerWeek,
      createdAt: selectedPlan?.createdAt || new Date()
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>{selectedPlan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Client Name</Label>
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Enter client name" />
          </div>
          <div>
            <Label>Plan Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter plan name" />
          </div>
          <div>
            <Label>Duration (weeks)</Label>
            <Input
              type="number"
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              min="1"
            />
          </div>
          <div>
            <Label>Workouts per Week</Label>
            <Input
              type="number"
              value={workoutsPerWeek}
              onChange={(e) => setWorkoutsPerWeek(Number(e.target.value))}
              min="1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>{selectedPlan ? 'Save Changes' : 'Add Plan'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Typy danych
type Plan = {
  id: number;
  name: string;
  clientName: string;
  durationWeeks: number;
  workoutsPerWeek: number;
  createdAt: Date;
};

// Przykładowe dane
const initialPlans: Plan[] = [
  {
    id: 1,
    name: 'Mass Gain Plan',
    clientName: 'John Doe',
    durationWeeks: 8,
    workoutsPerWeek: 4,
    createdAt: new Date(2024, 0, 15)
  },
  {
    id: 2,
    name: 'Strength Plan',
    clientName: 'Jane Smith',
    durationWeeks: 12,
    workoutsPerWeek: 3,
    createdAt: new Date(2024, 1, 1)
  }
];

const Plans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [filterClientName, setFilterClientName] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Filtrowanie planów po nazwie klienta
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => plan.clientName.toLowerCase().includes(filterClientName.toLowerCase()));
  }, [plans, filterClientName]);

  // Kolumny tabeli
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
            <Button variant="ghost" size="sm" onClick={() => handleEditPlan(plan)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan.id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  // Tabela
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

  // Dodawanie nowego planu
  const handleAddPlan = () => {
    setSelectedPlan(null);
    setIsDialogOpen(true);
  };

  // Edycja planu
  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  // Usuwanie planu
  const handleDeletePlan = (planId: number) => {
    setPlans(plans.filter((plan) => plan.id !== planId));
  };

  // Zapis planu
  const handleSavePlan = (plan: Plan) => {
    if (selectedPlan) {
      setPlans(plans.map((p) => (p.id === selectedPlan.id ? plan : p)));
    } else {
      setPlans([...plans, { ...plan, id: plans.length + 1, createdAt: new Date() }]);
    }
    setIsDialogOpen(false);
  };

  // Przyjazne nazwy kolumn dla menu rozwijanego
  const columnDisplayNames: Record<string, string> = {
    clientName: 'Client Name',
    name: 'Plan Name',
    durationWeeks: 'Duration (weeks)',
    workoutsPerWeek: 'Workouts per Week',
    createdAt: 'Created At'
  };

  return (
    <div className="p-4 absolute inset-0 overflow-auto bg-background">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Training Plans</h1>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter by client name..."
            value={filterClientName}
            onChange={(e) => setFilterClientName(e.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {columnDisplayNames[column.id] || column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddPlan}>
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No plans found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog do dodawania/edycji planu */}
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
