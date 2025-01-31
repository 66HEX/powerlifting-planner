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
import { Plus, Pencil, Trash, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

    for (let i = 0; i < patternParts.length; i++) {
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
      accessorKey: 'clientName',
      header: 'Client Name'
    },
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
    clientName: 'Client Name',
    duration: 'Duration (min)'
  };

  return (
    <div className="absolute inset-0 px-4 pt-4 pb-12 overflow-auto bg-black">
      <div className="space-y-4">
        {/* Header Stats Card */}
        <Card className="bg-gradient-to-tr from-transparent to-gray-300/5 border border-white/10">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-full">
                <CalendarIcon className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{events.length}</h3>
                <p className="text-sm font-medium text-gray-400">Total Events</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Filter by date..."
                value={filterDateInput}
                onChange={(e) => setFilterDateInput(e.target.value)}
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
                onClick={handleAddEvent}
                className="bg-emerald-400/40 backdrop-blur-md border border-white/10 hover:bg-emerald-400/50 text-gray-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Events Table Card */}
        <Card className="bg-gradient-to-tr from-transparent to-gray-300/5 border border-white/10">
          <CardHeader className="pb-8">
            <CardTitle className="text-lg font-medium text-gray-300">Events List</CardTitle>
            <p className="text-sm text-gray-400">Manage and view all your scheduled events in one place.</p>
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
                      No events found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-3xl bg-gradient-to-tr from-transparent to-gray-300/5 border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-gray-300">{selectedEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-400">
                  Title
                </label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Event title"
                  className="border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium text-gray-400">
                  Time
                </label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="clientName" className="text-sm font-medium text-gray-400">
                  Client Name
                </label>
                <Input
                  id="clientName"
                  value={newEvent.clientName}
                  onChange={(e) => setNewEvent({ ...newEvent, clientName: e.target.value })}
                  placeholder="Client name"
                  className="border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium text-gray-400">
                  Duration (minutes)
                </label>
                <Select
                  value={newEvent.duration}
                  onValueChange={(value) => setNewEvent({ ...newEvent, duration: value })}
                >
                  <SelectTrigger id="duration" className="border-white/10">
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
                className="rounded-md border border-white/10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveEvent}
              className="bg-emerald-400/40 backdrop-blur-md border border-white/10 hover:bg-emerald-400/50 text-gray-300"
            >
              {selectedEvent ? 'Save Changes' : 'Add Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
