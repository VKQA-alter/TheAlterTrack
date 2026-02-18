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
    LayoutGrid,
    ArrowLeft,
    Target,
    Layers,
    AlertCircle,
    ChevronRight
} from 'lucide-react';
import { Project, Issue, User, Sprint, Role, Status, IssueType, Notification, TestCaseFile, BacklogItem, StickyNote, ProjectPlatform } from '../types';
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
import { supabase } from '../lib/supabase';

const MainApp: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'home' | 'workspace' | 'backlog' | 'planning' | 'issues' | 'insights' | 'settings' | 'test-cases' | 'stickies'>('home');
    const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
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

    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoadingProjects(true);
            const { data, error } = await supabase.from('projects').select('*');
            if (!error && data) {
                setProjects(data as Project[]);
            }
            setIsLoadingProjects(false);
        };
        fetchProjects();
    }, []);

    const handleCreateProject = async (name: string, key: string, description: string, logo: string, visibility: 'PUBLIC' | 'PRIVATE', platform: ProjectPlatform) => {
        const newProj: Project = {
            id: `p${Date.now()}`,
            key, name, description, logo, visibility, platform,
            statuses: DEFAULT_STATUSES,
            modules: [], labels: [], members: [{ userId: 'u1', role: 'OWNER' }]
        };

        const { error } = await supabase.from('projects').insert([newProj]);
        if (!error) {
            setProjects(prev => [...prev, newProj]);
        } else {
            console.error('Error creating project:', error);
            alert('Failed to create project in Supabase. Check console.');
        }
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
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

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
            reporterId: 'u1',
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
        return <SignIn onSignIn={() => setUser(MOCK_USERS[0])} />;
    }

    return (
        <div className={`flex h-screen bg-transparent overflow-hidden transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
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
                                    className={`p-2 rounded-lg border transition-all ${isFiltered ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' : 'border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                                >
                                    <Filter className="h-4 w-4" />
                                </button>

                                {showFilterModal && (
                                    <>
                                        <div className="fixed inset-0 z-[100] bg-black/20 dark:bg-black/40 backdrop-blur-[2px] cursor-pointer" onClick={() => setShowFilterModal(false)} />
                                        <div className="fixed top-20 right-8 w-80 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[32px] shadow-2xl z-[101] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                                            {/* Modal Header */}
                                            <div className="p-6 pb-2 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {filterView !== 'categories' && (
                                                        <button
                                                            onClick={() => setFilterView('categories')}
                                                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                                        >
                                                            <ArrowLeft className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                                                        </button>
                                                    )}
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                            {filterView === 'categories' ? 'Filter Settings' :
                                                                filterView === 'sprints' ? 'Sprints' :
                                                                    filterView === 'modules' ? 'Modules' :
                                                                        filterView === 'labels' ? 'Labels' : 'Issue Types'}
                                                        </h3>
                                                        <p className="text-[11px] text-gray-500 dark:text-slate-500">
                                                            {filterView === 'categories' ? 'Select a category to refine results' : 'Select options to filter issues'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setShowFilterModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                                                    <X className="h-4 w-4 text-gray-400" />
                                                </button>
                                            </div>

                                            {/* Modal Content */}
                                            <div className="p-4 flex-1 min-h-[300px] max-h-[450px] overflow-y-auto custom-scrollbar">
                                                {filterView === 'categories' ? (
                                                    <div className="space-y-2">
                                                        {[
                                                            { id: 'sprints', label: 'Sprints', icon: Target, count: tempFilters.sprints.length },
                                                            { id: 'modules', label: 'Modules', icon: Layers, count: tempFilters.modules.length },
                                                            { id: 'labels', label: 'Labels', icon: Tag, count: tempFilters.labels.length },
                                                            { id: 'types', label: 'Issue Types', icon: AlertCircle, count: tempFilters.types.length }
                                                        ].map(cat => (
                                                            <button
                                                                key={cat.id}
                                                                onClick={() => setFilterView(cat.id as any)}
                                                                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-800 border border-gray-100/50 dark:border-slate-800/50 rounded-[22px] transition-all group shadow-sm hover:shadow-md"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className="h-10 w-10 rounded-[14px] bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                                        <cat.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                                    </div>
                                                                    <div className="text-left">
                                                                        <span className="text-sm font-bold text-gray-800 dark:text-slate-200">{cat.label}</span>
                                                                        {cat.count > 0 && <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">{cat.count} selected</p>}
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        {/* Drill-down items */}
                                                        {filterView === 'sprints' && sprints.map(s => (
                                                            <DrillDownItem
                                                                key={s.id}
                                                                label={s.name}
                                                                checked={tempFilters.sprints.includes(s.id)}
                                                                onChange={(checked) => {
                                                                    const next = checked ? [...tempFilters.sprints, s.id] : tempFilters.sprints.filter(id => id !== s.id);
                                                                    setTempFilters(prev => ({ ...prev, sprints: next }));
                                                                }}
                                                            />
                                                        ))}
                                                        {filterView === 'modules' && activeProject.modules.map(m => (
                                                            <DrillDownItem
                                                                key={m.id}
                                                                label={m.name}
                                                                checked={tempFilters.modules.includes(m.id)}
                                                                onChange={(checked) => {
                                                                    const next = checked ? [...tempFilters.modules, m.id] : tempFilters.modules.filter(id => id !== m.id);
                                                                    setTempFilters(prev => ({ ...prev, modules: next }));
                                                                }}
                                                            />
                                                        ))}
                                                        {filterView === 'labels' && activeProject.labels.map(l => (
                                                            <DrillDownItem
                                                                key={l.id}
                                                                label={l.name}
                                                                checked={tempFilters.labels.includes(l.id)}
                                                                onChange={(checked) => {
                                                                    const next = checked ? [...tempFilters.labels, l.id] : tempFilters.labels.filter(id => id !== l.id);
                                                                    setTempFilters(prev => ({ ...prev, labels: next }));
                                                                }}
                                                            />
                                                        ))}
                                                        {filterView === 'types' && ['ISSUE', 'TASK', 'FEATURE'].map(type => (
                                                            <DrillDownItem
                                                                key={type}
                                                                label={type.toLowerCase()}
                                                                className="capitalize"
                                                                checked={tempFilters.types.includes(type as IssueType)}
                                                                onChange={(checked) => {
                                                                    const next = checked ? [...tempFilters.types, type as IssueType] : tempFilters.types.filter(t => t !== type);
                                                                    setTempFilters(prev => ({ ...prev, types: next as IssueType[] }));
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Modal Footer */}
                                            <div className="p-6 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 flex items-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        setTempFilters({ sprints: [], modules: [], labels: [], types: [] });
                                                        setFilterView('categories');
                                                    }}
                                                    className="flex-1 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-[20px] transition-all"
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
                                                    className="flex-[1.5] py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-[20px] shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                                >
                                                    Apply Filters
                                                </button>
                                            </div>
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
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm"
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
                            onSelectProject={(id: string) => { setSelectedProjectId(id); setActiveTab('issues'); }}
                            onCreateProject={handleCreateProject}
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
                                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Module</th>
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
                                                            <div className="flex flex-wrap gap-1">
                                                                {issue.moduleIds.length > 0 ? (
                                                                    issue.moduleIds.map(mId => {
                                                                        const module = activeProject.modules.find(m => m.id === mId);
                                                                        return module ? (
                                                                            <span key={mId} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-[9px] font-bold text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700">
                                                                                {module.name}
                                                                            </span>
                                                                        ) : null;
                                                                    })
                                                                ) : (
                                                                    <span className="text-[10px] text-gray-400 dark:text-slate-600 italic">None</span>
                                                                )}
                                                            </div>
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
                )
            }

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
