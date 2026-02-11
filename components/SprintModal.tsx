
import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar, Check, Search, Target, ChevronDown, Star } from 'lucide-react';
import { Sprint, BacklogItem } from '../types';

interface SprintModalProps {
  backlogItems: BacklogItem[];
  onClose: () => void;
  onSave: (sprint: Sprint, selectedBacklogIds: string[]) => void;
}

const SprintModal: React.FC<SprintModalProps> = ({ backlogItems, onClose, onSave }) => {
  const [name, setName] = useState(`Sprint ${new Date().toLocaleDateString()}`);
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [selectedBacklogIds, setSelectedBacklogIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleBacklogItem = (id: string) => {
    setSelectedBacklogIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredItems = backlogItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (!name.trim() || !startDate || !endDate) return;

    const newSprint: Sprint = {
      id: `s-${Date.now()}`,
      name,
      goal,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      isActive: false,
      isCompleted: false
    };

    onSave(newSprint, selectedBacklogIds);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-transparent dark:border-slate-800">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Sprint</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">Plan your next cycle of work.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">
                Sprint Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sprint 12 – Payments"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <Target className="h-3.5 w-3.5" />
                Sprint Goal
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What are we trying to achieve?"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all resize-none h-20"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Backlog Item Selection Dropdown */}
          <div className="border-t border-gray-100 dark:border-slate-800 pt-6">
            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">
              Backlog Items
            </label>
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl text-sm cursor-pointer hover:border-indigo-500 transition-all font-medium text-gray-700 dark:text-slate-300"
              >
                <div className="flex flex-wrap gap-1.5 overflow-hidden">
                  {selectedBacklogIds.length === 0 ? (
                    <span className="text-gray-400">Select backlog items...</span>
                  ) : (
                    selectedBacklogIds.slice(0, 3).map(id => {
                      const item = backlogItems.find(i => i.id === id);
                      return (
                        <span key={id} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                          {item?.id}
                          <button onClick={(e) => { e.stopPropagation(); toggleBacklogItem(id); }}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })
                  )}
                  {selectedBacklogIds.length > 3 && (
                    <span className="text-[10px] font-bold text-gray-400 self-center">+{selectedBacklogIds.length - 3} more</span>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-2xl z-[70] p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search backlog..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredItems.length > 0 ? (
                      filteredItems.map(item => (
                        <div
                          key={item.id}
                          onClick={() => toggleBacklogItem(item.id)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedBacklogIds.includes(item.id) ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                        >
                          <div className={`flex items-center justify-center h-4 w-4 rounded border transition-all ${selectedBacklogIds.includes(item.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600'}`}>
                            {selectedBacklogIds.includes(item.id) && <Check className="h-3 w-3" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Star className="h-3 w-3 text-indigo-500" />
                              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono">{item.id}</span>
                            </div>
                            <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 truncate">{item.title}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-400 dark:text-slate-700 text-[10px] font-bold uppercase tracking-widest">
                        No features found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Items Summary */}
        {selectedBacklogIds.length > 0 && (
          <div className="px-6 py-2 bg-indigo-50/30 dark:bg-indigo-900/10 border-t border-indigo-100/50 dark:border-indigo-800/50">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Selected: {selectedBacklogIds.length} items
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 bg-white dark:bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || !startDate || !endDate}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95"
          >
            Create Sprint
          </button>
        </div>
      </div>
    </div>
  );
};

export default SprintModal;
