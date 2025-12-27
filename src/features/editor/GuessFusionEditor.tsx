import type { GuessFusionQuestion } from '../../types/quiz';
import { Card } from '../../components/ui/card';

interface GuessFusionEditorProps {
    question: GuessFusionQuestion;
    onUpdate: (updates: Partial<GuessFusionQuestion>) => void;
}

export function GuessFusionEditor({ question, onUpdate }: GuessFusionEditorProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Question Text / Title</label>
                <input
                    type="text"
                    value={question.text}
                    onChange={(e) => onUpdate({ text: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="e.g. Who are fused in this image?"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Fusion Image URL</label>
                        <input
                            type="text"
                            value={question.imageUrl || ''}
                            onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            placeholder="https://..."
                        />
                    </div>

                    <Card className="aspect-square bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
                        {question.imageUrl ? (
                            <img src={question.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-slate-600">Image Preview</div>
                        )}
                    </Card>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Hidden Answer #1</label>
                        <input
                            type="text"
                            value={question.answer1 || ''}
                            onChange={(e) => onUpdate({ answer1: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            placeholder="First Character/Component"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Hidden Answer #2</label>
                        <input
                            type="text"
                            value={question.answer2 || ''}
                            onChange={(e) => onUpdate({ answer2: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            placeholder="Second Character/Component"
                        />
                    </div>

                    <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-300">
                        <p>These answers will be hidden during gameplay until you reveal them by clicking the image.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
