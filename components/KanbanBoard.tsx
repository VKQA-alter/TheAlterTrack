import React from 'react';
import { Project, Issue, Priority, Sprint } from '../types';
import { PRIORITY_COLORS, MOCK_USERS } from '../constants';
import {
  MoreHorizontal,
  Layers,
  Plus,
  AlertCircle,
  Calendar,
  Clock,
  Check,
  Boxes,
  Disc,
  Tag,
  CircleDashed,
  LayoutGrid,
  X
} from 'lucide-react';
import { IssueTypeIcon } from './IssueDetail';
import PriorityIcon from './PriorityIcon';

interface KanbanBoardProps {
  project: Project;
  issues: Issue[];
  sprints: Sprint[];
  onIssueClick: (issue: Issue) => void;
  onUpdateIssue: (issue: Issue) => void;
  onQuickCreate: (statusId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ project, issues, sprints, onIssueClick, onUpdateIssue, onQuickCreate }) => {
  const [activeDropdown, setActiveDropdown] = React.useState<{ issueId: string, type: 'status' | 'priority' | 'assignee' | 'module' | 'sprint' | 'labels' | 'startDate' | 'dueDate' } | null>(null);

  const getIssuesForStatus = (statusId: string) => {
    return issues.filter(i => i.statusId === statusId);
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const onDrop = (e: React.DragEvent, statusId: string) => {
    const issueId = e.dataTransfer.getData('issueId');
    const issue = issues.find(i => i.id === issueId);
    if (issue && issue.statusId !== statusId) {
      onUpdateIssue({ ...issue, statusId, updatedAt: new Date().toISOString() });
    }
  };

  const handleUpdate = (issue: Issue, updates: Partial<Issue>) => {
    onUpdateIssue({ ...issue, ...updates, updatedAt: new Date().toISOString() });
    if (!updates.labelIds) setActiveDropdown(null); // Keep labels open for multi-select
  };

  const toggleLabel = (issue: Issue, labelId: string) => {
    const newLabelIds = issue.labelIds.includes(labelId)
      ? issue.labelIds.filter(id => id !== labelId)
      : [...issue.labelIds, labelId];
    handleUpdate(issue, { labelIds: newLabelIds });
  };

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Simple way to handle click outside: if target is not in a dropdown, close
      if (activeDropdown && !(e.target as HTMLElement).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    if (activeDropdown) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  if (issues.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="h-24 w-24 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl flex items-center justify-center mb-6">
          <LayoutGrid className="h-10 w-10 text-gray-300 dark:text-slate-700" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No issues found</h3>
        <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-xs text-center">
          There are no issues to display on the board. Create a new issue to get started or adjust your filters.
        </p>
        <button
          onClick={() => onQuickCreate(project.statuses[0].id)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Create First Issue
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full min-w-max pb-4 overflow-x-auto px-6">
      {project.statuses.map(status => (
        <div
          key={status.id}
          className="flex flex-col w-80 bg-gray-50/50 dark:bg-slate-900/30 rounded-2xl border border-gray-100 dark:border-slate-800/50 transition-colors"
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, status.id)}
        >
          {/* Column Header */}
          <div className="p-4 flex items-center justify-between font-pointer">
            <div className="flex items-center gap-2 cursor-default">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: status.color }} />
              <h3 className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">{status.name}</h3>
              <span className="bg-white dark:bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full text-gray-600 dark:text-slate-500 shadow-sm border border-gray-100 dark:border-slate-700">
                {getIssuesForStatus(status.id).length}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onQuickCreate(status.id)}
                className="p-1 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900/20 rounded-lg transition-colors cursor-pointer"
                title="Quick Create Issue"
              >
                <Plus className="h-5 w-5 stroke-[2.5]" />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Cards Area */}
          <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
            {getIssuesForStatus(status.id).map(issue => {
              const assignee = MOCK_USERS.find(u => u.id === issue.assigneeId);
              const mainModule = project.modules.find(m => issue.moduleIds.includes(m.id));
              const currentSprint = sprints.find(s => s.id === issue.sprintId);

              const isDropdownOpen = (type: string) =>
                activeDropdown?.issueId === issue.id && activeDropdown?.type === type;

              return (
                <div
                  key={issue.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('issueId', issue.id)}
                  onClick={() => onIssueClick(issue)}
                  className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="flex justify-between items-start mb-2" onClick={e => e.stopPropagation()}>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-wider font-mono cursor-default">{issue.key}</span>
                    <button className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1 rounded hover:bg-gray-50 dark:hover:bg-slate-700">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-4 leading-relaxed line-clamp-2 cursor-pointer transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                    {issue.title}
                  </h4>

                  <div className="space-y-2" onClick={e => e.stopPropagation()}>
                    {/* Row 1: Status, Priority, Dates, Assignee */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            setActiveDropdown(isDropdownOpen('status') ? null : { issueId: issue.id, type: 'status' });
                          }}
                          className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden shrink-0 hover:border-indigo-500 transition-colors cursor-pointer"
                        >
                          <CircleDashed className="h-3 w-3 text-gray-400 dark:text-slate-500" />
                          <span className="text-[9px] font-bold text-gray-600 dark:text-slate-400 uppercase tracking-tight">{status.name}</span>
                        </button>

                        {isDropdownOpen('status') && (
                          <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                            {project.statuses.map(s => (
                              <button
                                key={s.id}
                                onClick={() => handleUpdate(issue, { statusId: s.id })}
                                className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 flex items-center gap-2 cursor-pointer"
                              >
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                                {s.name}
                                {s.id === issue.statusId && <Check className="h-3 w-3 ml-auto text-indigo-500" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            setActiveDropdown(isDropdownOpen('priority') ? null : { issueId: issue.id, type: 'priority' });
                          }}
                          className={`p-1.5 rounded-lg border transition-colors hover:border-indigo-500 cursor-pointer ${issue.priority === 'URGENT' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50 text-red-500' : 'bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 text-gray-400'}`}
                        >
                          <PriorityIcon priority={issue.priority} className="h-3 w-3" />
                        </button>

                        {isDropdownOpen('priority') && (
                          <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                            {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as Priority[]).map(p => (
                              <button
                                key={p}
                                onClick={() => handleUpdate(issue, { priority: p })}
                                className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 flex items-center gap-2 cursor-pointer"
                              >
                                <PriorityIcon priority={p} className="h-3 w-3" />
                                {p}
                                {p === issue.priority && <Check className="h-3 w-3 ml-auto text-indigo-500" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            setActiveDropdown(isDropdownOpen('startDate') ? null : { issueId: issue.id, type: 'startDate' });
                          }}
                          className="p-1.5 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-gray-400 hover:border-indigo-500 transition-colors cursor-pointer"
                        >
                          <div className="relative">
                            <Calendar className={`h-3 w-3 ${issue.startDate ? 'text-indigo-500' : ''}`} />
                            <Clock className="h-1.5 w-1.5 absolute -bottom-0.5 -right-0.5 bg-gray-50 dark:bg-slate-900 rounded-full" />
                          </div>
                        </button>

                        {isDropdownOpen('startDate') && (
                          <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg shadow-xl z-50">
                            <input
                              type="date"
                              className="bg-transparent text-[10px] font-bold text-gray-900 dark:text-white border-none focus:ring-0 cursor-pointer"
                              value={issue.startDate ? new Date(issue.startDate).toISOString().split('T')[0] : ''}
                              onChange={(e) => handleUpdate(issue, { startDate: e.target.value })}
                            />
                            {issue.startDate && (
                              <button onClick={() => handleUpdate(issue, { startDate: undefined })} className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer">
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            setActiveDropdown(isDropdownOpen('dueDate') ? null : { issueId: issue.id, type: 'dueDate' });
                          }}
                          className="p-1.5 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-gray-400 hover:border-indigo-500 transition-colors cursor-pointer"
                        >
                          <div className="relative">
                            <Calendar className={`h-3 w-3 ${issue.endDate ? 'text-indigo-500' : ''}`} />
                            <Check className="h-1.5 w-1.5 absolute -bottom-0.5 -right-0.5 bg-gray-50 dark:bg-slate-900 rounded-full" />
                          </div>
                        </button>

                        {isDropdownOpen('dueDate') && (
                          <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg shadow-xl z-50">
                            <input
                              type="date"
                              className="bg-transparent text-[10px] font-bold text-gray-900 dark:text-white border-none focus:ring-0 cursor-pointer"
                              value={issue.endDate ? new Date(issue.endDate).toISOString().split('T')[0] : ''}
                              onChange={(e) => handleUpdate(issue, { endDate: e.target.value })}
                            />
                            {issue.endDate && (
                              <button onClick={() => handleUpdate(issue, { endDate: undefined })} className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer">
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            setActiveDropdown(isDropdownOpen('assignee') ? null : { issueId: issue.id, type: 'assignee' });
                          }}
                          className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white border border-white dark:border-slate-800 shadow-sm shrink-0 hover:scale-110 transition-transform cursor-pointer"
                        >
                          {assignee ? assignee.name.charAt(0) : '?'}
                        </button>

                        {isDropdownOpen('assignee') && (
                          <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                            {MOCK_USERS.map(u => (
                              <button
                                key={u.id}
                                onClick={() => handleUpdate(issue, { assigneeId: u.id })}
                                className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 flex items-center gap-2 cursor-pointer"
                              >
                                <img src={u.avatar} className="h-4 w-4 rounded-full" alt="" />
                                {u.name}
                                {u.id === issue.assigneeId && <Check className="h-3 w-3 ml-auto text-indigo-500" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Module, Sprint, Label */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            setActiveDropdown(isDropdownOpen('module') ? null : { issueId: issue.id, type: 'module' });
                          }}
                          className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg max-w-[150px] hover:border-indigo-500 transition-colors cursor-pointer"
                        >
                          <LayoutGrid className="h-3 w-3 text-gray-400 dark:text-slate-500" />
                          <span className="text-[9px] font-bold text-gray-600 dark:text-slate-400 truncate tracking-tight">{mainModule?.name || 'No Module'}</span>
                        </button>

                        {isDropdownOpen('module') && (
                          <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                            <button
                              onClick={() => handleUpdate(issue, { moduleIds: [] })}
                              className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer"
                            >
                              Clear Module
                            </button>
                            {project.modules.map(m => (
                              <button
                                key={m.id}
                                onClick={() => handleUpdate(issue, { moduleIds: [m.id] })}
                                className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 flex items-center gap-2 cursor-pointer"
                              >
                                <Boxes className="h-3 w-3" />
                                {m.name}
                                {issue.moduleIds.includes(m.id) && <Check className="h-3 w-3 ml-auto text-indigo-500" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            setActiveDropdown(isDropdownOpen('sprint') ? null : { issueId: issue.id, type: 'sprint' });
                          }}
                          className="p-1.5 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-gray-400 hover:border-indigo-500 transition-colors cursor-pointer"
                        >
                          <Disc className={`h-3 w-3 ${currentSprint ? 'text-indigo-500 animate-pulse' : ''}`} />
                        </button>

                        {isDropdownOpen('sprint') && (
                          <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                            <button
                              onClick={() => handleUpdate(issue, { sprintId: undefined })}
                              className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer"
                            >
                              No Sprint
                            </button>
                            {sprints.map(s => (
                              <button
                                key={s.id}
                                onClick={() => handleUpdate(issue, { sprintId: s.id })}
                                className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 flex items-center gap-2 cursor-pointer"
                              >
                                <Disc className={`h-3 w-3 ${s.isActive ? 'text-indigo-500' : ''}`} />
                                {s.name}
                                {s.id === issue.sprintId && <Check className="h-3 w-3 ml-auto text-indigo-500" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            setActiveDropdown(isDropdownOpen('labels') ? null : { issueId: issue.id, type: 'labels' });
                          }}
                          className="p-1.5 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-gray-400 hover:border-indigo-500 transition-colors cursor-pointer"
                        >
                          <Tag className={`h-3 w-3 ${issue.labelIds.length > 0 ? 'text-indigo-500' : ''}`} />
                        </button>

                        {isDropdownOpen('labels') && (
                          <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                            {project.labels.map(l => (
                              <button
                                key={l.id}
                                onClick={() => toggleLabel(issue, l.id)}
                                className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 flex items-center gap-2 cursor-pointer"
                              >
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
                                {l.name}
                                {issue.labelIds.includes(l.id) && <Check className="h-3 w-3 ml-auto text-indigo-500" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {getIssuesForStatus(status.id).length === 0 && (
              <div className="flex-1 min-h-[150px] border-2 border-dashed border-gray-100 dark:border-slate-800/50 rounded-2xl flex flex-col items-center justify-center p-6 text-center group/empty transition-colors hover:border-indigo-100 dark:hover:border-indigo-900/30">
                <div className="h-10 w-10 bg-gray-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center mb-3 group-hover/empty:bg-indigo-50 dark:group-hover/empty:bg-indigo-900/30 transition-colors">
                  <Check className="h-5 w-5 text-gray-200 dark:text-slate-800 group-hover/empty:text-indigo-400 transition-colors" />
                </div>
                <p className="text-[10px] text-gray-400 dark:text-slate-600 font-bold uppercase tracking-wider">No items yet</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
