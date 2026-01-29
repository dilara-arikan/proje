import React from 'react';
import { useRobotStore } from '../store/useRobotStore';
import { Activity, Cpu } from 'lucide-react';
import clsx from 'clsx';

export const StatusPanel: React.FC = () => {
    const { status, sensors, lastStatusUpdate } = useRobotStore();

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'IDLE': return 'text-slate-400 border-slate-500 bg-slate-500/10';
            case 'MAPPING': return 'text-sky-400 border-sky-500 bg-sky-500/10';
            case 'NAVIGATE': return 'text-blue-400 border-blue-500 bg-blue-500/10';
            case 'LOAD': return 'text-yellow-400 border-yellow-500 bg-yellow-500/10';
            case 'UNLOAD': return 'text-orange-400 border-orange-500 bg-orange-500/10';
            case 'OBSTACLE': return 'text-red-400 border-red-500 bg-red-500/10';
            case 'CHARGE': return 'text-lime-400 border-lime-500 bg-lime-500/10';
            case 'ERROR': return 'text-red-600 border-red-600 bg-red-600/20 animate-pulse';
            default: return 'text-zinc-400';
        }
    };

    return (
        <div className="p-4 flex flex-col gap-4 h-full">
            {/* Main Status Card */}
            <div className="space-y-2">
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} /> System State
                </h2>
                <div className={clsx(
                    "w-full h-24 flex items-center justify-center border-2 rounded-lg",
                    getStatusColor(status)
                )}>
                    <span className="text-4xl font-black tracking-widest font-mono">
                        {status}
                    </span>
                </div>
                <div className="flex justify-between text-xs font-mono text-zinc-500">
                    <span>UPTIME: 00:04:12</span>
                    <span>LAST: {(Date.now() - lastStatusUpdate) / 1000}s ago</span>
                </div>
            </div>

            {/* Sensor Array */}
            <div className="space-y-2 mt-4">
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Cpu size={14} /> Sensor Array
                </h2>
                <div className="grid grid-cols-2 gap-2">
                    <SensorBadge label="LIDAR" active={sensors.lidarActive} />
                    <SensorBadge label="BUMPER" active={sensors.bumperActive} alert={sensors.bumperActive} />
                    <SensorBadge label="OBSTACLE" active={sensors.obstacleDetected} alert={sensors.obstacleDetected} />
                    <SensorBadge label="SLAM" active={true} />
                </div>
            </div>

            {/* Legend / Info */}
            <div className="mt-auto p-4 border border-zinc-800 rounded bg-black/20">
                <h3 className="text-xs font-bold text-zinc-400 mb-2">MODE DESCRIPTION</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                    SYSTEM IS IN <strong>{status}</strong> MODE.
                    {status === 'MAPPING' && " Autonomous SLAM algorithm is building the occupancy grid."}
                    {status === 'NAVIGATE' && " Path planner is calculating optimal route avoiding static/dynamic obstacles."}
                    {status === 'OBSTACLE' && " Dynamic obstacle detected. Re-routing in progress."}
                </p>
            </div>
        </div>
    );
};

const SensorBadge: React.FC<{ label: string; active: boolean; alert?: boolean }> = ({ label, active, alert }) => (
    <div className={clsx(
        "flex flex-col items-center justify-center p-2 rounded border transition-colors",
        alert ? "bg-red-500/20 border-red-500 text-red-500" :
            active ? "bg-zinc-800 border-zinc-700 text-emerald-500" : "bg-zinc-900 border-zinc-800 text-zinc-600"
    )}>
        <span className="text-[10px] font-bold tracking-wider">{label}</span>
        <div className={clsx("w-2 h-2 rounded-full mt-1", active || alert ? "bg-current" : "bg-zinc-700")} />
    </div>
);
