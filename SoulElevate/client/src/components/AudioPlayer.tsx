import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Media } from "@shared/schema";

interface AudioPlayerProps {
  media: Media;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
}

const AudioPlayer = ({ media, onNext, onPrevious, className = "" }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [progressWidth, setProgressWidth] = useState("0%");
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Reset player when media changes
    setIsPlaying(false);
    setCurrentTime("0:00");
    setProgressWidth("0%");
  }, [media]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    const percent = (current / duration) * 100;
    
    setCurrentTime(formatTime(current));
    setProgressWidth(`${percent}%`);
    
    if (current === duration) {
      setIsPlaying(false);
    }
  };

  return (
    <div className={`audio-player p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-medium">{media.title}</h4>
          <p className="text-sm text-gray-300">{media.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          {onPrevious && (
            <Button variant="ghost" size="icon" onClick={onPrevious} className="text-white hover:text-primary transition-colors">
              <SkipBack className="h-5 w-5" />
            </Button>
          )}
          
          <Button
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white" />
            ) : (
              <Play className="h-5 w-5 text-white" />
            )}
          </Button>
          
          {onNext && (
            <Button variant="ghost" size="icon" onClick={onNext} className="text-white hover:text-primary transition-colors">
              <SkipForward className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="audio-progress">
        <div className="progress-bar" style={{ width: progressWidth }}></div>
      </div>
      
      <div className="flex justify-between text-white text-xs mt-2">
        <span>{currentTime}</span>
        <span>{media.duration}</span>
      </div>
      
      <audio
        ref={audioRef}
        src={media.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
};

export default AudioPlayer;
