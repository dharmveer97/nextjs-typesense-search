'use client';

import { useState } from 'react';
import {
  ChartBarIcon,
  CubeIcon,
  ClockIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [healthStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor and manage your Typesense search infrastructure
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Health Status */}
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  healthStatus === 'healthy'
                    ? 'bg-green-100 text-green-800'
                    : healthStatus === 'warning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    healthStatus === 'healthy'
                      ? 'bg-green-500'
                      : healthStatus === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                ></div>
                All Systems Operational
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Searches"
            value={9247}
            icon={MagnifyingGlassIcon}
            color="bg-blue-500"
          />
          <StatCard
            title="Click-through Rate"
            value="64.2%"
            icon={EyeIcon}
            color="bg-green-500"
          />
          <StatCard
            title="Avg Response Time"
            value="52ms"
            icon={ClockIcon}
            color="bg-purple-500"
          />
          <StatCard
            title="Active Collections"
            value={5}
            icon={ServerIcon}
            color="bg-orange-500"
          />
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Status
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cluster Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Cluster Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-mono">v2.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime:</span>
                  <span>99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="text-green-600">45ms</span>
                </div>
              </div>
            </div>

            {/* Feature Status */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Features</h4>
              <div className="space-y-2 text-sm">
                {[
                  { name: 'Vector Search', enabled: true },
                  { name: 'Semantic Search', enabled: true },
                  { name: 'Analytics', enabled: true },
                  { name: 'Voice Search', enabled: true },
                ].map((feature) => (
                  <div
                    key={feature.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-600">{feature.name}:</span>
                    <span
                      className={`flex items-center gap-1 ${
                        feature.enabled ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          feature.enabled ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      ></div>
                      {feature.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  Reindex Collections
                </button>
                <button className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  Clear Cache
                </button>
                <button className="w-full text-left px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  Export Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Management */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Collections
          </h3>

          <div className="space-y-4">
            {[
              {
                name: 'products',
                documents: 15420,
                size: '2.1 GB',
                status: 'healthy',
              },
              {
                name: 'courses',
                documents: 3280,
                size: '580 MB',
                status: 'healthy',
              },
              {
                name: 'documents',
                documents: 8750,
                size: '1.3 GB',
                status: 'healthy',
              },
            ].map((collection) => (
              <div
                key={collection.name}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <CubeIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {collection.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {collection.documents.toLocaleString()} documents •{' '}
                      {collection.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-green-600 capitalize">
                    {collection.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
