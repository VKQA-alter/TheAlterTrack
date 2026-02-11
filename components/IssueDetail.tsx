
import React, { useState, useRef, useEffect } from 'react';
import {
  X, Send, ChevronRight, Tag, Boxes,
  Calendar as CalendarIcon, Hash, Plus,
  ArrowRight, Check, AlertCircle, CheckSquare,
  Sparkles, ChevronDown, Filter
} from 'lucide-react';
import { Issue, Project, User, Sprint, Priority, IssueType } from '../types';
import { TYPE_COLORS, PRIORITY_COLORS } from '../constants';
import PriorityIcon from './PriorityIcon';

interface IssueDetailProps {
  issue: Issue | null;
  project: Project;
  users: User[];
  sprints: Sprint[];
  allIssues: Issue[];
  onClose: () => void;
  onSave: (issue: Partial<Issue>) => void;
}

export const IssueTypeIcon: React.FC<{ type: IssueType; className?: string }> = ({ type, className = "h-4 w-4" }) => {
  switch (type) {
    case 'ISSUE': return <AlertCircle className={`${className} text-red-500`} />;
    case 'TASK': return <CheckSquare className={`${className} text-blue-500`} />;
    case 'FEATURE': return <Sparkles className={`${className} text-purple-500`} />;
    default: return <AlertCircle className={className} />;
  }
};

