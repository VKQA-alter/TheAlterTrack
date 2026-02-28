import React, { useState } from 'react';
import { Issue, Project } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IssuesCalendarViewProps {
    issues: Issue[];
    project: Project;
    onIssueClick: (issue: Issue) => void;
}

const IssuesCalendarView: React.FC<IssuesCalendarViewProps> = ({ issues, project, onIssueClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const calendarDays = [];
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= numDays; i++) {
        calendarDays.push(i);
    }

    const getIssuesForDay = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return issues.filter(issue => {
            const start = issue.startDate ? issue.startDate.split('T')[0] : null;
            const end = issue.endDate ? issue.endDate.split('T')[0] : null;
            // Fall back to createdAt date when no explicit start/end dates are set
            const created = issue.createdAt ? issue.createdAt.split('T')[0] : null;
            return start === dateStr || end === dateStr || (!start && !end && created === dateStr);
        });
    };

    return (
        <div className="bg-white dark:bg-[#0c0d0e] rounded-2xl border border-gray-100 dark:border-slate-800/50 flex flex-col h-full overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-50 dark:border-slate-800/50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-500 transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                        Today
                    </button>
                    <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-500 transition-colors">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                <div className="grid grid-cols-7 border-b border-gray-50 dark:border-slate-800/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase text-center border-r border-gray-50 dark:border-slate-800/50 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-fr h-full min-h-[500px]">
                    {calendarDays.map((day, idx) => {
                        const dayIssues = day ? getIssuesForDay(day) : [];
                        const isToday = day && new Date().toDateString() === new Date(year, month, day).toDateString();

                        return (
                            <div
                                key={idx}
                                className={`min-h-[120px] p-2 border-r border-b border-gray-50 dark:border-slate-800/50 flex flex-col gap-1 transition-colors ${day ? 'bg-white dark:bg-transparent' : 'bg-gray-50/30 dark:bg-slate-900/10'}`}
                            >
                                {day && (
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-[10px] font-bold ${isToday ? 'h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center' : 'text-gray-400 dark:text-slate-500'}`}>
                                            {day}
                                        </span>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    {dayIssues.slice(0, 3).map(issue => (
                                        <button
                                            key={issue.id}
                                            onClick={() => onIssueClick(issue)}
                                            className="w-full text-left px-1.5 py-1 rounded bg-indigo-50 dark:bg-indigo-900/30 border-l-2 border-indigo-500 group transition-all hover:translate-x-0.5"
                                        >
                                            <p className="text-[9px] font-bold text-indigo-700 dark:text-indigo-300 line-clamp-1 group-hover:underline">
                                                {issue.title}
                                            </p>
                                        </button>
                                    ))}
                                    {dayIssues.length > 3 && (
                                        <p className="text-[9px] font-bold text-gray-400 mt-1 pl-1">
                                            + {dayIssues.length - 3} more
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default IssuesCalendarView;
