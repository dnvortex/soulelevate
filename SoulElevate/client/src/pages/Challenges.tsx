import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import type { Challenge, ChallengeInput } from "@/../../shared/schema";

// Challenge card component for displaying challenges
const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
  const difficultyColors = {
    "Easy": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "Medium": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    "Hard": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };
  
  const difficultyColor = difficultyColors[challenge.difficulty as keyof typeof difficultyColors] || difficultyColors.Medium;
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{challenge.title}</CardTitle>
          <Badge className={difficultyColor}>{challenge.difficulty}</Badge>
        </div>
        <CardDescription>
          {challenge.duration} days • {challenge.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="mb-4">{challenge.description}</p>
        <div>
          <h4 className="font-medium mb-2">Steps:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {challenge.steps.map((step: string, index: number) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 mt-auto">
        <Button variant="outline" className="w-full">
          Start Challenge
        </Button>
      </CardFooter>
    </Card>
  );
};

// Schema for the challenge generator form
const challengeInputSchema = z.object({
  interests: z.array(z.string()).min(1, "At least one interest is required"),
  goals: z.array(z.string()).min(1, "At least one goal is required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  duration: z.number().min(1).max(30),
  category: z.enum(["Productivity", "Mindset", "Health", "Success"])
});

const Challenges = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [interestInput, setInterestInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Form for the challenge generator
  const form = useForm<z.infer<typeof challengeInputSchema>>({
    resolver: zodResolver(challengeInputSchema),
    defaultValues: {
      interests: [],
      goals: [],
      difficulty: "Medium",
      duration: 14,
      category: "Productivity"
    },
  });
  
  // Query to fetch all challenges
  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['/api/challenges', selectedCategory],
    queryFn: async () => {
      const url = selectedCategory 
        ? `/api/challenges?category=${selectedCategory}` 
        : '/api/challenges';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch challenges');
      return res.json();
    }
  });
  
  // Mutation for generating personalized challenges
  const generateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof challengeInputSchema>) => {
      const res = await fetch('/api/challenges/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to generate challenge');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/challenges'] });
      toast({
        title: "Challenge Generated",
        description: "Your personalized challenge has been created!",
      });
      form.reset();
      setActiveTab("browse");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof challengeInputSchema>) => {
    generateMutation.mutate(data);
  };
  
  // Add interest to the list
  const addInterest = () => {
    if (interestInput.trim() === "") return;
    const currentInterests = form.getValues("interests");
    if (!currentInterests.includes(interestInput.trim())) {
      form.setValue("interests", [...currentInterests, interestInput.trim()]);
    }
    setInterestInput("");
  };
  
  // Remove interest from the list
  const removeInterest = (interest: string) => {
    const currentInterests = form.getValues("interests");
    form.setValue("interests", currentInterests.filter(i => i !== interest));
  };
  
  // Add goal to the list
  const addGoal = () => {
    if (goalInput.trim() === "") return;
    const currentGoals = form.getValues("goals");
    if (!currentGoals.includes(goalInput.trim())) {
      form.setValue("goals", [...currentGoals, goalInput.trim()]);
    }
    setGoalInput("");
  };
  
  // Remove goal from the list
  const removeGoal = (goal: string) => {
    const currentGoals = form.getValues("goals");
    form.setValue("goals", currentGoals.filter(g => g !== goal));
  };
  
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Personal Challenge Generator</h1>
        <p className="text-lg text-muted-foreground">
          Browse pre-made challenges or create your own personalized journey to self-improvement
        </p>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="browse">Browse Challenges</TabsTrigger>
          <TabsTrigger value="create">Create Your Challenge</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="inline-flex gap-2 p-1 bg-muted rounded-lg">
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                onClick={() => setSelectedCategory(null)}
                className="rounded-md"
              >
                All
              </Button>
              <Button
                variant={selectedCategory === "Productivity" ? "default" : "ghost"}
                onClick={() => setSelectedCategory("Productivity")}
                className="rounded-md"
              >
                Productivity
              </Button>
              <Button
                variant={selectedCategory === "Mindset" ? "default" : "ghost"}
                onClick={() => setSelectedCategory("Mindset")}
                className="rounded-md"
              >
                Mindset
              </Button>
              <Button
                variant={selectedCategory === "Health" ? "default" : "ghost"}
                onClick={() => setSelectedCategory("Health")}
                className="rounded-md"
              >
                Health
              </Button>
              <Button
                variant={selectedCategory === "Success" ? "default" : "ghost"}
                onClick={() => setSelectedCategory("Success")}
                className="rounded-md"
              >
                Success
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4">Loading challenges...</p>
            </div>
          ) : challenges.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No challenges found. Try selecting a different category or create your own!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge: Challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Personal Challenge</CardTitle>
              <CardDescription>
                Tell us about your interests and goals to generate a personalized challenge just for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Interests</FormLabel>
                          <div className="flex gap-2">
                            <Input
                              value={interestInput}
                              onChange={(e) => setInterestInput(e.target.value)}
                              placeholder="e.g. reading, meditation, programming"
                            />
                            <Button type="button" onClick={addInterest}>Add</Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.value.map((interest, index) => (
                              <Badge key={index} variant="secondary" className="py-1">
                                {interest}
                                <button 
                                  type="button" 
                                  className="ml-2 hover:text-destructive" 
                                  onClick={() => removeInterest(interest)}
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <FormDescription>
                            Add your interests to help personalize your challenge.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="goals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Goals</FormLabel>
                          <div className="flex gap-2">
                            <Input
                              value={goalInput}
                              onChange={(e) => setGoalInput(e.target.value)}
                              placeholder="e.g. become more focused, reduce stress"
                            />
                            <Button type="button" onClick={addGoal}>Add</Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.value.map((goal, index) => (
                              <Badge key={index} variant="secondary" className="py-1">
                                {goal}
                                <button 
                                  type="button" 
                                  className="ml-2 hover:text-destructive" 
                                  onClick={() => removeGoal(goal)}
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <FormDescription>
                            What do you want to achieve with this challenge?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Productivity">Productivity</SelectItem>
                                <SelectItem value="Mindset">Mindset</SelectItem>
                                <SelectItem value="Health">Health</SelectItem>
                                <SelectItem value="Success">Success</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose a focus area for your challenge.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Difficulty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How challenging do you want this to be?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (Days): {field.value}</FormLabel>
                          <FormControl>
                            <Slider
                              min={1}
                              max={30}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                          <FormDescription>
                            How many days do you want your challenge to last?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={generateMutation.isPending}
                  >
                    {generateMutation.isPending ? "Generating..." : "Generate My Challenge"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Challenges;