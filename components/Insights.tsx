
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Issue, Sprint } from '../types';

interface InsightsProps {
  issues: Issue[];
  sprints: Sprint[];
}

const Insights: React.FC<InsightsProps> = ({ issues, sprints }) => {
  if (issues.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-gray-200 dark:border-slate-800">
        <div className="h-20 w-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6">
          <BarChart3 className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No analytics available</h3>
        <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-sm text-center text-sm">
          Insights and reporting will appear here once you start adding issues and working through your sprints.
        </p>
      </div>
    );
  }

  const isDark = document.documentElement.classList.contains('dark');

  // Data for status distribution
  const statusData = [
    { name: 'To Do', value: issues.filter(i => i.statusId === '1').length, color: '#64748b' },
    { name: 'In Progress', value: issues.filter(i => i.statusId === '2' || i.statusId === '3').length, color: '#3b82f6' },
    { name: 'Done', value: issues.filter(i => i.statusId === '4').length, color: '#22c55e' },
  ];

  // Data for priority distribution
  const priorityData = [
    { name: 'Low', value: issues.filter(i => i.priority === 'LOW').length },
    { name: 'Medium', value: issues.filter(i => i.priority === 'MEDIUM').length },
    { name: 'High', value: issues.filter(i => i.priority === 'HIGH').length },
    { name: 'Urgent', value: issues.filter(i => i.priority === 'URGENT').length },
  ];

  // Mock Burndown Data
  const burndownData = [
    { day: 'Day 1', ideal: 40, actual: 40 },
    { day: 'Day 2', ideal: 35, actual: 38 },
    { day: 'Day 3', ideal: 30, actual: 32 },
    { day: 'Day 4', ideal: 25, actual: 24 },
    { day: 'Day 5', ideal: 20, actual: 22 },
    { day: 'Day 6', ideal: 15, actual: 18 },
    { day: 'Day 7', ideal: 10, actual: 8 },
    { day: 'Day 8', ideal: 5, actual: 4 },
    { day: 'Day 9', ideal: 0, actual: 0 },
  ];

  const chartTextColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12 transition-colors">
      {/* Velocity / Burndown */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm col-span-2">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Sprint Burndown</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={burndownData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#fff',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                  color: isDark ? '#fff' : '#000'
                }}
              />
              <Line type="monotone" dataKey="ideal" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="actual" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Status Distribution</h3>
        <div className="h-64 flex items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#fff',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 pr-4 min-w-[120px]">
            {statusData.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-slate-400">
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Bar Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Priority Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} />
              <YAxis hide />
              <Tooltip cursor={{ fill: isDark ? '#1e293b' : '#f3f4f6' }} contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#fff', borderColor: isDark ? '#334155' : '#e2e8f0' }} />
              <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Insights;
