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
    Check, Briefcase, Columns, TableProperties,
    X,
    Moon,
    Sun,
    Calendar,
    Tag,
    Boxes,
    Home as HomeIcon,
    StickyNote as StickyIcon,
    LayoutGrid,
    ArrowLeft,
    Target,
    Layers,
    AlertCircle,
    ChevronRight,
    PenLine,
    User as UserIcon,
    PanelLeft,
} from 'lucide-react';
import { Project, Issue, Priority, Sprint, User, Role, Status, IssueType, Notification, TestCaseFile, BacklogItem, StickyNote, ProjectPlatform } from '../types';
import { DEFAULT_STATUSES } from '../constants';
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
import { supabase } from '../lib/supabase';
import CustomizeNavigationModal from './CustomizeNavigationModal';
import { DEFAULT_NAV_PREFERENCES, NavPreferences } from '../types';
import Drafts from './Drafts';
import YourWork from './YourWork';
import Workspace from './Workspace';
import IssuesListView from './IssuesListView';
import IssuesTableView from './IssuesTableView';
import IssuesCalendarView from './IssuesCalendarView';

const MainApp: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'home' | 'workspace' | 'backlog' | 'planning' | 'issues' | 'insights' | 'settings' | 'test-cases' | 'stickies' | 'drafts' | 'your-work'>('home');
    const [activeView, setActiveView] = useState<'kanban' | 'list' | 'table' | 'calendar'>('kanban');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [testCaseFiles, setTestCaseFiles] = useState<TestCaseFile[]>([]);
    const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([]);

    // Filters (Multi-select)
    const [selectedSprintIds, setSelectedSprintIds] = useState<string[]>([]);
    const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);
    const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
    const [selectedIssueTypes, setSelectedIssueTypes] = useState<IssueType[]>([]);

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterView, setFilterView] = useState<'categories' | 'sprints' | 'modules' | 'labels' | 'types'>('categories');
    const [tempFilters, setTempFilters] = useState({
        sprints: [] as string[],
        modules: [] as string[],
        labels: [] as string[],
        types: [] as IssueType[]
    });
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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
    const [isNavCustomizationOpen, setIsNavCustomizationOpen] = useState(false);
    const [navPreferences, setNavPreferences] = useState<NavPreferences>(DEFAULT_NAV_PREFERENCES);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Projects Page Lifted State
    const [projectSearchQuery, setProjectSearchQuery] = useState('');
    const [projectSortField, setProjectSortField] = useState<'manual' | 'name' | 'created_at' | 'members'>('created_at');
    const [projectSortOrder, setProjectSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showProjectSortDropdown, setShowProjectSortDropdown] = useState(false);
    const [showProjectFilterModal, setShowProjectFilterModal] = useState(false);

    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoadingProjects(true);

            // Fetch Projects
            const { data: projectsData } = await supabase.from('projects').select('*');
            if (projectsData) setProjects(projectsData as Project[]);

            // Fetch Issues
            const { data: issuesData } = await supabase.from('issues').select('*');
            if (issuesData) setIssues(issuesData as Issue[]);

            // Fetch Sprints
            const { data: sprintsData } = await supabase.from('sprints').select('*');
            if (sprintsData) setSprints(sprintsData as Sprint[]);

            // Fetch Backlog Items
            const { data: backlogData } = await supabase.from('backlog_items').select('*');
            if (backlogData) setBacklogItems(backlogData as BacklogItem[]);

            // Fetch All Users (Profiles)
            const { data: profilesData } = await supabase.from('profiles').select('*');
            if (profilesData) {
                const mappedUsers = profilesData.map((p: any) => ({
                    id: p.id,
                    name: p.name || p.full_name || 'Unknown User',
                    email: p.email || '',
                    avatar: p.avatar || p.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${p.name || 'U'}`,
                    role: p.role || 'MEMBER'
                } as User));
                setUsers(mappedUsers);
            }

            setIsLoadingProjects(false);
        };
        fetchInitialData();
    }, []);

    const handleCreateProject = async (name: string, key: string, description: string, logo: string, visibility: 'PUBLIC' | 'PRIVATE', platform: ProjectPlatform) => {
        const newProj: Project = {
            id: `p${Date.now()}`,
            key, name, description, logo, visibility, platform,
            statuses: DEFAULT_STATUSES,
            modules: [], labels: [], members: [{ userId: user?.id || 'u1', role: 'OWNER' }]
        };

        const { error } = await supabase.from('projects').insert([newProj]);
        if (!error) {
            setProjects(prev => [...prev, newProj]);
        } else {
            console.error('Error creating project:', error);
            alert('Failed to create project in Supabase. Check console.');
        }
    };

    const handleJoinProject = async (projectId: string) => {
        if (!user) return;
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                const isMember = p.members?.some(m => m.userId === user.id);
                if (!isMember) {
                    return {
                        ...p,
                        members: [...(p.members || []), { userId: user.id, role: 'MEMBER' }]
                    };
                }
            }
            return p;
        }));
    };

    useEffect(() => {
        // Only access localStorage on the client side
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        const savedNav = localStorage.getItem('navPreferences');
        if (savedNav) {
            try {
                setNavPreferences(JSON.parse(savedNav));
            } catch (e) {
                console.error('Failed to parse navPreferences', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('navPreferences', JSON.stringify(navPreferences));
    }, [navPreferences]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);


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

            if (changed && notificationsEnabled) {
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

            const matchesSprint = selectedSprintIds.length === 0 || (issue.sprintId && selectedSprintIds.includes(issue.sprintId));
            const matchesModule = selectedModuleIds.length === 0 || issue.moduleIds.some(mId => selectedModuleIds.includes(mId));
            const matchesLabel = selectedLabelIds.length === 0 || issue.labelIds.some(lId => selectedLabelIds.includes(lId));
            const matchesType = selectedIssueTypes.length === 0 || selectedIssueTypes.includes(issue.type);

            return matchesSearch && matchesSprint && matchesModule && matchesLabel && matchesType;
        });
    }, [issues, searchQuery, selectedSprintIds, selectedModuleIds, selectedLabelIds, selectedIssueTypes]);

    const openIssueDetail = (issue: Issue) => {
        setSelectedIssue(issue);
        setIsIssueModalOpen(true);
    };

    const handleSprintClick = (sprintId: string) => {
        setSelectedSprintIds([sprintId]);
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
            reporterId: user?.id || 'u1',
            moduleIds: issueData.moduleIds || [],
            labelIds: issueData.labelIds || [],
            projectId: activeProject.id,
            sprintId: issueData.sprintId || (selectedSprintIds.length === 1 ? selectedSprintIds[0] : undefined),
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
        setSelectedSprintIds([]);
        setSelectedModuleIds([]);
        setSelectedLabelIds([]);
        setSelectedIssueTypes([]);
        setTempFilters({ sprints: [], modules: [], labels: [], types: [] });
    };

    const isFiltered = selectedSprintIds.length > 0 || selectedModuleIds.length > 0 || selectedLabelIds.length > 0 || selectedIssueTypes.length > 0;

    const handleDeleteProject = async (projectId: string) => {
        const { error } = await supabase.from('projects').delete().eq('id', projectId);
        if (!error) {
            setProjects(prev => prev.filter(p => p.id !== projectId));
            setIssues(prev => prev.filter(i => i.projectId !== projectId));
            if (selectedProjectId === projectId) {
                setSelectedProjectId(null);
                setActiveTab('workspace');
            }
        } else {
            console.error('Error deleting project:', error);
            alert('Failed to delete project in Supabase.');
        }
    };

    const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
        const { error } = await supabase.from('projects').update(updates).eq('id', id);
        if (!error) {
            setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        } else {
            console.error('Error updating project:', error);
            alert('Failed to update project in Supabase.');
        }
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
        return <SignIn onSignIn={(userData) => setUser(userData)} />;
    }

    return (
        <div className={`flex flex-col h-screen bg-[#fafafa] dark:bg-[#0c0d0e] transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
            <header className="h-16 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shrink-0 z-30 transition-all relative">
                {/* App Logo & Name - Static Header Section */}
                <div className="w-64 px-4 flex items-center border-r border-gray-100 dark:border-slate-800 h-full shrink-0">
                    <div className="flex items-center gap-2 truncate cursor-pointer group">
                        <div className="h-6 w-6 bg-sky-500 rounded flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">T</div>
                        <span className="font-bold text-sm text-gray-900 dark:text-white truncate">TheAlterTrack</span>
                    </div>
                </div>

                {/* Global Search - Perfectly Centered */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search commands..."
                            className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-transparent focus:bg-white dark:focus:bg-slate-900 border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:border-indigo-500 outline-none w-64 lg:w-96 transition-all dark:text-white shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-600 border border-gray-200 dark:border-slate-700 rounded px-1.5 py-0.5">⌘ K</span>
                        </div>
                    </div>
                </div>

                {/* Right Controls - Theme, Notifications, Profile */}
                <div className="flex items-center gap-4 px-6">
                    <div className="flex items-center gap-1 pr-1 border-r border-gray-100 dark:border-slate-800">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>

                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`p-2 rounded-lg transition-all relative ${showNotifications ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                        >
                            <Bell className="h-4 w-4" />
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-600 rounded-full border border-white dark:border-slate-900" />
                            )}
                        </button>
                    </div>

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
            </header>

            <div className="flex flex-1 min-h-0 overflow-hidden">
                <Sidebar
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    activeProject={activeProject}
                    activeTab={activeTab}
                    navPreferences={navPreferences}
                    projects={projects}
                    onTabChange={(tab: any) => {
                        if (tab === 'dashboard' || tab === 'home') {
                            setSelectedProjectId(null);
                            clearAllFilters();
                        }
                        setActiveTab(tab);
                    }}
                    onSelectProject={(id: string) => setSelectedProjectId(id)}
                    onOpenNavCustomization={() => setIsNavCustomizationOpen(true)}
                    onCreateWorkItem={() => {
                        setSelectedIssue(null);
                        setIsIssueModalOpen(true);
                    }}
                />

                <div className="flex-1 flex flex-col min-w-0">
                    <CustomizeNavigationModal
                        isOpen={isNavCustomizationOpen}
                        onClose={() => setIsNavCustomizationOpen(false)}
                        preferences={navPreferences}
                        onUpdate={setNavPreferences}
                    />

                    <main className="flex-1 overflow-auto custom-scrollbar transition-colors">
                        {/* Page Header - Consistent across all screens */}
                        <div className="px-4 py-4 border-b border-gray-50 dark:border-slate-800/50 bg-[#fafafa]/50 dark:bg-[#0c0d0e]/50 backdrop-blur-sm">
                            <div className="max-w-10xl mx-auto flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {activeTab === 'workspace' && <Briefcase className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                                    {activeTab === 'home' && <HomeIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                                    {activeTab === 'stickies' && <StickyIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                                    {activeTab === 'drafts' && <PenLine className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                                    {activeTab === 'your-work' && <UserIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                                    {!activeProject && !(['home', 'stickies', 'workspace', 'drafts', 'your-work'] as string[]).includes(activeTab) && <LayoutDashboard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                                    {activeProject && <div className="text-2xl leading-none">{activeProject.logo || '📁'}</div>}

                                    <h1 className="text-[14px] font-bold text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                                        {activeProject ? (
                                            <>
                                                <span className="text-gray-400 font-medium lowercase">projects /</span>
                                                <span>{activeProject.name}</span>
                                                {activeTab === 'issues' && (
                                                    <>
                                                        <span className="text-gray-400 font-medium mx-1">/</span>
                                                        <span className="text-indigo-600 dark:text-indigo-400">Work Items</span>
                                                    </>
                                                )}
                                            </>
                                        ) : (() => {
                                            switch (activeTab) {
                                                case 'home': return 'Home';
                                                case 'workspace': return 'Projects';
                                                case 'stickies': return 'Sticky Notes';
                                                case 'drafts': return 'Drafts';
                                                case 'your-work': return 'Your work';
                                                default: return 'Dashboard';
                                            }
                                        })()}
                                    </h1>
                                </div>

                                <div className="flex items-center gap-4">
                                    {activeTab === 'workspace' && (
                                        <div className="flex items-center gap-3">
                                            <div className="relative group flex items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Search projects..."
                                                    className="bg-transparent text-gray-900 dark:text-white outline-none pl-10 pr-4 py-2 w-0 group-focus-within:w-48 lg:group-focus-within:w-64 transition-all duration-300 border-b border-transparent focus:border-indigo-500 text-sm"
                                                    value={projectSearchQuery}
                                                    onChange={(e) => setProjectSearchQuery(e.target.value)}
                                                />
                                                <Search className="absolute left-2 h-4.5 w-4.5 text-gray-400 cursor-pointer" />
                                            </div>

                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowProjectSortDropdown(!showProjectSortDropdown)}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-[#1c1d1e] rounded-xl text-xs font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-[#2c2d2e] transition-all border border-transparent dark:border-slate-800 shadow-sm"
                                                >
                                                    <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                                                    <span>
                                                        {projectSortField === 'manual' ? 'Manual' :
                                                            projectSortField === 'name' ? 'Name' :
                                                                projectSortField === 'created_at' ? 'Created date' : 'Members'}
                                                    </span>
                                                </button>

                                                {showProjectSortDropdown && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setShowProjectSortDropdown(false)} />
                                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1c1d1e] border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in duration-150 ring-1 ring-black/5">
                                                            {(['manual', 'name', 'created_at', 'members'] as const).map(field => (
                                                                <button
                                                                    key={field}
                                                                    onClick={() => { setProjectSortField(field); setShowProjectSortDropdown(false); }}
                                                                    className="w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-600 dark:text-slate-300 font-medium"
                                                                >
                                                                    <span>
                                                                        {field === 'created_at' ? 'Created date' :
                                                                            field.charAt(0).toUpperCase() + field.slice(1)}
                                                                    </span>
                                                                    {projectSortField === field && <Check className="h-3.5 w-3.5 text-indigo-500" />}
                                                                </button>
                                                            ))}
                                                            <div className="h-px bg-gray-100 dark:bg-slate-800 my-1.5" />
                                                            <button
                                                                onClick={() => setProjectSortOrder('asc')}
                                                                className="w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-600 dark:text-slate-300 font-medium"
                                                            >
                                                                Ascending
                                                                {projectSortOrder === 'asc' && <Check className="h-3.5 w-3.5 text-indigo-500" />}
                                                            </button>
                                                            <button
                                                                onClick={() => setProjectSortOrder('desc')}
                                                                className="w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-600 dark:text-slate-300 font-medium"
                                                            >
                                                                Descending
                                                                {projectSortOrder === 'desc' && <Check className="h-3.5 w-3.5 text-indigo-500" />}
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => setShowProjectFilterModal(true)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-[#1c1d1e] rounded-xl text-xs font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-[#2c2d2e] transition-all border border-transparent dark:border-slate-800 shadow-sm"
                                            >
                                                <Filter className="h-3.5 w-3.5 text-gray-400" />
                                                Filters
                                            </button>

                                            <button
                                                onClick={() => setShowCreateMenu(true)}
                                                className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                                            >
                                                Add Project
                                            </button>
                                        </div>
                                    )}
                                    {activeProject && (activeTab === 'issues' || activeTab === 'planning') && (
                                        <div className="relative flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setTempFilters({
                                                        sprints: selectedSprintIds,
                                                        modules: selectedModuleIds,
                                                        labels: selectedLabelIds,
                                                        types: selectedIssueTypes
                                                    });
                                                    setFilterView('categories');
                                                    setShowFilterModal(true);
                                                }}
                                                className={`p-1.5 rounded-lg border transition-all ${isFiltered ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' : 'border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                                                title="Filter"
                                            >
                                                <Filter className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedIssue(null);
                                                    setIsIssueModalOpen(true);
                                                }}
                                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add Work Item
                                            </button>

                                            {showFilterModal && (
                                                <>
                                                    <div className="fixed inset-0 z-[100] bg-black/20 dark:bg-black/40 backdrop-blur-[2px] cursor-pointer" onClick={() => setShowFilterModal(false)} />
                                                    <div className="fixed top-40 right-8 w-80 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[32px] shadow-2xl z-[101] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                                                        {/* Modal Header */}
                                                        <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-50 dark:border-slate-800/50">
                                                            <div className="flex items-center gap-3">
                                                                {filterView !== 'categories' && (
                                                                    <button
                                                                        onClick={() => setFilterView('categories')}
                                                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                                                    >
                                                                        <ArrowLeft className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                                                                    </button>
                                                                )}
                                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                                    {filterView === 'categories' ? 'Filter Settings' :
                                                                        filterView === 'sprints' ? 'Sprint Filter' :
                                                                            filterView === 'modules' ? 'Module Filter' :
                                                                                filterView === 'labels' ? 'Label Filter' : 'Type Filter'}
                                                                </h3>
                                                            </div>
                                                            <button
                                                                onClick={() => setShowFilterModal(false)}
                                                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                                                            >
                                                                <X className="h-5 w-5" />
                                                            </button>
                                                        </div>

                                                        {/* Modal Body */}
                                                        <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[360px] custom-scrollbar">
                                                            {filterView === 'categories' && (
                                                                <>
                                                                    {[
                                                                        { id: 'sprints', label: 'Sprints', count: tempFilters.sprints.length, icon: <ArrowUpDown className="h-4 w-4" /> },
                                                                        { id: 'modules', label: 'Modules', count: tempFilters.modules.length, icon: <LayoutDashboard className="h-4 w-4" /> },
                                                                        { id: 'labels', label: 'Labels', count: tempFilters.labels.length, icon: <Tag className="h-4 w-4" /> },
                                                                        { id: 'types', label: 'Types', count: tempFilters.types.length, icon: <Layers className="h-4 w-4" /> },
                                                                    ].map(cat => (
                                                                        <button
                                                                            key={cat.id}
                                                                            onClick={() => setFilterView(cat.id as any)}
                                                                            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="text-gray-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors">{cat.icon}</span>
                                                                                <span className="text-sm font-bold text-gray-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{cat.label}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                {cat.count > 0 && (
                                                                                    <span className="text-[10px] font-black bg-indigo-500 text-white px-2 py-0.5 rounded-full">{cat.count}</span>
                                                                                )}
                                                                                <ChevronRight className="h-4 w-4 text-gray-300 dark:text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                                                            </div>
                                                                        </button>
                                                                    ))}
                                                                </>
                                                            )}

                                                            {filterView === 'sprints' && sprints.map(s => (
                                                                <label key={s.id} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={tempFilters.sprints.includes(s.id)}
                                                                        onChange={(e) => setTempFilters(prev => ({
                                                                            ...prev,
                                                                            sprints: e.target.checked
                                                                                ? [...prev.sprints, s.id]
                                                                                : prev.sprints.filter(id => id !== s.id)
                                                                        }))}
                                                                        className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-transparent"
                                                                    />
                                                                    <div className="flex items-center gap-2 min-w-0">
                                                                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${s.isActive ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-slate-600'}`} />
                                                                        <span className="text-sm font-medium text-gray-700 dark:text-slate-300 truncate">{s.name}</span>
                                                                    </div>
                                                                </label>
                                                            ))}

                                                            {filterView === 'modules' && (activeProject?.modules.length ?? 0) === 0 && (
                                                                <p className="text-center text-xs text-gray-400 dark:text-slate-500 py-8">No modules configured for this project.</p>
                                                            )}
                                                            {filterView === 'modules' && activeProject?.modules.map(m => (
                                                                <label key={m.id} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={tempFilters.modules.includes(m.id)}
                                                                        onChange={(e) => setTempFilters(prev => ({
                                                                            ...prev,
                                                                            modules: e.target.checked
                                                                                ? [...prev.modules, m.id]
                                                                                : prev.modules.filter(id => id !== m.id)
                                                                        }))}
                                                                        className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-transparent"
                                                                    />
                                                                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{m.name}</span>
                                                                </label>
                                                            ))}

                                                            {filterView === 'labels' && (activeProject?.labels.length ?? 0) === 0 && (
                                                                <p className="text-center text-xs text-gray-400 dark:text-slate-500 py-8">No labels configured for this project.</p>
                                                            )}
                                                            {filterView === 'labels' && activeProject?.labels.map(l => (
                                                                <label key={l.id} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={tempFilters.labels.includes(l.id)}
                                                                        onChange={(e) => setTempFilters(prev => ({
                                                                            ...prev,
                                                                            labels: e.target.checked
                                                                                ? [...prev.labels, l.id]
                                                                                : prev.labels.filter(id => id !== l.id)
                                                                        }))}
                                                                        className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-transparent"
                                                                    />
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                                                                        <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{l.name}</span>
                                                                    </div>
                                                                </label>
                                                            ))}

                                                            {filterView === 'types' && (['ISSUE', 'TASK', 'FEATURE'] as IssueType[]).map(type => (
                                                                <label key={type} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={tempFilters.types.includes(type)}
                                                                        onChange={(e) => setTempFilters(prev => ({
                                                                            ...prev,
                                                                            types: e.target.checked
                                                                                ? [...prev.types, type]
                                                                                : prev.types.filter(t => t !== type)
                                                                        }))}
                                                                        className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-transparent"
                                                                    />
                                                                    <span className={`text-sm font-bold ${type === 'ISSUE' ? 'text-red-500' : type === 'TASK' ? 'text-blue-500' : 'text-purple-500'}`}>{type}</span>
                                                                </label>
                                                            ))}
                                                        </div>

                                                        {/* Modal Footer */}
                                                        <div className="p-4 border-t border-gray-50 dark:border-slate-800/50 flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setTempFilters({ sprints: [], modules: [], labels: [], types: [] });
                                                                    clearAllFilters();
                                                                    setShowFilterModal(false);
                                                                }}
                                                                className="flex-1 py-2.5 text-sm font-bold text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
                                                            >
                                                                Clear All
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedSprintIds(tempFilters.sprints);
                                                                    setSelectedModuleIds(tempFilters.modules);
                                                                    setSelectedLabelIds(tempFilters.labels);
                                                                    setSelectedIssueTypes(tempFilters.types);
                                                                    setShowFilterModal(false);
                                                                }}
                                                                className="flex-1 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all shadow-sm active:scale-95"
                                                            >
                                                                Apply Filters
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={`${['home', 'drafts', 'your-work', 'workspace'].includes(activeTab) || !activeProject ? 'p-0' : 'p-6'}`}>
                            {activeTab === 'home' && user && (
                                <Home
                                    user={user}
                                    users={users}
                                    recentIssues={issues.filter(i => i.assigneeId === user.id || i.reporterId === user.id)}
                                    stickies={stickyNotes}
                                    onIssueClick={openIssueDetail}
                                    onAddSticky={handleCreateSticky}
                                    onViewAllIssues={() => setActiveTab('issues')}
                                />
                            )}
                            {activeTab === 'stickies' ? (
                                <StickyNotes
                                    notes={stickyNotes}
                                    onCreate={handleCreateSticky}
                                    onUpdate={handleUpdateSticky}
                                    onDelete={handleDeleteSticky}
                                />
                            ) : activeTab === 'drafts' ? (
                                <Drafts onCreateDraft={() => { setSelectedIssue(null); setIsIssueModalOpen(true); }} />
                            ) : activeTab === 'your-work' ? (
                                <YourWork user={user as User} issues={issues} projects={projects} onOpenIssue={openIssueDetail} />
                            ) : activeTab === 'workspace' || !activeProject ? (
                                <Workspace
                                    projects={projects}
                                    users={users}
                                    onSelectProject={(id: string) => {
                                        setSelectedProjectId(id);
                                        setActiveTab('planning');
                                    }}
                                    onGoToSettings={(id: string) => {
                                        setSelectedProjectId(id);
                                        setActiveTab('settings');
                                    }}
                                    onCreateProject={() => setShowCreateMenu(true)}
                                    currentUserId={user?.id || ''}
                                    onJoinProject={handleJoinProject}
                                    searchQuery={projectSearchQuery}
                                    setSearchQuery={setProjectSearchQuery}
                                    sortField={projectSortField}
                                    setSortField={setProjectSortField}
                                    sortOrder={projectSortOrder}
                                    setSortOrder={setProjectSortOrder}
                                    showFilterModal={showProjectFilterModal}
                                    setShowFilterModal={setShowProjectFilterModal}
                                />
                            ) : (
                                <>
                                    {activeTab === 'backlog' && activeProject && (
                                        <Backlog
                                            project={activeProject}
                                            issues={issues.filter(i => i.projectId === activeProject.id)}
                                            sprints={sprints}
                                            users={users}
                                            backlogItems={backlogItems.filter(i => i.projectId === activeProject.id)}
                                            onIssueClick={openIssueDetail}
                                            onUpdateIssue={handleUpdateIssue}
                                            onCreateBacklogItem={handleCreateBacklogItem}
                                            onUpdateBacklogItem={handleUpdateBacklogItem}
                                            onDeleteBacklogItem={handleDeleteBacklogItem}
                                        />
                                    )}
                                    {activeTab === 'planning' && activeProject && (
                                        <BacklogView
                                            project={activeProject}
                                            issues={issues.filter(i => i.projectId === activeProject.id)}
                                            sprints={sprints}
                                            users={users}
                                            backlogItems={backlogItems.filter(i => i.projectId === activeProject.id)}
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
                                                users={users}
                                                onIssueClick={openIssueDetail}
                                                onUpdateIssue={handleUpdateIssue}
                                                onQuickCreate={(statusId) => {
                                                    setSelectedIssue({ statusId } as any);
                                                    setIsIssueModalOpen(true);
                                                }}
                                            />
                                        ) : activeView === 'list' ? (
                                            <IssuesListView
                                                issues={filteredIssues}
                                                project={activeProject}
                                                sprints={sprints}
                                                users={users}
                                                onIssueClick={openIssueDetail}
                                            />
                                        ) : activeView === 'table' ? (
                                            <IssuesTableView
                                                issues={filteredIssues}
                                                project={activeProject}
                                                sprints={sprints}
                                                users={users}
                                                onIssueClick={openIssueDetail}
                                            />
                                        ) : (
                                            <IssuesCalendarView
                                                issues={filteredIssues}
                                                project={activeProject}
                                                onIssueClick={openIssueDetail}
                                            />
                                        )
                                    )}
                                    {activeTab === 'insights' && <Insights issues={issues} sprints={sprints} />}
                                    {activeTab === 'test-cases' && <TestCaseManager project={activeProject} files={testCaseFiles} onUpdateFiles={setTestCaseFiles} />}
                                    {activeTab === 'settings' && <ProjectSettings project={activeProject} users={users} setProjects={setProjects} onDeleteProject={handleDeleteProject} />}
                                </>
                            )}
                        </div>
                    </main>
                </div>

                {isSprintModalOpen && activeProject && (
                    <SprintModal
                        backlogItems={backlogItems.filter(item => item.projectId === activeProject?.id)}
                        onClose={() => setIsSprintModalOpen(false)}
                        onSave={handleCreateSprint}
                    />
                )}

                {isIssueModalOpen && activeProject && (
                    <IssueDetail
                        issue={selectedIssue}
                        project={activeProject as Project}
                        users={users}
                        sprints={sprints}
                        allIssues={issues}
                        onClose={() => setIsIssueModalOpen(false)}
                        onSave={selectedIssue?.id ? handleUpdateIssue : handleCreateIssue}
                    />
                )}

                {/* Notifications Portal */}
                {showNotifications && (
                    <>
                        <div className="fixed inset-0 z-[60] cursor-pointer" onClick={() => setShowNotifications(false)} />
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
                )}

                <ProfileSettingsModal
                    isOpen={isProfileSettingsOpen}
                    onClose={() => setIsProfileSettingsOpen(false)}
                    user={user as User}
                    initialTab={profileSettingsTab as any}
                    isDarkMode={isDarkMode}
                    onThemeChange={(theme: 'light' | 'dark') => setIsDarkMode(theme === 'dark')}
                    notificationsEnabled={notificationsEnabled}
                    onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
                />
            </div>
        </div>
    );
};

const DrillDownItem: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; className?: string }> = ({ label, checked, onChange, className }) => (
    <label className={`flex items-center justify-between p-3.5 bg-gray-50/50 dark:bg-slate-950/30 hover:bg-white dark:hover:bg-slate-800 border border-gray-100/50 dark:border-slate-800/50 rounded-2xl cursor-pointer group transition-all ${className}`}>
        <span className="text-xs font-bold text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors capitalize">{label}</span>
        <div className="relative inline-flex items-center">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="rounded border-gray-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-transparent h-4 w-4 transition-all"
            />
        </div>
    </label>
);

export default MainApp;
