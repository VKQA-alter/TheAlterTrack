
import { Priority, IssueType, Status, Label, Module, User } from './types';

export const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  URGENT: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const TYPE_COLORS: Record<IssueType, string> = {
  ISSUE: 'text-red-500',
  TASK: 'text-blue-500',
  FEATURE: 'text-purple-500',
};

export const DEFAULT_STATUSES: Status[] = [
  { id: '1', name: 'To Do', color: '#64748b', category: 'TODO', order: 0 },
  { id: '2', name: 'In Progress', color: '#3b82f6', category: 'IN_PROGRESS', order: 1 },
  { id: '3', name: 'Review', color: '#a855f7', category: 'IN_PROGRESS', order: 2 },
  { id: '4', name: 'Done', color: '#22c55e', category: 'DONE', order: 3 },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Vamshi M', email: 'vamshi@altertrack.io', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vamshi', role: 'OWNER' },
  { id: 'u2', name: 'Jordan Smith', email: 'jordan@altertrack.io', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan', role: 'MEMBER' },
  { id: 'u3', name: 'Casey Lee', email: 'casey@altertrack.io', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey', role: 'ADMIN' },
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `u${i + 4}`,
    name: `User ${i + 4}`,
    email: `user${i + 4}@altertrack.io`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${i + 4}`,
    role: 'MEMBER' as const
  }))
];

export const MOCK_LABELS: Label[] = [
  { id: 'l1', name: 'Frontend', color: '#3b82f6' },
  { id: 'l2', name: 'Backend', color: '#ef4444' },
  { id: 'l3', name: 'API', color: '#8b5cf6' },
  { id: 'l4', name: 'Design', color: '#ec4899' },
];

export const MOCK_MODULES: Module[] = [
  { id: 'm1', name: 'Auth Service', description: 'Authentication and user sessions' },
  { id: 'm2', name: 'Payment Gateway', description: 'Stripe integration' },
  { id: 'm3', name: 'Analytics', description: 'Reporting engine' },
];
