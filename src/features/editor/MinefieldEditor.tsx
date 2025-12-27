import type { MinefieldQuestion, MinefieldCell } from '../../types/quiz';
import { Card } from '../../components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface MinefieldEditorProps {
    question: MinefieldQuestion;
    onUpdate: (updates: Partial<MinefieldQuestion>) => void;
}

export function MinefieldEditor({ question, onUpdate }: MinefieldEditorProps) {
    const GRID_SIZE = 20; // 5 rows * 4 cols

    // Ensure grid is initialized if needed, but we handle optional grid in render.


    const handleCellUpdate = (index: number, updates: Partial<MinefieldCell>) => {
        const newGrid = [...(question.grid || [])];
        if (!newGrid[index]) return;
        newGrid[index] = { ...newGrid[index], ...updates };
        onUpdate({ grid: newGrid });
    };

    return (
        <div className="space-y-6">
            {/* Question Text acts as the "Table Title" */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Question / Grid Title</label>
                <input
                    type="text"
                    value={question.text}
                    onChange={(e) => onUpdate({ text: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="Enter the question or title for this grid..."
                />
            </div>

            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: GRID_SIZE }).map((_, i) => {
                    const cell = question.grid?.[i] || {
                        id: 'temp',
                        index: i,
                        hiddenType: 'TEXT',
                        hiddenContent: ''
                    } as MinefieldCell;

                    return (
                        <MinefieldCellEditor
                            key={cell.id || i}
                            cell={cell}
                            index={i}
                            onChange={(updates) => handleCellUpdate(i, updates)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function MinefieldCellEditor({
    cell,
    index,
    onChange
}: {
    cell: MinefieldCell;
    index: number;
    onChange: (updates: Partial<MinefieldCell>) => void;
}) {
    const [activeLayer, setActiveLayer] = useState<'TOP' | 'BOTTOM'>('TOP');

    return (
        <Card className="bg-slate-900/40 border-slate-800 p-3 space-y-3 relative group">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-slate-500">Cell {index + 1}</span>
                <div className="flex gap-1 bg-slate-950 rounded p-1">
                    <button
                        onClick={() => setActiveLayer('TOP')}
                        className={`p-1 rounded ${activeLayer === 'TOP' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-600 hover:text-slate-400'}`}
                        title="Top Layer (Visible)"
                    >
                        <Eye className="size-3" />
                    </button>
                    <button
                        onClick={() => setActiveLayer('BOTTOM')}
                        className={`p-1 rounded ${activeLayer === 'BOTTOM' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-600 hover:text-slate-400'}`}
                        title="Bottom Layer (Hidden)"
                    >
                        <EyeOff className="size-3" />
                    </button>
                </div>
            </div>

            {activeLayer === 'TOP' ? (
                <div className="space-y-2">
                    <label className="text-xs text-slate-400 uppercase font-bold">Top Layer (Cover)</label>
                    <div className="aspect-square bg-slate-950 rounded border border-slate-800 flex flex-col items-center justify-center overflow-hidden relative">
                        {cell.coverImage ? (
                            <img src={cell.coverImage} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-slate-600 text-xs text-center p-2">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            {/* In a real app we'd have a proper file uploader. For now, using a simple prompt or text input for URL could be easier for MVP, 
                   but let's try to stick to "Enter URL" for now, or maybe simulate upload if requested later. 
                   Standard text input for URL: */}
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="Image URL..."
                        value={cell.coverImage || ''}
                        onChange={(e) => onChange({ coverImage: e.target.value })}
                        className="w-full bg-slate-950 text-xs border border-slate-800 rounded px-2 py-1 text-white"
                    />
                </div>
            ) : (
                <div className="space-y-2">
                    <label className="text-xs text-slate-400 uppercase font-bold">Bottom Layer (Hidden)</label>

                    <div className="flex gap-2 mb-2">
                        <button
                            onClick={() => onChange({ hiddenType: 'TEXT' })}
                            className={`text-[10px] px-2 py-0.5 rounded border ${cell.hiddenType === 'TEXT' ? 'border-indigo-500 text-indigo-400' : 'border-slate-700 text-slate-500'}`}
                        >
                            Text
                        </button>
                        <button
                            onClick={() => onChange({ hiddenType: 'IMAGE' })}
                            className={`text-[10px] px-2 py-0.5 rounded border ${cell.hiddenType === 'IMAGE' ? 'border-indigo-500 text-indigo-400' : 'border-slate-700 text-slate-500'}`}
                        >
                            Image
                        </button>
                    </div>

                    {cell.hiddenType === 'TEXT' ? (
                        <textarea
                            value={cell.hiddenContent}
                            onChange={(e) => onChange({ hiddenContent: e.target.value })}
                            className="w-full h-24 bg-slate-950 text-xs border border-slate-800 rounded px-2 py-1 text-white resize-none"
                            placeholder="Hidden message..."
                        />
                    ) : (
                        <div className="space-y-2">
                            <div className="aspect-square bg-slate-950 rounded border border-slate-800 flex items-center justify-center overflow-hidden">
                                {cell.hiddenContent ? (
                                    <img src={cell.hiddenContent} alt="Hidden" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-slate-600">No Image</span>
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Image URL..."
                                value={cell.hiddenContent}
                                onChange={(e) => onChange({ hiddenContent: e.target.value })}
                                className="w-full bg-slate-950 text-xs border border-slate-800 rounded px-2 py-1 text-white"
                            />
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
