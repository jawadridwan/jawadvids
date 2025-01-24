import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { VideoControls } from './controls/VideoControls';
import { useFullscreen } from './hooks/useFullscreen';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useAutoScroll } from './hooks/useAutoScroll';
import { usePictureInPicture } from './hooks/usePictureInPicture';
import { useClosedCaptions } from './hooks/useClosedCaptions';
import { useVideoPlayback } from '@/contexts/VideoPlaybackContext';
import { toast } from 'sonner';

interface EnhancedVideoPlayerProps {
  url: string;
  thumbnail?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  className?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
  nextVideoId?: string;
  captions?: { src: string; label: string; language: string }[];
  videoId: string;
}

export const EnhancedVideoPlayer = ({
  url,
  thumbnail,
  onTimeUpdate,
  className,
  onPlayStateChange,
  nextVideoId,
  captions,
  videoId
}: EnhancedVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'default' | 'medium' | 'fullscreen'>('default');

  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const { isPiPActive, togglePiP } = usePictureInPicture(videoRef);
  const { activeCaptions, toggleCaptions } = useClosedCaptions(videoRef, captions);
  const { registerVideo, unregisterVideo, handlePlay } = useVideoPlayback();

  useAutoScroll({
    videoRef,
    nextVideoId,
    isEnabled: true,
    scrollThreshold: 0.8,
    scrollSpeed: 1000
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

    const handleError = () => {
      setError('Failed to load video');
      toast.error('Failed to load video');
    };

    const handleVideoPlay = () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
      handlePlay(videoId);
    };

    const handleVideoPause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    video.addEventListener('error', handleError);
    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);

    registerVideo(videoId, video);

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handleVideoPlay);
      video.removeEventListener('pause', handleVideoPause);
      unregisterVideo(videoId);
    };
  }, [videoId, onPlayStateChange, registerVideo, unregisterVideo, handlePlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {
        setError('Failed to play video');
        toast.error('Failed to play video');
      });
    } else {
      video.pause();
    }
  };

  const handleViewModeChange = (mode: 'default' | 'medium' | 'fullscreen') => {
    setViewMode(mode);
    if (mode === 'fullscreen') {
      toggleFullscreen();
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
            showControls={showControls}
            onPlayPause={togglePlay}
            onToggleFullscreen={toggleFullscreen}
            onTogglePiP={togglePiP}
            onToggleCaptions={toggleCaptions}
            onViewModeChange={handleViewModeChange}
            videoRef={videoRef}
            viewMode={viewMode}
          />
        </>
      )}
    </div>
  );
};