import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Pencil, Trash, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { useForm } from "react-hook-form";

// Define the type for a client
type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  goal: string;
};

// Define the type for the form data
type FormData = {
  name: string;
  email: string;
  phone: string;
  goal: string;
};

// Sample data
const initialClients: Client[] = [
  { id: 1, name: 'Anna Smith', email: 'anna.smith@example.com', phone: '123-456-7890', goal: 'Weight Loss' },
  { id: 2, name: 'John Miller', email: 'john.miller@example.com', phone: '987-654-3210', goal: 'Muscle Gain' },
  { id: 3, name: 'Mary Johnson', email: 'mary.johnson@example.com', phone: '555-555-5555', goal: 'Conditioning' }
];

const Clients: React.FC = () => {
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

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'name',
      header: 'Name'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'phone',
      header: 'Phone'
    },
    {
      accessorKey: 'goal',
      header: 'Goal'
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(client)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(client.id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

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

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditing(true);
    form.reset(client);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setClients(clients.filter((client) => client.id !== id));
  };

  const handleAdd = () => {
    setSelectedClient(null);
    setIsEditing(false);
    form.reset({
      name: '',
      email: '',
      phone: '',
      goal: ''
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: FormData) => {
    if (isEditing && selectedClient) {
      setClients(clients.map((client) => (client.id === selectedClient.id ? { ...client, ...data } : client)));
    } else {
      setClients([...clients, { id: clients.length + 1, ...data }]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="p-4 absolute inset-0 overflow-auto bg-background">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clients</h1>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter by name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
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
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
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
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Goal</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{isEditing ? 'Save Changes' : 'Add Client'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;