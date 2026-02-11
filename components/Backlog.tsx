
import React, { useState } from 'react';
import { Project, Issue, Sprint, BacklogItem } from '../types';
import { PRIORITY_COLORS, MOCK_USERS } from '../constants';
import { GripVertical, Plus, Star, FileText, Trash2, Edit3 } from 'lucide-react';
import { IssueTypeIcon } from './IssueDetail';
import PriorityIcon from './PriorityIcon';
import BacklogItemModal from './BacklogItemModal';

interface BacklogProps {
    project: Project;
    issues: Issue[];
    sprints: Sprint[];
    backlogItems: BacklogItem[];
    onIssueClick: (issue: Issue) => void;
    onUpdateIssue: (issue: Issue) => void;
    onCreateIssue?: () => void;
    onCreateBacklogItem: (item: Omit<BacklogItem, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => void;
    onUpdateBacklogItem: (id: string, item: Partial<BacklogItem>) => void;
    onDeleteBacklogItem: (id: string) => void;
}

const Backlog: React.FC<BacklogProps> = ({
    project,
    issues,
    sprints,
    backlogItems,
    onIssueClick,
    onUpdateIssue,
    onCreateIssue,
    onCreateBacklogItem,
    onUpdateBacklogItem,
    onDeleteBacklogItem
}) => {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<BacklogItem | null>(null);
    const [viewingItem, setViewingItem] = useState<BacklogItem | null>(null);
    const backlogIssues = issues.filter(i => !i.sprintId);
    const unassignedBacklogItems = backlogItems.filter(i => !i.sprintId);

    const onDragOver = (e: React.DragEvent) => e.preventDefault();

    const onDrop = (e: React.DragEvent) => {
        const issueId = e.dataTransfer.getData('issueId');
        const issue = issues.find(i => i.id === issueId);
        if (issue && issue.sprintId) {
            onUpdateIssue({ ...issue, sprintId: undefined, updatedAt: new Date().toISOString() });
        }
    };

    const handleSaveBacklogItem = async (data: {
        title: string;
        overview: string;
        attachments: File[];
        tags: string[];
    }) => {
        const attachmentPromises = data.attachments.map(async (file) => {
            return new Promise<{ name: string; url: string; type: string; size: number }>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        name: file.name,
                        url: reader.result as string,
                        type: file.type,
                        size: file.size
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        const attachments = await Promise.all(attachmentPromises);

        if (editingItem) {
            onUpdateBacklogItem(editingItem.id, {
                title: data.title,
                overview: data.overview,
                attachments,
                tags: data.tags,
                updatedAt: new Date().toISOString()
            });
        } else {
            onCreateBacklogItem({
                title: data.title,
                overview: data.overview,
                attachments,
                tags: data.tags
            });
        }

        setShowModal(false);
        setEditingItem(null);
    };

    const handleView = (item: BacklogItem) => {
        setViewingItem(item);
        setEditingItem(item);
        setShowModal(true);
    };

    const handleEdit = (item: BacklogItem, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingItem(item);
        setViewingItem(null);
        setShowModal(true);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this backlog feature?')) {
            onDeleteBacklogItem(id);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setViewingItem(null);
    };

    return (
        <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Backlog</h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        {backlogItems.length} backlog {backlogItems.length === 1 ? 'feature' : 'features'} • {backlogIssues.length} unassigned {backlogIssues.length === 1 ? 'issue' : 'issues'}
                    </p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setViewingItem(null); setShowModal(true); }}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                    Create Backlog Feature
                </button>
            </div>

            {/* Backlog Items List */}
            {backlogItems.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Backlog Features</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-slate-800">
                        {backlogItems.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handleView(item)}
                                className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all"
                            >
                                {/* Star Icon */}
                                <Star className="h-5 w-5 text-gray-300 dark:text-slate-700 flex-shrink-0" />

                                {/* ID */}
                                <span className="text-sm font-semibold text-gray-700 dark:text-slate-300 flex-shrink-0 min-w-[90px]">
                                    {item.id}
                                </span>

                                {/* Title */}
                                <span className="text-sm text-gray-900 dark:text-white flex-1 truncate">
                                    {item.title}
                                </span>

                                {/* Actions (visible on hover) */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                    <button
                                        onClick={(e) => handleEdit(item, e)}
                                        className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(item.id, e)}
                                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Unassigned Issues Section */}
            {backlogIssues.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Unassigned Issues</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="bg-gray-50/50 dark:bg-slate-800/30 border-b border-gray-100 dark:border-slate-800 px-6 py-3">
                            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                                <div className="w-4"></div>
                                <div className="w-20">Key</div>
                                <div className="w-6">Type</div>
                                <div className="flex-1">Title</div>
                                <div className="w-24 text-center">Labels</div>
                                <div className="w-16 text-center">Points</div>
                                <div className="w-24 text-center">Priority</div>
                                <div className="w-12 text-right">Assignee</div>
                            </div>
                        </div>

                        <div
                            className="min-h-[100px]"
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                        >
                            {backlogIssues.map(issue => (
                                <div
                                    key={issue.id}
                                    draggable
                                    onDragStart={(e) => e.dataTransfer.setData('issueId', issue.id)}
                                    onClick={() => onIssueClick(issue)}
                                    className="group flex items-center gap-4 px-6 py-3 border-b border-gray-50 dark:border-slate-800/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 cursor-pointer transition-all"
                                >
                                    <GripVertical className="h-4 w-4 text-gray-200 dark:text-slate-800 opacity-0 group-hover:opacity-100 cursor-grab flex-shrink-0" />
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-600 w-20 flex-shrink-0">{issue.key}</span>
                                    <div className="w-6 flex-shrink-0">
                                        <IssueTypeIcon type={issue.type} className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-sm flex-1 text-gray-800 dark:text-slate-200 font-medium truncate">{issue.title}</span>

                                    <div className="flex items-center gap-1 w-24 justify-center flex-shrink-0">
                                        {issue.labelIds.slice(0, 3).map(lid => {
                                            const label = project.labels.find(l => l.id === lid);
                                            return label ? (
                                                <div
                                                    key={lid}
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: label.color }}
                                                    title={label.name}
                                                />
                                            ) : null;
                                        })}
                                        {issue.labelIds.length > 3 && (
                                            <span className="text-[9px] text-gray-400 ml-1">+{issue.labelIds.length - 3}</span>
                                        )}
                                    </div>

                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 w-16 text-center flex-shrink-0">
                                        {issue.storyPoints || '-'}
                                    </span>

                                    <div className="w-24 flex items-center justify-center gap-1.5 flex-shrink-0">
                                        <PriorityIcon priority={issue.priority} className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-bold text-gray-600 dark:text-slate-400 capitalize">
                                            {issue.priority.toLowerCase()}
                                        </span>
                                    </div>

                                    <div className="w-12 flex justify-end flex-shrink-0">
                                        <img
                                            src={MOCK_USERS.find(u => u.id === issue.assigneeId)?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}
                                            className="h-6 w-6 rounded-full border border-gray-100 dark:border-slate-800"
                                            alt="avatar"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {backlogItems.length === 0 && backlogIssues.length === 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-gray-200 dark:border-slate-800 p-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="h-20 w-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FileText className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No backlog features yet</h3>
                    <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
                        Your backlog is currently empty. Start by defining features or requirements for your project.
                    </p>
                    <button
                        onClick={() => { setEditingItem(null); setViewingItem(null); setShowModal(true); }}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Create Backlog Feature
                    </button>
                </div>
            )}

            {/* Backlog Item Modal */}
            {showModal && (
                <BacklogItemModal
                    onClose={handleCloseModal}
                    onSave={handleSaveBacklogItem}
                    existingItem={editingItem ? {
                        id: editingItem.id,
                        title: editingItem.title,
                        overview: editingItem.overview,
                        attachments: [],
                        tags: editingItem.tags
                    } : null}
                />
            )}
        </div>
    );
};

export default Backlog;
