import { useState, useRef } from 'react';
import type { MapQuestion, MapPin } from '../../types/quiz';
import { Button } from '../../components/ui/button';
import { AVAILABLE_MAPS } from '../../utils/mapImages';
import { MapPin as MapPinIcon, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

interface MapEditorProps {
    question: MapQuestion;
    onUpdate: (updates: Partial<MapQuestion>) => void;
}

export function MapEditor({ question, onUpdate }: MapEditorProps) {
    const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const handleMapSelect = (url: string) => {
        onUpdate({ mapImageUrl: url });
    };

    const handleAddPin = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current) return;

        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newPin: MapPin = {
            id: Math.random().toString(36).substring(2, 9),
            x,
            y,
            question: '',
            answer: ''
        };

        onUpdate({ pins: [...question.pins, newPin] });
        setSelectedPinId(newPin.id);
    };

    const handleUpdatePin = (pinId: string, updates: Partial<MapPin>) => {
        const newPins = question.pins.map(p => 
            p.id === pinId ? { ...p, ...updates } : p
        );
        onUpdate({ pins: newPins });
    };

    const handleDeletePin = (pinId: string) => {
        onUpdate({ pins: question.pins.filter(p => p.id !== pinId) });
        if (selectedPinId === pinId) setSelectedPinId(null);
    };

    const selectedPin = question.pins.find(p => p.id === selectedPinId);
    
    // Default size is 40 if not set
    const currentPinSize = question.pinSize || 40;

    if (!question.mapImageUrl) {
        return (
            <div className="grid grid-cols-2 gap-4">
                {AVAILABLE_MAPS.map(map => (
                    <div 
                        key={map.id} 
                        onClick={() => handleMapSelect(map.url)}
                        className="cursor-pointer group relative aspect-video rounded-xl overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all"
                    >
                        <img src={map.url} alt={map.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold text-lg">{map.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onUpdate({ mapImageUrl: '', pins: [] })}
                      className="text-slate-400 hover:text-white"
                  >
                      Change Map
                  </Button>
                  
                  {/* Pin Size Slider */}
                  <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1 rounded-full border border-white/10">
                    <span className="text-xs text-slate-400 font-mono">Size: {currentPinSize}px</span>
                    <input 
                      type="range" 
                      min="20" 
                      max="100" 
                      step="5"
                      value={currentPinSize}
                      onChange={(e) => onUpdate({ pinSize: parseInt(e.target.value) })}
                      className="w-24 accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="text-sm text-slate-400">
                    Click on map to add a pin
                </div>
            </div>

            <div className="flex gap-6 h-[600px]">
                {/* Map Area - Shrink wrapped */}
                <div className="flex-1 relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
                    <div 
                        ref={imageContainerRef}
                        className="relative inline-block max-w-full max-h-full cursor-crosshair"
                        onClick={handleAddPin}
                    >
                        <img 
                            src={question.mapImageUrl} 
                            alt="Map" 
                            className="block max-w-full max-h-full w-auto h-auto object-contain pointer-events-none select-none"
                            style={{ maxHeight: '100%' }}
                        />
                        {question.pins.map((pin, index) => (
                            <div
                                key={pin.id}
                                style={{ 
                                  left: `${pin.x}%`, 
                                  top: `${pin.y}%`,
                                  width: `${currentPinSize}px`,
                                  height: `${currentPinSize}px`,
                                  fontSize: `${currentPinSize * 0.4}px` // Scale font size
                                }}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 ${
                                    selectedPinId === pin.id ? 'z-20 scale-125' : 'z-10'
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPinId(pin.id);
                                }}
                            >
                                <div className={`w-full h-full rounded-full shadow-lg flex items-center justify-center border-2 ${
                                    selectedPinId === pin.id 
                                        ? 'bg-red-500 border-white text-white' 
                                        : 'bg-white border-red-500 text-red-500'
                                }`}>
                                    <span className="font-bold">{index + 1}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Editor for Pin */}
                <div className="w-80 flex-none space-y-4">
                     {selectedPin ? (
                         <Card className="bg-slate-900/50 border-white/10">
                             <CardContent className="p-4 space-y-4">
                                 <div className="flex items-center justify-between">
                                     <h3 className="font-bold text-white flex items-center gap-2">
                                         <MapPinIcon className="size-4 text-red-400" />
                                         Pin #{question.pins.findIndex(p => p.id === selectedPin.id) + 1}
                                     </h3>
                                     <Button 
                                         variant="ghost" 
                                         size="icon" 
                                         onClick={() => handleDeletePin(selectedPin.id)}
                                         className="h-8 w-8 text-slate-500 hover:text-red-400"
                                     >
                                         <Trash2 className="size-4" />
                                     </Button>
                                 </div>

                                 <div className="space-y-2">
                                     <label className="text-xs font-semibold text-slate-400">Domanda</label>
                                     <textarea 
                                         value={selectedPin.question}
                                         onChange={(e) => handleUpdatePin(selectedPin.id, { question: e.target.value })}
                                         className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500 min-h-[80px]"
                                         placeholder="Scrivi la domanda..."
                                     />
                                 </div>

                                 <div className="space-y-2">
                                     <label className="text-xs font-semibold text-slate-400">Risposta</label>
                                     <textarea 
                                         value={selectedPin.answer}
                                         onChange={(e) => handleUpdatePin(selectedPin.id, { answer: e.target.value })}
                                         className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-green-500 min-h-[80px]"
                                         placeholder="Scrivi la risposta..."
                                     />
                                 </div>
                             </CardContent>
                         </Card>
                     ) : (
                         <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center border border-dashed border-slate-800 rounded-xl">
                             <MapPinIcon className="size-8 opacity-20 mb-2" />
                             <p className="text-sm">Seleziona un pin sulla mappa per modificarlo</p>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
}
