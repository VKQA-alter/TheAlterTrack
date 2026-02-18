
import React, { useState } from 'react';
import { Project, ProjectPlatform } from '../types';
import {
  Plus,
  Folder,
  Users,
  Globe,
  Lock,
  Image as ImageIcon,
  MoreVertical,
  Edit3,
  Trash2,
  AlertTriangle,
  X,
  Monitor,
  Smartphone
} from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, key: string, description: string, logo: string, visibility: 'PUBLIC' | 'PRIVATE', platform: ProjectPlatform) => void;
  onDeleteProject: (id: string) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  projects,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onUpdateProject
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLogo, setNewLogo] = useState('');
  const [newVisibility, setNewVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PRIVATE');
  const [newPlatform, setNewPlatform] = useState<ProjectPlatform>('WEBSITE');

  const openCreateModal = () => {
    setModalMode('CREATE');
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setModalMode('EDIT');
    setEditingProjectId(project.id);
    setNewName(project.name);
    setNewKey(project.key);
    setNewDescription(project.description);
    setNewLogo(project.logo || '');
    setNewVisibility(project.visibility);
    setNewPlatform(project.platform);
    setShowModal(true);
    setActiveMenuId(null);
  };

  const resetForm = () => {
    setNewName('');
    setNewKey('');
    setNewDescription('');
    setNewLogo('');
    setNewVisibility('PRIVATE');
    setNewPlatform('WEBSITE');
    setEditingProjectId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newKey) {
      if (modalMode === 'CREATE') {
        onCreateProject(newName, newKey, newDescription, newLogo, newVisibility, newPlatform);
      } else if (editingProjectId) {
        onUpdateProject(editingProjectId, {
          name: newName,
          key: newKey,
          description: newDescription,
          logo: newLogo,
          visibility: newVisibility,
          platform: newPlatform
        });
      }
      setShowModal(false);
      resetForm();
    }
  };

  if (projects.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-20 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-gray-200 dark:border-slate-800 p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="h-24 w-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Folder className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No projects yet</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
            Get started by creating your first project to manage tasks, sprints, and team collaboration.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Create Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8 px-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects Overview</h2>
          <p className="text-gray-500 dark:text-slate-400">Manage your workspace projects and teams.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
        >
          <Plus className="h-5 w-5" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(240px,auto)] grid-flow-dense px-4">
        {projects.map((project, index) => {
          // current user is u1
          const isMember = project.members.some(m => m.userId === 'u1');

          // Bento Grid Pattern
          const isFeatured = index === 0;
          const isWide = index === 3 || index === 6;

          let gridClass = "md:col-span-1 md:row-span-1";
          if (isFeatured) gridClass = "md:col-span-2 md:row-span-2";
          else if (isWide) gridClass = "md:col-span-2 md:row-span-1";

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all cursor-pointer group relative flex flex-col justify-between ${gridClass}`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`rounded-2xl flex items-center justify-center overflow-hidden text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors ${isFeatured ? 'h-16 w-16 bg-indigo-50 dark:bg-indigo-900/30' : 'h-12 w-12 bg-indigo-50 dark:bg-indigo-900/30'}`}>
                    {project.logo ? (
                      <img src={project.logo} alt={project.name} className="h-full w-full object-cover" />
                    ) : (
                      <Folder className={isFeatured ? "h-8 w-8" : "h-6 w-6"} />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                      {project.visibility === 'PUBLIC' ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      <span className="hidden sm:inline">{project.visibility}</span>
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === project.id ? null : project.id);
                        }}
                        className="p-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {activeMenuId === project.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(project);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Edit Project
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(project.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete Project
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className={`font-bold text-gray-900 dark:text-white mb-2 ${isFeatured ? 'text-3xl' : 'text-lg'}`}>{project.name}</h3>
                <p className={`text-gray-500 dark:text-slate-400 mb-6 line-clamp-2 ${isFeatured ? 'text-base' : 'text-sm'}`}>{project.description || 'No description provided.'}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-800">
                <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-xs font-medium">
                  <Users className="h-4 w-4" />
                  <span>{project.members.length} Members</span>
                </div>
                <div className="flex items-center gap-3">
                  {!isMember && (
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest animate-pulse">
                      Join
                    </span>
                  )}
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                    {project.key}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <button
          onClick={openCreateModal}
          className="md:col-span-1 md:row-span-1 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-gray-400 dark:text-slate-500 hover:border-indigo-300 dark:hover:border-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-all min-h-[240px]"
        >
          <div className="h-16 w-16 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30">
            <Plus className="h-8 w-8" />
          </div>
          <span className="font-semibold text-lg">Create New Project</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {modalMode === 'CREATE' ? 'Create Project' : 'Edit Project'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Define your project identity.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full text-gray-400 hover:text-indigo-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1 block">Project Name</label>
                  <input
                    autoFocus
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Marketing Site"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1 block">Key</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value.toUpperCase())}
                    placeholder="e.g., MKT"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1 block">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="What is this project about?"
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white h-24 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1 block">Project Logo (JPEG/PNG)</label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-50 dark:bg-slate-800 border border-dashed border-gray-200 dark:border-slate-700 rounded-xl flex items-center justify-center overflow-hidden text-gray-400">
                    {newLogo ? (
                      <img src={newLogo} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewLogo(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-xs text-gray-500 dark:text-slate-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-xl file:border-0
                        file:text-xs file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        dark:file:bg-indigo-900/30 dark:file:text-indigo-400
                        hover:file:bg-indigo-100 transition-all"
                    />
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">Maximum size: 2MB. Recommended: Square image.</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">Visibility</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewVisibility('PUBLIC')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${newVisibility === 'PUBLIC'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                      : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:border-gray-200 dark:hover:border-slate-700'
                      }`}
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-semibold">Public</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewVisibility('PRIVATE')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${newVisibility === 'PRIVATE'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                      : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:border-gray-200 dark:hover:border-slate-700'
                      }`}
                  >
                    <Lock className="h-4 w-4" />
                    <span className="text-sm font-semibold">Private</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">Project Platform</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewPlatform('WEBSITE')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${newPlatform === 'WEBSITE'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                      : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:border-gray-200 dark:hover:border-slate-700'
                      }`}
                  >
                    <Monitor className="h-4 w-4" />
                    <span className="text-sm font-semibold">Website</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPlatform('MOBILE')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${newPlatform === 'MOBILE'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                      : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:border-gray-200 dark:hover:border-slate-700'
                      }`}
                  >
                    <Smartphone className="h-4 w-4" />
                    <span className="text-sm font-semibold">Mobile</span>
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-sm"
                >
                  {modalMode === 'CREATE' ? 'Create Project' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div >
        </div >
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200 p-6">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Delete Project?</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
              This will permanently delete <span className="font-bold text-gray-900 dark:text-white">"{projects.find(p => p.id === showDeleteConfirm)?.name}"</span> and all its association data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteProject(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default Dashboard;
