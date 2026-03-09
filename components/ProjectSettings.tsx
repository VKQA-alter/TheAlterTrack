import React, { useState } from 'react';
import { Project, Status, Module, Label, User, Role } from '../types';
import { Plus, Trash2, Edit3, GripVertical, Boxes, Tag, Users, UserPlus, X, Image as ImageIcon, AlertTriangle, Settings, Workflow } from 'lucide-react';
interface ProjectSettingsProps {
  project: Project;
  users: User[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onDeleteProject: (id: string) => void;
}

type SettingsTab = 'general' | 'modules' | 'labels' | 'workflow' | 'team';

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ project, users, setProjects, onDeleteProject }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  // Modal states
  const [activeModal, setActiveModal] = useState<'MODULE' | 'LABEL' | 'STATUS' | 'DELETE' | null>(null);
  const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states for modals
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6366f1',
    category: 'TODO' as Status['category']
  });

  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('MEMBER');

  const saveProjectMeta = () => {
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, name, description } : p));
    alert('Project settings saved!');
  };

  const openModal = (type: 'MODULE' | 'LABEL' | 'STATUS', mode: 'CREATE' | 'EDIT', item?: any) => {
    setActiveModal(type);
    setModalMode(mode);
    if (mode === 'EDIT' && item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        color: item.color || '#6366f1',
        category: item.category || 'TODO'
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', color: '#6366f1', category: 'TODO' });
    }
  };

  const handleSaveModule = () => {
    if (!formData.name.trim()) return;
    if (modalMode === 'CREATE') {
      const newModule: Module = {
        id: `m${Date.now()}`,
        name: formData.name,
        description: formData.description
      };
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, modules: [...p.modules, newModule] } : p));
    } else {
      setProjects(prev => prev.map(p => p.id === project.id ? {
        ...p,
        modules: p.modules.map(m => m.id === editingItem.id ? { ...m, name: formData.name, description: formData.description } : m)
      } : p));
    }
    setActiveModal(null);
  };

  const handleSaveLabel = () => {
    if (!formData.name.trim()) return;
    if (modalMode === 'CREATE') {
      const newLabel: Label = {
        id: `l${Date.now()}`,
        name: formData.name,
        color: formData.color
      };
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, labels: [...p.labels, newLabel] } : p));
    } else {
      setProjects(prev => prev.map(p => p.id === project.id ? {
        ...p,
        labels: p.labels.map(l => l.id === editingItem.id ? { ...l, name: formData.name, color: formData.color } : l)
      } : p));
    }
    setActiveModal(null);
  };

  const handleSaveStatus = () => {
    if (!formData.name.trim()) return;
    if (modalMode === 'CREATE') {
      const newStatus: Status = {
        id: `s${Date.now()}`,
        name: formData.name,
        description: formData.description,
        color: formData.color,
        category: formData.category,
        order: project.statuses.length
      };
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, statuses: [...p.statuses, newStatus] } : p));
    } else {
      setProjects(prev => prev.map(p => p.id === project.id ? {
        ...p,
        statuses: p.statuses.map(s => s.id === editingItem.id ? { ...s, name: formData.name, description: formData.description, color: formData.color, category: formData.category } : s)
      } : p));
    }
    setActiveModal(null);
  };

  const confirmDelete = (type: 'MODULE' | 'LABEL' | 'STATUS', item: any) => {
    setActiveModal('DELETE');
    setEditingItem({ ...item, type });
  };

  const confirmDeleteProject = () => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action is irreversible.`)) {
      onDeleteProject(project.id);
    }
  };

  const handleDelete = () => {
    const { id, type } = editingItem;
    setProjects(prev => prev.map(p => {
      if (p.id !== project.id) return p;
      if (type === 'MODULE') return { ...p, modules: p.modules.filter(m => m.id !== id) };
      if (type === 'LABEL') return { ...p, labels: p.labels.filter(l => l.id !== id) };
      if (type === 'STATUS') return { ...p, statuses: p.statuses.filter(s => s.id !== id) };
      return p;
    }));
    setActiveModal(null);
  };

  const addMember = () => {
    if (!newUserEmail.trim()) return;

    // Find user in users prop
    const userToAdd = users.find(u => u.email.toLowerCase() === newUserEmail.toLowerCase());

    if (!userToAdd) {
      alert('User not found in system (try alex@altertrack.io, jordan@..., casey@...)');
      return;
    }

    if (project.members.length >= 50) {
      alert('Project member limit reached (Max 50 members).');
      return;
    }

    if (project.members.some(m => m.userId === userToAdd.id)) {
      alert('User is already a member of this project');
      return;
    }

    setProjects(prev => prev.map(p =>
      p.id === project.id ? { ...p, members: [...p.members, { userId: userToAdd.id, role: newUserRole }] } : p
    ));
    setNewUserEmail('');
    setNewUserRole('MEMBER');
  };

  const removeMember = (userId: string) => {
    if (project.members.length <= 1) {
      alert('Cannot remove the last member');
      return;
    }
    setProjects(prev => prev.map(p =>
      p.id === project.id ? { ...p, members: p.members.filter(m => m.userId !== userId) } : p
    ));
  };

  const updateMemberRole = (userId: string, newRole: Role) => {
    setProjects(prev => prev.map(p =>
      p.id === project.id ? {
        ...p,
        members: p.members.map(m => m.userId === userId ? { ...m, role: newRole } : m)
      } : p
    ));
  };

  const getMemberDetails = (userId: string) => users.find(u => u.id === userId);

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <Settings className="h-4 w-4" /> },
    { id: 'modules', label: 'Modules', icon: <Boxes className="h-4 w-4" /> },
    { id: 'labels', label: 'Labels', icon: <Tag className="h-4 w-4" /> },
    { id: 'workflow', label: 'Workflow', icon: <Workflow className="h-4 w-4" /> },
    { id: 'team', label: 'Team', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Settings</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">Configure your project workflow and team.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-xl border border-gray-100 dark:border-slate-800 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-gray-800 dark:hover:text-white'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="transition-all duration-300">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">General Settings</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Update project identity and visibility.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Project Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Project Key</label>
                    <input
                      type="text"
                      value={project.key}
                      disabled
                      className="w-full bg-gray-100/50 dark:bg-slate-950/50 border border-gray-100 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-gray-500 dark:text-slate-600 cursor-not-allowed font-mono font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Project Logo</label>
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 bg-white/50 dark:bg-slate-800/50 border border-dashed border-gray-200 dark:border-slate-700 rounded-2xl flex items-center justify-center overflow-hidden text-gray-400 shadow-inner">
                      {project.logo ? (
                        <img src={project.logo} alt={project.name} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-8 w-8" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64 = reader.result as string;
                              setProjects(prev => prev.map(p => p.id === project.id ? { ...p, logo: base64 } : p));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="block w-full text-xs text-gray-500 dark:text-slate-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-xl file:border-0
                          file:text-xs file:font-bold
                          file:bg-indigo-100 file:text-indigo-700
                          dark:file:bg-indigo-900/30 dark:file:text-indigo-400
                          hover:file:bg-indigo-200 transition-all cursor-pointer"
                      />
                      <button
                        onClick={() => setProjects(prev => prev.map(p => p.id === project.id ? { ...p, logo: '' } : p))}
                        className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors"
                      >
                        Remove Logo
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-28 dark:text-white transition-all shadow-sm resize-none"
                  />
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-50 dark:border-slate-800">
                  <button
                    onClick={saveProjectMeta}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </section>

            {/* Consolidated Danger Zone UI */}
            <section className="bg-red-50/30 dark:bg-red-950/20 backdrop-blur-sm rounded-xl border border-red-100/50 dark:border-red-900/30 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-red-100/50 dark:border-red-900/30">
                <h3 className="text-lg font-bold text-red-900 dark:text-red-400">Danger Zone</h3>
                <p className="text-sm text-red-600 dark:text-red-500/80">Irreversible actions that affect your project data permanently.</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-red-900/10 rounded-2xl border border-red-100/50 dark:border-red-900/20">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-red-900 dark:text-red-400">Delete this project</h4>
                    <p className="text-xs text-red-600 dark:text-red-500/70">All data including issues, sprints, and files will be removed.</p>
                  </div>
                  <button
                    onClick={confirmDeleteProject}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
                  >
                    Delete Project
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Modules Management */}
        {activeTab === 'modules' && (
          <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Modules</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Categorize issues into functional areas.</p>
              </div>
              <button
                onClick={() => openModal('MODULE', 'CREATE')}
                className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              >
                <Plus className="h-4 w-4" /> Add Module
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.modules.map(mod => (
                  <div key={mod.id} className="flex items-center justify-between p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800 group transition-all hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Boxes className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-gray-800 dark:text-white block truncate">{mod.name}</span>
                        {mod.description && <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 truncate">{mod.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => openModal('MODULE', 'EDIT', mod)}
                        className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete('MODULE', mod)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {project.modules.length === 0 && (
                  <div className="md:col-span-2 py-12 text-center border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl">
                    <p className="text-sm font-bold text-gray-400">No modules created yet.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Labels Management */}
        {activeTab === 'labels' && (
          <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Labels</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Manage global labels for issue filtering.</p>
              </div>
              <button
                onClick={() => openModal('LABEL', 'CREATE')}
                className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              >
                <Plus className="h-4 w-4" /> Add Label
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-4">
                {project.labels.map(label => (
                  <div
                    key={label.id}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl border group transition-all shadow-sm hover:shadow-md"
                    style={{ backgroundColor: label.color + '10', borderColor: label.color + '30' }}
                  >
                    <div className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: label.color }} />
                    <span className="text-xs font-bold" style={{ color: label.color }}>{label.name}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all ml-1">
                      <button
                        onClick={() => openModal('LABEL', 'EDIT', label)}
                        className="p-1 rounded-md transition-colors"
                        style={{ color: label.color }}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => confirmDelete('LABEL', label)}
                        className="p-1 rounded-md transition-colors hover:text-red-500"
                        style={{ color: label.color }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {project.labels.length === 0 && (
                  <div className="w-full py-12 text-center border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl">
                    <p className="text-sm font-bold text-gray-400">No labels created yet.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Workflow / Statuses */}
        {activeTab === 'workflow' && (
          <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Workflow States</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Configure custom columns for your Kanban board.</p>
              </div>
              <button
                onClick={() => openModal('STATUS', 'CREATE')}
                className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              >
                <Plus className="h-4 w-4" /> Add State
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {project.statuses.map(status => (
                  <div key={status.id} className="flex items-center gap-4 p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800 group hover:shadow-sm transition-all">
                    <GripVertical className="h-5 w-5 text-gray-300 dark:text-slate-700 cursor-grab" />
                    <div className="h-5 w-5 rounded-md shadow-sm border border-black/5" style={{ backgroundColor: status.color }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-gray-800 dark:text-white block truncate">{status.name}</span>
                      {status.description && <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 truncate">{status.description}</p>}
                    </div>
                    <span className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase bg-gray-100 dark:bg-slate-700/50 px-2 py-1 rounded-md tracking-widest">{status.category}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => openModal('STATUS', 'EDIT', status)}
                        className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete('STATUS', status)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Team Members Management */}
        {activeTab === 'team' && (
          <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Team Members</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">Manage access and roles for this project.</p>
            </div>
            <div className="p-6">
              <div className="flex gap-4 mb-8 bg-indigo-50/30 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/50 items-end">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Email Address</label>
                  <input
                    type="email"
                    placeholder="colleague@altertrack.io"
                    className="w-full bg-white/70 dark:bg-slate-800/70 border border-transparent dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white shadow-sm transition-all"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div className="w-40 space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as Role)}
                    className="w-full bg-white/70 dark:bg-slate-800/70 border border-transparent dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white shadow-sm transition-all"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                    <option value="OWNER">Owner</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </div>
                <button
                  onClick={addMember}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-md active:scale-95 whitespace-nowrap"
                >
                  <UserPlus className="h-4 w-4" /> Add Member
                </button>
              </div>

              <div className="border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white/30 dark:bg-slate-950/30">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">User</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Email</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Role</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50 dark:divide-slate-800/50">
                    {project.members.map((member) => {
                      const userDetails = getMemberDetails(member.userId);
                      if (!userDetails) return null;

                      return (
                        <tr key={member.userId} className="group hover:bg-white/40 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={userDetails.avatar}
                                alt={userDetails.name}
                                className="h-9 w-9 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"
                              />
                              <div className="text-sm font-bold text-gray-800 dark:text-slate-200">{userDetails.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-slate-400">
                            {userDetails.email}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={member.role}
                              onChange={(e) => updateMemberRole(member.userId, e.target.value as Role)}
                              className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-lg text-xs font-bold outline-none cursor-pointer border border-transparent hover:border-indigo-200"
                            >
                              <option value="OWNER">Owner</option>
                              <option value="ADMIN">Admin</option>
                              <option value="MEMBER">Member</option>
                              <option value="VIEWER">Viewer</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => removeMember(member.userId)}
                              className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                              title="Remove member"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Danger Zone content removed and merged into general settings */}
      </div>

      {/* Modals */}
      {activeModal && activeModal !== 'DELETE' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200 border border-white/10">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {modalMode === 'CREATE' ? 'Add' : 'Edit'} {activeModal.charAt(0) + activeModal.slice(1).toLowerCase()}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Modify your project configuration.</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1 block">Title</label>
                <input
                  autoFocus
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={`e.g., ${activeModal === 'MODULE' ? 'Authentication' : activeModal === 'LABEL' ? 'Bug' : 'To Do'}`}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all shadow-sm"
                />
              </div>

              {(activeModal === 'MODULE' || activeModal === 'STATUS') && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1 block">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide some context..."
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white h-28 resize-none shadow-sm transition-all"
                  />
                </div>
              )}

              {activeModal === 'LABEL' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Label Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-12 w-12 p-1 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer shadow-sm"
                    />
                    <div className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10">
                      {formData.color.toUpperCase()}
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'STATUS' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1 block">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Status['category'] })}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white shadow-sm transition-all"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="h-10 w-10 p-1 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer shadow-sm"
                      />
                      <div className="h-6 w-6 rounded-lg shadow-sm border border-black/5" style={{ backgroundColor: formData.color }} />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-6 border-t border-gray-50 dark:border-slate-800">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 px-4 py-2.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (activeModal === 'MODULE') handleSaveModule();
                    else if (activeModal === 'LABEL') handleSaveLabel();
                    else if (activeModal === 'STATUS') handleSaveStatus();
                  }}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
                >
                  {modalMode === 'CREATE' ? 'Add Item' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {activeModal === 'DELETE' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl p-8 animate-in zoom-in duration-150 border border-red-100/50 dark:border-red-900/50">
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full text-red-500">
                <AlertTriangle className="h-10 w-10 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete {editingItem.type.toLowerCase()}?</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  Are you sure you want to delete <span className="font-black text-red-600 dark:text-red-500">"{editingItem.name}"</span>?
                </p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-xl mb-8">
              <p className="text-[10px] leading-relaxed text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider text-center">
                This action is irreversible and reflects immediately in the database.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-4 py-2.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl font-bold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSettings;
