import React, { useRef, useEffect, useState } from 'react';
import { EnhancedVideoPlayer } from './EnhancedVideoPlayer';
import { Video } from '@/types/video';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface TikTokFeedProps {
  videos: Video[];
}

export const TikTokFeed = ({ videos }: TikTokFeedProps) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollPosition = containerRef.current.scrollTop;
      const videoHeight = window.innerHeight;
      const newIndex = Math.round(scrollPosition / videoHeight);
      setCurrentVideoIndex(newIndex);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory"
      onScroll={handleScroll}
    >
      {videos.map((video, index) => (
        <TikTokVideoCard
          key={video.id}
          video={video}
          isActive={index === currentVideoIndex}
        />
      ))}
    </div>
  );
};

interface TikTokVideoCardProps {
  video: Video;
  isActive: boolean;
}

const TikTokVideoCard = ({ video, isActive }: TikTokVideoCardProps) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  return (
    <div 
      ref={ref}
      className={cn(
        "h-screen w-full snap-start relative",
        "flex items-center justify-center",
        "bg-youtube-darker"
      )}
    >
      <div className="relative w-full max-w-[500px] aspect-[9/16]">
        <EnhancedVideoPlayer
          url={video.url}
          thumbnail={video.thumbnail_url}
          className="rounded-xl overflow-hidden"
          onPlayStateChange={(isPlaying) => {
            console.log('Video play state changed:', isPlaying);
          }}
          nextVideoId={video.id}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white font-medium mb-2">{video.title}</h3>
          <p className="text-white/80 text-sm line-clamp-2">{video.description}</p>
        </div>
      </div>
    </div>
  );
};