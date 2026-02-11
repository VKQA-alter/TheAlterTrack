
import React, { useState, useRef } from 'react';
import {
    FileText,
    Upload,
    Plus,
    Download,
    Trash2,
    ArrowLeft,
    Save,
    FileSpreadsheet,
    MoreVertical,
    ChevronRight,
    Search
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { TestCaseFile, Project } from '../types';

interface TestCaseManagerProps {
    project: Project;
    files: TestCaseFile[];
    onUpdateFiles: (files: TestCaseFile[]) => void;
}

const TestCaseManager: React.FC<TestCaseManagerProps> = ({ project, files, onUpdateFiles }) => {
    const [editingFileId, setEditingFileId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeProjectFiles = files.filter(f => f.projectId === project.id);
    const filteredFiles = activeProjectFiles.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const editingFile = files.find(f => f.id === editingFileId);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

            const newFile: TestCaseFile = {
                id: `tf-${Date.now()}`,
                projectId: project.id,
                name: file.name.replace(/\.[^/.]+$/, ""),
                type: file.name.endsWith('.csv') ? 'csv' : 'xlsx',
                size: `${(file.size / 1024).toFixed(1)} KB`,
                lastModified: new Date().toISOString(),
                content: data
            };

            onUpdateFiles([...files, newFile]);
        };
        reader.readAsBinaryString(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const createNewFile = () => {
        const fileName = prompt("Enter file name:");
        if (!fileName) return;

        const newFile: TestCaseFile = {
            id: `tf-${Date.now()}`,
            projectId: project.id,
            name: fileName,
            type: 'xlsx',
            size: '0 KB',
            lastModified: new Date().toISOString(),
            content: [["ID", "Title", "Steps", "Expected Result", "Status"]]
        };

        onUpdateFiles([...files, newFile]);
        setEditingFileId(newFile.id);
    };

    const deleteFile = (id: string) => {
        if (confirm("Are you sure you want to delete this file?")) {
            onUpdateFiles(files.filter(f => f.id !== id));
        }
    };

    const updateFileContent = (newContent: any[][]) => {
        if (!editingFileId) return;
        onUpdateFiles(files.map(f =>
            f.id === editingFileId
                ? { ...f, content: newContent, lastModified: new Date().toISOString() }
                : f
        ));
    };

    const exportFile = (file: TestCaseFile) => {
        const ws = XLSX.utils.aoa_to_sheet(file.content);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Test Cases");
        XLSX.writeFile(wb, `${file.name}.${file.type}`);
    };

    if (editingFileId && editingFile) {
        return (
            <TestCaseEditor
                file={editingFile}
                onBack={() => setEditingFileId(null)}
                onSave={updateFileContent}
                onExport={() => exportFile(editingFile)}
            />
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Test Case Management</h2>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">Manage, edit and import test case spreadsheets.</p>
                </div>
                <div className="flex gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-800 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
                    >
                        <Upload className="h-4 w-4" /> Import
                    </button>
                    <button
                        onClick={createNewFile}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        <Plus className="h-4 w-4" /> New List
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-slate-800/30 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-3">File Name</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Size</th>
                                <th className="px-6 py-3">Last Modified</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                            {filteredFiles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12">
                                        <div className="flex flex-col items-center justify-center p-8 text-center">
                                            <div className="h-16 w-16 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-4">
                                                <FileSpreadsheet className="h-8 w-8 text-gray-300 dark:text-slate-700" />
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No test cases found</p>
                                            <p className="text-xs text-gray-500 dark:text-slate-400">Try adjusting your search or create a new list.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredFiles.map(file => (
                                    <tr key={file.id} className="group hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => setEditingFileId(file.id)}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                                                    <FileSpreadsheet className="h-5 w-5" />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {file.name}.{file.type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded uppercase text-gray-500 dark:text-slate-400">
                                                {file.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                                            {file.size}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                                            {new Date(file.lastModified).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => exportFile(file)}
                                                    className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                                    title="Download"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteFile(file.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

interface TestCaseEditorProps {
    file: TestCaseFile;
    onBack: () => void;
    onSave: (content: any[][]) => void;
    onExport: () => void;
}

const TestCaseEditor: React.FC<TestCaseEditorProps> = ({ file, onBack, onSave, onExport }) => {
    const [data, setData] = useState<any[][]>(file.content);

    const handleCellChange = (rowIndex: number, colIndex: number, value: any) => {
        const newData = [...data];
        if (!newData[rowIndex]) newData[rowIndex] = [];
        newData[rowIndex][colIndex] = value;
        setData(newData);
    };

    const addRow = () => {
        const maxCols = data.reduce((max, row) => Math.max(max, row.length), 0) || 5;
        setData([...data, Array(maxCols).fill("")]);
    };

    const addColumn = () => {
        setData(data.map(row => [...row, ""]));
    };

    return (
        <div className="h-full flex flex-col space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5 text-green-600" />
                            {file.name}.{file.type}
                        </h2>
                        <p className="text-xs text-gray-500">Editing spreadsheet mode</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-slate-800 rounded-lg text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900"
                    >
                        <Download className="h-3.5 w-3.5" /> Export
                    </button>
                    <button
                        onClick={() => { onSave(data); alert("Saved successfully!"); }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
                    >
                        <Save className="h-3.5 w-3.5" /> Save Changes
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-inner overflow-hidden flex flex-col">
                <div className="p-2 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex gap-2">
                    <button onClick={addRow} className="px-3 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-[10px] font-bold hover:border-indigo-500 transition-colors dark:text-white">+ Add Row</button>
                    <button onClick={addColumn} className="px-3 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-[10px] font-bold hover:border-indigo-500 transition-colors dark:text-white">+ Add Column</button>
                </div>
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                        <tbody>
                            {data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="divide-x divide-gray-100 dark:divide-slate-800 border-b border-gray-50 dark:border-slate-800">
                                    <td className="w-10 bg-gray-50 dark:bg-slate-950 text-[10px] font-bold text-gray-400 text-center select-none sticky left-0">{rowIndex + 1}</td>
                                    {row.map((cell, colIndex) => (
                                        <td key={colIndex} className="p-0 min-w-[150px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:z-10 relative">
                                            <input
                                                type="text"
                                                value={cell || ''}
                                                onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                                className={`w-full h-full px-3 py-2 text-sm bg-transparent outline-none dark:text-white ${rowIndex === 0 ? 'font-bold bg-gray-50/50 dark:bg-slate-800/20' : ''}`}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TestCaseManager;
