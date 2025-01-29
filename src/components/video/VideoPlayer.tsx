import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { VideoProgress } from './controls/VideoProgress';
import { VideoControls } from './controls/VideoControls';
import { useFullscreen } from './hooks/useFullscreen';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useAutoScroll } from './hooks/useAutoScroll';
import { toast } from 'sonner';
import { useVideoPlayback } from '@/contexts/VideoPlaybackContext';

interface VideoPlayerProps {
  url: string;
  thumbnail?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  className?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
  nextVideoId?: string;
  size?: 'default' | 'medium' | 'fullscreen';
}

export const VideoPlayer = ({ 
  url, 
  thumbnail, 
  onTimeUpdate, 
  className,
  onPlayStateChange,
  nextVideoId,
  size = 'default'
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const { registerVideo, unregisterVideo, handlePlay } = useVideoPlayback();

  useAutoScroll({
    videoRef,
    nextVideoId,
    isEnabled: true,
    scrollThreshold: 0.8,
  });

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

    const handleError = () => {
      setError('Failed to load video');
      toast.error('Failed to load video');
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
    };
  }, [onTimeUpdate]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {
        setError('Failed to play video');
        toast.error('Failed to play video');
      });
      setIsPlaying(true);
      onPlayStateChange?.(true);
      handlePlay(nextVideoId || '');
    } else {
      video.pause();
      setIsPlaying(false);
      onPlayStateChange?.(false);
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
    "relative group bg-black rounded-lg overflow-hidden transition-all duration-300",
    {
      'w-full aspect-video': size === 'default',
      'w-[854px] h-[480px]': size === 'medium',
      'fixed inset-0 z-50': size === 'fullscreen'
    },
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
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          {error}
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
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
            showControls={showControls}
            onPlayPause={togglePlay}
            onToggleFullscreen={toggleFullscreen}
            onViewModeChange={(mode) => {
              if (mode === 'fullscreen') {
                toggleFullscreen();
              }
            }}
            videoRef={videoRef}
            viewMode={size}
          />
        </>
      )}
    </div>
  );
};
