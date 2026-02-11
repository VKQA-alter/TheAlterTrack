"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
    Plus,
    Search,
    Bell,
    Filter,
    ArrowUpDown,
    LayoutDashboard,
    LayoutList,
    ChevronDown,
    AlertTriangle,
    Check,
    X,
    Moon,
    Sun,
    Calendar,
    Tag,
    Boxes,
    Home as HomeIcon,
    StickyNote as StickyIcon,
    LayoutGrid
} from 'lucide-react';
import { Project, Issue, User, Sprint, Role, Status, IssueType, Notification, TestCaseFile, BacklogItem, StickyNote } from '../types';
import { MOCK_USERS, DEFAULT_STATUSES, MOCK_LABELS, MOCK_MODULES } from '../constants';
import KanbanBoard from './KanbanBoard';
import PriorityIcon from './PriorityIcon';
import BacklogView from './BacklogView';
import Backlog from './Backlog';
import IssueDetail from './IssueDetail';
import Insights from './Insights';
import Sidebar from './Sidebar';
import ProjectSettings from './ProjectSettings';
import Dashboard from './Dashboard';
import SprintModal from './SprintModal';
import TestCaseManager from './TestCaseManager';
import StickyNotes from '@/components/StickyNotes';
import Home from '@/components/Home';
import ProfileDropdown from './ProfileDropdown';
import ProfileSettingsModal from './ProfileSettingsModal';
import SignIn from './SignIn';

