import React from 'react';
import { Settings, Sliders, LogOut } from 'lucide-react';
import { User } from '../types';

interface ProfileDropdownProps {
    user: User;
    onOpenSettings: () => void;
    onOpenPreferences: () => void;
    onSignOut: () => void;
    onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
    user,
    onOpenSettings,
    onOpenPreferences,
    onSignOut,
    onClose
}) => {
    return (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in duration-150 ring-1 ring-black/5">
            {/* Header with Background */}
            <div className="h-44 relative flex flex-col items-center justify-center text-white px-6 p-4">
                <div
                    className="absolute inset-0 bg-cover bg-center brightness-50"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop")' }}
                />
                <div className="relative z-10 flex flex-col items-center w-full">
                    <div className="h-20 w-20 bg-teal-600 rounded-full flex items-center justify-center text-3xl font-bold mb-3 border-4 border-white/10 shadow-2xl text-white">
                        {user.name.charAt(0)}
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold truncate leading-tight">{user.name}</h3>
                        <p className="text-xs text-white/60 truncate mt-0.5">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="p-3 bg-white dark:bg-slate-900">
                <button
                    onClick={() => { onOpenSettings(); onClose(); }}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 text-sm font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/80 rounded-2xl transition-all group"
                >
                    <div className="h-9 w-9 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm">
                        <Settings className="h-5 w-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    Settings
                </button>
                <button
                    onClick={() => { onOpenPreferences(); onClose(); }}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 text-sm font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/80 rounded-2xl transition-all group"
                >
                    <div className="h-9 w-9 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm">
                        <Sliders className="h-5 w-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    Preferences
                </button>
                <div className="h-px bg-gray-100 dark:bg-slate-800 my-2.5 mx-4 opacity-50" />
                <button
                    onClick={() => { onSignOut(); onClose(); }}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all group"
                >
                    <div className="h-9 w-9 rounded-xl bg-red-50 dark:bg-red-900/40 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-red-900/20 transition-colors shadow-sm">
                        <LogOut className="h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors" />
                    </div>
                    Sign out
                </button>
            </div>
        </div>
    );
};

export default ProfileDropdown;
