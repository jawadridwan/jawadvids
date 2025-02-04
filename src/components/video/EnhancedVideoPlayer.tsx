import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { VideoControls } from './controls/VideoControls';
import { VideoVolume } from './controls/VideoVolume';
import { VideoPlaybackSpeed } from './controls/VideoPlaybackSpeed';
import { useFullscreen } from './hooks/useFullscreen';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useVideoState } from './hooks/useVideoState';
import { VideoProgress } from './controls/VideoProgress';
import { toast } from 'sonner';

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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [viewMode, setViewMode] = useState<'default' | 'medium' | 'fullscreen'>('default');

  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const { isPlaying, error, togglePlay } = useVideoState(videoRef, videoId, onPlayStateChange);

  useKeyboardControls({
    videoRef,
    togglePlay,
    toggleFullscreen,
    skip: (seconds: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, videoRef.current.duration));
        toast.success(`Skipped ${seconds > 0 ? 'forward' : 'backward'} ${Math.abs(seconds)} seconds`);
      }
    }
  });

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      onTimeUpdate?.(video.currentTime, video.duration);
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

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
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

          <VideoProgress
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />

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