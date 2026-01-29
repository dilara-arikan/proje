export type RobotStatus = 'IDLE' | 'MAPPING' | 'NAVIGATE' | 'LOAD' | 'UNLOAD' | 'OBSTACLE' | 'CHARGE' | 'ERROR';

export interface Position {
    x: number;
    y: number;
    theta: number; // Angle in degrees/radians
}

export interface BatteryState {
    percentage: number;
    voltage: number;
    current: number;
    isCharging: boolean;
}

export interface Task {
    id: string;
    type: 'LOAD' | 'UNLOAD' | 'TRANSPORT';
    targetNode: string; // e.g., 'A1', 'B2'
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
}

export interface SensorData {
    lidarActive: boolean;
    bumperActive: boolean;
    emergencyStop: boolean;
    obstacleDetected: boolean;
}

export interface RobotState {
    status: RobotStatus;
    lastStatusUpdate: number; // Timestamp
    position: Position;
    battery: BatteryState;
    currentTask: Task | null;
    tasks: Task[];
    sensors: SensorData;
    logs: LogEntry[];
}

export interface LogEntry {
    id: string;
    timestamp: number;
    level: 'INFO' | 'WARN' | 'ERROR';
    message: string;
}
