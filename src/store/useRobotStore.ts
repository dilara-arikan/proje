import { create } from 'zustand';
import type { RobotState, LogEntry, RobotStatus } from '../types/robot';

interface RobotStore extends RobotState {
    setStatus: (status: RobotStatus) => void;
    updatePosition: (x: number, y: number, theta: number) => void;
    updateBattery: (battery: Partial<RobotState['battery']>) => void;
    addLog: (level: LogEntry['level'], message: string) => void;
    toggleEmergencyStop: () => void;
    deleteTask: (taskId: string) => void;
}

export const useRobotStore = create<RobotStore>((set) => ({
    status: 'IDLE',
    lastStatusUpdate: Date.now(),
    position: { x: 0, y: 0, theta: 0 },
    battery: {
        percentage: 100,
        voltage: 24.5,
        current: 0.5,
        isCharging: false,
    },
    currentTask: null,
    tasks: [],
    sensors: {
        lidarActive: true,
        bumperActive: false,
        emergencyStop: false,
        obstacleDetected: false,
    },
    logs: [],

    setStatus: (status) => set({ status, lastStatusUpdate: Date.now() }),

    updatePosition: (x, y, theta) => set((state) => ({
        position: { ...state.position, x, y, theta }
    })),

    updateBattery: (batteryUpdate) => set((state) => ({
        battery: { ...state.battery, ...batteryUpdate }
    })),

    addLog: (level, message) => set((state) => {
        const newLog: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            level,
            message,
        };
        return { logs: [newLog, ...state.logs].slice(0, 50) }; // Keep last 50
    }),

    toggleEmergencyStop: () => set((state) => ({
        sensors: { ...state.sensors, emergencyStop: !state.sensors.emergencyStop },
        status: !state.sensors.emergencyStop ? 'ERROR' : 'IDLE' // Force error if stop engaged
    })),

    deleteTask: (taskId: string) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
}));
