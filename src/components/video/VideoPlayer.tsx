import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

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
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (!video) return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
        case 'arrowleft':
          skip(-5);
          break;
        case 'arrowright':
          skip(5);
          break;
        default:
          if (!isNaN(parseInt(e.key)) && parseInt(e.key) >= 1 && parseInt(e.key) <= 9) {
            const percentage = (parseInt(e.key) * 10) / 100;
            video.currentTime = video.duration * percentage;
          }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

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
      // Pause all other videos before playing this one
      document.querySelectorAll('video').forEach(v => {
        if (v !== video) {
          v.pause();
        }
      });
      
      video.play();
      setIsPlaying(true);
      onPlayStateChange?.(true);
    } else {
      video.pause();
      setIsPlaying(false);
      onPlayStateChange?.(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

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
        className="w-full aspect-video"
        poster={thumbnail}
        onClick={togglePlay}
        playsInline
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8" />
          )}
        </Button>
      </div>

      {/* Controls */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4",
          showControls ? "opacity-100" : "opacity-0",
          "transition-opacity duration-300"
        )}
      >
        {/* Progress bar */}
        <Slider
          value={[currentTime ? (currentTime / duration) * 100 : 0]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="mb-4"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>

            <div className="w-24">
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
                max={1}
                step={0.1}
                className="w-24"
              />
            </div>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                className="text-white text-sm"
              >
                {playbackSpeed}x
              </Button>
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                <div className="bg-black/90 rounded-lg p-2">
                  {[0.5, 1, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      className="block w-full text-white text-sm px-4 py-1 hover:bg-white/10 rounded"
                      onClick={() => handleSpeedChange(speed)}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};