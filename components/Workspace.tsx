import React, { useState, useMemo } from 'react';
import {
    Search,
    ArrowUpDown,
    Filter,
    Plus,
    Settings,
    Link as LinkIcon,
    Star,
    Lock,
    Globe,
    Check,
    ChevronDown,
    ChevronUp,
    X,
    User as UserIcon
} from 'lucide-react';
import { Project, Role, ProjectPlatform } from '../types';

interface WorkspaceProps {
    projects: Project[];
    onSelectProject: (id: string) => void;
    onGoToSettings: (projectId: string) => void;
    onCreateProject: () => void;
    currentUserId: string;
    onJoinProject: (projectId: string) => void;
}

type SortField = 'manual' | 'name' | 'created_at' | 'members';
type SortOrder = 'asc' | 'desc';

const Workspace: React.FC<WorkspaceProps> = ({ projects, onSelectProject, onGoToSettings, onCreateProject, currentUserId, onJoinProject }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('created_at');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [projectToJoin, setProjectToJoin] = useState<Project | null>(null);
    const [filterExpanded, setFilterExpanded] = useState<Record<string, boolean>>({
        access: true,
        lead: true,
        members: true
    });

    const toggleFilter = (key: string) => {
        setFilterExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const sortedProjects = useMemo(() => {
        let result = [...projects];

        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.key.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        result.sort((a, b) => {
            let valA: any = a[sortField as keyof Project] || '';
            let valB: any = b[sortField as keyof Project] || '';

            if (sortField === 'members') {
                valA = a.members?.length || 0;
                valB = b.members?.length || 0;
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [projects, searchQuery, sortField, sortOrder]);

    const sortLabels: Record<SortField, string> = {
        manual: 'Manual',
        name: 'Name',
        created_at: 'Created date',
        members: 'Number of members'
    };

    const mockLeads = [
        { name: 'You', avatar: 'V', color: 'bg-emerald-500' },
        { name: 'aditya', avatar: 'A', color: 'bg-orange-500' },
        { name: 'akshay', avatar: 'A', color: 'bg-indigo-500' },
        { name: 'beast', avatar: 'A', color: 'bg-cyan-500' },
        { name: 'cibi', avatar: 'C', color: 'bg-teal-500' },
    ];

    return (
        <div className="p-4 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl shadow-sm">
                        <UserIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Projects</h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group flex items-center">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent text-gray-900 dark:text-white outline-none pl-10 pr-4 py-2 w-0 group-focus-within:w-48 lg:group-focus-within:w-64 transition-all duration-300 border-b border-transparent focus:border-indigo-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-2 h-5 w-5 text-gray-400 cursor-pointer" />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#1c1d1e] rounded-xl text-sm font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-[#2c2d2e] transition-all border border-transparent dark:border-slate-800 shadow-sm"
                        >
                            <ArrowUpDown className="h-4 w-4 text-gray-400" />
                            <span>{sortLabels[sortField]}</span>
                        </button>

                        {showSortDropdown && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1c1d1e] border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in duration-150 ring-1 ring-black/5">
                                    {(['manual', 'name', 'created_at', 'members'] as SortField[]).map(field => (
                                        <button
                                            key={field}
                                            onClick={() => { setSortField(field); setShowSortDropdown(false); }}
                                            className="w-full text-left px-5 py-3 text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-600 dark:text-slate-300 font-medium"
                                        >
                                            {sortLabels[field]}
                                            {sortField === field && <Check className="h-4 w-4 text-indigo-500" />}
                                        </button>
                                    ))}
                                    <div className="h-px bg-gray-100 dark:bg-slate-800 my-2" />
                                    <button
                                        onClick={() => setSortOrder('asc')}
                                        className="w-full text-left px-5 py-3 text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-600 dark:text-slate-300 font-medium"
                                    >
                                        Ascending
                                        {sortOrder === 'asc' && <Check className="h-4 w-4 text-indigo-500" />}
                                    </button>
                                    <button
                                        onClick={() => setSortOrder('desc')}
                                        className="w-full text-left px-5 py-3 text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-600 dark:text-slate-300 font-medium"
                                    >
                                        Descending
                                        {sortOrder === 'desc' && <Check className="h-4 w-4 text-indigo-500" />}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setShowFilterModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#1c1d1e] rounded-xl text-sm font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-[#2c2d2e] transition-all border border-transparent dark:border-slate-800 shadow-sm"
                    >
                        <Filter className="h-4 w-4 text-gray-400" />
                        Filters
                    </button>

                    <button
                        onClick={onCreateProject}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-sky-500/20 transition-all active:scale-95"
                    >
                        Add Project
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProjects.map(project => (
                    <div
                        key={project.id}
                        className="group bg-[#161718] border border-slate-800/50 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 cursor-pointer flex flex-col h-full"
                    >
                        <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden shrink-0">
                            {/* Visual background image based on project name hash or just a nice generic one */}
                            <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&auto=format&fit=crop&q=60')` }} />

                            <div className="absolute top-4 right-4 flex items-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <button className="p-2 bg-[#1c1d1e]/80 backdrop-blur-md rounded-lg text-slate-400 hover:text-white transition-colors">
                                    <LinkIcon className="h-4 w-4" />
                                </button>
                                <button className="p-2 bg-[#1c1d1e]/80 backdrop-blur-md rounded-lg text-slate-400 hover:text-white transition-colors">
                                    <Star className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="absolute -bottom-6 left-6 h-14 w-14 bg-[#1c1d1e] rounded-2xl shadow-xl border-4 border-[#161718] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 z-10">
                                {project.logo || '📁'}
                            </div>
                        </div>

                        <div className="p-6 pt-10 flex flex-col flex-1 space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors truncate pr-8">
                                        {project.name}
                                    </h3>
                                    {project.visibility === 'PRIVATE' ? <Lock className="h-3.5 w-3.5 text-slate-600" /> : <Globe className="h-3.5 w-3.5 text-sky-500/50" />}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{project.key}</span>
                                </div>
                            </div>

                            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed flex-1">
                                {project.description || 'Project description management and collaboration overview.'}
                            </p>

                            <div className="pt-4 flex items-center justify-between border-t border-slate-800/50 mt-auto">
                                <div className="flex items-center -space-x-2">
                                    {project.members && project.members.length > 0 ? (
                                        project.members.slice(0, 3).map((m, idx) => (
                                            <div key={idx} className="h-7 w-7 rounded-full bg-slate-800 border-2 border-[#161718] flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">
                                                {m.userId.substring(0, 2).toUpperCase()}
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-500 font-medium">No Member Yet</span>
                                    )}
                                    {project.members && project.members.length > 3 && (
                                        <div className="h-7 w-7 rounded-full bg-slate-800 border-2 border-[#161718] flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                                            +{project.members.length - 3}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    {(project.members && project.members.some(m => m.userId === currentUserId)) ? (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onGoToSettings(project.id); }}
                                            className="text-slate-500 hover:text-white transition-colors"
                                            title="Settings"
                                        >
                                            <Settings className="h-5 w-5" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setProjectToJoin(project); }}
                                            className="text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors"
                                        >
                                            Join
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Exact Filter Modal from Screenshot */}
            {showFilterModal && (
                <div className="fixed inset-0 z-[101] flex items-start justify-end pr-8 pt-24">
                    <div className="absolute inset-0 bg-transparent" onClick={() => setShowFilterModal(false)} />
                    <div className="relative w-full max-w-[320px] bg-[#0c0d0e] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full pl-10 pr-4 py-2 bg-[#161718] border border-slate-800 rounded-lg outline-none text-sm text-slate-300 placeholder:text-slate-600 focus:border-indigo-500/50 transition-colors"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <label className="flex items-center gap-3 p-2 hover:bg-slate-800/40 rounded-lg cursor-pointer transition-colors group">
                                <div className="h-4 w-4 rounded border border-slate-700 flex items-center justify-center group-hover:border-indigo-500">
                                    <Check className="h-3 w-3 text-transparent group-hover:text-indigo-500" />
                                </div>
                                <span className="text-sm text-slate-400 font-medium">My projects</span>
                            </label>

                            <div className="h-px bg-slate-800 mx-2" />

                            {/* Access Section */}
                            <div className="space-y-1">
                                <button
                                    onClick={() => toggleFilter('access')}
                                    className="w-full flex items-center justify-between p-2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest pl-1">Access</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${filterExpanded.access ? 'rotate-180' : ''}`} />
                                </button>
                                {filterExpanded.access && (
                                    <div className="space-y-1 pl-1">
                                        {[
                                            { label: 'Private', icon: Lock },
                                            { label: 'Public', icon: Globe }
                                        ].map(item => (
                                            <label key={item.label} className="flex items-center gap-3 p-2 hover:bg-slate-800/40 rounded-lg cursor-pointer transition-colors group">
                                                <div className="h-4 w-4 rounded border border-slate-700 flex items-center justify-center group-hover:border-indigo-500">
                                                    <Check className="h-3 w-3 text-transparent group-hover:text-indigo-500" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <item.icon className="h-3.5 w-3.5 text-slate-500" />
                                                    <span className="text-sm text-slate-400 font-medium">{item.label}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Lead Section */}
                            <div className="space-y-1">
                                <button
                                    onClick={() => toggleFilter('lead')}
                                    className="w-full flex items-center justify-between p-2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest pl-1">Lead</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${filterExpanded.lead ? 'rotate-180' : ''}`} />
                                </button>
                                {filterExpanded.lead && (
                                    <div className="space-y-1 pl-1">
                                        {mockLeads.map(lead => (
                                            <label key={lead.name} className="flex items-center gap-3 p-2 hover:bg-slate-800/40 rounded-lg cursor-pointer transition-colors group">
                                                <div className="h-4 w-4 rounded border border-slate-700 flex items-center justify-center group-hover:border-indigo-500">
                                                    <Check className="h-3 w-3 text-transparent group-hover:text-indigo-500" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-6 w-6 rounded-full ${lead.color} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                                                        {lead.avatar}
                                                    </div>
                                                    <span className="text-sm text-slate-400 font-medium">{lead.name}</span>
                                                </div>
                                            </label>
                                        ))}
                                        <button className="text-xs font-bold text-sky-400 hover:text-sky-300 pl-9 py-1 transition-colors">View all</button>
                                    </div>
                                )}
                            </div>

                            {/* Members Section */}
                            <div className="space-y-1">
                                <button
                                    onClick={() => toggleFilter('members')}
                                    className="w-full flex items-center justify-between p-2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest pl-1">Members</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${filterExpanded.members ? 'rotate-180' : ''}`} />
                                </button>
                                {filterExpanded.members && (
                                    <div className="space-y-1 pl-1">
                                        {mockLeads.slice(0, 3).map(member => (
                                            <label key={member.name} className="flex items-center gap-3 p-2 hover:bg-slate-800/40 rounded-lg cursor-pointer transition-colors group">
                                                <div className="h-4 w-4 rounded border border-slate-700 flex items-center justify-center group-hover:border-indigo-500">
                                                    <Check className="h-3 w-3 text-transparent group-hover:text-indigo-500" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-6 w-6 rounded-full ${member.color} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                                                        {member.avatar}
                                                    </div>
                                                    <span className="text-sm text-slate-400 font-medium">{member.name}</span>
                                                </div>
                                            </label>
                                        ))}
                                        <button className="text-xs font-bold text-sky-400 hover:text-sky-300 pl-9 py-1 transition-colors">View all</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Join Project Modal */}
            {projectToJoin && (
                <div className="fixed inset-0 z-[102] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setProjectToJoin(null)} />
                    <div className="relative w-full max-w-md bg-[#161718] border border-slate-800 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-white mb-2">Join Project</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Are you sure you want to join the project <span className="text-white font-medium">{projectToJoin.name}</span>?
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setProjectToJoin(null)}
                                className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onJoinProject(projectToJoin.id);
                                    setProjectToJoin(null);
                                }}
                                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                            >
                                Confirm Join
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workspace;
