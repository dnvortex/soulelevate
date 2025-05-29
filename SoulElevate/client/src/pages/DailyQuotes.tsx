import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Quote } from "@shared/schema";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import QuoteCard from "@/components/QuoteCard";

const DailyQuotes = () => {
  const { toast } = useToast();
  const [featuredIndex, setFeaturedIndex] = useState(0);
  
  const { data: quotes, isLoading, error } = useQuery<Quote[]>({
    queryKey: ['/api/quotes'],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading quotes",
        description: "Failed to load quotes. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleNext = () => {
    if (!quotes || quotes.length === 0) return;
    setFeaturedIndex((prevIndex) => (prevIndex + 1) % quotes.length);
  };

  const handlePrevious = () => {
    if (!quotes || quotes.length === 0) return;
    setFeaturedIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length);
  };

  return (
    <section id="quotes" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-500">
          <h2 className="text-3xl font-bold font-heading mb-4">Daily Quotes</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Find daily inspiration with our curated collection of motivational quotes.
          </p>
        </div>
        
        {isLoading ? (
          <div className="glass-panel p-6 md:p-8 max-w-4xl mx-auto animate-pulse">
            <div className="p-8 text-center">
              <div className="h-24 bg-gray-700/50 rounded mb-6 mx-auto max-w-2xl"></div>
              <div className="h-6 w-32 bg-gray-700/50 rounded mx-auto"></div>
            </div>
          </div>
        ) : quotes && quotes.length > 0 ? (
          <div className="glass-panel p-6 md:p-8 max-w-4xl mx-auto animate-in fade-in duration-700">
            <div className="quote-card p-8 text-center">
              <p className="text-2xl md:text-3xl italic font-medium text-white mb-6 z-10 relative">
                "{quotes[featuredIndex].text}"
              </p>
              <p className="text-primary-light font-medium text-lg">
                {quotes[featuredIndex].author}
              </p>
            </div>

            <div className="mt-8 flex justify-between">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="mr-1 h-5 w-5" />
                Previous
              </Button>
              <Button
                variant="ghost"
                onClick={handleNext}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                Next
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-6 md:p-8 max-w-4xl mx-auto text-center">
            <p className="text-gray-300">No quotes available at the moment.</p>
          </div>
        )}
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="glass-panel p-6 animate-pulse">
                  <div className="h-16 bg-gray-700/50 rounded mb-4"></div>
                  <div className="h-4 w-32 bg-gray-700/50 rounded"></div>
                </div>
              ))
          ) : quotes && quotes.length > 0 ? (
            quotes
              .filter((_, index) => index !== featuredIndex)
              .slice(0, 6)
              .map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  className="animate-in fade-in duration-700"
                />
              ))
          ) : (
            <div className="col-span-3 text-center">
              <p className="text-gray-300">No additional quotes available.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DailyQuotes;
