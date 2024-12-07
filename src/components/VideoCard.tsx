interface VideoCardProps {
  title: string;
  views: string;
  thumbnail: string;
}

export const VideoCard = ({ title, views, thumbnail }: VideoCardProps) => {
  return (
    <div className="bg-youtube-dark rounded-xl overflow-hidden animate-fade-in hover:scale-105 transition-transform">
      <img src={thumbnail} alt={title} className="w-full aspect-video object-cover" />
      <div className="p-4">
        <h3 className="text-white font-medium mb-2 line-clamp-2">{title}</h3>
        <p className="text-youtube-gray text-sm">{views} views</p>
      </div>
    </div>
  );
};