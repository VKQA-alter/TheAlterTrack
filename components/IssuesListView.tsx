import React from 'react';
import { Issue, Project, Priority, Sprint, User } from '../types';
import PriorityIcon from './PriorityIcon';
import { Clock } from 'lucide-react';

interface IssuesListViewProps {
    issues: Issue[];
    project: Project;
    sprints: Sprint[];
    users: User[];
    onIssueClick: (issue: Issue) => void;
}

const IssuesListView: React.FC<IssuesListViewProps> = ({ issues, project, sprints, users, onIssueClick }) => {
    if (issues.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                <p className="text-gray-500 dark:text-slate-400">No issues found matching your filters.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {issues.map(issue => (
                <div
                    key={issue.id}
                    onClick={() => onIssueClick(issue)}
                    className="group bg-white dark:bg-[#0c0d0e] p-4 rounded-xl border border-gray-100 dark:border-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                >
                    <div className="flex items-center gap-4 flex-1">
                        <div className="flex flex-col items-center gap-1 shrink-0">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors uppercase tracking-wider">{issue.key}</span>
                            <PriorityIcon priority={issue.priority} className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {issue.title}
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-tight">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(issue.updatedAt).toLocaleDateString()}
                                </span>
                                {issue.labelIds.length > 0 && (
                                    <div className="flex gap-1 items-center">
                                        {issue.labelIds.map(lid => {
                                            const label = project.labels.find(l => l.id === lid);
                                            return label ? (
                                                <span key={lid} className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
                                                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: label.color }} />
                                                    {label.name}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
                            <span className="text-[9px] font-black text-gray-500 dark:text-slate-400 uppercase">
                                {project.statuses.find(s => s.id === issue.statusId)?.name || 'Backlog'}
                            </span>
                        </div>
                        {users.find(u => u.id === issue.assigneeId) && (
                            <img
                                src={users.find(u => u.id === issue.assigneeId)?.avatar}
                                className="h-6 w-6 rounded-full border border-white dark:border-slate-800 shadow-sm"
                                alt=""
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default IssuesListView;
