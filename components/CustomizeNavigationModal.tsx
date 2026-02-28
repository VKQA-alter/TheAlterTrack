"use client";

import React from 'react';
import {
    X,
    GripVertical,
    StickyNote,
    PenLine,
    User,
    Layers,
    LayoutDashboard,
    BarChart3,
    Archive,
    Check
} from 'lucide-react';
import { NavPreferences } from '../types';

interface CustomizeNavigationModalProps {
    isOpen: boolean;
    onClose: () => void;
    preferences: NavPreferences;
    onUpdate: (prefs: NavPreferences) => void;
}

const CustomizeNavigationModal: React.FC<CustomizeNavigationModalProps> = ({
    isOpen,
    onClose,
    preferences,
    onUpdate
}) => {
    if (!isOpen) return null;

    const handleTogglePersonal = (key: keyof NavPreferences['personalItems']) => {
        onUpdate({
            ...preferences,
            personalItems: {
                ...preferences.personalItems,
                [key]: !preferences.personalItems[key]
            }
        });
    };

    const handleToggleWorkspace = (key: keyof NavPreferences['workspaceItems']) => {
        onUpdate({
            ...preferences,
            workspaceItems: {
                ...preferences.workspaceItems,
                [key]: !preferences.workspaceItems[key]
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1c1e] rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Customize navigation</h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md">
                            Selected items will always stay visible in your sidebar. You can still find the others anytime from the More menu. These changes are personal to you and won't affect anyone else on your workspace.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                <div className="px-6 pb-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Personal Section */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-1">Personal</h3>
                        <div className="bg-gray-50/50 dark:bg-slate-900/30 rounded-xl border border-gray-100 dark:border-slate-800/50 p-1">
                            <NavItem
                                icon={<StickyNote className="h-4 w-4" />}
                                label="Stickies"
                                checked={preferences.personalItems.stickies}
                                onChange={() => handleTogglePersonal('stickies')}
                            />
                            <NavItem
                                icon={<PenLine className="h-4 w-4" />}
                                label="Drafts"
                                checked={preferences.personalItems.drafts}
                                onChange={() => handleTogglePersonal('drafts')}
                            />
                            <NavItem
                                icon={<User className="h-4 w-4" />}
                                label="Your work"
                                checked={preferences.personalItems.yourWork}
                                onChange={() => handleTogglePersonal('yourWork')}
                            />
                        </div>
                    </div>

                    {/* Workspace Section */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-1">Workspace</h3>
                        <div className="bg-gray-50/50 dark:bg-slate-900/30 rounded-xl border border-gray-100 dark:border-slate-800/50 p-1">
                            <NavItem
                                icon={<Layers className="h-4 w-4" />}
                                label="Views"
                                checked={preferences.workspaceItems.views}
                                onChange={() => handleToggleWorkspace('views')}
                            />
                            <NavItem
                                icon={<LayoutDashboard className="h-4 w-4" />}
                                label="Dashboards"
                                checked={preferences.workspaceItems.dashboards}
                                onChange={() => handleToggleWorkspace('dashboards')}
                            />
                            <NavItem
                                icon={<BarChart3 className="h-4 w-4" />}
                                label="Analytics"
                                checked={preferences.workspaceItems.analytics}
                                onChange={() => handleToggleWorkspace('analytics')}
                            />
                            <NavItem
                                icon={<Archive className="h-4 w-4" />}
                                label="Archives"
                                checked={preferences.workspaceItems.archives}
                                onChange={() => handleToggleWorkspace('archives')}
                            />
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-1">Projects</h3>
                        <div className="bg-gray-50/50 dark:bg-slate-900/30 rounded-xl border border-gray-100 dark:border-slate-800/50 p-4 space-y-6">
                            <div className="space-y-4">
                                <label className="flex items-start gap-4 cursor-pointer group">
                                    <div className="mt-1 relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-300 dark:border-slate-600 transition-colors group-hover:border-indigo-500">
                                        <input
                                            type="radio"
                                            className="sr-only"
                                            name="navMode"
                                            checked={preferences.navigationMode === 'accordion'}
                                            onChange={() => onUpdate({ ...preferences, navigationMode: 'accordion' })}
                                        />
                                        {preferences.navigationMode === 'accordion' && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900 dark:text-slate-100">Accordion sidebar navigation</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-500">Feature tabs will appear as nested items under project and acts as accordion.</p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-4 cursor-pointer group">
                                    <div className="mt-1 relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-300 dark:border-slate-600 transition-colors group-hover:border-indigo-500">
                                        <input
                                            type="radio"
                                            className="sr-only"
                                            name="navMode"
                                            checked={preferences.navigationMode === 'tabbed'}
                                            onChange={() => onUpdate({ ...preferences, navigationMode: 'tabbed' })}
                                        />
                                        {preferences.navigationMode === 'tabbed' && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900 dark:text-slate-100">Tabbed Navigation</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-500">Feature tabs will appear as horizontal tabs inside a project.</p>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800/50">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${preferences.showLimitedProjects ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-slate-600'}`}
                                        onClick={() => onUpdate({ ...preferences, showLimitedProjects: !preferences.showLimitedProjects })}
                                    >
                                        <input type="checkbox" className="sr-only" checked={preferences.showLimitedProjects} readOnly />
                                        {preferences.showLimitedProjects && <Check className="h-3.5 w-3.5 text-white" />}
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 dark:text-slate-100">Show limited projects on sidebar</span>
                                </label>

                                <div className="pl-8 space-y-2">
                                    <p className="text-xs text-gray-500 dark:text-slate-500">Enter number of projects</p>
                                    <input
                                        type="number"
                                        value={preferences.projectLimit}
                                        onChange={(e) => onUpdate({ ...preferences, projectLimit: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    checked: boolean;
    onChange: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, checked, onChange }) => (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group">
        <div className="flex items-center gap-3">
            <GripVertical className="h-4 w-4 text-gray-300 dark:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
            <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${checked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-slate-600 group-hover:border-indigo-500'}`}
                onClick={onChange}
            >
                <input type="checkbox" className="sr-only" checked={checked} readOnly />
                {checked && <Check className="h-3.5 w-3.5 text-white" />}
            </div>
            <div className="p-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg text-gray-500 dark:text-slate-400">
                {icon}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-slate-200">{label}</span>
        </div>
    </div>
);

export default CustomizeNavigationModal;
