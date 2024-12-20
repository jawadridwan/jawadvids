import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { VideoProgress } from './controls/VideoProgress';
import { VideoControls } from './controls/VideoControls';
import { useFullscreen } from './hooks/useFullscreen';
import { useKeyboardControls } from './hooks/useKeyboardControls';

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
  const [preferences, setPreferences] = useState({
    volume: 1,
    playbackSpeed: 1,
    quality: 'auto',
    autoScroll: true,
    scrollThreshold: 0.8,
    scrollSpeed: 1000,
  });

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

  const handlePreferenceChange = (key: string, value: any) => {
    const video = videoRef.current;
    if (!video) return;

    setPreferences(prev => ({ ...prev, [key]: value }));

    switch (key) {
      case 'volume':
        video.volume = value;
        video.muted = value === 0;
        break;
      case 'playbackSpeed':
        video.playbackRate = value;
        break;
      default:
        break;
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

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative group bg-black rounded-lg overflow-hidden",
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onTouchStart={() => setShowControls(true)}
      onTouchEnd={() => setTimeout(() => setShowControls(false), 3000)}
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

      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4",
          showControls ? "opacity-100" : "opacity-0",
          "transition-opacity duration-300"
        )}
      >
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
          onPreferenceChange={handlePreferenceChange}
          videoRef={videoRef}
        />
      </div>
    </div>
  );
};