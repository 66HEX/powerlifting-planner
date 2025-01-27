import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ChartNoAxesColumnIncreasing,
  Settings,
  FileText,
  Dumbbell,
  Calendar
} from 'lucide-react';
import React from 'react';

export default function Sidebar() {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users, badge: '10' },
    { name: 'Training Plans', href: '/plans', icon: Dumbbell, badge: '8' },
    { name: 'Progress Tracking', href: '/tracking', icon: ChartNoAxesColumnIncreasing },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Documentation', href: '/docs', icon: FileText }
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-card p-4 flex flex-col z-50">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-6 h-6 bg-lime-400 rounded-full" />
        <div>
          <div className="text-white font-medium">TrainerPro</div>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full text-white border border-border bg-card rounded-md py-1.5 px-8 text-sm outline-none focus:outline-none"
        />
        <svg
          className="w-4 h-4 absolute left-2 top-2 text-text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#ffffff"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <nav className="flex-1 mt-6 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="flex items-center text-text-secondary hover:text-white px-2 py-2 text-sm rounded-md hover:bg-white/5"
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
            {item.badge && (
              <span className="ml-auto bg-white/10 text-text-secondary px-2 rounded-md text-xs">{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-1">
        <div className="flex items-center px-2 py-2 mt-4 bg-card border border-border rounded-md">
          <div className="w-8 h-8 rounded-full bg-white/5 mr-3" />
          <div>
            <div className="text-white text-sm">Mia de Silva</div>
            <div className="text-text-secondary text-xs">mia@untitledui.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
