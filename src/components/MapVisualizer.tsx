import React, { useRef, useEffect } from 'react';
import { useRobotStore } from '../store/useRobotStore';

export const MapVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { position, status } = useRobotStore();

    // Configuration
    const MAP_WIDTH = 800; // Physical width representation
    const MAP_HEIGHT = 600;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Grid
        ctx.strokeStyle = '#1f2937'; // zinc-800
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 50) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 50) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        // Draw Boundary Box (Arena)
        ctx.strokeStyle = '#f59e0b'; // Amber
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]);
        ctx.strokeRect(50, 50, MAP_WIDTH, MAP_HEIGHT);
        ctx.setLineDash([]);

        // Draw Robot
        ctx.save();
        ctx.translate(position.x, position.y);
        ctx.rotate(position.theta);

        // Robot Body
        ctx.fillStyle = '#0ea5e9'; // Sky 500
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();

        // Robot Direction Indicator
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(20, 0); // Point forward
        ctx.stroke();

        // Lidar Scan area (Effect)
        if (status === 'MAPPING' || status === 'NAVIGATE') {
            ctx.fillStyle = 'rgba(14, 165, 233, 0.1)';
            ctx.beginPath();
            ctx.arc(0, 0, 100, -0.5, 0.5); // Pie slice
            ctx.lineTo(0, 0);
            ctx.fill();
        }

        ctx.restore();

        // Draw Overlay Info
        ctx.fillStyle = '#10b981';
        ctx.font = '12px monospace';
        const infoText = `POS: X${position.x.toFixed(0)} Y${position.y.toFixed(0)} TH${(position.theta * 57.29).toFixed(0)}°`;
        ctx.fillText(infoText, 60, canvas.height - 20);

    }, [position, status]);

    return (
        <div className="w-full h-full relative flex items-center justify-center bg-black/40 overflow-hidden">
            <canvas
                ref={canvasRef}
                width={1000}
                height={800}
                className="shadow-2xl shadow-black border border-zinc-800 bg-zinc-950/50"
            />
            <div className="absolute top-4 right-4 bg-zinc-900/80 p-4 border border-zinc-700 rounded backdrop-blur">
                <h3 className="text-zinc-400 text-xs font-bold mb-2">LEGEND</h3>
                <div className="flex flex-col gap-2 text-[10px] font-mono text-zinc-500">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-sky-500 rounded-full"></div> ROBOT</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 border border-amber-500"></div> BOUNDARY</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-zinc-800 border border-zinc-700"></div> OBSTACLE</div>
                </div>
            </div>
        </div>
    );
};
