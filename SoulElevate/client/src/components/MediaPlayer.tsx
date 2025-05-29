import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Media } from "@shared/schema";

interface MediaPlayerProps {
  media: Media;
  aspectRatio?: "video" | "square";
  autoPlay?: boolean;
  className?: string;
}

const MediaPlayer = ({
  media,
  aspectRatio = "video",
  autoPlay = false,
  className = "",
}: MediaPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState(media.duration);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (autoPlay) {
      handlePlay();
    }
  }, [autoPlay]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const progressPercent = (current / duration) * 100;
      
      setProgress(progressPercent);
      setCurrentTime(formatTime(current));
      
      if (current === duration) {
        setIsPlaying(false);
      }
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (videoRef.current) {
      const newTime = (value[0] / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0] / 100;
      videoRef.current.volume = newVolume;
      setVolume(value[0]);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (isMuted) {
        videoRef.current.volume = volume / 100;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
    }
  };

  const aspectRatioClass = aspectRatio === "video" ? "aspect-video" : "aspect-square";

  return (
    <div className={`w-full ${className}`}>
      <div className={`relative ${aspectRatioClass} bg-background rounded-lg overflow-hidden`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={media.url}
          poster={media.thumbnail}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
        
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Button
              className="w-16 h-16 rounded-full bg-primary/80 hover:bg-primary flex items-center justify-center transition-all transform hover:scale-110"
              onClick={handlePlay}
            >
              <Play className="h-8 w-8 text-white" />
            </Button>
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-background-lighter/60 backdrop-blur-sm p-3 rounded-lg">
            <Slider
              value={[progress]}
              min={0}
              max={100}
              step={0.1}
              onValueChange={handleProgressChange}
              className="mb-2"
            />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handlePlay} className="text-white">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <span className="text-xs text-white">
                  {currentTime} / {duration}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white">
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-lg font-medium">{media.title}</h4>
        <p className="text-gray-300 text-sm mt-1">{media.description}</p>
      </div>
    </div>
  );
};

export default MediaPlayer;
