import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { VideoProgress } from './controls/VideoProgress';
import { VideoControls } from './controls/VideoControls';
import { useFullscreen } from './hooks/useFullscreen';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useVideoPreferences } from './hooks/useVideoPreferences';
import { useAutoScroll } from './hooks/useAutoScroll';
import { usePictureInPicture } from './hooks/usePictureInPicture';
import { useClosedCaptions } from './hooks/useClosedCaptions';
import { toast } from 'sonner';

interface VideoPlayerProps {
  url: string;
  thumbnail?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  className?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
  nextVideoId?: string;
  captions?: { src: string; label: string; language: string }[];
}

export const VideoPlayer = ({ 
  url, 
  thumbnail, 
  onTimeUpdate, 
  className,
  onPlayStateChange,
  nextVideoId,
  captions
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'default' | 'medium' | 'fullscreen'>('default');
  
  const { preferences, updatePreference } = useVideoPreferences();
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const { isPiPActive, togglePiP } = usePictureInPicture(videoRef);
  const { activeCaptions, toggleCaptions } = useClosedCaptions(videoRef, captions);

  useAutoScroll({
    videoRef,
    nextVideoId,
    isEnabled: preferences.autoScroll,
    scrollThreshold: preferences.scrollThreshold,
    scrollSpeed: preferences.scrollSpeed
  });

  useKeyboardControls({
    videoRef,
    togglePlay: () => togglePlay(),
    toggleFullscreen,
    togglePiP,
    toggleCaptions
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
            playsInline
            crossOrigin="anonymous"
          >
            <source src={url} type="video/mp4" />
            {captions?.map((caption, index) => (
              <track
                key={index}
                kind="subtitles"
                src={caption.src}
                srcLang={caption.language}
                label={caption.label}
                default={index === 0}
              />
            ))}
            Your browser does not support the video tag.
          </video>

          <VideoControls
            isPlaying={isPlaying}
            isFullscreen={isFullscreen}
            isPiPActive={isPiPActive}
            preferences={preferences}
            showControls={showControls}
            onPlayPause={togglePlay}
            onToggleFullscreen={toggleFullscreen}
            onTogglePiP={togglePiP}
            onToggleCaptions={toggleCaptions}
            onViewModeChange={handleViewModeChange}
            onPreferenceChange={updatePreference}
            videoRef={videoRef}
            viewMode={viewMode}
          />
        </>
      )}
    </div>
  );
};