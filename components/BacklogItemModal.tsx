
import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Paperclip, Tag as TagIcon, Hash } from 'lucide-react';

interface BacklogItemModalProps {
    onClose: () => void;
    onSave: (data: {
        title: string;
        overview: string;
        attachments: File[];
        tags: string[];
    }) => void;
    existingItem?: {
        id: string;
        title: string;
        overview: string;
        attachments: File[];
        tags: string[];
    } | null;
}

const BacklogItemModal: React.FC<BacklogItemModalProps> = ({ onClose, onSave, existingItem }) => {
    const [title, setTitle] = useState(existingItem?.title || '');
    const [overview, setOverview] = useState(existingItem?.overview || '');
    const [attachments, setAttachments] = useState<File[]>(existingItem?.attachments || []);
    const [tags, setTags] = useState<string[]>(existingItem?.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const overviewRef = useRef<HTMLTextAreaElement>(null);

    // Generate preview URLs for attachments
    useEffect(() => {
        const urls = attachments.map(file => {
            if (file.type.startsWith('image/')) {
                return URL.createObjectURL(file);
            }
            return '';
        });
        setPreviewUrls(urls);

        return () => {
            urls.forEach(url => url && URL.revokeObjectURL(url));
        };
    }, [attachments]);

    // Handle paste events for images
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            const files: File[] = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) {
                        files.push(file);
                    }
                }
            }

            if (files.length > 0) {
                setAttachments(prev => [...prev, ...files]);
                e.preventDefault();
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setAttachments(prev => [...prev, ...files]);
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags(prev => [...prev, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onSave({
                title: title.trim(),
                overview: overview.trim(),
                attachments,
                tags
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {existingItem ? 'Edit Backlog Feature' : 'Create Backlog Feature'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                            Add details for your backlog feature
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-6 space-y-6">
                        {/* ID Display (if editing) */}
                        {existingItem && (
                            <div>
                                <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Hash className="h-3.5 w-3.5" />
                                    ID
                                </label>
                                <div className="bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-600 dark:text-slate-400 font-mono">
                                    {existingItem.id}
                                </div>
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                autoFocus
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter backlog feature title..."
                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                            />
                        </div>

                        {/* Overview */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">
                                Overview
                            </label>
                            <textarea
                                ref={overviewRef}
                                value={overview}
                                onChange={(e) => setOverview(e.target.value)}
                                placeholder="Describe the backlog feature in detail..."
                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white h-32 resize-none transition-all"
                            />
                            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1.5">
                                💡 Tip: You can paste images directly (Ctrl+V) to add them as attachments
                            </p>
                        </div>

                        {/* Attachments */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Paperclip className="h-3.5 w-3.5" />
                                Attachments
                            </label>

                            {/* Upload Area */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-all cursor-pointer group"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-full group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                                        <Upload className="h-5 w-5 text-gray-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                                            Click to upload or paste images
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*,application/pdf,.doc,.docx"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>

                            {/* Attachment Previews */}
                            {attachments.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {attachments.map((file, index) => (
                                        <div
                                            key={index}
                                            className="relative group bg-gray-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700"
                                        >
                                            {file.type.startsWith('image/') ? (
                                                <img
                                                    src={previewUrls[index]}
                                                    alt={file.name}
                                                    className="w-full h-24 object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-24 flex items-center justify-center">
                                                    <Paperclip className="h-8 w-8 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(index)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="p-2 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700">
                                                <p className="text-[10px] font-medium text-gray-600 dark:text-slate-400 truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-[9px] text-gray-400 dark:text-slate-500">
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <TagIcon className="h-3.5 w-3.5" />
                                Tags
                            </label>
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Type a tag and press Enter..."
                                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                            />

                            {/* Tag List */}
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {tags.map((tag, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-100 dark:border-indigo-800"
                                        >
                                            <TagIcon className="h-3 w-3" />
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 hover:text-indigo-900 dark:hover:text-indigo-200 transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-slate-800 flex gap-3 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl font-semibold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!title.trim()}
                        className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {existingItem ? 'Save Changes' : 'Create Feature'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BacklogItemModal;
