import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SOUNDTRACK = [
  { name: 'A High-School Life Without Struggles', url: 'https://www.youtube.com/watch?v=j5W0qRHILoU', youtubeId: 'j5W0qRHILoU' },
  { name: 'To My First Friend', url: 'https://www.youtube.com/watch?v=6aDb8_MP7CM', youtubeId: '6aDb8_MP7CM' }
];

export default function MusicPlayer({ timeSlot }) {
  const [muted, setMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-30">
      <div className="flex flex-col gap-2 items-end">
        {showInfo && (
          <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg p-3 mb-2">
            <p className="text-xs text-purple-300/80 mb-1">🎵 Komi Can't Communicate OST</p>
            <p className="text-xs text-purple-400">Playing: {SOUNDTRACK[0].name}</p>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowInfo(!showInfo)}
            className="h-10 w-10 rounded-full bg-slate-800/90 backdrop-blur-sm border border-slate-700 hover:bg-purple-500/20"
          >
            <Music className="w-5 h-5 text-purple-300" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMuted(!muted)}
            className="h-10 w-10 rounded-full bg-slate-800/90 backdrop-blur-sm border border-slate-700 hover:bg-purple-500/20"
          >
            {muted ? (
              <VolumeX className="w-5 h-5 text-purple-300" />
            ) : (
              <Volume2 className="w-5 h-5 text-purple-300" />
            )}
          </Button>
        </div>
      </div>

      {/* Hidden iframe for background music */}
      {!muted && (
        <iframe
          width="0"
          height="0"
          src={`https://www.youtube.com/embed/${SOUNDTRACK[0].youtubeId}?autoplay=1&loop=1&playlist=${SOUNDTRACK[0].youtubeId}&controls=0`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
}