import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { Activity, Users, TrendingUp, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

// Sample data remains the same
const clientProgress = [
  { month: 'Jan', clients: 4, activeClients: 3 },
  { month: 'Feb', clients: 6, activeClients: 5 },
  { month: 'Mar', clients: 8, activeClients: 7 },
  { month: 'Apr', clients: 12, activeClients: 10 },
  { month: 'May', clients: 15, activeClients: 13 },
  { month: 'Jun', clients: 18, activeClients: 15 }
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

const upcomingSessions = [
  { id: 1, clientName: 'Anna Smith', goal: 'Weight Loss', date: '2024-02-01', time: '10:00 AM' },
  { id: 2, clientName: 'John Miller', goal: 'Muscle Gain', date: '2024-02-02', time: '11:00 AM' },
  { id: 3, clientName: 'Mary Johnson', goal: 'Conditioning', date: '2024-02-03', time: '09:00 AM' },
  { id: 4, clientName: 'Peter Brown', goal: 'Rehabilitation', date: '2024-02-04', time: '12:00 PM' }
];

const statsData = [
  { icon: Users, title: '15', subtitle: 'Active Clients', trend: '+5%', up: true },
  { icon: Activity, title: '33', subtitle: 'Weekly Sessions', trend: '-2%', up: false },
  { icon: TrendingUp, title: '66%', subtitle: 'Avg Progress', trend: '+8%', up: true },
  { icon: Calendar, title: '12', subtitle: 'Upcoming Sessions', trend: '+3%', up: true }
];

function Dashboard() {
  return (
    <div className="absolute inset-0 px-4 pt-4 pb-12 overflow-auto">
      <div className="space-y-4">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <Card key={index} className="bg-gradient-to-tr from-transparent to-gray-300/5 border border-white/10">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="p-3 bg-emerald-500/10 rounded-full">
                  <stat.icon className="h-8 w-8 text-emerald-800" />
                </div>
                <h3 className="text-2xl font-bold text-white mt-4">{stat.title}</h3>
                <p className="text-sm font-medium text-gray-400">{stat.subtitle}</p>
                <p className="text-sm text-gray-400 flex items-center mt-1">
                  {stat.up ? (
                    <ArrowUp className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-400" />
                  )}
                  <span className={stat.up ? 'text-emerald-400' : 'text-red-400'}>{stat.trend}</span>
                  <span className="ml-1">from last period</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="relative overflow-hidden bg-gradient-to-tr from-transparent to-gray-300/5 border border-white/10">
            <div className="z-0 -right-32 absolute w-3/4 aspect-square bg-emerald-800 blur-3xl rounded-full translate-y-1/4" />
            <div className="z-10 absolute bottom-0 h-full blur-xl w-full  backdrop-blur-3xl bg-gradient-to-t from-transparent to-transparent/0" />
            <CardHeader className="pb-8 z-10">
              <CardTitle className="z-10 text-lg font-medium text-gray-300 flex items-center gap-2">Client Growth</CardTitle>
              <p className="z-10 text-sm text-gray-400">Track the growth of your client base over time.</p>
            </CardHeader>
            <CardContent className="z-10">
              <ResponsiveContainer className="z-10" width="100%" height={200}>
                <LineChart className="z-10" data={clientProgress}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#E5E7EB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clients"
                    stroke="#34D399"
                    strokeWidth={2}
                    dot={false}
                    name="Total Clients"
                  />
                  <Line
                    type="monotone"
                    dataKey="activeClients"
                    stroke="rgba(6, 95, 70, 1)"
                    strokeWidth={2}
                    dot={false}
                    name="Active Clients"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-tr from-transparent to-gray-300/5 border border-white/10">
            <CardHeader className="pb-8">
              <CardTitle className="text-lg font-medium text-gray-300 flex items-center gap-2">
                Weekly Workload
              </CardTitle>
              <p className="text-sm text-gray-400">Monitor your weekly session workload.</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={workloadData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
                  <XAxis dataKey="day" stroke="#6B7280" fontSize={12} tickLine={false} />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#E5E7EB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <Bar dataKey="sessions" fill="rgb(6 95 70)" name="Sessions" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Sessions */}
        <Card className="bg-gradient-to-tr from-transparent to-gray-300/5 border border-white/10">
          <CardHeader className="pb-8">
            <CardTitle className="text-lg font-medium text-gray-300 flex items-center gap-2">
              Upcoming Sessions
            </CardTitle>
            <p className="text-sm text-gray-400">List of your upcoming training sessions with clients.</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-gray-300/5">
                  <TableHead className="text-gray-400">Client</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingSessions.map((session) => (
                  <TableRow key={session.id} className="hover:bg-gray-300/5 border-b border-white/5">
                    <TableCell className="flex items-center gap-2 py-2 text-gray-300">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/api/placeholder/32/32" />
                        <AvatarFallback className="bg-gray-700 text-gray-300">
                          {session.clientName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      {session.clientName}
                    </TableCell>
                    <TableCell className="py-2 text-gray-300">{session.goal}</TableCell>
                    <TableCell className="py-2 text-gray-300">{session.date}</TableCell>
                    <TableCell className="py-2 text-gray-300">{session.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
