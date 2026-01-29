import React, { useState } from 'react';
import { List, Play, StopCircle, Plus, Trash2 } from 'lucide-react';
import { useRobotStore } from '../store/useRobotStore';
import { MockRobotService } from '../services/mockRobot';

const robotService = new MockRobotService();

export const ControlPanel: React.FC = () => {
    const { tasks, addLog, deleteTask } = useRobotStore();
    const [source, setSource] = useState('A1');
    const [target, setTarget] = useState('B1');
    const [isRunning, setIsRunning] = useState(false);

    const handleAddTask = () => {
        useRobotStore.setState((state) => ({
            tasks: [
                ...state.tasks,
                {
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'TRANSPORT',
                    targetNode: `${source} → ${target}`,
                    status: 'PENDING',
                },
            ],
        }));
        addLog('INFO', `Task added: ${source} -> ${target}`);
    };

    const handleStart = () => {
        setIsRunning(true);
        robotService.start();
        addLog('INFO', 'Robot started');
    };

    const handleStop = () => {
        setIsRunning(false);
        robotService.stop();
        addLog('INFO', 'Robot stopped');
    };

    return (
        <div className="h-full flex flex-col bg-zinc-900/50">
            {/* Job Entry Form */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-900">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Plus size={14} /> New Mission
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                        <label className="text-[10px] text-zinc-500 font-mono block mb-1">PICKUP</label>
                        <select
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 text-zinc-300 text-sm p-2 rounded focus:border-sky-500 outline-none"
                        >
                            {['A1', 'A2', 'A3', 'A4'].map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] text-zinc-500 font-mono block mb-1">DROP</label>
                        <select
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 text-zinc-300 text-sm p-2 rounded focus:border-sky-500 outline-none"
                        >
                            {['B1', 'B2', 'B3', 'B4'].map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleAddTask}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white p-2 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                >
                    Add Task to Queue
                </button>
            </div>

            {/* Job List Header */}
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <List size={14} /> Active Queue
                </h2>
                <span className="px-2 py-0.5 text-[10px] bg-sky-500/20 text-sky-400 rounded-full">{tasks.length} PENDING</span>
            </div>

            {/* Job List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {tasks.length === 0 ? (
                    <div className="text-center py-8 text-zinc-600">
                        <p className="text-xs font-mono">QUEUE EMPTY</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="bg-zinc-800 p-3 rounded border border-zinc-700 flex justify-between items-center group">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-zinc-300">{task.type} {task.targetNode}</span>
                                <span className="text-[10px] font-mono text-zinc-500">{task.status}</span>
                            </div>
                            <button 
                                onClick={() => deleteTask(task.id)}
                                className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Manual Controls */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">MANUAL OVERRIDE</h2>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={handleStart}
                        disabled={isRunning}
                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:opacity-50 text-white p-3 rounded font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                        <Play size={14} /> Start
                    </button>
                    <button
                        onClick={handleStop}
                        disabled={!isRunning}
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:opacity-50 text-white p-3 rounded font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                        <StopCircle size={14} /> Stop
                    </button>
                </div>
            </div>
        </div>
    );
};
