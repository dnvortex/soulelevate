import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Quote } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import QuoteCard from "@/components/QuoteCard";
import Newsletter from "@/components/Newsletter";

const Home = () => {
  const { toast } = useToast();
  
  const { data: featuredQuote, isLoading, error } = useQuery<Quote>({
    queryKey: ['/api/quotes/featured'],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading quote",
        description: "Failed to load the featured quote. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const renderQuoteCard = () => {
    if (isLoading) {
      return (
        <div className="gradient-border w-full max-w-md aspect-square rounded-2xl relative overflow-hidden animate-pulse">
          <div className="absolute inset-0.5 glass-panel rounded-xl flex items-center justify-center">
            <div className="text-center p-6">
              <div className="h-24 bg-gray-700/50 rounded mb-4"></div>
              <div className="h-6 w-1/2 bg-gray-700/50 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      );
    }

    if (!featuredQuote) {
      return (
        <div className="gradient-border w-full max-w-md aspect-square rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0.5 glass-panel rounded-xl flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-lg md:text-xl italic font-medium text-white mb-4">
                "The best way to predict the future is to create it."
              </p>
              <p className="text-primary-light font-medium">Abraham Lincoln</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="gradient-border w-full max-w-md aspect-square rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0.5 glass-panel rounded-xl flex items-center justify-center">
          <div className="quote-card text-center p-6">
            <p className="text-lg md:text-xl italic z-10 relative font-medium text-white mb-4">
              "{featuredQuote.text}"
            </p>
            <p className="text-primary-light font-medium">{featuredQuote.author}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section id="home" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 space-y-6 animate-in fade-in slide-in-from-left duration-700">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight">
                Transform Your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Inner Self
                </span>
              </h2>
              <p className="text-lg text-gray-300 max-w-lg">
                Welcome to your journey of self-improvement. Discover daily inspiration, practical tips, and multimedia content designed to help you grow.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/quotes">
                  <a className="btn-gradient text-white font-medium px-6 py-3 rounded-full shadow-lg">
                    Get Inspired
                  </a>
                </Link>
                <Link href="/tips">
                  <a className="bg-transparent border border-primary hover:bg-primary/10 text-white font-medium px-6 py-3 rounded-full transition-all">
                    Explore Tips
                  </a>
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center animate-in fade-in slide-in-from-right duration-700">
              {renderQuoteCard()}
            </div>
          </div>
        </div>
      </section>
      
      <Newsletter />
    </>
  );
};

export default Home;
