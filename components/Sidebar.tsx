import React, { useState } from 'react';
import {
  Home as HomeIcon,
  StickyNote,
  PenLine,
  User,
  Briefcase,
  MoreHorizontal,
  Plus,
  SlidersHorizontal,
  PanelLeft,
  ChevronDown,
  Boxes,
  Disc,
  LayoutGrid,
  Layers,
  FileText,
  ChevronRight
} from 'lucide-react';
import { Project, NavPreferences } from '../types';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeProject: Project | null;
  activeTab: string;
  navPreferences: NavPreferences;
  projects: Project[];
  onTabChange: (tab: any) => void;
  onSelectProject: (projectId: string) => void;
  onOpenNavCustomization: () => void;
  onCreateWorkItem: () => void;
}


const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  activeProject,
  activeTab,
  navPreferences,
  projects,
  onTabChange,
  onSelectProject,
  onOpenNavCustomization,
  onCreateWorkItem
}) => {

  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set([activeProject?.id || '']));
  const [isProjectsSectionExpanded, setIsProjectsSectionExpanded] = useState(true);

  const toggleProject = (projectId: string) => {
    const next = new Set(expandedProjects);
    if (next.has(projectId)) next.delete(projectId);
    else next.add(projectId);
    setExpandedProjects(next);
  };

  const visibleProjects = navPreferences.showLimitedProjects
    ? projects.slice(0, navPreferences.projectLimit)
    : projects;

  const NavItem = ({
    id,
    label,
    icon,
    isActive,
    onClick,
    className = ""
  }: {
    id: string;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center rounded-lg text-sm font-medium transition-all group ${isCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2'
        } ${isActive
          ? 'bg-white/10 dark:bg-slate-800/50 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-500 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-slate-900/50 hover:text-gray-900 dark:hover:text-white'
        } ${className}`}
      title={isCollapsed ? label : ""}
    >
      <span className={`${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
        {icon}
      </span>
      {!isCollapsed && <span>{label}</span>}
    </button>
  );

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} border-r border-gray-100 dark:border-slate-800 flex flex-col h-full bg-[#fafafa] dark:bg-[#0c0d0e] flex-shrink-0 transition-all duration-300 relative pt-2`}>
      <div className={`p-2 flex-1 flex flex-col overflow-hidden ${isCollapsed ? 'items-center' : ''}`}>
        <div className={`flex items-center w-full mb-4 ${isCollapsed ? 'justify-center' : 'justify-between px-1'}`}>
          {!isCollapsed && <h2 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tight">Projects</h2>}
          <div className="flex items-center gap-0.5">
            {!isCollapsed && (
              <button
                onClick={onOpenNavCustomization}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 rounded-lg transition-colors"
                title="Customize Navigation"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 rounded-lg transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <PanelLeft className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* New work item button */}
        {!isCollapsed ? (
          <button
            onClick={onCreateWorkItem}
            className="flex items-center gap-2 w-full px-4 py-2 border border-blue-500/10 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 rounded-xl mb-4 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New work item</span>
          </button>
        ) : (
          <div className="h-px w-full bg-gray-100 dark:bg-slate-800 my-6" />
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2 space-y-6 w-full">
          {/* Main Navigation */}
          <div className="space-y-1">
            <NavItem
              id="home"
              label="Home"
              icon={<HomeIcon className="h-4.5 w-4.5" />}
              isActive={activeTab === 'home'}
              onClick={() => onTabChange('home')}
            />
            {navPreferences.personalItems.stickies && (
              <NavItem
                id="stickies"
                label="Stickies"
                icon={<StickyNote className="h-4.5 w-4.5" />}
                isActive={activeTab === 'stickies'}
                onClick={() => onTabChange('stickies')}
              />
            )}
            {navPreferences.personalItems.drafts && (
              <NavItem
                id="drafts"
                label="Drafts"
                icon={<PenLine className="h-4.5 w-4.5" />}
                isActive={activeTab === 'drafts'}
                onClick={() => onTabChange('drafts')}
              />
            )}
            {navPreferences.personalItems.yourWork && (
              <NavItem
                id="your-work"
                label="Your work"
                icon={<User className="h-4.5 w-4.5" />}
                isActive={activeTab === 'your-work'}
                onClick={() => onTabChange('your-work')}
              />
            )}
          </div>

          {/* Workspace Section */}
          <div className="space-y-1">
            {!isCollapsed && <h3 className="px-3 mb-2 text-sm font-bold text-gray-400 dark:text-slate-500">Workspace</h3>}
            <NavItem
              id="projects"
              label="Projects"
              icon={<Briefcase className="h-4.5 w-4.5" />}
              isActive={activeTab === 'workspace'}
              onClick={() => onTabChange('workspace')}
            />
          </div>

          {/* Projects (Accordion) */}
          <div className="space-y-1">
            {!isCollapsed ? (
              <button
                onClick={() => setIsProjectsSectionExpanded(!isProjectsSectionExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <span>Projects</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isProjectsSectionExpanded ? '' : '-rotate-90'}`} />
              </button>
            ) : (
              <div className="h-px bg-gray-100 dark:bg-slate-800 mx-3 my-4" />
            )}

            {(isProjectsSectionExpanded || isCollapsed) && (
              <div className={`space-y-1 ${!isCollapsed ? 'pl-1' : ''}`}>
                {visibleProjects.map(project => (
                  <div key={project.id} className="space-y-1">
                    <button
                      onClick={() => {
                        onSelectProject(project.id);
                        onTabChange('issues');
                        if (!isCollapsed) toggleProject(project.id);
                      }}
                      className={`w-full flex items-center rounded-lg text-sm font-medium transition-all ${isCollapsed ? 'justify-center py-2.5' : 'gap-3 px-3 py-2'
                        } ${activeProject?.id === project.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      title={isCollapsed ? project.name : ""}
                    >
                      <span className="text-lg leading-none">{project.logo || '📁'}</span>
                      {!isCollapsed && <span className="truncate">{project.name}</span>}
                    </button>

                    {expandedProjects.has(project.id) && !isCollapsed && (
                      <div className="ml-9 border-l border-gray-100 dark:border-slate-800/50 space-y-1 py-1">
                        <NestedItem label="Work items" icon={<Boxes className="h-4 w-4" />} onClick={() => { onSelectProject(project.id); onTabChange('issues'); }} />
                        <NestedItem label="Cycles" icon={<Disc className="h-4 w-4" />} onClick={() => { onSelectProject(project.id); onTabChange('planning'); }} />
                        <NestedItem label="Modules" icon={<LayoutGrid className="h-4 w-4" />} onClick={() => { onSelectProject(project.id); onTabChange('planning'); }} />
                        <NestedItem label="Views" icon={<Layers className="h-4 w-4" />} onClick={() => { onSelectProject(project.id); onTabChange('issues'); }} />
                        <NestedItem label="Pages" icon={<FileText className="h-4 w-4" />} onClick={() => { onSelectProject(project.id); onTabChange('backlog'); }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        {!isCollapsed && (
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800/50">
            <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-slate-600 font-bold uppercase tracking-widest px-2">
              <Disc className="h-3 w-3 text-orange-500" />
              <span>ITW-CRM-Beta</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

const NestedItem = ({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick?: () => void }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/5 dark:hover:bg-slate-900/50 rounded-r-lg transition-all group">
    <span className="text-gray-400 dark:text-slate-600 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
      {icon}
    </span>
    <span>{label}</span>
  </button>
);

export default Sidebar;
