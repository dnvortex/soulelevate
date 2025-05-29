import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Quote } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface QuoteCardProps {
  quote: Quote;
  large?: boolean;
  className?: string;
}

const QuoteCard = ({ quote, large = false, className = "" }: QuoteCardProps) => {
  const { toast } = useToast();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Inspirational Quote",
        text: `"${quote.text}" - ${quote.author}`,
        url: window.location.href,
      }).catch((error) => console.log("Sharing failed:", error));
    } else {
      navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
      toast({
        title: "Quote copied to clipboard",
        description: "Share it with your friends!",
      });
    }
  };

  if (large) {
    return (
      <div className={`glass-panel p-6 md:p-8 ${className}`}>
        <div className="quote-card p-8 text-center">
          <p className="text-2xl md:text-3xl italic font-medium text-white mb-6 z-10 relative">
            "{quote.text}"
          </p>
          <p className="text-primary-light font-medium text-lg">{quote.author}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-panel p-6 quote-card ${className}`}>
      <p className="text-lg italic text-white mb-4 z-10 relative">
        "{quote.text}"
      </p>
      <p className="text-primary-light font-medium">{quote.author}</p>
      <div className="mt-4 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          className="text-accent hover:text-accent-light transition-colors"
        >
          <Share className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default QuoteCard;
