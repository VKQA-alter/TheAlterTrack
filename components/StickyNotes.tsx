"use client";

import React from 'react';
import {
    Plus,
    Trash2,
    Palette,
    Bold,
    Italic,
    List,
    Search,
    BookOpen
} from 'lucide-react';
import { StickyNote } from '../types';

interface StickyNotesProps {
    notes: StickyNote[];
    onCreate: () => void;
    onUpdate: (note: StickyNote) => void;
    onDelete: (id: string) => void;
}

const COLORS = [
    { name: 'Yellow', value: '#fef3c7', border: '#fcd34d', text: '#92400e' },
    { name: 'Blue', value: '#dbeafe', border: '#93c5fd', text: '#1e40af' },
    { name: 'Green', value: '#dcfce7', border: '#86efac', text: '#166534' },
    { name: 'Purple', value: '#f3e8ff', border: '#d8b4fe', text: '#6b21a8' },
    { name: 'Pink', value: '#fce7f3', border: '#f9a8d4', text: '#9d174d' },
    { name: 'Brown', value: '#5c4033', border: '#3e2723', text: '#d7ccc8' },
];

const StickyNotes: React.FC<StickyNotesProps> = ({ notes, onCreate, onUpdate, onDelete }) => {
    const [activeColorPicker, setActiveColorPicker] = React.useState<string | null>(null);

    if (notes.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
                <div className="relative mb-8">
                    {/* Isometric Sticky Illustration Shorthand */}
                    <div className="w-48 h-48 bg-gray-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center transform rotate-12 shadow-xl border border-gray-200 dark:border-slate-700">
                        <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-lg shadow-inner flex items-center justify-center -rotate-12 border border-blue-200 dark:border-blue-900">
                            <Plus className="text-blue-500 h-8 w-8" />
                        </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <div className="w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Capture ideas instantly</h2>
                <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-sm text-center">
                    Create stickies for quick notes and to-dos, and keep them with you wherever you go.
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onCreate}
                        className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition-all shadow-lg shadow-sky-500/20 active:scale-95 flex items-center gap-2"
                    >
                        Create first sticky
                    </button>
                    <button className="px-6 py-2.5 bg-transparent text-gray-400 dark:text-slate-500 font-bold rounded-lg border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900 transition-all flex items-center gap-2">
                        Documentation
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sticky Notes</h2>
                    <p className="text-xs text-gray-400 dark:text-slate-500 font-semibold uppercase tracking-widest mt-1">Personal Workspace</p>
                </div>
                <button
                    onClick={onCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-md active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    New Sticky
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {notes.map(note => {
                    const colorObj = COLORS.find(c => c.value === note.color) || COLORS[0];
                    const isDark = note.color === '#5c4033';

                    return (
                        <div
                            key={note.id}
                            className="group relative flex flex-col min-h-[280px] rounded-lg p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 animate-in zoom-in-95 duration-200"
                            style={{
                                backgroundColor: note.color,
                                border: `1px solid ${colorObj.border}40`,
                                color: isDark ? '#d7ccc8' : colorObj.text
                            }}
                        >
                            <textarea
                                value={note.content}
                                onChange={(e) => onUpdate({ ...note, content: e.target.value, updatedAt: new Date().toISOString() })}
                                placeholder="Click to type here"
                                className={`flex-1 w-full bg-transparent resize-none border-none outline-none text-lg placeholder:opacity-50 ${note.isBold ? 'font-bold' : ''} ${note.isItalic ? 'italic' : ''}`}
                                style={{ color: 'inherit' }}
                            />

                            <div className="pt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-1">
                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveColorPicker(activeColorPicker === note.id ? null : note.id)}
                                            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <Palette className="h-4 w-4" />
                                        </button>
                                        {activeColorPicker === note.id && (
                                            <div className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-gray-100 dark:border-slate-700 flex gap-1.5 z-50">
                                                {COLORS.map(c => (
                                                    <button
                                                        key={c.value}
                                                        onClick={() => {
                                                            onUpdate({ ...note, color: c.value, updatedAt: new Date().toISOString() });
                                                            setActiveColorPicker(null);
                                                        }}
                                                        className="h-5 w-5 rounded-full border border-gray-200 dark:border-slate-600 transition-transform hover:scale-125"
                                                        style={{ backgroundColor: c.value }}
                                                        title={c.name}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => onUpdate({ ...note, isBold: !note.isBold })}
                                        className={`p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${note.isBold ? 'bg-black/10 dark:bg-white/10' : ''}`}
                                    >
                                        <Bold className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onUpdate({ ...note, isItalic: !note.isItalic })}
                                        className={`p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${note.isItalic ? 'bg-black/10 dark:bg-white/10' : ''}`}
                                    >
                                        <Italic className="h-4 w-4" />
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => onDelete(note.id)}
                                    className="p-1.5 rounded hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StickyNotes;
