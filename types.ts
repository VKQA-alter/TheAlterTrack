
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type IssueType = 'ISSUE' | 'TASK' | 'FEATURE';
export type Role = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
export type ProjectPlatform = 'WEBSITE' | 'MOBILE';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
}

export interface Status {
  id: string;
  name: string;
  description?: string;
  color: string;
  category: 'TODO' | 'IN_PROGRESS' | 'DONE';
  order: number;
}

export interface Module {
  id: string;
  name: string;
  description?: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  isCompleted: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'DANGER';
  read: boolean;
  createdAt: string;
}

export interface Issue {
  id: string;
  key: string;
  title: string;
  description: string;
  type: IssueType;
  priority: Priority;
  statusId: string;
  assigneeId?: string;
  reporterId: string;
  moduleIds: string[];
  labelIds: string[];
  sprintId?: string;
  storyPoints?: number;
  startDate?: string;
  endDate?: string;
  projectId: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description: string;
  logo?: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  platform: ProjectPlatform;
  statuses: Status[];
  modules: Module[];
  labels: Label[];
  members: { userId: string; role: Role }[];
}

export interface Workspace {
  id: string;
  name: string;
  projects: Project[];
  members: User[];
}

export interface TestCaseFile {
  id: string;
  projectId: string;
  name: string;
  type: 'xlsx' | 'csv';
  size: string;
  lastModified: string;
  content: any[][];
}

export interface BacklogItem {
  id: string;
  projectId: string;
  title: string;
  overview: string;
  attachments: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  tags: string[];
  sprintId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StickyNote {
  id: string;
  content: string;
  color: string;
  isBold: boolean;
  isItalic: boolean;
  isList: boolean;
  createdAt: string;
  updatedAt: string;
}
