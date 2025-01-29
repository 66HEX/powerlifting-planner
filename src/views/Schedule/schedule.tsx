import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Plus, Pencil, Trash } from 'lucide-react';
import { format } from 'date-fns';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState
} from '@tanstack/react-table';

// Define the type for an event
type Event = {
  id: number;
  title: string;
  date: Date;
  time: string;
  clientName: string;
  duration: string;
};

// Define the type for the new event form
type NewEvent = {
  title: string;
  date: Date;
  time: string;
  clientName: string;
  duration: string;
};

// Sample initial events
const initialEvents: Event[] = [
  {
    id: 1,
    title: 'Fitness Consultation',
    date: new Date(2024, 0, 15),
    time: '10:00',
    clientName: 'John Doe',
    duration: '60'
  },
  {
    id: 2,
    title: 'Personal Training',
    date: new Date(2024, 0, 21),
    time: '14:00',
    clientName: 'Jane Smith',
    duration: '45'
  },
  {
    id: 3,
    title: 'Fitness Consultation',
    date: new Date(2025, 0, 15),
    time: '10:00',
    clientName: 'John Doe',
    duration: '60'
  }
];

const Schedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    date: selectedDate,
    time: '',
    clientName: '',
    duration: '60'
  });
  const [filterDateInput, setFilterDateInput] = useState<string>('');

  // Funkcja do usuwania wydarzenia
  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const matchesDatePattern = (eventDate: Date, filterPattern: string) => {
    if (!filterPattern) return true;

    const eventDateStr = format(new Date(eventDate), 'dd/MM/yyyy');
    const cleanPattern = filterPattern.replace(/\/$/, '');

    if (!/^[0-9/]*$/.test(cleanPattern)) return false;

    const patternParts = cleanPattern.split('/');
    const dateParts = eventDateStr.split('/');

    for (let i = 0; i < patternParts.length; i + 1) {
      if (patternParts[i] && patternParts[i] !== dateParts[i]) {
        return false;
      }
    }

    return true;
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => matchesDatePattern(new Date(event.date), filterDateInput));
  }, [events, filterDateInput]);

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: 'title',
      header: 'Title'
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.date), 'dd/MM/yyyy')
    },
    {
      accessorKey: 'time',
      header: 'Time'
    },
    {
      accessorKey: 'clientName',
      header: 'Client'
    },
    {
      accessorKey: 'duration',
      header: 'Duration (min)'
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEditEvent(event)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const table = useReactTable({
    data: filteredEvents,
    columns,
    state: {
      columnVisibility,
      sorting
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const handleAddEvent = () => {
    setNewEvent({
      title: '',
      date: selectedDate,
      time: '',
      clientName: '',
      duration: '60'
    });
    setSelectedEvent(null);
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setNewEvent({
      ...event,
      date: new Date(event.date)
    });
    setIsDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (selectedEvent) {
      setEvents(events.map((event) => (event.id === selectedEvent.id ? { ...newEvent, id: selectedEvent.id } : event)));
    } else {
      setEvents([
        ...events,
        {
          ...newEvent,
          id: events.length + 1 // Użycie `+ 1` zamiast `++`
        }
      ]);
    }
    setIsDialogOpen(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setNewEvent({ ...newEvent, date });
    }
  };

  // Przyjazne nazwy kolumn dla menu rozwijanego
  const columnDisplayNames: Record<string, string> = {
    title: 'Title',
    date: 'Date',
    time: 'Time',
    clientName: 'Client',
    duration: 'Duration (min)'
  };

  return (
    <div className="p-4 absolute inset-0 overflow-auto bg-background">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter by date..."
            value={filterDateInput}
            onChange={(e) => setFilterDateInput(e.target.value)}
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
          <Button onClick={handleAddEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
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
                  No events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Event title"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium">
                  Time
                </label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="clientName" className="text-sm font-medium">
                  Client Name
                </label>
                <Input
                  id="clientName"
                  value={newEvent.clientName}
                  onChange={(e) => setNewEvent({ ...newEvent, clientName: e.target.value })}
                  placeholder="Client name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">
                  Duration (minutes)
                </label>
                <Select
                  value={newEvent.duration}
                  onValueChange={(value) => setNewEvent({ ...newEvent, duration: value })}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Calendar
                mode="single"
                selected={newEvent.date}
                onSelect={handleDateSelect}
                className="rounded-md border w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEvent}>{selectedEvent ? 'Save Changes' : 'Add Event'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
