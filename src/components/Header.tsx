import React, { useEffect, useState } from 'react';
import { Battery, Wifi, AlertOctagon } from 'lucide-react';
import { useRobotStore } from '../store/useRobotStore';

export const Header: React.FC = () => {
    const { battery, sensors } = useRobotStore();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const isEmergency = sensors.emergencyStop;

    return (
        <div className="w-full flex justify-between items-center">
            {/* Left: Branding & Time */}
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold tracking-wider text-white">
                    <span className="text-sky-500">TitanCore</span> CONTROL
                </h1>
                <div className="h-6 w-px bg-zinc-700" />
                <span className="text-zinc-400 font-mono text-sm">
                    {currentTime.toLocaleTimeString('tr-TR')}
                </span>
            </div>

            {/* Center: Major Alerts */}
            {isEmergency && (
                <div className="flex items-center gap-2 px-4 py-1 bg-red-500/20 border border-red-500 text-red-500 rounded animate-pulse">
                    <AlertOctagon size={20} />
                    <span className="font-bold tracking-widest">EMERGENCY STOP ACTIVE</span>
                </div>
            )}

            {/* Right: System Vitals */}
            <div className="flex items-center gap-6">
                {/* Connection (Mock) */}
                <div className="flex items-center gap-2 text-zinc-400">
                    <Wifi size={18} className="text-emerald-500" />
                    <span className="text-xs font-mono">LINK: 24ms</span>
                </div>

                {/* Battery */}
                <div className={`flex items-center gap-2 px-3 py-1 rounded border ${battery.percentage < 20 ? 'border-red-500/50 bg-red-500/10 text-red-500' : 'border-zinc-700 bg-zinc-800'
                    }`}>
                    <Battery size={18} className={battery.isCharging ? 'text-green-400' : ''} />
                    <div className="flex flex-col leading-none">
                        <span className="font-mono font-bold text-sm">{battery.percentage.toFixed(0)}%</span>
                        <span className="font-mono text-[10px] text-zinc-500">{battery.voltage.toFixed(1)}V</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
