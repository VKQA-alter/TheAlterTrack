
import { Priority, IssueType, Status, Label, Module, User, Project } from './types';

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


export const MOCK_LABELS: Label[] = [];
export const MOCK_MODULES: Module[] = [];
export const MOCK_PROJECTS: Project[] = [];
export const MOCK_USERS: User[] = [];
