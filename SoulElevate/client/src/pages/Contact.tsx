import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import Newsletter from "@/components/Newsletter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/contact", data);
      
      toast({
        title: "Message sent successfully!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Contact error:", error);
      toast({
        title: "Message delivery failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-500">
              <h2 className="text-3xl font-bold font-heading mb-4">Get In Touch</h2>
              <p className="text-gray-300">Have questions or feedback? We'd love to hear from you.</p>
            </div>
            
            <div className="glass-panel p-6 md:p-8 animate-in fade-in duration-700">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-300">Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              className="w-full px-4 py-2 bg-background/80 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-destructive" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-300">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your.email@example.com"
                              className="w-full px-4 py-2 bg-background/80 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-destructive" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your message here..."
                            rows={5}
                            className="w-full px-4 py-2 bg-background/80 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-destructive" />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-gradient text-white font-medium px-8 py-3 rounded-full shadow-lg"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-6 animate-in fade-in slide-in-from-bottom duration-700">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Newsletter />
    </>
  );
};

export default Contact;
