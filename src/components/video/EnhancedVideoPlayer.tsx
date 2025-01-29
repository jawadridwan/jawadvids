import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { VideoControls } from './controls/VideoControls';
import { useFullscreen } from './hooks/useFullscreen';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useVideoState } from './hooks/useVideoState';
import { VideoVolume } from './controls/VideoVolume';
import { VideoPlaybackSpeed } from './controls/VideoPlaybackSpeed';

interface EnhancedVideoPlayerProps {
  url: string;
  thumbnail?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  className?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
  videoId: string;
}

export const EnhancedVideoPlayer = ({
  url,
  thumbnail,
  onTimeUpdate,
  className,
  onPlayStateChange,
  videoId
}: EnhancedVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [viewMode, setViewMode] = useState<'default' | 'medium' | 'fullscreen'>('default');

  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const { isPlaying, error, togglePlay } = useVideoState(videoRef, videoId, onPlayStateChange);

  useKeyboardControls({
    videoRef,
    togglePlay,
    toggleFullscreen
  });

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && onTimeUpdate) {
      onTimeUpdate(video.currentTime, video.duration);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    if (videoRef.current) {
      const volume = newVolume[0];
      videoRef.current.volume = volume;
      setVolume(volume);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group bg-black rounded-lg overflow-hidden",
        viewMode === 'medium' && "w-[854px] h-[480px]",
        viewMode === 'default' && "w-full aspect-video",
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(false)}
      onTouchStart={() => setShowControls(true)}
      onTouchEnd={() => setTimeout(() => !isPlaying && setShowControls(false), 3000)}
    >
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          {error}
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full h-full"
            poster={thumbnail}
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            playsInline
          >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <VideoControls
            isPlaying={isPlaying}
            isFullscreen={isFullscreen}
            showControls={showControls}
            onPlayPause={togglePlay}
            onToggleFullscreen={toggleFullscreen}
            onViewModeChange={(mode) => {
              setViewMode(mode);
              if (mode === 'fullscreen') {
                toggleFullscreen();
              }
            }}
            videoRef={videoRef}
            viewMode={viewMode}
          >
            <VideoVolume
              volume={volume}
              onVolumeChange={handleVolumeChange}
              onToggleMute={() => handleVolumeChange([volume === 0 ? 1 : 0])}
            />
            <VideoPlaybackSpeed
              speed={playbackSpeed}
              onSpeedChange={handleSpeedChange}
            />
          </VideoControls>
        </>
      )}
    </div>
  );
};