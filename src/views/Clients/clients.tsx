import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash, Plus, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  goal: string;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  goal: string;
};

const initialClients: Client[] = [
  { id: 1, name: 'Anna Smith', email: 'anna.smith@example.com', phone: '123-456-7890', goal: 'Weight Loss' },
  { id: 2, name: 'John Miller', email: 'john.miller@example.com', phone: '987-654-3210', goal: 'Muscle Gain' },
  { id: 3, name: 'Mary Johnson', email: 'mary.johnson@example.com', phone: '555-555-5555', goal: 'Conditioning' }
];

const ActionsCell = ({
  row,
  onEdit,
  onDelete
}: {
  row: any;
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
}) => {
  const client = row.original;
  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={() => onEdit(client)} className="text-gray-400 hover:text-gray-300">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(client.id)}
        className="text-gray-400 hover:text-gray-300"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      goal: ''
    }
  });

  const handleEdit = useCallback(
    (client: Client) => {
      setSelectedClient(client);
      setIsEditing(true);
      form.reset(client);
      setIsDialogOpen(true);
    },
    [form]
  );

  const handleDelete = useCallback((id: number) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedClient(null);
    setIsEditing(false);
    form.reset({ name: '', email: '', phone: '', goal: '' });
    setIsDialogOpen(true);
  }, [form]);

  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      { accessorKey: 'name', header: 'Client Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'phone', header: 'Phone' },
      { accessorKey: 'goal', header: 'Goal' },
      {
        id: 'actions',
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <ActionsCell
            row={row}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )
      }
    ],
    [handleDelete, handleEdit]
  );

  const table = useReactTable({
    data: clients,
    columns,
    state: {
      columnVisibility,
      globalFilter: nameFilter
    },
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel()
  });

  const onSubmit = useCallback(
    (data: FormData) => {
      if (isEditing && selectedClient) {
        setClients((prev) => prev.map((client) => (client.id === selectedClient.id ? { ...client, ...data } : client)));
      } else {
        setClients((prev) => [...prev, { id: prev.length + 1, ...data }]);
      }
      setIsDialogOpen(false);
    },
    [isEditing, selectedClient]
  );

  return (
    <div className="absolute inset-0 px-4 pt-4 pb-12 overflow-auto">
      <div className="space-y-4">
        {/* Header Stats Card */}
        <Card className="bg-gradient-to-tr from-transparent to-gray-300/5 border border-white/10">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-full">
                <Users className="h-8 w-8 text-emerald-800" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{clients.length}</h3>
                <p className="text-sm font-medium text-gray-400">Total Clients</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Filter by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="max-w-sm border border-white/10 "
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
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize text-gray-300"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={handleAdd}
                className="bg-emerald-800/50 backdrop-blur-md border border-white/10 hover:bg-emerald-800/60 text-gray-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clients Table Card */}
        <Card className="bg-gradient-to-tr from-transparent to-gray-300/5 border border-white/10">
          <CardHeader className="pb-8">
            <CardTitle className="text-lg font-medium text-gray-300">Client List</CardTitle>
            <p className="text-sm text-gray-400">Manage and view all your clients in one place.</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-white/10 hover:bg-gray-300/5">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-gray-400">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gradient-to-tr from-transparent to-gray-300/5 border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-gray-300">{isEditing ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Email</FormLabel>
                    <FormControl>
                      <Input {...field} className="border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Phone</FormLabel>
                    <FormControl>
                      <Input {...field} className="border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Goal</FormLabel>
                    <FormControl>
                      <Input {...field} className="border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-emerald-800/50 backdrop-blur-md border border-white/10 hover:bg-emerald-800/60 text-gray-300"
                >
                  {isEditing ? 'Save Changes' : 'Add Client'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
