import React, { useState } from 'react';
import {
    X, User as UserIcon, Sliders, Bell, Lock, Activity, Key,
    Camera, Mail, ShieldAlert, Eye, EyeOff, Check, ChevronDown, Clock, Globe
} from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileSettingsModalProps {
    user: UserType;
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'profile' | 'preferences' | 'notifications' | 'security' | 'activity' | 'tokens';
    isDarkMode: boolean;
    onThemeChange: (theme: 'light' | 'dark') => void;
    notificationsEnabled: boolean;
    onToggleNotifications: () => void;
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
    user,
    isOpen,
    onClose,
    initialTab = 'profile',
    isDarkMode,
    onThemeChange,
    notificationsEnabled,
    onToggleNotifications
}) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [showThemeDropdown, setShowThemeDropdown] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const tabs = [
        { id: 'profile', label: 'Profile', icon: UserIcon },
        { id: 'preferences', label: 'Preferences', icon: Sliders },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'activity', label: 'Activity', icon: Activity },
        { id: 'tokens', label: 'Personal Access Tokens', icon: Key, group: 'Developer' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative w-full max-w-5xl h-[80vh] bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden flex animate-in zoom-in slide-in-from-bottom-4 duration-300 border border-gray-100 dark:border-slate-800">

                {/* Sidebar */}
                <div className="w-80 border-r border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/30 p-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-12 w-12 bg-teal-600 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg">
                            {user.name.charAt(0)}
                        </div>
                        <div className="truncate">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</h3>
                            <p className="text-[11px] text-gray-500 dark:text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div>
                            <h4 className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest mb-4 px-4">Your Profile</h4>
                            <div className="space-y-1">
                                {tabs.filter(t => !t.group).map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-100 dark:border-slate-700' : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50'}`}
                                    >
                                        <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-600'}`} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest mb-4 px-4">Developer</h4>
                            <div className="space-y-1">
                                {tabs.filter(t => t.group === 'Developer').map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-100 dark:border-slate-700' : 'text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50'}`}
                                    >
                                        <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-600'}`} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto custom-scrollbar p-12 bg-white dark:bg-slate-900">
                    <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-all text-gray-400 hover:text-indigo-600">
                        <X className="h-6 w-6" />
                    </button>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Profile Header */}
                            <div className="relative">
                                <div className="h-48 w-full bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-850 rounded-3xl overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop")' }} />
                                    <div className="absolute inset-0 bg-black/20" />
                                    <button className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2 transition-all">
                                        <Camera className="h-3 w-3" /> Change cover
                                    </button>
                                </div>
                                <div className="absolute -bottom-10 left-10">
                                    <div className="h-28 w-28 bg-white dark:bg-slate-900 rounded-[32px] p-1.5 shadow-xl border border-gray-100 dark:border-slate-800 relative group cursor-pointer transition-transform hover:scale-105">
                                        <div className="h-full w-full bg-teal-600 rounded-[26px] flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="absolute inset-1.5 rounded-[26px] bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Camera className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 px-10">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h1>
                                <p className="text-sm text-gray-500 dark:text-slate-500">{user.email}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 px-10">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest block mb-2 px-1">First name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            defaultValue={user.name.split(' ')[0]}
                                            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest block mb-2 px-1">Email <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                defaultValue={user.email}
                                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white font-medium"
                                            />
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        </div>
                                        <button className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-2 hover:underline ml-1">Change email</button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest block mb-2 px-1">Last name</label>
                                        <input
                                            type="text"
                                            defaultValue={user.name.split(' ').slice(1).join(' ')}
                                            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest block mb-2 px-1">Display name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            defaultValue={user.name}
                                            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="px-10">
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                                    Save changes
                                </button>
                            </div>

                            <div className="px-10 pt-12">
                                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[32px] p-8 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
                                            <ShieldAlert className="h-5 w-5" />
                                            <h4 className="font-bold">Deactivate account</h4>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-slate-400 max-w-lg leading-relaxed">
                                            When deactivating an account, all of the data and resources within that account will be permanently removed and cannot be recovered.
                                        </p>
                                    </div>
                                    <button className="px-6 py-3 border-2 border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all active:scale-95">
                                        Deactivate account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Preferences</h2>
                                <p className="text-sm text-gray-500 dark:text-slate-500">Customize your app experience the way you work</p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-950/50 rounded-[24px] border border-gray-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                            <Globe className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Theme</h4>
                                            <p className="text-[11px] text-gray-500">Select or customize your interface color scheme.</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all capitalize"
                                        >
                                            {isDarkMode ? 'Dark' : 'Light'} <ChevronDown className="h-4 w-4" />
                                        </button>

                                        {showThemeDropdown && (
                                            <>
                                                <div className="fixed inset-0 z-40 cursor-pointer" onClick={() => setShowThemeDropdown(false)} />
                                                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
                                                    <button
                                                        onClick={() => { onThemeChange('light'); setShowThemeDropdown(false); }}
                                                        className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-between ${!isDarkMode ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-slate-300'}`}
                                                    >
                                                        Light {!isDarkMode && <Check className="h-3 w-3" />}
                                                    </button>
                                                    <button
                                                        onClick={() => { onThemeChange('dark'); setShowThemeDropdown(false); }}
                                                        className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-between ${isDarkMode ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-slate-300'}`}
                                                    >
                                                        Dark {isDarkMode && <Check className="h-3 w-3" />}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-950/50 rounded-[24px] border border-gray-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                            <Sliders className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Smooth Cursor</h4>
                                            <p className="text-[11px] text-gray-500">Select the cursor motion style that feels right for you.</p>
                                        </div>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer group">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 shadow-inner"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Language & Time</h3>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-950/50 rounded-[24px] border border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                                <Clock className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Timezone</h4>
                                                <p className="text-[11px] text-gray-500">Current timezone setting.</p>
                                            </div>
                                        </div>
                                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all min-w-[120px] justify-between">
                                            UTC <ChevronDown className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-950/50 rounded-[24px] border border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                                <Globe className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Language</h4>
                                                <p className="text-[11px] text-gray-500">Choose the language used in the user interface.</p>
                                            </div>
                                        </div>
                                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-bold text-gray-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all min-w-[120px] justify-between">
                                            English <ChevronDown className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Change password</h2>
                            </div>

                            <div className="space-y-6 max-w-2xl">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest block mb-2 px-1">Current password</label>
                                    <div className="relative group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Old password"
                                            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[11px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest block mb-2 px-1">New password</label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                                            />
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest block mb-2 px-1">Confirm password</label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Confirm password"
                                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                                            />
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button className="bg-indigo-100 dark:bg-slate-800 text-indigo-400 dark:text-slate-600 font-bold py-3.5 px-8 rounded-2xl cursor-not-allowed transition-all">
                                        Change password
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h2>
                                <p className="text-sm text-gray-500 dark:text-slate-500">Manage how and when you receive updates</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-950/50 rounded-[24px] border border-gray-100 dark:border-slate-800 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${notificationsEnabled ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600'}`}>
                                            <Bell className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Enable Notifications</h4>
                                            <p className="text-[11px] text-gray-500">Receive alerts for sprint deadlines and important updates.</p>
                                        </div>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={notificationsEnabled}
                                            onChange={onToggleNotifications}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 shadow-inner"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {['activity', 'tokens'].includes(activeTab) && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="h-20 w-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6">
                                <Activity className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize mb-2">{activeTab} section</h2>
                            <p className="text-gray-500 dark:text-slate-500 text-sm max-w-xs">This feature is currently under development to ensure the best experience.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsModal;
