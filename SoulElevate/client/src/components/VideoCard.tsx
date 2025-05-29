import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Media } from "@shared/schema";
import { Link } from "wouter";

interface VideoCardProps {
  video: Media;
  onClick?: () => void;
  className?: string;
}

const VideoCard = ({ video, onClick, className = "" }: VideoCardProps) => {
  return (
    <div className={`glass-panel ${className}`} onClick={onClick}>
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={`Thumbnail for ${video.title}`} 
          className="w-full aspect-video object-cover rounded-t-lg" 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            className="w-12 h-12 rounded-full bg-primary/80 hover:bg-primary flex items-center justify-center transition-all"
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
          >
            <Play className="h-5 w-5 text-white" />
          </Button>
        </div>
        <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs">
          {video.duration}
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-medium">{video.title}</h4>
        <p className="text-gray-300 text-sm mt-1">{video.description}</p>
      </div>
    </div>
  );
};

export default VideoCard;
