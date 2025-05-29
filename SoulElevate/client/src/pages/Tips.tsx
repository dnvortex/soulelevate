import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tip } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TipCard from "@/components/TipCard";

type TipCategory = "Productivity" | "Mindset" | "Health" | "Success";

const Tips = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<TipCategory>("Productivity");
  
  const { data: allTips, isLoading, error } = useQuery<Tip[]>({
    queryKey: ['/api/tips'],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading tips",
        description: "Failed to load tips. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const filteredTips = allTips?.filter(tip => tip.category === activeCategory) || [];

  const categories: TipCategory[] = ["Productivity", "Mindset", "Health", "Success"];

  const handleCategoryChange = (category: TipCategory) => {
    setActiveCategory(category);
  };

  return (
    <section id="tips" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-500">
          <h2 className="text-3xl font-bold font-heading mb-4">Self-Improvement Tips</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Practical advice to help you grow in different areas of your life.
          </p>
        </div>
        
        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={
                  activeCategory === category
                    ? "bg-primary text-white"
                    : "bg-background-lighter/80 text-white hover:bg-primary/20 transition-colors"
                }
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Tips Content */}
        <div className="tab-content">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="glass-panel h-full p-6 animate-pulse">
                    <div className="h-6 bg-gray-700/50 rounded mb-4 w-3/4"></div>
                    <div className="h-24 bg-gray-700/50 rounded mb-4"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-1/4"></div>
                  </div>
                ))}
            </div>
          ) : filteredTips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTips.map((tip) => (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  className="animate-in fade-in duration-700"
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 glass-panel">
              <p className="text-gray-300">No tips available for this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Tips;
