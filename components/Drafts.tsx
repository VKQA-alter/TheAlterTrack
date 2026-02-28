import React from 'react';
import { PenLine, Plus, Search } from 'lucide-react';

interface DraftsProps {
    onCreateDraft: () => void;
}

const Drafts: React.FC<DraftsProps> = ({ onCreateDraft }) => {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0c0d0e] transition-colors relative">
            <div className="absolute top-0 right-0 p-6 z-10">
                <button
                    onClick={onCreateDraft}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
                >
                    <PenLine className="h-3.5 w-3.5" />
                    Draft a work item
                </button>
            </div>
            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-8 relative">
                    {/* Illustration Placeholder - Using a combination of boxes and icons to mimic the screenshot */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-200 dark:from-gray-800 to-transparent rounded-3xl opacity-20 transform rotate-12 -translate-y-4"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-200 dark:from-gray-800 to-transparent rounded-3xl opacity-40 transform -rotate-6"></div>
                        <div className="relative bg-gray-50 dark:bg-[#1a1c1e] p-8 rounded-3xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-white/5">
                            <PenLine className="h-16 w-16 text-sky-500/50" />
                        </div>
                        {/* Floating elements */}
                        <div className="absolute top-4 left-4 h-8 w-12 bg-gray-100 dark:bg-gray-800/50 rounded-lg blur-[1px]"></div>
                        <div className="absolute top-12 -right-4 h-10 w-16 bg-gray-100 dark:bg-gray-800/30 rounded-lg blur-[1px]"></div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-3 tracking-tight text-gray-900 dark:text-white">Half-written work items</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-8 leading-relaxed">
                    To try this out, start adding a work item and leave it mid-way or create your first draft below. 😋
                </p>

                <button
                    onClick={onCreateDraft}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-sky-600/20"
                >
                    Create draft work item
                </button>
            </div>
        </div>
    );
};

export default Drafts;
