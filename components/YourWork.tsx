import React, { useState, useMemo } from 'react';
import {
    User as UserIcon,
    Briefcase,
    Clock,
    CheckCircle2,
    Circle,
    AlertCircle,
    CheckSquare,
    MessageSquare,
    Plus,
    ChevronDown,
    ExternalLink,
    Edit2
} from 'lucide-react';
import { User, Issue, Project, IssueType, Priority } from '../types';

interface YourWorkProps {
    user: User;
    issues: Issue[];
    projects: Project[];
    onOpenIssue: (issue: Issue) => void;
}

type TabType = 'summary' | 'assigned' | 'created' | 'activity';

const YourWork: React.FC<YourWorkProps> = ({ user, issues, projects, onOpenIssue }) => {
    const [activeTab, setActiveTab] = useState<TabType>('summary');

    const myAssignedIssues = useMemo(() =>
        issues.filter(i => i.assigneeId === user.id),
        [issues, user.id]
    );

    const myCreatedIssues = useMemo(() =>
        issues.filter(i => i.reporterId === user.id),
        [issues, user.id]
    );

    const stats = useMemo(() => {
        const createdCount = myCreatedIssues.length;
        const assignedCount = myAssignedIssues.length;

        // Mocked counts for demonstration to match screenshot "subscribed" concept if needed
        // but the user said "ignore subscribed tab"

        const workload = {
            backlog: myAssignedIssues.filter(i => i.statusId === '1').length,
            notStarted: myAssignedIssues.filter(i => i.statusId === '2').length,
            workingOn: myAssignedIssues.filter(i => i.statusId === '3').length,
            completed: myAssignedIssues.filter(i => i.statusId === '4').length,
            canceled: myAssignedIssues.filter(i => i.statusId === '5').length,
        };

        const priorities = {
            urgent: myAssignedIssues.filter(i => i.priority === 'URGENT').length,
            high: myAssignedIssues.filter(i => i.priority === 'HIGH').length,
            medium: myAssignedIssues.filter(i => i.priority === 'MEDIUM').length,
            low: myAssignedIssues.filter(i => i.priority === 'LOW').length,
        };

        return { createdCount, assignedCount, workload, priorities };
    }, [myCreatedIssues, myAssignedIssues]);

    // Mocked activity data
    const activities = [
        { id: 1, type: 'create', title: 'Created issue', target: 'ALT-12', time: '2h ago', project: 'TheAlterTrack' },
        { id: 2, type: 'comment', title: 'Commented on', target: 'ALT-5', time: '4h ago', project: 'TheAlterTrack' },
        { id: 3, type: 'status', title: 'Moved to Completed', target: 'ALT-2', time: 'Yesterday', project: 'ITW-CRM-Beta' },
    ];

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0c0d0e] transition-colors overflow-hidden pt-4">
            {/* Tab Navigation */}
            <div className="flex items-center gap-6 border-b border-gray-100 dark:border-slate-800/50 mb-4 pb-2 px-4">
                {(['summary', 'assigned', 'created', 'activity'] as TabType[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm font-medium pb-2 transition-all relative capitalize ${activeTab === tab
                            ? 'text-indigo-600 dark:text-sky-400'
                            : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-300'
                            }`}
                    >
                        {tab === 'activity' ? 'Activity' : tab}
                        {activeTab === tab && (
                            <span className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-indigo-600 dark:bg-sky-400 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6">
                    {activeTab === 'summary' && (
                        <div className="space-y-8 pb-8">
                            {/* Overview Widgets */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Overview</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <StatCard
                                        label="Work items created"
                                        value={stats.createdCount}
                                        icon={<Plus className="h-5 w-5 text-gray-500" />}
                                    />
                                    <StatCard
                                        label="Work items assigned"
                                        value={stats.assignedCount}
                                        icon={<UserIcon className="h-5 w-5 text-gray-500" />}
                                    />
                                </div>
                            </div>

                            {/* Workload */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Workload</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <WorkloadItem label="Backlog" value={stats.workload.backlog} color="bg-gray-400" />
                                    <WorkloadItem label="Not started" value={stats.workload.notStarted} color="bg-blue-500" />
                                    <WorkloadItem label="Working on" value={stats.workload.workingOn} color="bg-orange-500" />
                                    <WorkloadItem label="Completed" value={stats.workload.completed} color="bg-green-500" />
                                    <WorkloadItem label="Canceled" value={stats.workload.canceled} color="bg-red-500" />
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Work items by Priority</h3>
                                    <div className="bg-gray-50/50 dark:bg-slate-900/40 rounded-2xl p-6 border border-gray-100 dark:border-slate-800/50 h-64 flex items-end justify-between px-10">
                                        <BarChartItem height="40%" label="Low" />
                                        <BarChartItem height="70%" label="Med" />
                                        <BarChartItem height="90%" label="High" />
                                        <BarChartItem height="20%" label="Urg" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Work items by state</h3>
                                    <div className="bg-gray-50/50 dark:bg-slate-900/40 rounded-2xl p-6 border border-gray-100 dark:border-slate-800/50 h-64 flex items-center justify-center gap-8">
                                        <div className="relative w-40 h-40">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="20" className="text-gray-100 dark:text-slate-800" />
                                                <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="20" strokeDasharray="440" strokeDashoffset="100" className="text-green-500" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-2xl font-bold text-gray-900 dark:text-white">1</span>
                                                <span className="text-[10px] text-gray-500 uppercase">Total</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <LegendItem label="Backlog" count={0} color="bg-gray-400" />
                                            <LegendItem label="Unstarted" count={0} color="bg-blue-500" />
                                            <LegendItem label="Started" count={0} color="bg-orange-500" />
                                            <LegendItem label="Completed" count={1} color="bg-green-500" />
                                            <LegendItem label="Canceled" count={0} color="bg-red-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'assigned' || activeTab === 'created') && (
                        <div className="space-y-2">
                            {(activeTab === 'assigned' ? myAssignedIssues : myCreatedIssues).length === 0 ? (
                                <div className="py-20 text-center">
                                    <p className="text-gray-500 dark:text-slate-400">No work items found.</p>
                                </div>
                            ) : (
                                (activeTab === 'assigned' ? myAssignedIssues : myCreatedIssues).map(issue => (
                                    <button
                                        key={issue.id}
                                        onClick={() => onOpenIssue(issue)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800/50 rounded-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-indigo-500 transition-colors uppercase tracking-wider">{issue.key}</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{issue.title}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${issue.priority === 'URGENT' ? 'bg-red-100 text-red-600' :
                                                issue.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {issue.priority}
                                            </span>
                                            <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-6">
                            {activities.map(act => (
                                <div key={act.id} className="flex gap-4 relative">
                                    <div className="mt-1 flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                            {act.type === 'create' ? <Plus className="h-4 w-4 text-indigo-600" /> :
                                                act.type === 'comment' ? <MessageSquare className="h-4 w-4 text-indigo-600" /> :
                                                    <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                                        </div>
                                    </div>
                                    <div className="flex-1 pb-6 border-b border-gray-50 dark:border-slate-800/50">
                                        <p className="text-sm text-gray-900 dark:text-slate-200">
                                            <span className="font-bold">{act.title}</span> {act.target}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-400">{act.time}</span>
                                            <span className="h-1 w-1 bg-gray-300 rounded-full" />
                                            <span className="text-xs text-indigo-600 font-medium">{act.project}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Profile Sidebar */}
                <div className="w-80 border-l border-gray-100 dark:border-slate-800/50 px-6 flex flex-col">
                    <div className="relative group mb-6">
                        <div className="h-40 w-full rounded-2xl bg-gray-900 overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60" className="w-full h-full object-cover opacity-50" />
                            <button className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-lg text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <Edit2 className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="absolute -bottom-6 left-6 h-20 w-20 rounded-2xl bg-sky-500 border-4 border-white dark:border-[#0c0d0e] flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                            {user.name.charAt(0)}
                        </div>
                    </div>

                    <div className="mt-8 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-slate-500">({user.email.split('@')[0]})</p>
                        </div>

                        <div className="space-y-3">
                            <ProfileInfo label="Joined on" value="Oct 28, 2024" />
                            <ProfileInfo label="Timezone" value="17:41 UTC" />
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-slate-800/50 space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Projects</h3>
                            <div className="space-y-2">
                                {projects.slice(0, 3).map((p, idx) => (
                                    <div key={p.id} className="flex items-center justify-between group cursor-pointer p-1 hover:bg-gray-50 dark:hover:bg-slate-900 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-[10px] font-bold text-sky-600">
                                                {p.key.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{p.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {idx === 2 && <span className="text-[10px] font-bold text-red-500 bg-red-100/50 dark:bg-red-900/20 px-1.5 rounded">17%</span>}
                                            <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) => (
    <div className="p-6 bg-gray-50/50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800/50 rounded-2xl transition-all hover:bg-white dark:hover:bg-slate-800 shadow-sm hover:shadow-md group">
        <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </div>
        <div>
            <p className="text-xs text-gray-500 dark:text-slate-500 font-medium mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const WorkloadItem = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="p-4 bg-gray-50/30 dark:bg-slate-900/30 border border-gray-100/50 dark:border-slate-800/30 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
            <div className={`h-2.5 w-2.5 rounded-sm ${color}`} />
            <span className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">{value}</span>
    </div>
);

const LegendItem = ({ label, count, color }: { label: string; count: number; color: string }) => (
    <div className="flex items-center justify-between gap-4 min-w-[120px]">
        <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${color}`} />
            <span className="text-xs text-gray-600 dark:text-slate-400">{label}</span>
        </div>
        <span className="text-xs font-bold text-gray-900 dark:text-white">{count}</span>
    </div>
);

const BarChartItem = ({ height, label }: { height: string; label: string }) => (
    <div className="flex flex-col items-center gap-2 h-full flex-1 max-w-[40px]">
        <div className="w-8 bg-gray-200 dark:bg-slate-800 rounded-t-lg relative flex-1">
            <div
                className="absolute bottom-0 left-0 right-0 bg-indigo-500 dark:bg-sky-500 rounded-t-lg transition-all duration-1000"
                style={{ height }}
            />
        </div>
        <span className="text-[10px] text-gray-400 font-bold">{label}</span>
    </div>
);

const ProfileInfo = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center px-1">
        <span className="text-sm text-gray-500 dark:text-slate-500">{label}</span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
    </div>
);

export default YourWork;
