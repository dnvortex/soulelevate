import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Media as MediaType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import MediaPlayer from "@/components/MediaPlayer";
import AudioPlayer from "@/components/AudioPlayer";
import VideoCard from "@/components/VideoCard";
import AudioCard from "@/components/AudioCard";

type MediaContentType = "videos" | "audio";

const Media = () => {
  const { toast } = useToast();
  const [activeType, setActiveType] = useState<MediaContentType>("videos");
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [selectedAudioId, setSelectedAudioId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: videos, isLoading: isLoadingVideos, error: videosError } = useQuery<MediaType[]>({
    queryKey: ['/api/media', { type: 'video' }],
    queryFn: () => fetch('/api/media?type=video').then(res => res.json()),
  });
  
  const { data: audios, isLoading: isLoadingAudios, error: audiosError } = useQuery<MediaType[]>({
    queryKey: ['/api/media', { type: 'audio' }],
    queryFn: () => fetch('/api/media?type=audio').then(res => res.json()),
  });
  
  const { data: featuredVideo } = useQuery<MediaType>({
    queryKey: ['/api/media/featured/video'],
    enabled: activeType === "videos",
  });
  
  const { data: featuredAudio } = useQuery<MediaType>({
    queryKey: ['/api/media/featured/audio'],
    enabled: activeType === "audio",
  });

  useEffect(() => {
    if (videosError || audiosError) {
      toast({
        title: "Error loading media",
        description: "Failed to load media content. Please try again later.",
        variant: "destructive",
      });
    }
  }, [videosError, audiosError, toast]);

  const handleSelectVideo = (videoId: number) => {
    setSelectedVideoId(videoId);
    setIsDialogOpen(true);
  };

  const handleSelectAudio = (audioId: number) => {
    setSelectedAudioId(audioId);
  };

  const selectedVideo = videos?.find(video => video.id === selectedVideoId);
  const selectedAudio = audios?.find(audio => audio.id === selectedAudioId) || featuredAudio;

  return (
    <section id="media" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-500">
          <h2 className="text-3xl font-bold font-heading mb-4">Video & Audio Content</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Multimedia resources to inspire and guide your personal development.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Button
            variant={activeType === "videos" ? "default" : "outline"}
            className={
              activeType === "videos"
                ? "px-5 py-2 rounded-full bg-primary text-white"
                : "px-5 py-2 rounded-full bg-background-lighter/80 text-white hover:bg-primary/20 transition-colors"
            }
            onClick={() => setActiveType("videos")}
          >
            Videos
          </Button>
          <Button
            variant={activeType === "audio" ? "default" : "outline"}
            className={
              activeType === "audio"
                ? "px-5 py-2 rounded-full bg-primary text-white"
                : "px-5 py-2 rounded-full bg-background-lighter/80 text-white hover:bg-primary/20 transition-colors"
            }
            onClick={() => setActiveType("audio")}
          >
            Audio
          </Button>
        </div>
        
        {/* Videos Section */}
        <div className={`media-content ${activeType === "videos" ? "" : "hidden"}`}>
          {/* Featured Video */}
          <div className="glass-panel p-6 mb-8 animate-in fade-in duration-700">
            <h3 className="text-xl font-bold mb-4 font-heading">Featured Video</h3>
            {isLoadingVideos ? (
              <div className="aspect-video w-full max-w-3xl mx-auto relative bg-background-lighter/50 animate-pulse rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-700/50"></div>
                </div>
              </div>
            ) : featuredVideo ? (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <div onClick={() => setSelectedVideoId(featuredVideo.id)}>
                    <MediaPlayer media={featuredVideo} aspectRatio="video" />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  {selectedVideo && (
                    <MediaPlayer media={selectedVideo} aspectRatio="video" autoPlay />
                  )}
                </DialogContent>
              </Dialog>
            ) : (
              <div className="aspect-video w-full max-w-3xl mx-auto flex items-center justify-center bg-background-lighter/30 rounded-lg">
                <p className="text-gray-300">No featured video available.</p>
              </div>
            )}
          </div>
          
          {/* Video Library */}
          <h3 className="text-xl font-bold mb-4 font-heading">Video Library</h3>
          {isLoadingVideos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="glass-panel animate-pulse">
                    <div className="w-full aspect-video bg-gray-700/50 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-5 bg-gray-700/50 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : videos && videos.length > 0 ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos
                  .filter(video => !featuredVideo || video.id !== featuredVideo.id)
                  .map((video) => (
                    <DialogTrigger asChild key={video.id}>
                      <div>
                        <VideoCard 
                          video={video}
                          onClick={() => setSelectedVideoId(video.id)}
                          className="animate-in fade-in duration-700"
                        />
                      </div>
                    </DialogTrigger>
                  ))}
              </div>
              <DialogContent className="max-w-4xl">
                {selectedVideo && (
                  <MediaPlayer media={selectedVideo} aspectRatio="video" autoPlay />
                )}
              </DialogContent>
            </Dialog>
          ) : (
            <div className="text-center p-8 glass-panel">
              <p className="text-gray-300">No videos available at the moment.</p>
            </div>
          )}
        </div>
        
        {/* Audio Section */}
        <div className={`media-content ${activeType === "audio" ? "" : "hidden"}`}>
          {/* Featured Audio */}
          <div className="glass-panel p-6 mb-8 animate-in fade-in duration-700">
            <h3 className="text-xl font-bold mb-4 font-heading">Featured Audio</h3>
            {isLoadingAudios ? (
              <div className="p-4 w-full max-w-3xl mx-auto bg-background-lighter/50 animate-pulse rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="h-5 bg-gray-700/50 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-32"></div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-700/50"></div>
                  </div>
                </div>
                <div className="h-1 bg-gray-700/50 rounded w-full"></div>
              </div>
            ) : selectedAudio ? (
              <AudioPlayer 
                media={selectedAudio}
                className="w-full max-w-3xl mx-auto" 
              />
            ) : (
              <div className="p-4 w-full max-w-3xl mx-auto flex items-center justify-center bg-background-lighter/30 rounded-lg h-40">
                <p className="text-gray-300">No featured audio available.</p>
              </div>
            )}
          </div>
          
          {/* Audio Library */}
          <h3 className="text-xl font-bold mb-4 font-heading">Audio Library</h3>
          {isLoadingAudios ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="glass-panel p-4 flex items-center space-x-4 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-700/50 flex-shrink-0"></div>
                    <div className="flex-grow">
                      <div className="h-5 bg-gray-700/50 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : audios && audios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audios.map((audio) => (
                <AudioCard
                  key={audio.id}
                  audio={audio}
                  onPlay={() => handleSelectAudio(audio.id)}
                  className={`animate-in fade-in duration-700 ${selectedAudioId === audio.id ? 'border-2 border-primary' : ''}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 glass-panel">
              <p className="text-gray-300">No audio content available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Media;
