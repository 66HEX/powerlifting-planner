import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Activity,
  Users,
  TrendingUp,
  Calendar,
  ArrowUp,
  ArrowDown,
  BarChart2,
  LineChart as LineChartIcon
} from 'lucide-react';

// Sample data
const clientProgress = [
  { month: 'Jan', clients: 4, activeClients: 3 },
  { month: 'Feb', clients: 6, activeClients: 5 },
  { month: 'Mar', clients: 8, activeClients: 7 },
  { month: 'Apr', clients: 12, activeClients: 10 },
  { month: 'May', clients: 15, activeClients: 13 },
  { month: 'Jun', clients: 18, activeClients: 15 }
];

const recentClients = [
  { id: 1, name: 'Anna Smith', goal: 'Weight Loss', progress: 75, lastSession: '2024-01-25' },
  { id: 2, name: 'John Miller', goal: 'Muscle Gain', progress: 60, lastSession: '2024-01-26' },
  { id: 3, name: 'Mary Johnson', goal: 'Conditioning', progress: 85, lastSession: '2024-01-27' },
  { id: 4, name: 'Peter Brown', goal: 'Rehabilitation', progress: 45, lastSession: '2024-01-27' }
];

const workloadData = [
  { day: 'Mon', sessions: 6 },
  { day: 'Tue', sessions: 8 },
  { day: 'Wed', sessions: 5 },
  { day: 'Thu', sessions: 7 },
  { day: 'Fri', sessions: 4 },
  { day: 'Sat', sessions: 3 },
  { day: 'Sun', sessions: 0 }
];

const Dashboard = () => {
  return (
    <div className="absolute inset-0 px-4 pt-4 pb-12 overflow-auto bg-background">
      <div className="space-y-4">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-sidebar to-sidebar-accent hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="p-3 bg-sidebar-accent-foreground/10 rounded-full">
                <Users className="h-8 w-8 text-sidebar-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-sidebar-foreground mt-4">15</h3>
              <p className="text-sm font-medium text-sidebar-foreground/70">Active Clients</p>
              <p className="text-sm text-sidebar-foreground/70 flex items-center mt-1">
                <ArrowUp className="h-4 w-4 text-green-500" /> 5% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-sidebar to-sidebar-accent hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="p-3 bg-sidebar-accent-foreground/10 rounded-full">
                <Activity className="h-8 w-8 text-sidebar-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-sidebar-foreground mt-4">33</h3>
              <p className="text-sm font-medium text-sidebar-foreground/70">Weekly Sessions</p>
              <p className="text-sm text-sidebar-foreground/70 flex items-center mt-1">
                <ArrowDown className="h-4 w-4 text-red-500" /> 2% from last week
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-sidebar to-sidebar-accent hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="p-3 bg-sidebar-accent-foreground/10 rounded-full">
                <TrendingUp className="h-8 w-8 text-sidebar-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-sidebar-foreground mt-4">66%</h3>
              <p className="text-sm font-medium text-sidebar-foreground/70">Average Progress</p>
              <p className="text-sm text-sidebar-foreground/70 flex items-center mt-1">
                <ArrowUp className="h-4 w-4 text-green-500" /> 8% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-sidebar to-sidebar-accent hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="p-3 bg-sidebar-accent-foreground/10 rounded-full">
                <Calendar className="h-8 w-8 text-sidebar-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-sidebar-foreground mt-4">12</h3>
              <p className="text-sm font-medium text-sidebar-foreground/70">Scheduled Sessions</p>
              <p className="text-sm text-sidebar-foreground/70 flex items-center mt-1">
                <ArrowUp className="h-4 w-4 text-green-500" /> 3% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-sidebar to-sidebar-accent hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-sidebar-foreground/80 flex items-center gap-2">
                <LineChartIcon className="h-6 w-6 text-sidebar-accent-foreground" />
                Client Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={clientProgress}>
                  <XAxis dataKey="month" stroke="hsl(var(--sidebar-foreground))" fontSize={12} tickLine={false} />
                  <YAxis stroke="hsl(var(--sidebar-foreground))" fontSize={12} tickLine={false} />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--sidebar-background))',
                      border: '1px solid hsl(var(--sidebar-border))',
                      color: 'hsl(var(--sidebar-foreground))',
                      borderRadius: '5px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="clients"
                    stroke="#3b82f6" // Blue color
                    strokeWidth={2}
                    name="Total Clients"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="activeClients"
                    stroke="#10b981" // Green color
                    strokeWidth={2}
                    name="Active Clients"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-sidebar to-sidebar-accent hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-sidebar-foreground/80 flex items-center gap-2">
                <BarChart2 className="h-6 w-6 text-sidebar-accent-foreground" />
                Weekly Workload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={workloadData}>
                  <XAxis dataKey="day" stroke="hsl(var(--sidebar-foreground))" fontSize={12} tickLine={false} />
                  <YAxis stroke="hsl(var(--sidebar-foreground))" fontSize={12} tickLine={false} />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--sidebar-background))',
                      border: '1px solid hsl(var(--sidebar-border))',
                      color: 'hsl(var(--sidebar-foreground))',
                      borderRadius: '5px'
                    }}
                  />
                  <Bar
                    dataKey="sessions"
                    fill="#f59e0b" // Amber color
                    name="Number of Sessions"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Clients table */}
        <Card className="bg-gradient-to-br from-sidebar to-sidebar-accent hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-sidebar-foreground/80 flex items-center gap-2">
              <Users className="h-6 w-6 text-sidebar-accent-foreground" />
              Recently Active Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-sidebar-accent/20">
                  <TableHead className="text-sidebar-foreground/70">Client</TableHead>
                  <TableHead className="text-sidebar-foreground/70">Goal</TableHead>
                  <TableHead className="text-sidebar-foreground/70">Progress</TableHead>
                  <TableHead className="text-sidebar-foreground/70">Last Session</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-sidebar-accent">
                    <TableCell className="flex items-center gap-2 py-2 text-sidebar-foreground">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/api/placeholder/32/32" />
                        <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                          {client.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      {client.name}
                    </TableCell>
                    <TableCell className="py-2 text-sidebar-foreground">{client.goal}</TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-sidebar-accent rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sidebar-accent-foreground"
                            style={{ width: `${client.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-sidebar-foreground">{client.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sidebar-foreground">{client.lastSession}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
