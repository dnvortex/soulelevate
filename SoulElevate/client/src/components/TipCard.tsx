import { Heart, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tip } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface TipCardProps {
  tip: Tip;
  className?: string;
}

const TipCard = ({ tip, className = "" }: TipCardProps) => {
  const { toast } = useToast();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tip.title,
        text: `${tip.title}: ${tip.content}`,
        url: window.location.href,
      }).catch((error) => console.log("Sharing failed:", error));
    } else {
      navigator.clipboard.writeText(`${tip.title}: ${tip.content}`);
      toast({
        title: "Tip copied to clipboard",
        description: "Share it with your friends!",
      });
    }
  };

  const handleFavorite = () => {
    toast({
      title: "Added to favorites",
      description: "This tip has been saved to your favorites",
    });
  };

  const timeAgo = formatDistanceToNow(new Date(tip.addedDate), { addSuffix: true });

  return (
    <div className={`glass-panel h-full ${className}`}>
      <div className="p-6 flex flex-col h-full">
        <h3 className="text-xl font-bold mb-2 font-heading text-white">{tip.title}</h3>
        <p className="text-gray-300 flex-grow">
          {tip.content}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-neutral">Added {timeAgo}</span>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              className="text-accent hover:text-accent-light transition-colors"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="text-accent hover:text-accent-light transition-colors"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipCard;
