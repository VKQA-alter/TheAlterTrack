
import React from 'react';
import {
  Inbox,
  Layers,
  BarChart3,
  Settings,
  LayoutDashboard,
  FileSpreadsheet,
  Archive,
  PanelLeft,
  StickyNote,
  Home as HomeIcon,
  LayoutGrid
} from 'lucide-react';
import { Project } from '../types';

interface SidebarProps {
  activeProject: Project | null;
  activeTab: string;
  onTabChange: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeProject,
  activeTab,
  onTabChange
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} border-r border-gray-100 dark:border-slate-800 flex flex-col h-full bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl flex-shrink-0 transition-all duration-300 relative`}>
      <div className={`p-4 flex flex-col h-full ${isCollapsed ? 'items-center' : ''}`}>
        <div
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'mb-8 justify-between'}`}
        >
          {!isCollapsed && (
            <div
              onClick={() => onTabChange('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-110 shadow-sm flex-shrink-0">
                A
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight animate-in fade-in duration-200">AlterTrack</span>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all ${!isCollapsed ? 'ml-2' : ''}`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>

        {!isCollapsed && (
          <>
            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
              {/* Main Navigation */}
              <nav className="space-y-1">
                <button
                  onClick={() => onTabChange('home')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'home'
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <HomeIcon className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => onTabChange('stickies')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'stickies'
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <StickyNote className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>Sticky Notes</span>
                </button>

                <button
                  onClick={() => onTabChange('workspace')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'workspace'
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <LayoutGrid className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>Workspace</span>
                </button>

                {activeProject && (
                  <div className="py-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest ml-3 mb-1 block animate-in fade-in">Project</label>

                    <button
                      onClick={() => onTabChange('backlog')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'backlog'
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                      <Archive className="h-4.5 w-4.5 flex-shrink-0" />
                      <span>Backlog</span>
                    </button>
                    <button
                      onClick={() => onTabChange('planning')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'planning'
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                      <Inbox className="h-4.5 w-4.5 flex-shrink-0" />
                      <span>Sprint Planning</span>
                    </button>
                    <button
                      onClick={() => onTabChange('issues')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'issues'
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                      <Layers className="h-4.5 w-4.5 flex-shrink-0" />
                      <span>Issue List</span>
                    </button>
                    <button
                      onClick={() => onTabChange('test-cases')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'test-cases'
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                      <FileSpreadsheet className="h-4.5 w-4.5 flex-shrink-0" />
                      <span>Test Cases</span>
                    </button>
                    <button
                      onClick={() => onTabChange('insights')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'insights'
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                      <BarChart3 className="h-4.5 w-4.5 flex-shrink-0" />
                      <span>Insights</span>
                    </button>
                    <button
                      onClick={() => onTabChange('settings')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings'
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                      <Settings className="h-4.5 w-4.5 flex-shrink-0" />
                      <span>Settings</span>
                    </button>
                  </div>
                )}
              </nav>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-50 dark:border-slate-900">
              <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer group">
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-600 font-bold group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0">W</div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-gray-900 dark:text-slate-200 truncate">Default Workspace</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 truncate">Workspace Owner</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
