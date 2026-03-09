
import React, { useState } from 'react';
import { Project, Issue, Sprint, Priority, BacklogItem, User } from '../types';
import { PRIORITY_COLORS } from '../constants';
import { ChevronDown, ChevronRight, GripVertical, Plus, ExternalLink, Star } from 'lucide-react';
import { IssueTypeIcon } from './IssueDetail';
import PriorityIcon from './PriorityIcon';

interface BacklogViewProps {
  project: Project;
  issues: Issue[];
  sprints: Sprint[];
  users: User[];
  backlogItems: BacklogItem[];
  onIssueClick: (issue: Issue) => void;
  onUpdateIssue: (issue: Issue) => void;
  onSprintClick: (sprintId: string) => void;
  onAddSprint?: () => void;
}

const BacklogView: React.FC<BacklogViewProps> = ({
  project,
  issues,
  sprints,
  users,
  backlogItems,
  onIssueClick,
  onUpdateIssue,
  onSprintClick,
  onAddSprint
}) => {
  const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>({
    's1': true
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSprints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getIssuesForSprint = (sprintId?: string) => {
    return issues.filter(i => i.sprintId === sprintId);
  };

  const getBacklogItemsForSprint = (sprintId?: string) => {
    return backlogItems.filter(i => i.sprintId === sprintId);
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const onDrop = (e: React.DragEvent, sprintId?: string) => {
    const issueId = e.dataTransfer.getData('issueId');
    const issue = issues.find(i => i.id === issueId);
    if (issue && issue.sprintId !== sprintId) {
      onUpdateIssue({ ...issue, sprintId, updatedAt: new Date().toISOString() });
    }
  };

  const renderIssueList = (sprintId?: string) => {
    const sprintIssues = getIssuesForSprint(sprintId);
    const sprintBacklogItems = getBacklogItemsForSprint(sprintId);

    return (
      <div
        className="min-h-[50px] space-y-px"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, sprintId)}
      >
        {/* Render Backlog Features (Backlog Items) */}
        {sprintBacklogItems.map(item => (
          <div
            key={item.id}
            className="group flex items-center gap-4 px-4 py-2.5 bg-indigo-50/20 dark:bg-indigo-900/10 border-b border-indigo-100/50 dark:border-indigo-800/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 cursor-pointer transition-all"
          >
            <div className="w-4 flex-shrink-0" /> {/* Spacer for drag handle */}
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono w-20 flex-shrink-0">{item.id}</span>
            <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
              <Star className="h-2.5 w-2.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-sm flex-1 text-gray-900 dark:text-white font-bold truncate">{item.title}</span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-100/50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">Feature</span>
          </div>
        ))}

        {/* Render Issues */}
        {sprintIssues.map(issue => (
          <div
            key={issue.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('issueId', issue.id)}
            onClick={() => onIssueClick(issue)}
            className="group flex items-center gap-4 px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-gray-50 dark:border-slate-800/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 cursor-pointer transition-all"
          >
            <GripVertical className="h-4 w-4 text-gray-200 dark:text-slate-800 opacity-0 group-hover:opacity-100 cursor-grab flex-shrink-0" />
            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-600 w-20 flex-shrink-0">{issue.key}</span>
            <IssueTypeIcon type={issue.type} className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-sm flex-1 text-gray-800 dark:text-slate-200 font-semibold truncate">{issue.title}</span>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex gap-1">
                {issue.labelIds.map(lid => {
                  const label = project.labels.find(l => l.id === lid);
                  return label ? <div key={lid} className="h-2 w-2 rounded-full" style={{ backgroundColor: label.color }} /> : null;
                })}
              </div>
              <span className="text-[10px] font-bold text-gray-400 min-w-[20px] text-center">{issue.storyPoints || '-'}</span>
              <div className="w-20 flex items-center justify-center">
                <PriorityIcon priority={issue.priority} className="h-3.5 w-3.5" />
              </div>
              <div className="w-8 flex justify-end">
                <img
                  src={users.find(u => u.id === issue.assigneeId)?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}
                  className="h-6 w-6 rounded-full border border-gray-100 dark:border-slate-800"
                  alt="avatar"
                />
              </div>
            </div>
          </div>
        ))}
        {sprintIssues.length === 0 && sprintBacklogItems.length === 0 && (
          <div className="py-8 text-center text-gray-400 dark:text-slate-700 text-[10px] font-bold uppercase tracking-widest border-2 border-dashed border-gray-50 dark:border-slate-800/50 rounded-lg m-2">
            No items assigned
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Sprints</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {sprints.length} {sprints.length === 1 ? 'sprint' : 'sprints'}
          </p>
        </div>
        <button
          onClick={onAddSprint}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Create Sprint
        </button>
      </div>

      {/* Sprints List */}
      {sprints.map(sprint => (
        <div key={sprint.id} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
          <div
            className="flex items-center justify-between px-6 py-4 bg-gray-50/50 dark:bg-slate-800/30 border-b border-gray-50 dark:border-slate-800 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors group/sprint"
            onClick={() => onSprintClick(sprint.id)}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => toggleExpand(sprint.id, e)}
                className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded transition-colors"
              >
                {expandedSprints[sprint.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white group-hover/sprint:text-indigo-600 transition-colors">{sprint.name}</h3>
                  {sprint.isActive && (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase">Active</span>
                  )}
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {getIssuesForSprint(sprint.id).length + getBacklogItemsForSprint(sprint.id).length} items
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Points</span>
                <span className="text-xs font-bold text-gray-700 dark:text-white">
                  {getIssuesForSprint(sprint.id).reduce((acc, i) => acc + (i.storyPoints || 0), 0)}
                </span>
              </div>
              <button className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Complete</button>
            </div>
          </div>
          {expandedSprints[sprint.id] && renderIssueList(sprint.id)}
        </div>
      ))}

      {/* Empty State */}
      {sprints.length === 0 && (
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-[32px] border border-dashed border-gray-200 dark:border-slate-800 p-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="h-20 w-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Plus className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No sprints yet</h3>
          <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
            You haven't created any sprints for this project. Start planning your work by creating your first sprint.
          </p>
          <button
            onClick={onAddSprint}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Create Sprint
          </button>
        </div>
      )}
    </div>
  );
};

export default BacklogView;
