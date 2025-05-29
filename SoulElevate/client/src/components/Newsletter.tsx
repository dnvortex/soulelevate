import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const Newsletter = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailFormValues) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/subscribe", data);
      
      toast({
        title: "Subscribed successfully!",
        description: "Thank you for subscribing to our newsletter.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 animated-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center glass-panel p-8">
          <h2 className="text-3xl font-bold font-heading mb-4">Join Our Newsletter</h2>
          <p className="text-gray-200 mb-6">
            Get weekly inspiration, tips, and exclusive content delivered to your inbox.
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        placeholder="Your email address"
                        className="px-4 py-3 bg-background/70 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-left text-sm text-destructive mt-1" />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-gradient text-white font-medium px-6 py-3 rounded-lg shadow-lg whitespace-nowrap"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
