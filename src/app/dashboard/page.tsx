'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ServiceProvider, ServiceRequest } from '@/lib/types';

const CATEGORIES = [
  'Web Development',
  'Data Science',
  'Design',
  'Marketing',
  'Mobile Development',
  'DevOps',
  'Content Writing',
  'Cybersecurity',
];

export default function DashboardPage() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/providers').then((r) => r.json()),
      fetch('/api/requests').then((r) => r.json()),
    ])
      .then(([p, r]) => {
        setProviders(p);
        setRequests(r);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categoryBreakdown = CATEGORIES.map((cat) => ({
    name: cat,
    count: providers.filter((p) => p.category === cat).length,
  }));

  const avgRate =
    providers.length > 0
      ? Math.round(providers.reduce((sum, p) => sum + p.hourlyRate, 0) / providers.length)
      : 0;

  const topProviders = [...providers]
    .sort((a, b) => b.rating - a.rating || b.completedProjects - a.completedProjects)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of the MatchAI platform</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Total Providers', value: providers.length, icon: '👷', color: 'bg-blue-50 text-blue-700' },
              { label: 'Open Requests', value: requests.length, icon: '📋', color: 'bg-purple-50 text-purple-700' },
              { label: 'Avg. Hourly Rate', value: `$${avgRate}`, icon: '💰', color: 'bg-green-50 text-green-700' },
              { label: 'Categories', value: CATEGORIES.length, icon: '🏷️', color: 'bg-orange-50 text-orange-700' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color} mb-3`}>
                  {icon}
                </div>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <div className="text-sm text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-5">Providers by Category</h2>
              <div className="space-y-3">
                {categoryBreakdown.map(({ name, count }) => (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700 font-medium">{name}</span>
                      <span className="text-slate-500">{count} provider{count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all"
                        style={{ width: providers.length > 0 ? `${(count / providers.length) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/providers"
                className="mt-5 block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse all providers →
              </Link>
            </div>

            {/* Top Providers */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-5">Top Rated Providers</h2>
              <div className="space-y-4">
                {topProviders.map((provider, i) => (
                  <div key={provider.id} className="flex items-center gap-4">
                    <div className="text-lg font-bold text-slate-300 w-5 text-center">{i + 1}</div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {provider.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{provider.name}</div>
                      <div className="text-xs text-slate-500 truncate">{provider.category}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-slate-900">{provider.rating}★</div>
                      <div className="text-xs text-slate-400">{provider.completedProjects} jobs</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900">Recent Service Requests</h2>
                <Link href="/request" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  + Post New Request
                </Link>
              </div>
              {requests.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No requests yet. <Link href="/request" className="text-blue-600 underline">Post the first one!</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-slate-500 border-b border-slate-100">
                        <th className="text-left py-2 font-medium">Title</th>
                        <th className="text-left py-2 font-medium">Client</th>
                        <th className="text-left py-2 font-medium">Category</th>
                        <th className="text-left py-2 font-medium">Budget</th>
                        <th className="text-left py-2 font-medium">Timeline</th>
                        <th className="text-left py-2 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => (
                        <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-medium text-slate-900 max-w-xs truncate pr-4">{req.title}</td>
                          <td className="py-3 text-slate-600 whitespace-nowrap">{req.clientName}</td>
                          <td className="py-3 text-slate-600 whitespace-nowrap">{req.category}</td>
                          <td className="py-3 text-slate-700 font-medium whitespace-nowrap">${req.budget.toLocaleString()}</td>
                          <td className="py-3 text-slate-600 whitespace-nowrap capitalize">{req.timeline.replace(/-/g, ' ')}</td>
                          <td className="py-3">
                            <Link
                              href={`/matches?requestId=${req.id}`}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                            >
                              Find Matches →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