const MainApp: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'home' | 'workspace' | 'backlog' | 'planning' | 'issues' | 'insights' | 'settings' | 'test-cases' | 'stickies'>('home');
    const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [testCaseFiles, setTestCaseFiles] = useState<TestCaseFile[]>([]);
    const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([]);

    // Filters
    const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
    const [selectedIssueType, setSelectedIssueType] = useState<IssueType | null>(null);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notifiedSprintIds, setNotifiedSprintIds] = useState<Set<string>>(new Set());
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
    const [profileSettingsTab, setProfileSettingsTab] = useState<'profile' | 'preferences' | 'security'>('profile');

    useEffect(() => {
        // Only access localStorage on the client side
        const savedTheme = localStorage.getItem('theme');
        setIsDarkMode(savedTheme === 'dark');
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const [projects, setProjects] = useState<Project[]>([
        {
            id: 'p1',
            key: 'ALT',
            name: 'AlterTrack Core',
            description: 'The main issue and project management engine.',
            visibility: 'PUBLIC',
            platform: 'WEBSITE',
            statuses: DEFAULT_STATUSES,
            modules: MOCK_MODULES,
            labels: MOCK_LABELS,
            members: [{ userId: 'u1', role: 'OWNER' }, { userId: 'u2', role: 'MEMBER' }]
        },
        {
            id: 'p2',
            key: 'UI',
            name: 'AlterTrack UI System',
            description: 'The React component library and design system.',
            visibility: 'PRIVATE',
            platform: 'MOBILE',
            statuses: DEFAULT_STATUSES,
            modules: [],
            labels: [],
            members: [{ userId: 'u1', role: 'OWNER' }]
        }
    ]);

    const [sprints, setSprints] = useState<Sprint[]>([
        {
            id: 's1',
            name: 'Sprint 24 - Launch Prep',
            isActive: true,
            isCompleted: false,
            goal: 'Fix all P0 bugs before launch.',
            endDate: new Date().toISOString() // Simpler date for initial state
        },
        { id: 's2', name: 'Sprint 25 - Post Launch', isActive: false, isCompleted: false },
    ]);

    const [issues, setIssues] = useState<Issue[]>([
        {
            id: 'i1',
            key: 'ALT-1',
            title: 'Implement OAuth2 Authentication',
            description: 'Need to support Google and GitHub SSO.',
            type: 'FEATURE',
            priority: 'HIGH',
            statusId: '2',
            assigneeId: 'u1',
            reporterId: 'u3',
            moduleIds: ['m1'],
            labelIds: ['l2', 'l3'],
            sprintId: 's1',
            storyPoints: 5,
            projectId: 'p1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: 'i2',
            key: 'ALT-2',
            title: 'Fix sidebar overflow on mobile',
            description: 'The sidebar doesn\'t collapse properly on screens smaller than 768px.',
            type: 'ISSUE',
            priority: 'URGENT',
            statusId: '1',
            assigneeId: 'u2',
            reporterId: 'u1',
            moduleIds: [],
            labelIds: ['l1', 'l4'],
            sprintId: 's1',
            storyPoints: 2,
            projectId: 'p1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ]);

    const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);

    const handleCreateSticky = () => {
        const newSticky: StickyNote = {
            id: `sticky-${Date.now()}`,
            content: '',
            color: '#fef3c7',
            isBold: false,
            isItalic: false,
            isList: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setStickyNotes(prev => [newSticky, ...prev]);
        setActiveTab('stickies');
    };

    const handleUpdateSticky = (updated: StickyNote) => {
        setStickyNotes(prev => prev.map(s => s.id === updated.id ? updated : s));
    };

    const handleDeleteSticky = (id: string) => {
        setStickyNotes(prev => prev.filter(s => s.id !== id));
    };

    useEffect(() => {
        const checkDeadlines = () => {
            const now = new Date();
            const newNotifications: Notification[] = [];
            const newNotifiedIds = new Set(notifiedSprintIds);
            let changed = false;

            sprints.forEach(sprint => {
                if (sprint.isActive && !sprint.isCompleted && sprint.endDate) {
                    const endDate = new Date(sprint.endDate);
                    if (endDate < now && !notifiedSprintIds.has(sprint.id)) {
                        newNotifications.push({
                            id: `notif-expiry-${sprint.id}-${Date.now()}`,
                            title: 'Sprint Duration Exceeded',
                            message: `Sprint "${sprint.name}" has passed its scheduled end date.`,
                            type: 'DANGER',
                            read: false,
                            createdAt: new Date().toISOString()
                        });
                        newNotifiedIds.add(sprint.id);
                        changed = true;
                    }
                }
            });

            if (changed) {
                setNotifications(prev => [...newNotifications, ...prev]);
                setNotifiedSprintIds(newNotifiedIds);
            }
        };
        checkDeadlines();
    }, [sprints]);

    const activeProject = useMemo(() =>
        projects.find(p => p.id === selectedProjectId) || null,
        [projects, selectedProjectId]
    );

    const filteredIssues = useMemo(() => {
        return issues.filter(issue => {
            const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                issue.key.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSprint = !selectedSprintId || issue.sprintId === selectedSprintId;
            const matchesModule = !selectedModuleId || issue.moduleIds.includes(selectedModuleId);
            const matchesLabel = !selectedLabelId || issue.labelIds.includes(selectedLabelId);
            const matchesType = !selectedIssueType || issue.type === selectedIssueType;

            return matchesSearch && matchesSprint && matchesModule && matchesLabel && matchesType;
        });
    }, [issues, searchQuery, selectedSprintId, selectedModuleId, selectedLabelId, selectedIssueType]);

    const openIssueDetail = (issue: Issue) => {
        setSelectedIssue(issue);
        setIsIssueModalOpen(true);
    };

    const handleSprintClick = (sprintId: string) => {
        setSelectedSprintId(sprintId);
        setActiveTab('issues');
    };

    const handleUpdateIssue = (updatedIssue: Partial<Issue>) => {
        if (!updatedIssue.id) return;
        setIssues(prev => prev.map(i => i.id === updatedIssue.id ? { ...i, ...updatedIssue } as Issue : i));
    };

    const handleCreateIssue = (issueData: Partial<Issue>) => {
        if (!activeProject) return;
        const newIssue: Issue = {
            id: `i${Date.now()}`,
            key: `${activeProject.key}-${issues.length + 1}`,
            title: issueData.title || 'Untitled Issue',
            description: issueData.description || '',
            type: issueData.type || 'TASK',
            priority: issueData.priority || 'MEDIUM',
            statusId: issueData.statusId || activeProject.statuses[0].id,
            assigneeId: issueData.assigneeId,
            reporterId: 'u1',
            moduleIds: issueData.moduleIds || [],
            labelIds: issueData.labelIds || [],
            projectId: activeProject.id,
            sprintId: issueData.sprintId || (selectedSprintId || undefined),
            storyPoints: issueData.storyPoints,
            parentId: issueData.parentId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setIssues(prev => [...prev, newIssue]);
        setIsIssueModalOpen(false);
    };

    const handleCreateSprint = (sprintData: Sprint, backlogIds: string[]) => {
        setSprints(prev => [...prev, sprintData]);
        // Update backlog items to assign them to the sprint
        setBacklogItems(prev => prev.map(item =>
            backlogIds.includes(item.id) ? { ...item, sprintId: sprintData.id, updatedAt: new Date().toISOString() } : item
        ));
        setIsSprintModalOpen(false);
    };

    const clearAllFilters = () => {
        setSelectedSprintId(null);
        setSelectedModuleId(null);
        setSelectedLabelId(null);
        setSelectedIssueType(null);
    };

    const isFiltered = selectedSprintId || selectedModuleId || selectedLabelId || selectedIssueType;

    const handleDeleteProject = (projectId: string) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        setIssues(prev => prev.filter(i => i.projectId !== projectId));
        if (selectedProjectId === projectId) {
            setSelectedProjectId(null);
            setActiveTab('workspace');
        }
    };

    const handleUpdateProject = (id: string, updates: Partial<Project>) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const handleCreateBacklogItem = (item: Omit<BacklogItem, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
        if (!activeProject) return;
        // Generate REQ##### format ID
        const nextId = backlogItems.length + 1;
        const reqId = `REQ${String(nextId).padStart(5, '0')}`;

        const newItem: BacklogItem = {
            ...item,
            id: reqId,
            projectId: activeProject.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setBacklogItems(prev => [...prev, newItem]);
    };

    const handleUpdateBacklogItem = (id: string, updates: Partial<BacklogItem>) => {
        setBacklogItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const handleDeleteBacklogItem = (id: string) => {
        setBacklogItems(prev => prev.filter(item => item.id !== id));
    };

    if (!user) {
        return <SignIn onSignIn={() => setUser(MOCK_USERS[0])} />;
    }

    return (
        <div className="flex h-screen bg-transparent overflow-hidden transition-colors duration-200">
            <Sidebar
                activeProject={activeProject}
                activeTab={activeTab}
                onTabChange={(tab: any) => {
                    if (tab === 'dashboard' || tab === 'home') {
                        setSelectedProjectId(null);
                        clearAllFilters();
                    }
                    setActiveTab(tab);
                }}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30 transition-all relative">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            {activeTab === 'home' && <HomeIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
                            {activeTab === 'stickies' && <StickyIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
                            {activeTab === 'workspace' && <LayoutGrid className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
                            {!activeProject && !['home', 'stickies', 'workspace'].includes(activeTab) && <LayoutDashboard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}

                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                                {activeProject ? activeProject.name : (
                                    activeTab === 'home' ? 'Home' :
                                        activeTab === 'stickies' ? 'Sticky Notes' :
                                            activeTab === 'workspace' ? 'Workspace' : 'Dashboard'
                                )}
                            </h1>
                        </div>
                        {activeProject && (
                            <>
                                <div className="h-4 w-px bg-gray-200 dark:bg-slate-700" />
                                <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 overflow-x-auto custom-scrollbar no-scrollbar">
                                    <span className="capitalize whitespace-nowrap">{activeTab === 'planning' ? 'Sprints' : activeTab}</span>
                                    {isFiltered && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="ml-2 flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded text-[10px] font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                                        >
                                            Clear Filters <X className="h-3 w-3" />
                                        </button>
                                    )}
                                </nav>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Global Search - Centered */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-transparent focus:bg-white dark:focus:bg-slate-900 border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:border-indigo-500 outline-none w-64 lg:w-96 transition-all dark:text-white shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-600 border border-gray-200 dark:border-slate-700 rounded px-1.5 py-0.5">⌘ K</span>
                                </div>
                            </div>
                        </div>

                        {activeProject && (activeTab === 'issues' || activeTab === 'planning') && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    className={`p-2 rounded-lg border transition-all ${isFiltered ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' : 'border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                                >
                                    <Filter className="h-4 w-4" />
                                </button>
                                {showFilterDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)} />
                                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-2xl z-50 p-4 space-y-4 animate-in fade-in zoom-in duration-150">
                                            <h4 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Quick Filters</h4>

                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-[10px] text-gray-400 mb-1 block">Sprint</label>
                                                    <select
                                                        value={selectedSprintId || ''}
                                                        onChange={(e) => setSelectedSprintId(e.target.value || null)}
                                                        className="w-full text-xs bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded p-1.5 outline-none dark:text-white"
                                                    >
                                                        <option value="">All Sprints</option>
                                                        {sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="text-[10px] text-gray-400 mb-1 block">Module</label>
                                                    <select
                                                        value={selectedModuleId || ''}
                                                        onChange={(e) => setSelectedModuleId(e.target.value || null)}
                                                        className="w-full text-xs bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded p-1.5 outline-none dark:text-white"
                                                    >
                                                        <option value="">All Modules</option>
                                                        {activeProject.modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-gray-400 mb-1 block">Label</label>
                                                    <select
                                                        value={selectedLabelId || ''}
                                                        onChange={(e) => setSelectedLabelId(e.target.value || null)}
                                                        className="w-full text-xs bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded p-1.5 outline-none dark:text-white"
                                                    >
                                                        <option value="">All Labels</option>
                                                        {activeProject.labels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="text-[10px] text-gray-400 mb-1 block">Issue Type</label>
                                                    <select
                                                        value={selectedIssueType || ''}
                                                        onChange={(e) => setSelectedIssueType(e.target.value as IssueType || null)}
                                                        className="w-full text-xs bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded p-1.5 outline-none dark:text-white"
                                                    >
                                                        <option value="">All Types</option>
                                                        <option value="ISSUE">Issue</option>
                                                        <option value="TASK">Task</option>
                                                        <option value="FEATURE">Feature</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <button
                                                onClick={clearAllFilters}
                                                className="w-full text-center py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                            >
                                                Reset Filters
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {activeProject && activeTab === 'issues' && (
                            <div className="hidden md:flex items-center gap-1 bg-gray-50 dark:bg-slate-800 p-1 rounded-lg border border-gray-100 dark:border-slate-700">
                                <button
                                    onClick={() => setActiveView('kanban')}
                                    className={`p-1.5 rounded transition-all ${activeView === 'kanban' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-indigo-600'}`}
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setActiveView('list')}
                                    className={`p-1.5 rounded transition-all ${activeView === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-indigo-600'}`}
                                >
                                    <LayoutList className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>

                        {activeProject && (
                            <button
                                onClick={() => { setSelectedIssue(null); setIsIssueModalOpen(true); }}
                                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Create</span>
                            </button>
                        )}

                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`p-2 rounded-lg transition-all relative ${showNotifications ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                        >
                            <Bell className="h-4 w-4" />
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-600 rounded-full border border-white dark:border-slate-900" />
                            )}
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="h-8 w-8 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700 flex-shrink-0 active:scale-95 transition-transform"
                            >
                                <img src={user.avatar} alt="User" />
                            </button>
                            {showProfileDropdown && (
                                <ProfileDropdown
                                    user={user}
                                    onOpenSettings={() => { setIsProfileSettingsOpen(true); setProfileSettingsTab('profile'); }}
                                    onOpenPreferences={() => { setIsProfileSettingsOpen(true); setProfileSettingsTab('preferences'); }}
                                    onSignOut={() => setUser(null)}
                                    onClose={() => setShowProfileDropdown(false)}
                                />
                            )}
                        </div>
                    </div>
                </header >

                <main className="flex-1 overflow-auto custom-scrollbar p-6 transition-colors">
                    {activeTab === 'home' ? (
                        <Home
                            user={user}
                            recentIssues={issues}
                            stickies={stickyNotes}
                            onIssueClick={openIssueDetail}
                            onAddSticky={handleCreateSticky}
                            onViewAllIssues={() => {
                                if (activeProject) setActiveTab('issues');
                                else setActiveTab('workspace');
                            }}
                        />
                    ) : activeTab === 'stickies' ? (
                        <StickyNotes
                            notes={stickyNotes}
                            onCreate={handleCreateSticky}
                            onUpdate={handleUpdateSticky}
                            onDelete={handleDeleteSticky}
                        />
                    ) : activeTab === 'workspace' || !activeProject ? (
                        <Dashboard
                            projects={projects}
                            onSelectProject={(id) => { setSelectedProjectId(id); setActiveTab('issues'); }}
                            onCreateProject={(name, key, description, logo, visibility, platform) => {
                                const newProj: Project = {
                                    id: `p${Date.now()}`,
                                    key, name, description, logo, visibility, platform, statuses: DEFAULT_STATUSES,
                                    modules: [], labels: [], members: [{ userId: 'u1', role: 'OWNER' }]
                                };
                                setProjects([...projects, newProj]);
                            }}
                            onDeleteProject={handleDeleteProject}
                            onUpdateProject={handleUpdateProject}
                        />
                    ) : (
                        <>
                            {activeTab === 'backlog' && (
                                <Backlog
                                    project={activeProject}
                                    issues={issues}
                                    sprints={sprints}
                                    backlogItems={backlogItems.filter(item => item.projectId === activeProject.id)}
                                    onIssueClick={openIssueDetail}
                                    onUpdateIssue={handleUpdateIssue}
                                    onCreateIssue={() => { setSelectedIssue(null); setIsIssueModalOpen(true); }}
                                    onCreateBacklogItem={handleCreateBacklogItem}
                                    onUpdateBacklogItem={handleUpdateBacklogItem}
                                    onDeleteBacklogItem={handleDeleteBacklogItem}
                                />
                            )}
                            {activeTab === 'planning' && (
                                <BacklogView
                                    project={activeProject}
                                    issues={issues}
                                    sprints={sprints}
                                    backlogItems={backlogItems}
                                    onIssueClick={openIssueDetail}
                                    onUpdateIssue={handleUpdateIssue}
                                    onSprintClick={handleSprintClick}
                                    onAddSprint={() => setIsSprintModalOpen(true)}
                                />
                            )}
                            {activeTab === 'issues' && (
                                activeView === 'kanban' ? (
                                    <KanbanBoard
                                        project={activeProject}
                                        issues={filteredIssues}
                                        sprints={sprints}
                                        onIssueClick={openIssueDetail}
                                        onUpdateIssue={handleUpdateIssue}
                                        onQuickCreate={(statusId) => {
                                            setSelectedIssue({ statusId } as any);
                                            setIsIssueModalOpen(true);
                                        }}
                                    />
                                ) : (
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm overflow-x-auto">
                                        <table className="w-full text-left min-w-[700px]">
                                            <thead className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
                                                <tr>
                                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Key</th>
                                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Title</th>
                                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest text-center">Sprint</th>
                                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Priority</th>
                                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest text-right">Assignee</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                                {filteredIssues.map(issue => (
                                                    <tr
                                                        key={issue.id}
                                                        className="hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                                                        onClick={() => openIssueDetail(issue)}
                                                    >
                                                        <td className="px-4 py-3 text-xs font-bold text-gray-400 dark:text-slate-500 whitespace-nowrap">{issue.key}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium text-gray-900 dark:text-slate-200 line-clamp-1">{issue.title}</span>
                                                                {issue.labelIds.length > 0 && (
                                                                    <div className="flex gap-1">
                                                                        {issue.labelIds.slice(0, 1).map(lid => {
                                                                            const label = activeProject.labels.find(l => l.id === lid);
                                                                            return label ? <div key={lid} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: label.color }} /> : null;
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="text-[10px] text-gray-500 dark:text-slate-400">
                                                                {sprints.find(s => s.id === issue.sprintId)?.name || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: activeProject.statuses.find(s => s.id === issue.statusId)?.color + '20', color: activeProject.statuses.find(s => s.id === issue.statusId)?.color }}>
                                                                {activeProject.statuses.find(s => s.id === issue.statusId)?.name}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <PriorityIcon priority={issue.priority} className="h-3.5 w-3.5" />
                                                                <span className="text-[10px] font-bold text-gray-600 dark:text-slate-400 capitalize">{issue.priority.toLowerCase()}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <div className="flex justify-end">
                                                                <img
                                                                    src={MOCK_USERS.find(u => u.id === issue.assigneeId)?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}
                                                                    className="h-6 w-6 rounded-full border border-gray-100 dark:border-slate-800"
                                                                    alt="avatar"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            )}
                            {activeTab === 'insights' && <Insights issues={issues} sprints={sprints} />}
                            {activeTab === 'test-cases' && <TestCaseManager project={activeProject} files={testCaseFiles} onUpdateFiles={setTestCaseFiles} />}
                            {activeTab === 'settings' && <ProjectSettings project={activeProject} setProjects={setProjects} onDeleteProject={handleDeleteProject} />}
                        </>
                    )}
                </main>
            </div >

            {isSprintModalOpen && activeProject && (
                <SprintModal
                    backlogItems={backlogItems.filter(item => item.projectId === activeProject.id)}
                    onClose={() => setIsSprintModalOpen(false)}
                    onSave={handleCreateSprint}
                />
            )}

            {
                isIssueModalOpen && activeProject && (
                    <IssueDetail
                        issue={selectedIssue}
                        project={activeProject}
                        users={MOCK_USERS}
                        sprints={sprints}
                        allIssues={issues}
                        onClose={() => setIsIssueModalOpen(false)}
                        onSave={selectedIssue?.id ? handleUpdateIssue : handleCreateIssue}
                    />
                )
            }

            {/* Notifications Portal */}
            {
                showNotifications && (
                    <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setShowNotifications(false)} />
                        <div className="fixed right-6 top-16 w-80 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-2xl z-[70] overflow-hidden flex flex-col max-h-[400px]">
                            <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50 dark:bg-slate-900/50">
                                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Notifications</h3>
                                <button
                                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                                    className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    Clear all
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-xs text-gray-400">Everything up to date.</div>
                                ) : (
                                    notifications.map(n => (
                                        <div key={n.id} className={`p-3 rounded-lg border transition-all ${n.read ? 'bg-transparent border-transparent opacity-60' : 'bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-100/50 dark:border-indigo-800/50'}`}>
                                            <p className="text-[10px] font-bold dark:text-white">{n.title}</p>
                                            <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">{n.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )
            }

            <ProfileSettingsModal
                isOpen={isProfileSettingsOpen}
                onClose={() => setIsProfileSettingsOpen(false)}
                user={user as User}
                initialTab={profileSettingsTab as any}
            />
        </div>
    );
};

export default MainApp;
