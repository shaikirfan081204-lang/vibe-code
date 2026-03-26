import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#0ff] font-mono selection:bg-[#f0f] selection:text-[#050505] flex flex-col relative overflow-hidden">
      <div className="scanlines"></div>
      <div className="noise"></div>
      
      {/* Header */}
      <header className="w-full py-4 px-6 border-b-4 border-[#f0f] bg-[#050505] flex items-center justify-between z-50 relative screen-tear">
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-[#f0f]">[TERM]</span>
          <h1 className="text-3xl font-bold tracking-widest glitch-text" data-text="SYS.OP // SNAKE_PROTOCOL">
            SYS.OP // SNAKE_PROTOCOL
          </h1>
        </div>
        <div className="hidden md:block text-xl text-[#0ff] animate-pulse">
          STATUS: ONLINE_
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10 relative">
        
        {/* Game Area */}
        <div className="lg:col-span-8 flex justify-center items-center w-full border-2 border-[#0ff] p-2 bg-[#0a0a0a] shadow-[8px_8px_0px_#f0f]">
          <SnakeGame />
        </div>

        {/* Music Player Area */}
        <div className="lg:col-span-4 flex justify-center items-center w-full border-2 border-[#f0f] p-2 bg-[#0a0a0a] shadow-[8px_8px_0px_#0ff]">
          <MusicPlayer />
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-2 border-t-2 border-[#0ff] bg-[#050505] text-center text-lg text-[#f0f] z-10 relative">
        <p>WARNING: UNAUTHORIZED ACCESS DETECTED. TRACING...</p>
      </footer>
    </div>
  );
}
