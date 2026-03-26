import React, { useState, useEffect, useRef, useCallback } from 'react';

const TRACKS = [
  { id: 1, title: 'SECTOR_01.WAV', artist: 'AI_CORE_ALPHA', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'SECTOR_02.WAV', artist: 'NEURAL_NET_V2', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'SECTOR_03.WAV', artist: 'GHOST_IN_MACHINE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    if (isMuted) setIsMuted(false);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="w-full flex flex-col items-stretch bg-[#050505] p-6 border-2 border-[#f0f]">
      <div className="border-b-2 border-[#0ff] pb-2 mb-4 flex justify-between items-end">
        <h2 className="text-2xl text-[#0ff] glitch-text" data-text="AUDIO_SUBSYSTEM">AUDIO_SUBSYSTEM</h2>
        <span className="text-[#f0f] animate-pulse">{isPlaying ? 'ACTIVE' : 'IDLE'}</span>
      </div>

      <audio ref={audioRef} src={currentTrack.url} onEnded={nextTrack} preload="auto" />

      <div className="bg-[#0a0a0a] border border-[#0ff] p-4 mb-6">
        <div className="text-xl text-[#f0f] mb-1">{`> FILE: ${currentTrack.title}`}</div>
        <div className="text-lg text-[#0ff]">{`> AUTH: ${currentTrack.artist}`}</div>
      </div>

      <div className="flex items-center justify-between mb-6 border-y border-[#f0f] py-4">
        <button onClick={prevTrack} className="text-2xl text-[#0ff] hover:text-[#f0f] hover:bg-[#0ff] px-4 py-1 transition-colors">
          [ &lt;&lt; ]
        </button>
        
        <button onClick={togglePlay} className="text-3xl text-[#050505] bg-[#f0f] hover:bg-[#0ff] px-6 py-2 transition-colors">
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
        
        <button onClick={nextTrack} className="text-2xl text-[#0ff] hover:text-[#f0f] hover:bg-[#0ff] px-4 py-1 transition-colors">
          [ &gt;&gt; ]
        </button>
      </div>

      <div className="flex items-center w-full space-x-4 text-[#0ff]">
        <button onClick={toggleMute} className="text-xl hover:text-[#f0f] w-16 text-left">
          {isMuted || volume === 0 ? 'MUTE' : 'VOL'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-full h-4 bg-[#0a0a0a] border border-[#0ff] appearance-none cursor-pointer accent-[#f0f]"
        />
      </div>
    </div>
  );
}
