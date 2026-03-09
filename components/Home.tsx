"use client";

import React from 'react';
import {
    Plus,
    Search,
    Clock,
    Users,
    Settings,
    MoreVertical,
    Layers,
    StickyNote as StickyIcon
} from 'lucide-react';
import { Issue, StickyNote, User } from '../types';
import PriorityIcon from './PriorityIcon';

interface HomeProps {
    user: User;
    users: User[];
    recentIssues: Issue[];
    stickies: StickyNote[];
    onIssueClick: (issue: Issue) => void;
    onAddSticky: () => void;
    onViewAllIssues: () => void;
}

const Home: React.FC<HomeProps> = ({
    user,
    users,
    recentIssues,
    stickies,
    onIssueClick,
    onAddSticky,
    onViewAllIssues
}) => {
    const [filter, setFilter] = React.useState<'All' | 'Created' | 'Assigned'>('All');

    const filteredIssues = recentIssues.filter(issue => {
        if (filter === 'Created') return issue.reporterId === user.id;
        if (filter === 'Assigned') return issue.assigneeId === user.id;
        return true;
    });

    return (
        <div className="p-8 max-w-8xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Recents Section */}

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recents</h2>
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="appearance-none bg-gray-50/50 dark:bg-slate-800/50 px-3 py-1.5 pr-8 rounded-lg text-xs font-bold text-gray-500 dark:text-slate-400 outline-none cursor-pointer border border-gray-100 dark:border-slate-800 hover:border-indigo-500 transition-all"
                        >
                            <option value="All">All</option>
                            <option value="Created">Created by me</option>
                            <option value="Assigned">Assigned to me</option>
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    {filteredIssues.length > 0 ? (
                        <div className="divide-y divide-gray-50 dark:divide-slate-800">
                            {filteredIssues.slice(0, 7).map(issue => (
                                <div
                                    key={issue.id}
                                    onClick={() => onIssueClick(issue)}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                                >
                                    <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                                        <Layers className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tight">{issue.key}</span>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-slate-200 truncate">{issue.title}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">2 days ago</span>
                                        <div className="flex items-center gap-3">
                                            <div className="h-4 w-4 rounded-full border-2 border-dashed border-gray-300 dark:border-slate-700" />
                                            <div className="h-4 w-4 rounded-full border-2 border-gray-300 dark:border-slate-700" />
                                            <img
                                                src={users.find(u => u.id === issue.assigneeId)?.avatar || user.avatar}
                                                className="h-6 w-6 rounded-full border border-white dark:border-slate-800 shadow-sm"
                                                alt="avatar"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={onViewAllIssues}
                                className="w-full py-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                Show all
                            </button>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="h-12 w-12 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-slate-400">No recent activity found.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Stickies Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your stickies</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                            <Search className="h-4 w-4" />
                        </button>
                        <button
                            onClick={onAddSticky}
                            className="flex items-center gap-2 text-sky-500 hover:text-sky-600 text-sm font-bold transition-all active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            Add sticky
                        </button>
                    </div>
                </div>

                {stickies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stickies.slice(0, 3).map(sticky => (
                            <div
                                key={sticky.id}
                                className="p-6 rounded-2xl shadow-sm border border-transparent transition-all hover:shadow-lg hover:-translate-y-1"
                                style={{ backgroundColor: sticky.color + '20', borderColor: sticky.color + '40' }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: sticky.color }} />
                                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className={`text-sm text-gray-800 dark:text-slate-200 line-clamp-4 ${sticky.isBold ? 'font-bold' : ''} ${sticky.isItalic ? 'italic' : ''}`}>
                                    {sticky.content || 'Empty note...'}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 p-12 text-center">
                        <div className="relative mb-6 flex justify-center">
                            {/* Simplified Sticky Illustration */}
                            <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center transform rotate-6 border border-gray-200 dark:border-slate-700">
                                <StickyIcon className="text-gray-300 dark:text-slate-700 h-10 w-10" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs mx-auto">
                            Jot down an idea, capture an aha, or record a brainwave. Add a sticky to get started.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