const IssueDetail: React.FC<IssueDetailProps> = ({ issue, project, users, sprints, allIssues, onClose, onSave }) => {
  const [title, setTitle] = useState(issue?.title || '');
  const [description, setDescription] = useState(issue?.description || '');
  const [statusId, setStatusId] = useState(issue?.statusId || project.statuses[0].id);
  const [priority, setPriority] = useState<Priority>(issue?.priority || 'MEDIUM');
  const [type, setType] = useState<IssueType>(issue?.type || 'TASK');
  const [assigneeId, setAssigneeId] = useState(issue?.assigneeId || '');
  const [sprintId, setSprintId] = useState(issue?.sprintId || '');
  const [storyPoints, setStoryPoints] = useState(issue?.storyPoints || 0);
  const [startDate, setStartDate] = useState(issue?.startDate || '');
  const [endDate, setEndDate] = useState(issue?.endDate || '');
  const [moduleIds, setModuleIds] = useState<string[]>(issue?.moduleIds || []);
  const [labelIds, setLabelIds] = useState<string[]>(issue?.labelIds || []);

  // Dropdown states
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [isLabelOpen, setIsLabelOpen] = useState(false);

  const subIssues = allIssues.filter(i => i.parentId === issue?.id);
  const parentIssue = allIssues.find(i => i.id === issue?.parentId);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      ...(issue || {}),
      title,
      description,
      statusId,
      priority,
      type,
      assigneeId: assigneeId || undefined,
      sprintId: sprintId || undefined,
      storyPoints,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      moduleIds,
      labelIds,
      parentId: issue?.parentId,
      updatedAt: new Date().toISOString(),
    } as any);
  };

  const toggleModule = (id: string) => {
    setModuleIds(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const toggleLabel = (id: string) => {
    setLabelIds(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const selectedModules = project.modules.filter(m => moduleIds.includes(m.id));
  const selectedLabels = project.labels.filter(l => labelIds.includes(l.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-transparent dark:border-slate-800">

        {/* Header */}
        <div className="px-8 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {parentIssue && (
                <>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{parentIssue.key}</span>
                  <ChevronRight className="h-3 w-3 text-gray-400" />
                </>
              )}
              <span className="text-xs font-bold text-gray-400 dark:text-slate-500">{issue?.key || 'NEW ISSUE'}</span>
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              <IssueTypeIcon type={type} />
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="bg-transparent text-xs font-bold uppercase outline-none cursor-pointer text-gray-600 dark:text-slate-300"
              >
                <option value="ISSUE">Issue</option>
                <option value="TASK">Task</option>
                <option value="FEATURE">Feature</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95"
            >
              {issue?.id ? 'Save Changes' : 'Create Issue'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summary"
              className="text-2xl font-bold text-gray-900 dark:text-white w-full mb-8 outline-none bg-transparent placeholder:text-gray-200 dark:placeholder:text-slate-700 tracking-tight"
            />

            <div className="mb-10">
              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3 block">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this issue..."
                className="w-full h-64 p-4 bg-gray-50/50 dark:bg-slate-800/50 border border-transparent dark:border-slate-800/50 focus:border-indigo-500 dark:focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-sm outline-none transition-all resize-none shadow-inner dark:text-slate-200"
              />
            </div>

            {issue?.id && (
              <div className="pt-8 border-t border-gray-100 dark:border-slate-800">
                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 block">Discussion</label>
                <div className="flex items-start gap-3">
                  <img src={users[0].avatar} className="h-8 w-8 rounded-full" alt="avatar" />
                  <div className="flex-1 bg-gray-50 dark:bg-slate-800 rounded-xl p-3 border border-transparent dark:border-slate-700">
                    <textarea
                      placeholder="Leave a comment..."
                      className="w-full bg-transparent border-none outline-none text-xs resize-none h-12 dark:text-white"
                    />
                    <div className="flex justify-end pt-2">
                      <button className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-all">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Attributes Sidebar */}
          <div className="w-80 border-l border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 p-6 space-y-8 overflow-y-auto custom-scrollbar">

            {/* Status */}
            <section>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Status</label>
              <div className="relative group">
                <select
                  value={statusId}
                  onChange={(e) => setStatusId(e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-xs font-bold outline-none ring-offset-2 focus:ring-2 ring-indigo-500 transition-all dark:text-white cursor-pointer"
                >
                  {project.statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none group-hover:text-gray-600" />
              </div>
            </section>

            {/* Assignee */}
            <section>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Assignee</label>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-lg border border-gray-200 dark:border-slate-700 group hover:border-indigo-300 transition-colors">
                <img
                  src={users.find(u => u.id === assigneeId)?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=U'}
                  className="h-7 w-7 rounded-full"
                  alt="avatar"
                />
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="flex-1 bg-transparent text-xs font-medium outline-none cursor-pointer dark:text-white"
                >
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </section>

            {/* Priority */}
            <section>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Priority</label>
              <div className="grid grid-cols-2 gap-2">
                {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as Priority[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${priority === p
                      ? 'bg-white dark:bg-slate-700 border-indigo-500 text-indigo-700 dark:text-indigo-400 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-400'
                      }`}
                  >
                    <PriorityIcon priority={p} className="h-3.5 w-3.5" />
                    <span className="capitalize">{p.toLowerCase()}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Modules Dropdown */}
            <section>
              <div
                className="flex items-center justify-between cursor-pointer group mb-3"
                onClick={() => setIsModuleOpen(!isModuleOpen)}
              >
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors">Modules</label>
                <div className="flex items-center gap-2">
                  {selectedModules.length > 0 && !isModuleOpen && (
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded">
                      {selectedModules.length}
                    </span>
                  )}
                  <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${isModuleOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {isModuleOpen ? (
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 max-h-48 overflow-y-auto custom-scrollbar space-y-0.5 animate-in slide-in-from-top-2 duration-200">
                  {project.modules.map(mod => (
                    <button
                      key={mod.id}
                      onClick={() => toggleModule(mod.id)}
                      className={`w-full flex items-center justify-between p-2 rounded text-[10px] font-bold transition-all ${moduleIds.includes(mod.id)
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-900/50'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <Boxes className="h-3.5 w-3.5 opacity-70" />
                        <span>{mod.name}</span>
                      </div>
                      {moduleIds.includes(mod.id) && <Check className="h-3 w-3" />}
                    </button>
                  ))}
                  {project.modules.length === 0 && <span className="text-[10px] text-gray-300 italic px-2">No modules</span>}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selectedModules.length > 0 ? selectedModules.map(m => (
                    <div key={m.id} className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-[10px] font-bold text-gray-600 dark:text-slate-400 shadow-sm">
                      <Boxes className="h-2.5 w-2.5" />
                      {m.name}
                    </div>
                  )) : (
                    <span className="text-[10px] text-gray-300 dark:text-slate-700 italic">None selected</span>
                  )}
                </div>
              )}
            </section>

            {/* Labels Dropdown */}
            <section>
              <div
                className="flex items-center justify-between cursor-pointer group mb-3"
                onClick={() => setIsLabelOpen(!isLabelOpen)}
              >
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors">Labels</label>
                <div className="flex items-center gap-2">
                  {selectedLabels.length > 0 && !isLabelOpen && (
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded">
                      {selectedLabels.length}
                    </span>
                  )}
                  <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${isLabelOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {isLabelOpen ? (
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 max-h-48 overflow-y-auto custom-scrollbar flex flex-wrap gap-1 animate-in slide-in-from-top-2 duration-200">
                  {project.labels.map(label => (
                    <button
                      key={label.id}
                      onClick={() => toggleLabel(label.id)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full text-[10px] font-bold border transition-all ${labelIds.includes(label.id)
                        ? 'shadow-sm ring-2 ring-indigo-500/20'
                        : 'opacity-40 grayscale-[0.2] hover:opacity-100'
                        }`}
                      style={{
                        backgroundColor: label.color + '15',
                        borderColor: label.color,
                        color: label.color
                      }}
                    >
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: label.color }} />
                      {label.name}
                      {labelIds.includes(label.id) && <Check className="h-2.5 w-2.5" />}
                    </button>
                  ))}
                  {project.labels.length === 0 && <span className="text-[10px] text-gray-300 italic px-2">No labels</span>}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selectedLabels.length > 0 ? selectedLabels.map(l => (
                    <div
                      key={l.id}
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border shadow-sm"
                      style={{ backgroundColor: l.color + '10', borderColor: l.color + '30', color: l.color }}
                    >
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: l.color }} />
                      {l.name}
                    </div>
                  )) : (
                    <span className="text-[10px] text-gray-300 dark:text-slate-700 italic">None selected</span>
                  )}
                </div>
              )}
            </section>

            {/* Timeline */}
            <section>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Timeline</label>
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-lg border border-gray-200 dark:border-slate-700">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <select
                    value={sprintId}
                    onChange={(e) => setSprintId(e.target.value)}
                    className="flex-1 bg-transparent text-[10px] font-bold outline-none dark:text-white"
                  >
                    <option value="">Backlog</option>
                    {sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-lg border border-gray-200 dark:border-slate-700">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={storyPoints || ''}
                    onChange={(e) => setStoryPoints(parseInt(e.target.value) || 0)}
                    placeholder="Points"
                    className="flex-1 bg-transparent text-[10px] font-bold outline-none dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Start Date</label>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-gray-200 dark:border-slate-700">
                      <CalendarIcon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-transparent text-[10px] font-bold outline-none dark:text-white w-full cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">End Date</label>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-gray-200 dark:border-slate-700">
                      <CalendarIcon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-transparent text-[10px] font-bold outline-none dark:text-white w-full cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
