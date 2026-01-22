// admin\src\components\contentpage\DashboardContent.tsx
'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { FiPlus, FiAlertCircle } from 'react-icons/fi';

interface DashboardStats {
  projects: number;
  creations: number;
  skills: number;
  services: number;
  contacts: number;
  hires: number;
  subscriptions: number;
}
export default function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    creations: 0,
    skills: 0,
    services: 0,
    contacts: 0,
    hires: 0,
    subscriptions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/'); // ✅ single call now
        setStats(res.data);
      } catch (err) {
        setError('Failed to load dashboard stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <FiAlertCircle size={24} className="mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Projects" value={stats.projects} color="blue" />
        <StatCard title="Creations" value={stats.creations} color="green" />
        <StatCard title="Skills" value={stats.skills} color="yellow" />
        <StatCard title="Services" value={stats.services} color="purple" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Contact Messages" value={stats.contacts} color="red" />
        <StatCard title="Hire Requests" value={stats.hires} color="indigo" />
        <StatCard title="Subscriptions" value={stats.subscriptions} color="pink" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActionCard 
          title="Content Management"
          actions={[
            { label: 'Create Project', href: '/admin/projects/create' },
            { label: 'Create Creation', href: '/admin/creations/create' },
            { label: 'Add Skill', href: '/admin/skills/create' },
            { label: 'Add Service', href: '/admin/services/create' },
            { label: 'Add Qualification', href: '/admin/qualifications#add' },
          ]}
        />
        <QuickActionCard 
          title="User Management"
          actions={[
            { label: 'View Messages', href: '/admin/contacts' },
            { label: 'View Hire Requests', href: '/admin/hires' },
            { label: 'View Subscriptions', href: '/admin/subscriptions' },
            { label: 'Edit Profile', href: '/admin/profile' },
          ]}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo' | 'pink';
}

function StatCard({ title, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    pink: 'bg-pink-100 text-pink-800',
  };

  return (
    <div className={`p-4 rounded-lg shadow ${colorClasses[color]}`}>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  actions: { label: string; href: string }[];
}

function QuickActionCard({ title, actions }: QuickActionCardProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow">
      <h3 className="font-medium text-gray-700 mb-3">{title}</h3>
      <div className="grid grid-cols-1 gap-2">
        {actions.map((action, index) => (
          <Link 
            key={index} 
            href={action.href}
            className="flex items-center px-3 py-2 text-sm bg-white rounded border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <FiPlus className="mr-2" />
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}