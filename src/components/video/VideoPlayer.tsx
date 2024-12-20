import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { VideoProgress } from './controls/VideoProgress';
import { VideoControls } from './controls/VideoControls';
import { useFullscreen } from './hooks/useFullscreen';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useVideoPreferences } from './hooks/useVideoPreferences';

interface VideoPlayerProps {
  url: string;
  thumbnail?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  className?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export const VideoPlayer = ({ 
  url, 
  thumbnail, 
  onTimeUpdate, 
  className,
  onPlayStateChange 
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [viewMode, setViewMode] = useState<'default' | 'medium' | 'fullscreen'>('default');
  
  const { preferences, updatePreference } = useVideoPreferences();
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime, video.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onTimeUpdate]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
      onPlayStateChange?.(true);
    } else {
      video.pause();
      setIsPlaying(false);
      onPlayStateChange?.(false);
    }
  };

  const handleViewModeChange = (mode: 'default' | 'medium' | 'fullscreen') => {
    setViewMode(mode);
    if (mode === 'fullscreen') {
      toggleFullscreen();
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  useKeyboardControls({
    videoRef,
    togglePlay,
    toggleFullscreen,
    skip: (seconds: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
    }
  });

  const containerClasses = cn(
    "relative group bg-black rounded-lg overflow-hidden",
    viewMode === 'medium' && "w-[854px] h-[480px]",
    viewMode === 'default' && "w-full aspect-video",
    className
  );

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(false)}
      onTouchStart={() => setShowControls(true)}
      onTouchEnd={() => setTimeout(() => !isPlaying && setShowControls(false), 3000)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={thumbnail}
        onClick={togglePlay}
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
        preferences={preferences}
        showControls={showControls}
        onPlayPause={togglePlay}
        onToggleFullscreen={toggleFullscreen}
        onViewModeChange={handleViewModeChange}
        onPreferenceChange={updatePreference}
        videoRef={videoRef}
        viewMode={viewMode}
      />
    </div>
  );
};