import React from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
    header: React.ReactNode;
    leftPanel: React.ReactNode;
    rightPanel: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, header, leftPanel, rightPanel }) => {
    return (
        <div className="w-screen h-screen bg-zinc-950 text-zinc-100 overflow-hidden flex flex-col font-sans select-none">
            {/* Header Area */}
            <header className="h-[60px] border-b border-zinc-800 bg-zinc-900 flex items-center px-6 shadow-md z-10">
                {header}
            </header>

            {/* Main Content Grid */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Panel (Status/FSM) */}
                <aside className="w-[350px] border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
                    {leftPanel}
                </aside>

                {/* Center Canvas (Map) */}
                <section className="flex-1 relative bg-black/40">
                    {children}
                </section>

                {/* Right Panel (Jobs/Logs) */}
                <aside className="w-[400px] border-l border-zinc-800 bg-zinc-900/50 flex flex-col">
                    {rightPanel}
                </aside>
            </main>
        </div>
    );
};
