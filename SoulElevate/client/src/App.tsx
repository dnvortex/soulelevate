import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import DailyQuotes from "@/pages/DailyQuotes";
import Tips from "@/pages/Tips";
import Media from "@/pages/Media";
import Contact from "@/pages/Contact";
import Challenges from "@/pages/Challenges";
import CloudinaryTest from "@/components/CloudinaryTest";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quotes" component={DailyQuotes} />
      <Route path="/tips" component={Tips} />
      <Route path="/media" component={Media} />
      <Route path="/challenges" component={Challenges} />
      <Route path="/contact" component={Contact} />
      <Route path="/upload-test" component={CloudinaryTest} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-background-lighter bg-fixed">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
