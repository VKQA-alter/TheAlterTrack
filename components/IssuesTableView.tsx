import React from 'react';
import { Issue, Project, Sprint, User } from '../types';
import PriorityIcon from './PriorityIcon';

interface IssuesTableViewProps {
    issues: Issue[];
    project: Project;
    sprints: Sprint[];
    users: User[];
    onIssueClick: (issue: Issue) => void;
}

const IssuesTableView: React.FC<IssuesTableViewProps> = ({ issues, project, sprints, users, onIssueClick }) => {
    if (issues.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                <p className="text-gray-500 dark:text-slate-400">No issues found matching your filters.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#0c0d0e] rounded-2xl border border-gray-100 dark:border-slate-800/50 overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
                <thead className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800/50">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">Key</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">Summary</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">Sprint</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest text-center">Priority</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest text-right">Assignee</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/30">
                    {issues.map(issue => {
                        const assignee = users.find(u => u.id === issue.assigneeId);
                        const sprint = sprints.find(s => s.id === issue.sprintId);
                        const status = project.statuses.find(s => s.id === issue.statusId);

                        return (
                            <tr
                                key={issue.id}
                                onClick={() => onIssueClick(issue)}
                                className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors uppercase tracking-wider">{issue.key}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{issue.title}</span>
                                        {issue.labelIds.length > 0 && (
                                            <div className="flex gap-1">
                                                {issue.labelIds.map(lid => {
                                                    const label = project.labels.find(l => l.id === lid);
                                                    return label ? <div key={lid} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: label.color }} /> : null;
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sprint ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-600'}`}>
                                        {sprint ? sprint.name : 'No Sprint'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <PriorityIcon priority={issue.priority} className="h-4 w-4" />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status?.color || '#ccc' }} />
                                        <span className="text-[10px] font-bold text-gray-600 dark:text-slate-400 uppercase tracking-tight">{status?.name || 'Backlog'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end">
                                        {assignee ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-gray-500 dark:text-slate-500">{assignee.name}</span>
                                                <img src={assignee.avatar} className="h-6 w-6 rounded-full border border-white dark:border-slate-800 shadow-sm" alt="" />
                                            </div>
                                        ) : (
                                            <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-gray-400">?</div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default IssuesTableView;
