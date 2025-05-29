import { Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Media } from "@shared/schema";

interface AudioCardProps {
  audio: Media;
  onPlay: () => void;
  className?: string;
}

const AudioCard = ({ audio, onPlay, className = "" }: AudioCardProps) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would trigger a download
    window.open(audio.url, '_blank');
  };

  return (
    <div 
      className={`glass-panel p-4 flex items-center space-x-4 cursor-pointer hover:bg-background-lighter/90 transition-colors ${className}`}
      onClick={onPlay}
    >
      <Button 
        className="w-10 h-10 rounded-full bg-primary/80 hover:bg-primary flex items-center justify-center flex-shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onPlay();
        }}
      >
        <Play className="h-5 w-5 text-white" />
      </Button>
      <div className="flex-grow">
        <h4 className="font-medium">{audio.title}</h4>
        <p className="text-sm text-gray-300">{audio.duration} • {audio.description}</p>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDownload}
        className="text-accent hover:text-accent-light transition-colors"
      >
        <Download className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default AudioCard;
