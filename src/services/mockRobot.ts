import { useRobotStore } from '../store/useRobotStore';


export class MockRobotService {
    private interval: number | null = null;
    private pathIndex = 0;
    // A simple rectangle path
    private path = [
        { x: 100, y: 100 },
        { x: 500, y: 100 },
        { x: 500, y: 400 },
        { x: 100, y: 400 },
    ];

    start() {
        if (this.interval) return;

        const store = useRobotStore.getState();
        store.addLog('INFO', 'Mock Robot Simulation Started');
        store.setStatus('NAVIGATE');

        this.interval = window.setInterval(() => {
            this.updateLoop();
        }, 100);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    private updateLoop() {
        const store = useRobotStore.getState();
        const currentPos = store.position;

        // Simple waypoint navigation logic
        const target = this.path[this.pathIndex];
        const dx = target.x - currentPos.x;
        const dy = target.y - currentPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) {
            this.pathIndex = (this.pathIndex + 1) % this.path.length;
        } else {
            // Move towards target
            const speed = 2; // px per tick
            const angle = Math.atan2(dy, dx);

            store.updatePosition(
                currentPos.x + Math.cos(angle) * speed,
                currentPos.y + Math.sin(angle) * speed,
                angle
            );

            // Consume Battery
            if (Math.random() > 0.95) {
                store.updateBattery({ percentage: Math.max(0, store.battery.percentage - 0.1) });
            }
        }
    }
}

export const mockService = new MockRobotService();
